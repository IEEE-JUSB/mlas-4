import { MembershipType, PricingConfig } from '@/types/payment';

// Base pricing in paise (Razorpay uses smallest currency unit)
const BASE_PRICING: Record<MembershipType, number> = {
  ieee: 50000, // ₹500
  non_ieee: 58000, // ₹580
};

export function getPricing(membershipType: MembershipType): PricingConfig {
  const baseAmount = BASE_PRICING[membershipType];
  
  // Check if early-bird discount applies
  const isEarlyBird = isEarlyBirdPeriod();
  const discountPercent = isEarlyBird 
    ? parseInt(process.env.EARLY_BIRD_DISCOUNT_PERCENT || '20', 10)
    : 0;
  
  const discountAmount = Math.floor((baseAmount * discountPercent) / 100);
  const finalAmount = baseAmount - discountAmount;
  
  return {
    amount: finalAmount,
    currency: 'INR',
    isEarlyBird,
  };
}

function isEarlyBirdPeriod(): boolean {
  const cutoffDateStr = process.env.EARLY_BIRD_CUTOFF_DATE;
  
  if (!cutoffDateStr || cutoffDateStr === 'YYYY-MM-DDTHH:mm:ssZ') {
    // No cutoff date configured, early-bird not active
    return false;
  }
  
  const cutoffDate = new Date(cutoffDateStr);
  const now = new Date();
  
  return now < cutoffDate;
}
