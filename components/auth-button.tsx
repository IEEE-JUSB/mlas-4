import Link from "next/link";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";

export async function AuthButton() {
  const supabase = await createClient();
  let firstName = ""; // Switched to let for standard block scoping

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
  if (user != undefined) {
    const metadata = user.user_metadata || {};
    firstName = metadata.name ? metadata.name.split(" ")[0] : "Participant";
  }

  return user ? (
    <div className="flex items-center gap-4 text-black dark:text-white">
      {/* Hey, {firstName}! */}
      <Link
        href="/dashboard"
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-7 py-2.5 text-sm font-semibold transition-transform hover:scale-105 duration-300 text-black"
      >
        Dashboard
      </Link>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link
        href="/login"
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-7 py-2.5 text-sm font-semibold transition-transform hover:scale-105 duration-300 text-black"
      >
        Sign in
      </Link>
    </div>
  );
}