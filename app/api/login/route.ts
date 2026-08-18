import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from "zod";

const loginDetails = z.object({
  email: z
  .email({ error: "Invalid email format" }),  
  
  password: z
  .string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const validationResult = loginDetails.safeParse(body);

        if (!validationResult.success) {
          return NextResponse.json(
            {
              error: "Invalid input data",
              details: z.flattenError(validationResult.error).fieldErrors
            },
            { status: 400 }
          );
        }


    const validatedData = validationResult.data;
    const supabase = await createClient();

    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: 'Login successful.',
        user: { id: data.user.id, email: data.user.email },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}