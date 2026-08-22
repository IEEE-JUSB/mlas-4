import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRazorpayClient } from '@/lib/razorpay/client';
import { getPricing, EARLY_BIRD_SEAT_LIMITS } from '@/lib/razorpay/config';
import { CreateOrderRequest, CreateOrderResponse } from '@/types/payment';

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
    const body: CreateOrderRequest = await request.json();
    const { membershipType } = body;

    // Validate membership type
    if (membershipType !== 'ieee' && membershipType !== 'non_ieee') {
      return NextResponse.json(
        { error: 'Invalid membership type. Must be "ieee" or "non_ieee"' },
        { status: 400 }
      );
    }

    // Check if user already has a payment (prevent duplicate orders)
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('payment_id')
      .eq('id', user.id)
      .single();

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      console.error('Failed to check existing payment:', existingUserError);
      return NextResponse.json(
        { error: 'Failed to check payment status' },
        { status: 500 }
      );
    }

    if (existingUser?.payment_id) {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 400 }
      );
    }

    // If user selected IEEE membership, verify they have been verified by admin
    if (membershipType === 'ieee') {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_ieee_member')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        console.error('Failed to fetch user IEEE status:', userError);
        return NextResponse.json(
          { error: 'Failed to verify IEEE membership status' },
          { status: 500 }
        );
      }

      if (!userData.is_ieee_member) {
        return NextResponse.json(
          {
            error:
              'IEEE membership not verified. Please wait for admin verification before proceeding with IEEE pricing.',
          },
          { status: 403 }
        );
      }
    }

    // Get pricing
    let pricing = getPricing(membershipType);
    let forceRegular = false;
    let reservationId: string | null = null;

    // For early bird pricing, reserve seat BEFORE creating Razorpay order
    if (pricing.isEarlyBird) {
      const seatLimit = EARLY_BIRD_SEAT_LIMITS[membershipType];
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      // Create reservation first (without order ID) to atomically lock the seat
      const { data: reservationData, error: reservationError } = await supabase
        .rpc('create_reservation', {
          p_user_id: user.id,
          p_membership_type: membershipType,
          p_pricing_tier: 'early_bird',
          p_razorpay_order_id: null, // Will be set after order creation
          p_expires_at: expiresAt.toISOString(),
          p_seat_limit: seatLimit,
        });

      if (reservationError || !reservationData || reservationData.length === 0 || !reservationData[0].is_available) {
        console.log('Early bird seats not available, switching to regular pricing');
        forceRegular = true;
      } else {
        reservationId = reservationData[0].reservation_id;
        console.log(`Reservation created: ${reservationId}`);
      }
    }

    // Determine final pricing
    pricing = getPricing(membershipType, forceRegular);

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      console.error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured');
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const razorpay = getRazorpayClient();

    // Create Razorpay order with the final pricing
    const order = await razorpay.orders.create({
      amount: pricing.amount,
      currency: pricing.currency,
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        membershipType,
        pricingTier: pricing.isEarlyBird ? 'early_bird' : 'regular',
      },
    });

    // Update reservation with the Razorpay order ID
    if (reservationId && pricing.isEarlyBird) {
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ razorpay_order_id: order.id })
        .eq('id', reservationId);

      if (updateError) {
        console.error('Failed to update reservation with order ID:', updateError);
        // Continue anyway - the reservation exists and the order is created
        // The webhook/verify will handle the mismatch
      } else {
        console.log(`Reservation ${reservationId} linked to order ${order.id}`);
      }
    }

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
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
