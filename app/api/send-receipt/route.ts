import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRazorpayClient } from '@/lib/razorpay/client';
import { savePaymentToUser } from '@/lib/db/payments';
import { sendReceiptEmail } from '@/lib/email/sender';
import { retryWithBackoff } from '@/lib/utils/retry';
import { SendReceiptRequest, SendReceiptResponse } from '@/types/payment';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: SendReceiptRequest = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    // Re-check payment status with Razorpay (don't trust frontend)
    const razorpay = getRazorpayClient();
    const payment = await razorpay.payments.fetch(paymentId);

    if (!payment || payment.status !== 'captured') {
      return NextResponse.json({ error: 'Payment not confirmed or not found' }, { status: 400 });
    }

    // Save payment to user record with idempotency check
    const wasSaved = await savePaymentToUser(user.id, paymentId);

    // If payment was already saved, skip email sending (idempotency)
    if (!wasSaved) {
      const response: SendReceiptResponse = {
        success: true,
        message: 'Receipt already sent',
      };
      return NextResponse.json(response);
    }

    // Get user details for email
    // Email is in auth.users, name is in public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      console.error('Failed to fetch user details:', userError);
      return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }

    // Get email from auth.users
    const userEmail = user.email;
    if (!userEmail) {
      console.error('User email not found');
      return NextResponse.json({ error: 'User email not found' }, { status: 500 });
    }

    // Get membership type from payment notes
    const membershipType = payment.notes?.membershipType || 'non_ieee';
    const whatsappGroupLink = process.env.WHATSAPP_GROUP_LINK;

    if (!whatsappGroupLink) {
      console.error('WHATSAPP_GROUP_LINK not configured');
      return NextResponse.json({ error: 'WhatsApp group link not configured' }, { status: 500 });
    }

    // Extract payment details from Razorpay response
    const paymentDate = payment.created_at
      ? new Date(payment.created_at * 1000).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : undefined;
    const paymentMethod = payment.method || 'UPI';
    const bankName = payment.bank || payment.wallet || 'Razorpay';
    const firmName = 'IEEE Student Branch';

    // Send receipt email with retry logic
    await retryWithBackoff(
      () =>
        sendReceiptEmail({
          email: userEmail,
          userName: userData.name || 'User',
          paymentId,
          amount:
            typeof payment.amount === 'string' ? parseInt(payment.amount, 10) : payment.amount,
          membershipType,
          whatsappGroupLink,
          paymentDate,
          paymentMethod,
          bankName,
          firmName,
        }),
      { maxAttempts: 5 }
    );

    const response: SendReceiptResponse = {
      success: true,
      message: 'Receipt sent successfully',
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error sending receipt:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send receipt',
      },
      { status: 500 }
    );
  }
}
