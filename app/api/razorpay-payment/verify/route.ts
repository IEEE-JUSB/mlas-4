import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { savePaymentToUser } from '@/lib/db/payments';
import { VerifyPaymentRequest, VerifyPaymentResponse } from '@/types/payment';
import { createHmac } from 'crypto';

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
    const body: VerifyPaymentRequest = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const response: VerifyPaymentResponse = {
        confirmed: false,
        redirect: '/checkout',
      };
      return NextResponse.json(response);
    }

    // Recompute signature using Razorpay key secret
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    const generatedSignature = createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const isValid = constantTimeCompare(generatedSignature, razorpay_signature);

    if (!isValid) {
      const response: VerifyPaymentResponse = {
        confirmed: false,
        redirect: '/checkout',
      };
      return NextResponse.json(response);
    }

    // Signature is valid - save payment to user record
    await savePaymentToUser(user.id, razorpay_payment_id);

    const response: VerifyPaymentResponse = {
      confirmed: true,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error verifying payment:', error);
    const response: VerifyPaymentResponse = {
      confirmed: false,
      redirect: '/checkout',
    };
    return NextResponse.json(response);
  }
}

/**
 * Constant-time comparison to prevent timing attacks
 * when comparing HMAC signatures
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
