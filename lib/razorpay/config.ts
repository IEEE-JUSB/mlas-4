import { MembershipType, PricingConfig } from '@/types/payment';

// Early bird pricing in paise (Razorpay uses smallest currency unit)
const EARLY_BIRD_PRICING: Record<MembershipType, number> = {
  ieee: 49900, // ₹499
  non_ieee: 59900, // ₹599
};

// Regular pricing in paise
const REGULAR_PRICING: Record<MembershipType, number> = {
  ieee: 59900, // ₹599
  non_ieee: 69900, // ₹699
};

// Early bird seat limits
const EARLY_BIRD_SEAT_LIMITS: Record<MembershipType, number> = {
  ieee: 10, // 10 early bird seats for IEEE
  non_ieee: 20, // 20 early bird seats for Non-IEEE
};

export function getPricing(membershipType: MembershipType, forceRegular = false): PricingConfig {
  // Early bird is based on seat limits only, not time
  // The calling code should check seat availability before calling this
  const isEarlyBird = !forceRegular;

  let finalAmount: number;

  if (isEarlyBird) {
    // Use early bird pricing
    finalAmount = EARLY_BIRD_PRICING[membershipType];
  } else {
    // Use regular pricing
    finalAmount = REGULAR_PRICING[membershipType];
  }

  return {
    amount: finalAmount,
    currency: 'INR',
    isEarlyBird,
  };
}

// Export seat limits for checking availability
export { EARLY_BIRD_SEAT_LIMITS };
