import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret === "change-this-to-a-random-string") {
    throw new Error("ADMIN_SECRET must be set");
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // --- OWASP Security Headers ---
  // A05:2021 - Security Misconfiguration
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

  // A03:2021 - Injection (CSP)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  );

  // A09:2021 - Security Logging (request ID for tracing)
  response.headers.set("X-Request-Id", crypto.randomUUID());

  // Strict-Transport-Security (HTTPS only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  // --- A01:2021 - Broken Access Control ---

  // Protect admin routes (except login page, forgot-password)
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/forgot-password" && pathname !== "/admin/reset-password";
  const isAdminApi = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login") && !pathname.startsWith("/api/admin/forgot-password") && !pathname.startsWith("/api/admin/reset-password");

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get("ll-admin-token")?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, getSecret());
    } catch {
      const res = pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        : NextResponse.redirect(new URL("/admin/login", request.url));
      res.cookies.delete("ll-admin-token");
      return res;
    }
  }

  // Protect customer routes
  const isCustomerPage = pathname === "/account" || pathname.startsWith("/account/") || pathname === "/collections";
  const isCustomerApi = pathname.startsWith("/api/track/");

  if (isCustomerPage) {
    const token = request.cookies.get("ll-customer-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      await jwtVerify(token, getSecret());
    } catch {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("ll-customer-token");
      return res;
    }
  }

  // Tracking APIs pass through — they check auth internally and silently skip for anonymous users

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
