import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { savePaymentToUser } from '@/lib/db/payments';
import { getRazorpayClient } from '@/lib/razorpay/client';
import { VerifyPaymentRequest, VerifyPaymentResponse } from '@/types/payment';
import { createHmac } from 'crypto';
import { constantTimeCompare } from '@/lib/utils/crypto';

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

    // Signature is valid - verify order ownership
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.fetch(razorpay_order_id);

    if (!order || order.notes?.userId !== user.id) {
      const response: VerifyPaymentResponse = {
        confirmed: false,
        redirect: '/checkout',
      };
      return NextResponse.json(response);
    }

    // Re-verify IEEE membership if order was for IEEE pricing
    if (order.notes?.membershipType === 'ieee') {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_ieee_member')
        .eq('id', user.id)
        .single();

      if (userError || !userData || !userData.is_ieee_member) {
        console.error('[Verify] IEEE membership verification failed:', userError);
        const response: VerifyPaymentResponse = {
          confirmed: false,
          redirect: '/checkout',
        };
        return NextResponse.json(response);
      }
    }

    // Save payment to user record
    try {
      const pricingTier = order.notes?.pricingTier === 'early_bird' ? 'early_bird' : 'regular';
      await savePaymentToUser(user.id, razorpay_payment_id, pricingTier);
    } catch (dbError) {
      console.error('[Verify] Failed to save payment to database:', dbError);
      // Return 500 to indicate server error - payment was verified but DB save failed
      // Frontend should handle this appropriately (show error, don't redirect to checkout)
      return NextResponse.json(
        { error: 'Database error saving payment' },
        { status: 500 }
      );
    }

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
