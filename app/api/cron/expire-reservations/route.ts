import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized calls
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET) {
      console.error('[Cron] Invalid cron secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase.rpc('expire_old_reservations');

    if (error) {
      console.error('[Cron] Failed to expire reservations:', error);
      return NextResponse.json({ error: 'Failed to expire reservations' }, { status: 500 });
    }

    console.log('[Cron] Expired reservations:', data);

    return NextResponse.json({ expiredCount: data });
  } catch (error) {
    console.error('[Cron] Error expiring reservations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
