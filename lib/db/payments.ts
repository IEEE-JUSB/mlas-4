import { createClient } from '@/lib/supabase/server';

/**
 * Database function for saving payment records with idempotency.
 *
 * This function:
 * 1. Checks if payment is already recorded (idempotency)
 * 2. Writes PaymentID (Razorpay payment_id) to the user's row
 * 3. Sets status to 'payment completed'
 *
 * Assumes SU1 (DB Table Setup) has been implemented with users table.
 */
export async function savePaymentToUser(userId: string, paymentId: string): Promise<boolean> {
  const supabase = await createClient();

  // Check if payment is already recorded (idempotency)
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('payment_id, status')
    .eq('id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is "not found", which is acceptable
    throw new Error(`Failed to fetch user: ${fetchError.message}`);
  }

  // If payment already recorded, return false (no-op)
  if (
    existingUser &&
    existingUser.payment_id === paymentId &&
    existingUser.status === 'payment completed'
  ) {
    console.log('[DB] Payment already recorded for user:', { userId, paymentId });
    return false;
  }

  // Update user with payment details
  const { error: updateError } = await supabase
    .from('users')
    .update({
      payment_id: paymentId,
      status: 'payment completed',
    })
    .eq('id', userId);

  if (updateError) {
    throw new Error(`Failed to update user: ${updateError.message}`);
  }

  console.log('[DB] Payment saved successfully:', { userId, paymentId });
  return true;
}
