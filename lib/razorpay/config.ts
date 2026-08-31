import { MembershipType, PricingConfig } from '@/types/payment';

// Early bird pricing in paise (Razorpay uses smallest currency unit)
const EARLY_BIRD_PRICING: Record<MembershipType, number> = {
  ieee: parseInt(process.env.EARLY_BIRD_IEEE_PRICE || '49900', 10), // ₹499
  non_ieee: parseInt(process.env.EARLY_BIRD_NON_IEEE_PRICE || '59900', 10), // ₹599
};

// Regular pricing in paise
const REGULAR_PRICING: Record<MembershipType, number> = {
  ieee: parseInt(process.env.REGULAR_IEEE_PRICE || '59900', 10), // ₹599
  non_ieee: parseInt(process.env.REGULAR_NON_IEEE_PRICE || '69900', 10), // ₹699
};

// Early bird seat limits
const EARLY_BIRD_SEAT_LIMITS: Record<MembershipType, number> = {
  ieee: 2,
  non_ieee: 30,
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

export const IEEE_EARLY_BIRD_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

// Export seat limits for checking availability
export { EARLY_BIRD_SEAT_LIMITS };
