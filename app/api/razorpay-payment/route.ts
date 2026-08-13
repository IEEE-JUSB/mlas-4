import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRazorpayClient } from '@/lib/razorpay/client';
import { getPricing } from '@/lib/razorpay/config';
import { CreateOrderRequest, CreateOrderResponse } from '@/types/payment';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreateOrderRequest = await request.json();
    const { membershipType } = body;

    // Validate membership type
    if (membershipType !== 'ieee' && membershipType !== 'non_ieee') {
      return NextResponse.json(
        { error: 'Invalid membership type. Must be "ieee" or "non_ieee"' },
        { status: 400 }
      );
    }

    // Get pricing (includes early-bird discount logic)
    const pricing = getPricing(membershipType);

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      console.error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Create Razorpay order
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: pricing.amount,
      currency: pricing.currency,
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        membershipType,
      },
    });

    // Return order details to frontend
    const response: CreateOrderResponse = {
      order_id: order.id,
      amount: typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount,
      currency: order.currency,
      key: razorpayKeyId,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
