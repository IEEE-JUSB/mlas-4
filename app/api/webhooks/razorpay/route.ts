import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { savePaymentToUser } from '@/lib/db/payments';
import { sendReceiptEmail } from '@/lib/email/sender';
import { retryWithBackoff } from '@/lib/utils/retry';
import { createClient } from '@/lib/supabase/server';
import { RazorpayWebhookPayload } from '@/types/payment';
import { constantTimeCompare } from '@/lib/utils/crypto';

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();

    // Get webhook signature from header
    const webhookSignature = request.headers.get('x-razorpay-signature');
    if (!webhookSignature) {
      console.error('Missing webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const expectedSignature = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

    // Constant-time comparison
    const isValid = constantTimeCompare(expectedSignature, webhookSignature);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse webhook payload
    const payload: RazorpayWebhookPayload = JSON.parse(rawBody);

    // Handle payment.captured event
    if (payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const userId = payment.notes?.userId;
      const paymentId = payment.id;
      const membershipType = payment.notes?.membershipType || 'non_ieee';

      if (!userId) {
        console.error('Missing userId in payment notes');
        return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
      }

      // Save payment to user record with idempotency check
      let wasSaved: boolean;
      try {
        wasSaved = await savePaymentToUser(userId, paymentId);
      } catch (dbError) {
        console.error('[Webhook] Failed to save payment to database:', dbError);
        // Return 500 to trigger retry for DB failures
        return NextResponse.json({ error: 'Database error saving payment' }, { status: 500 });
      }

      // If payment was already saved, skip email sending (idempotency)
      if (!wasSaved) {
        console.log('[Webhook] Payment already processed:', { userId, paymentId });
        return NextResponse.json({ status: 'ok' });
      }

      // Get user details for email
      // Email is in auth.users, name is in public.users
      const supabase = await createClient();
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error('[Webhook] Failed to fetch user details:', userError);
        // Still return 200 to avoid webhook retries
        return NextResponse.json({ status: 'ok' });
      }

      // Get email from auth.users
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      const userEmail = authUser.user?.email;

      if (!userEmail) {
        console.error('[Webhook] User email not found');
        // Still return 200 to avoid webhook retries
        return NextResponse.json({ status: 'ok' });
      }

      const whatsappGroupLink = process.env.WHATSAPP_GROUP_LINK;
      if (!whatsappGroupLink) {
        console.error('[Webhook] WHATSAPP_GROUP_LINK not configured');
        // Still return 200 to avoid webhook retries
        return NextResponse.json({ status: 'ok' });
      }

      // Send receipt email with retry logic (non-blocking)
      // Don't await this to ensure quick webhook response
      retryWithBackoff(
        () =>
          sendReceiptEmail({
            email: userEmail,
            userName: userData.name || 'User',
            paymentId,
            amount:
              typeof payment.amount === 'string' ? parseInt(payment.amount, 10) : payment.amount,
            membershipType,
            whatsappGroupLink,
            paymentDate: payment.created_at
              ? new Date(payment.created_at * 1000).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : undefined,
            paymentMethod: payment.method || 'UPI',
            bankName: payment.bank || payment.wallet || 'Razorpay',
            firmName: 'IEEE Student Branch',
          }),
        { maxAttempts: 5 }
      ).catch((error) => {
        console.error('[Webhook] Failed to send receipt email:', error);
      });

      console.log('[Webhook] Payment processed successfully:', { userId, paymentId });
    }

    // Return 200 quickly to avoid webhook retries
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Still return 200 to avoid webhook retries for processing errors
    return NextResponse.json({ status: 'ok' });
  }
}
