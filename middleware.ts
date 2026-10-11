import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

// Everything under /admin except the login page. (API routes under
// /api/admin check the cookie themselves via requireAdmin().)
export const config = {
  matcher: ["/admin/((?!login).*)", "/admin"]
};
