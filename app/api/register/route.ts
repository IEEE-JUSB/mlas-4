import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const registerDetails = z.object({
  email: z.email({ error: "Invalid email format" }),

  password: z.string(),

  name: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password, name } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const validationResult = registerDetails.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: z.flattenError(validationResult.error).fieldErrors,
        },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        // Pass name in user_metadata so confirm-email can access it later (why)
        data: {
          name: name ?? "",
        },
        // Point the verification link directly to your confirm-email route (what is this see docs)
        emailRedirectTo: `${new URL(request.url).origin}/api/confirm-email`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user?.id) {
      return NextResponse.json(
        { error: "Failed to create user account." },
        { status: 400 },
      );
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (serviceRoleKey) {
      const adminSupabase = createAdminClient();

      // Provision a matching public.users row at sign-up time, but do not
      // fail registration if the profile write is temporarily unavailable.
      const { error: insertError } = await adminSupabase.from("users").upsert(
        {
          id: data.user.id,
          name: validatedData.name ?? "",
          status: "account created",
        },
        { onConflict: "id" },
      );

      if (insertError) {
        console.warn(
          "Failed to provision users row during /api/register",
          insertError,
        );
      }
    } else {
      // Avoid hard failure in dev if service role key is not configured.
      // The confirm-email route can still provision the row after verification.
      console.warn(
        "SUPABASE_SERVICE_ROLE_KEY is missing; skipped users upsert in /api/register",
      );
    }

    return NextResponse.json(
      { message: "Account created. Please check your email to verify." },
      { status: 201 },
    );
  } catch (err) {
    console.error("Register route error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
