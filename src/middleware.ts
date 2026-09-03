import { NextRequest, NextResponse } from "next/server";
import { verifyJwtEdge } from "@/lib/jwt-edge";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1. Only process /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("CRITICAL: JWT_SECRET is missing from environment variables!");
    // Fail safely: prevent access to protected admin pages
    if (pathname !== "/admin/login") {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Read admin_token from cookies
  const token = req.cookies.get("admin_token")?.value;
  const verifiedPayload = token ? await verifyJwtEdge(token, jwtSecret) : null;
  const isAuthenticated = Boolean(verifiedPayload);

  // 3. Handle Login Page (/admin/login)
  if (pathname === "/admin/login") {
    // If already authenticated, redirect straight to the admin dashboard
    if (isAuthenticated) {
      const dashboardUrl = new URL("/admin", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
    // Otherwise allow guest to view the login form
    return NextResponse.next();
  }

  // 4. Protected Admin Routes (/admin, /admin/cakes, /admin/settings, etc.)
  if (!isAuthenticated) {
    const loginUrl = new URL("/admin/login", req.url);
    // Preserve requested destination for post-login redirection
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    }

    const response = NextResponse.redirect(loginUrl);

    // If an invalid or expired token was sent, clear the invalid cookie
    if (token) {
      response.cookies.delete("admin_token");
    }

    return response;
  }

  // 5. User is authenticated -> Allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
