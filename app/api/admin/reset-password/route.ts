import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { updateAdminPassword } from "@/lib/admins";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.ADMIN_SECRET);
}

export async function POST(request: Request) {
  let body: { token?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { token, password } = body;
  if (!token || !password || typeof token !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Token and password required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (payload.purpose !== "password-reset" || !payload.sub) {
      return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
    }

    await updateAdminPassword(payload.sub, password);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
  }
}
