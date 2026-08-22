import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createHmac } from 'crypto';
import {
  claimReceiptEmail,
  releaseReceiptEmailClaim,
  savePaymentToUser,
} from '@/lib/db/payments';
import { sendReceiptEmail } from '@/lib/email/sender';
import { retryWithBackoff } from '@/lib/utils/retry';
import { createAdminClient } from '@/lib/supabase/admin';
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

    if (payload.event !== 'payment_link.paid') {
      console.error('[Webhook] Invalid event type:', payload.event);
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    if (payload.event === 'payment_link.paid') {
      const payment = payload.payload.payment.entity;
      const paymentLink = payload.payload.payment_link.entity;
      const userId = paymentLink.notes?.userId;
      const paymentId = payment.id;
      const membershipType = paymentLink.notes?.membershipType || 'non_ieee';

      if (!userId) {
        console.error('Missing userId in payment notes');
        return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
      }

      // Save payment to user record with idempotency check
      let wasSaved: boolean;
      const pricingTier = paymentLink.notes?.pricingTier === 'early_bird' ? 'early_bird' : 'regular';

      try {
        // Try to confirm reservation first if early bird pricing
        if (pricingTier === 'early_bird') {
          const adminSupabase = createAdminClient();
          const { data: confirmData, error: confirmError } = await adminSupabase
            .rpc('confirm_reservation', {
              p_razorpay_payment_link_id: paymentLink.id,
              p_payment_id: paymentId,
              p_user_id: userId,
              p_pricing_tier: pricingTier,
            });

          if (confirmError) {
            console.error('[Webhook] Failed to confirm reservation:', confirmError);
            console.warn('[Webhook] Early-bird payment saved without matching reservation - possible data drift');
            // Fallback to direct payment save if reservation confirmation fails
            wasSaved = await savePaymentToUser(userId, paymentId, pricingTier);
          } else if (confirmData === true) {
            console.log('[Webhook] Reservation confirmed successfully');
            wasSaved = true;
          } else {
            console.warn('[Webhook] Early-bird payment saved without matching reservation - possible data drift');
            // No reservation found, fallback to direct payment save
            wasSaved = await savePaymentToUser(userId, paymentId, pricingTier);
          }
        } else {
          // Regular pricing - direct payment save
          wasSaved = await savePaymentToUser(userId, paymentId, pricingTier);
        }
      } catch (dbError) {
        console.error('[Webhook] Failed to save payment to database:', dbError);
        // Return 500 to trigger retry for DB failures
        return NextResponse.json({ error: 'Database error saving payment' }, { status: 500 });
      }

      console.log('[Webhook] Payment persistence result:', { userId, paymentId, wasSaved });

      // Webhooks do not have a user session, so use the service-role client for both lookups.
      const adminSupabase = createAdminClient();
      const { data: userData, error: userError } = await adminSupabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error('[Webhook] Failed to fetch user details:', userError);
        // Still return 200 to avoid webhook retries
        return NextResponse.json({ status: 'ok' });
      }

      // Get email from auth.users using admin client
      const { data: authUser, error: authError } = await adminSupabase.auth.admin.getUserById(userId);
      const userEmail = authUser.user?.email;

      if (authError || !userEmail) {
        console.error('[Webhook] Failed to fetch user email:', authError);
        // Still return 200 to avoid webhook retries
        return NextResponse.json({ status: 'ok' });
      }

      const whatsappGroupLink = process.env.WHATSAPP_GROUP_LINK;
      if (!whatsappGroupLink) {
        console.error('[Webhook] WHATSAPP_GROUP_LINK not configured');
        // Still return 200 to avoid webhook retries
        return NextResponse.json({ status: 'ok' });
      }

      // This independent marker keeps receipt delivery idempotent even when client-side
      // verification recorded the payment before Razorpay delivers the webhook.
      const shouldSendReceipt = await claimReceiptEmail(userId);
      if (!shouldSendReceipt) {
        return NextResponse.json({ status: 'ok' });
      }

      after(() => {
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
          releaseReceiptEmailClaim(userId).catch((releaseError) => {
            console.error('[Webhook] Failed to release receipt email claim:', releaseError);
          });
        });
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
