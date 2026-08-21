import { createClient } from '@/lib/supabase/server';

/**
 * Database function for saving payment records with idempotency.
 *
 * This function:
 * 1. Atomically updates payment_id, status, and pricing_tier if payment_id is null
 * 2. Returns false if payment was already recorded (no-op)
 * 3. Returns true if payment was successfully saved
 *
 * Uses conditional update to prevent race conditions - only updates if payment_id is currently null.
 * This ensures atomicity without requiring database transactions.
 *
 * Assumes SU1 (DB Table Setup) has been implemented with users table.
 */
export async function savePaymentToUser(
  userId: string,
  paymentId: string,
  pricingTier?: 'early_bird' | 'regular'
): Promise<boolean> {
  const supabase = await createClient();

  // Atomically update user with payment details using conditional update
  // Only update if payment_id is currently null (prevents race conditions)
  const updateData: {
    payment_id: string;
    status: string;
    pricing_tier?: 'early_bird' | 'regular';
  } = {
    payment_id: paymentId,
    status: 'payment completed',
  };

  // Only set pricing_tier if provided
  if (pricingTier) {
    updateData.pricing_tier = pricingTier;
  }

  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .is('payment_id', null) // Only update if payment_id is currently null
    .select('payment_id')
    .single();

  if (updateError) {
    if (updateError.code === 'PGRST116') {
      // Zero rows matched: either payment_id already set (already recorded)
      // or userId doesn't exist. Either way, no-op.
      console.log('[DB] Payment already recorded (or user not found):', { userId, paymentId });
      return false;
    }
    throw new Error(`Failed to update user: ${updateError.message}`);
  }

  console.log('[DB] Payment saved successfully:', { userId, paymentId, pricingTier });
  return true;
}
