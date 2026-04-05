import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyCustomerPassword, createCustomerSession } from "@/lib/customer-auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const { allowed, retryAfterSeconds } = checkRateLimit(`customer:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const customer = await verifyCustomerPassword(email, password);
  if (!customer) {
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createCustomerSession(customer.id, customer.email);
  return NextResponse.json({ success: true });
}
