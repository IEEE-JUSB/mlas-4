import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/server";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // // Protect frontend page
  // if (!user && pathname === "/complete-profile") {
  //   return NextResponse.redirect(
  //     new URL("/login", request.url)
  //   );
  // } //already being done by lib/supabase/proxy.ts, i checked 

  const protectedApiRoutes = [
    "/api/complete-profile","/api/logout"
  ];

  if (protectedApiRoutes.includes(pathname) && !user) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
