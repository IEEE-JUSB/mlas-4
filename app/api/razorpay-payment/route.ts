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

    // Get pricing (includes early-bird discount logic)
    let pricing = getPricing(membershipType);

    // Check early bird seat limits if early bird pricing is active
    if (pricing.isEarlyBird) {
      const seatLimit = EARLY_BIRD_SEAT_LIMITS[membershipType];
      const isIeeeMember = membershipType === 'ieee';

      // Use atomic seat counting function to prevent race conditions
      const { data: seatData, error: seatError } = await supabase
        .rpc('check_early_bird_availability', {
          p_is_ieee_member: isIeeeMember,
          p_seat_limit: seatLimit,
        });

      if (seatError) {
        console.error('Failed to check seat availability:', seatError);
        // Fallback to regular pricing if seat check fails
        pricing = getPricing(membershipType, true);
      } else if (seatData && seatData.length > 0) {
        const { is_available, used_seats } = seatData[0];

        if (!is_available) {
          console.log(
            `Early bird seats exhausted for ${membershipType}. Used: ${used_seats}, Limit: ${seatLimit}. Switching to regular pricing.`
          );
          // Force regular pricing when seats are exhausted
          pricing = getPricing(membershipType, true);
        } else {
          console.log(
            `Early bird pricing active for ${membershipType}. Used: ${used_seats}, Limit: ${seatLimit}`
          );
        }
      }
    }

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      console.error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured');
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
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
        pricingTier: pricing.isEarlyBird ? 'early_bird' : 'regular',
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
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
