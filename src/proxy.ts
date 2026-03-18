import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Simple auth check - redirect to signin if no session token
  const token =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");

  if (!token) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Only protect admin/dashboard routes — public pages handle auth client-side
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
