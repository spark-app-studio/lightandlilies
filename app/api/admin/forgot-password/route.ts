import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getResend } from "@/lib/resend";
import { findAdminByEmail } from "@/lib/admins";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.ADMIN_SECRET);
}

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email } = body;
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // Always return success to prevent email enumeration
  const admin = await findAdminByEmail(email);
  if (!admin || !admin.recoveryEmail) {
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ success: true });
  }

  // Generate a short-lived reset token (15 minutes)
  const resetToken = await new SignJWT({ sub: admin.id, purpose: "password-reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSecret());

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;

  await getResend().emails.send({
    from: "Light & Lilies <curator@lightandlilies.com>",
    to: admin.recoveryEmail,
    subject: "Password Reset — Light & Lilies Admin",
    html: `
      <p>A password reset was requested for the Light &amp; Lilies admin account associated with <strong>${admin.email}</strong>.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 15 minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });

  return NextResponse.json({ success: true });
}
