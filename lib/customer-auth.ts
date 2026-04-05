import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import pool, { initDb } from "./db";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET must be set");
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = "ll-customer-token";

let dbInit = false;
async function ensureDb() {
  if (!dbInit) { await initDb(); dbInit = true; }
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
}

export async function createCustomerSession(customerId: string, email: string) {
  const token = await new SignJWT({ sub: customerId, email, role: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function verifyCustomerSession(): Promise<Customer | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "customer") return null;
    return { id: payload.sub as string, fullName: "", email: payload.email as string };
  } catch {
    return null;
  }
}

export async function destroyCustomerSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function verifyCustomerPassword(email: string, password: string): Promise<Customer | null> {
  await ensureDb();
  const { rows } = await pool.query(
    "SELECT id, full_name, email, password_hash FROM customers WHERE email = $1",
    [email.toLowerCase()]
  );
  if (rows.length === 0) return null;
  const valid = await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) return null;
  return { id: rows[0].id, fullName: rows[0].full_name, email: rows[0].email };
}

export async function findCustomerByEmail(email: string) {
  await ensureDb();
  const { rows } = await pool.query(
    "SELECT id, full_name, email FROM customers WHERE email = $1",
    [email.toLowerCase()]
  );
  return rows.length > 0 ? { id: rows[0].id, fullName: rows[0].full_name, email: rows[0].email } : null;
}

export async function updateCustomerPassword(id: string, newPassword: string) {
  await ensureDb();
  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query("UPDATE customers SET password_hash = $1 WHERE id = $2", [hash, id]);
}
