import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

//this route is for update password pkce code verification
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/protected";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/error?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`,
  );
}
