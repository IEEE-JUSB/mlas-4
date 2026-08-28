import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();
  let verifiedUser = null;

  //pkce code verification
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      verifiedUser = data.user;
    }
  }

  if (verifiedUser) {
    try {
      const adminSupabase = createAdminClient();

      await adminSupabase.from("users").upsert(
        {
          id: verifiedUser.id,
          name: verifiedUser.user_metadata?.name || "",
        },
        { onConflict: "id" },
      );
    } catch (error) {
      console.error(
        "Failed to provision users row in /api/confirm-email",
        error,
      );
    }

    return NextResponse.redirect(`${origin}/login`);
  }

  // 4. Fallback on Verification or DB Error
  return NextResponse.redirect(`${origin}/error?message=Verification+failed`);
}

// if (token_hash && type) {
//   const supabase = await createClient();
//   const { data, error: verifyError } = await supabase.auth.verifyOtp({
//     type,
//     token_hash,
//   });

//   if (!verifyError && data.user) {
//     const user = data.user;

//     // 2. Provision the public record in public.users now that email is verified
//     const { error: dbError } = await supabase
//       .from('users')
//       .upsert({
//         id: user.id, // Primary key linking to auth.users.id
//         email: user.email,
//         name: user.user_metadata?.name || '',
//       });

//     if (!dbError) {
//       // 3. Redirect to dashboard/onboarding on success
//       return NextResponse.redirect(`${origin}/dashboard`);
//     }
//   }
// }

// // Redirect to an error page if token verification or database insert fails
// return NextResponse.redirect(`${origin}/auth-error?message=Verification+failed`);
//}
