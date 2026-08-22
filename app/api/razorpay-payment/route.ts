import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getRazorpayClient } from '@/lib/razorpay/client';
import { getPricing, IEEE_EARLY_BIRD_WINDOW_MS } from '@/lib/razorpay/config';
import { CreatePaymentLinkResponse } from '@/types/payment';

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

    // Derive eligibility and pricing from the stored profile; never trust a client-selected tier.
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select(
        'payment_id, is_ieee_member, ieee_verified_at, name, phone, college, department, degree, year, food_preference, tshirt_size, ieee_student_branch, ieee_membership_no'
      )
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

    if (!existingUser) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 400 });
    }

    const hasText = (value: string | null | undefined) => Boolean(value?.trim());
    const hasIeeeDetails =
      hasText(existingUser.ieee_student_branch) === hasText(existingUser.ieee_membership_no);
    const isRegistrationComplete =
      hasText(existingUser.name) &&
      hasText(user.email) &&
      hasText(existingUser.phone) &&
      hasText(existingUser.college) &&
      hasText(existingUser.department) &&
      hasText(existingUser.degree) &&
      existingUser.year !== null &&
      hasText(existingUser.food_preference) &&
      hasText(existingUser.tshirt_size) &&
      hasIeeeDetails;

    if (!isRegistrationComplete) {
      return NextResponse.json({ error: 'Complete your registration before payment' }, { status: 400 });
    }

    if (hasText(existingUser.ieee_student_branch) && !existingUser.is_ieee_member) {
      return NextResponse.json(
        { error: 'Your IEEE membership is awaiting admin verification' },
        { status: 403 }
      );
    }

    const membershipType = existingUser.is_ieee_member ? 'ieee' : 'non_ieee';
    const ieeeEarlyBirdWindowExpired =
      membershipType === 'ieee' &&
      (!existingUser.ieee_verified_at ||
        new Date(existingUser.ieee_verified_at).getTime() + IEEE_EARLY_BIRD_WINDOW_MS <= Date.now());

    // Get pricing
    let pricing = getPricing(membershipType, ieeeEarlyBirdWindowExpired);
    let forceRegular = ieeeEarlyBirdWindowExpired;
    let reservationId: string | null = null;
    const expiresAt = new Date(Date.now() + 16 * 60 * 1000);

    // For early bird pricing, reserve seat BEFORE creating Razorpay order
    if (pricing.isEarlyBird) {
      // Razorpay requires a Payment Link expiry at least 15 minutes ahead. One extra
      // minute avoids a rejected request because of second-level rounding.
      // Create reservation first (without a link ID) to atomically lock the seat.
      const { data: reservationData, error: reservationError } = await supabase
        .rpc('create_reservation', {
          p_user_id: user.id,
          p_membership_type: membershipType,
          p_pricing_tier: 'early_bird',
          p_razorpay_payment_link_id: null,
          p_expires_at: expiresAt.toISOString(),
        });

      if (reservationError) {
        console.error('Failed to create reservation:', reservationError);
        // Transient error - don't silently charge full price
        return NextResponse.json(
          { error: 'Failed to create reservation. Please try again.' },
          { status: 500 }
        );
      } else if (!reservationData || reservationData.length === 0) {
        console.error('Invalid reservation response');
        return NextResponse.json(
          { error: 'Invalid reservation response. Please try again.' },
          { status: 500 }
        );
      } else if (!reservationData[0].is_available) {
        // Actual seat exhaustion - switch to regular pricing
        console.log('Early bird seats not available, switching to regular pricing');
        forceRegular = true;
      } else {
        reservationId = reservationData[0].reservation_id;
        console.log(`Reservation created: ${reservationId}`);
      }
    }

    // Determine final pricing
    pricing = getPricing(membershipType, forceRegular);

    const razorpay = getRazorpayClient();
    const paymentLink = await razorpay.paymentLink.create({
      amount: pricing.amount,
      currency: pricing.currency,
      accept_partial: false,
      expire_by: Math.ceil(expiresAt.getTime() / 1000),
      reference_id: reservationId ? `res_${reservationId}` : `u_${user.id}`,
      description: 'MLAS 4.0 Workshop Registration',
      customer: {
        name: existingUser.name,
        email: user.email,
        contact: `+91${existingUser.phone}`,
      },
      notify: { email: false, sms: false },
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin}/dashboard`,
      callback_method: 'get',
      notes: {
        userId: user.id,
        membershipType,
        pricingTier: pricing.isEarlyBird ? 'early_bird' : 'regular',
      },
    });

    // Link the reservation after the Payment Link is created.
    if (reservationId && pricing.isEarlyBird) {
      const adminSupabase = createAdminClient();
      const { error: updateError } = await adminSupabase
        .from('reservations')
        .update({ razorpay_payment_link_id: paymentLink.id })
        .eq('id', reservationId);

      if (updateError) {
        console.error('Failed to update reservation with order ID:', updateError);
        // Continue anyway - the reservation exists and the order is created
        // The webhook fallback can still find the user's active reservation.
      } else {
        console.log(`Reservation ${reservationId} linked to Payment Link ${paymentLink.id}`);
      }
    }

    const response: CreatePaymentLinkResponse = {
      paymentLinkUrl: paymentLink.short_url,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
