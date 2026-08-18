import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.email({error: "Invalid email address"}),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Input Validation
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;
    const supabase = await createClient();

    // 2. Trigger Password Reset Email
    // Directs the link back to your app's callback handler or password update page
    const origin = new URL(request.url).origin;
    console.log("fogpass", new URL(request.url));
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/api/callback?next=/update-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Password reset link sent successfully.' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}