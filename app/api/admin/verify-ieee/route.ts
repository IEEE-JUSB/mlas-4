import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { sendIeeeVerificationEmail } from '@/lib/email/sender';
import { IEEE_EARLY_BIRD_WINDOW_MS } from '@/lib/razorpay/config';

const requestSchema = z.object({ userId: z.string().uuid() });

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: actor, error: actorError } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', user.id)
    .single();
  if (actorError || actor?.user_type !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: participant, error: participantError } = await admin
    .from('users')
    .select('name, is_ieee_member, ieee_verified_at')
    .eq('id', parsed.data.userId)
    .single();
  if (participantError || !participant) {
    return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
  }

  const verifiedAt = participant.ieee_verified_at
    ? new Date(participant.ieee_verified_at)
    : new Date();
  const { error: updateError } = await admin
    .from('users')
    .update({ is_ieee_member: true, ieee_verified_at: verifiedAt.toISOString() })
    .eq('id', parsed.data.userId);
  if (updateError) {
    return NextResponse.json({ error: 'Unable to verify IEEE membership' }, { status: 500 });
  }

  const { data: authUser, error: authError } = await admin.auth.admin.getUserById(parsed.data.userId);
  if (authError || !authUser.user?.email) {
    return NextResponse.json({ error: 'Membership verified, but email could not be found' }, { status: 500 });
  }

  try {
    await sendIeeeVerificationEmail({
      email: authUser.user.email,
      userName: participant.name || 'Participant',
      earlyBirdDeadline: new Date(verifiedAt.getTime() + IEEE_EARLY_BIRD_WINDOW_MS),
    });
  } catch (error) {
    console.error('Failed to send IEEE verification email:', error);
    return NextResponse.json({ error: 'Membership verified, but verification email could not be sent' }, { status: 500 });
  }

  return NextResponse.json({ success: true, earlyBirdDeadline: new Date(verifiedAt.getTime() + IEEE_EARLY_BIRD_WINDOW_MS).toISOString() });
}
