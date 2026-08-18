import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    console.log("check: ",searchParams)

    const code = searchParams.get("code");

    //error handler in case code expires
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const errorDescription = searchParams.get("error_description");

    if (error) {
    return NextResponse.redirect(
        `${origin}/error?error=${encodeURIComponent(error)}&error_code=${encodeURIComponent(
        errorCode || ""
        )}&error_description=${encodeURIComponent(errorDescription || "")}`
    );
    }
    const body = await request.json();

    const validationResult = updatePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: z.flattenError(validationResult.error).fieldErrors,
        },
        { status: 400 }
      );
    }

    const { password } = validationResult.data;

    const supabase = await createClient();
    let verifiedUser = null;

    // console.log(
    //   "reached password update point with",
    //   searchParams
    // );

    // PKCE code verification
    if (code) {
      const { data, error } =
        await supabase.auth.exchangeCodeForSession(code);

      console.log("1\n");

      if (!error && data.user) {
        verifiedUser = data.user;

        console.log("user is: ", verifiedUser);
      } else {
        console.log("PKCE exchange error: ", error);
        console.log("user: ", data.user);
      }
    }

    // Recovery session successfully established
    if (verifiedUser) {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (!updateError) {
        return NextResponse.json(
          {
            message: "Password updated successfully.",
          },
          { status: 200 }
        );
      } else {
        console.log("password update error: ", updateError);

        return NextResponse.json(
          {
            error: updateError.message,
          },
          { status: 400 }
        );
      }
    }

    // Verification failed
    return NextResponse.json(
      {
        error: "Password reset link is invalid or has expired.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Update password error: ", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}