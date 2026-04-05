import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret === "change-this-to-a-random-string") {
    throw new Error("ADMIN_SECRET must be set to a secure random value");
  }
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = "ll-admin-token";

export async function createSession(adminId: string, email: string) {
  const token = await new SignJWT({ sub: adminId, email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function verifySession(): Promise<{ adminId: string; email: string } | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { adminId: payload.sub as string, email: payload.email as string };
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}
