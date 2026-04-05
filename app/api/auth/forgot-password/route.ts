import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getResend } from "@/lib/resend";
import { findCustomerByEmail } from "@/lib/customer-auth";
import { passwordReset } from "@/lib/email-templates";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.ADMIN_SECRET);
}

export async function POST(request: Request) {
  let body: { email?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const { email } = body;
  if (!email || typeof email !== "string") return NextResponse.json({ error: "Email required" }, { status: 400 });

  const customer = await findCustomerByEmail(email);
  if (!customer) { await new Promise((r) => setTimeout(r, 500)); return NextResponse.json({ success: true }); }

  const resetToken = await new SignJWT({ sub: customer.id, purpose: "customer-password-reset" })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("15m").sign(getSecret());

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  await getResend().emails.send({
    from: "Light & Lilies <curator@lightandlilies.com>",
    to: customer.email,
    subject: "Password Reset — Light & Lilies",
    html: passwordReset(customer.fullName, resetUrl),
  });

  return NextResponse.json({ success: true });
}
