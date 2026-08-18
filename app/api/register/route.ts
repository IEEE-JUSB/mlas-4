import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from "zod";

const registerDetails = z.object({
  email: z
  .email({ error: "Invalid email format" }),  
  
  password: z
  .string(),
  
  name: z
  .string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();


    const { email, password, name } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const validationResult = registerDetails.safeParse(body);
    
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

    console.log("reached with data: ", validatedData)

    const supabase = await createClient();


    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        // Pass name in user_metadata so confirm-email can access it later (why)
        data: {
          name: name ?? '',
        },
        // Point the verification link directly to your confirm-email route (what is this see docs)
        emailRedirectTo: `${new URL(request.url).origin}/api/confirm-email`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Account created. Please check your email to verify.' },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}