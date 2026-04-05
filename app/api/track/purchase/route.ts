import { NextResponse } from "next/server";
import { verifyCustomerSession } from "@/lib/customer-auth";
import pool, { initDb } from "@/lib/db";

let dbInit = false;

export async function POST(request: Request) {
  const session = await verifyCustomerSession();
  if (!session) return NextResponse.json({ success: true });

  if (!dbInit) { await initDb(); dbInit = true; }

  const { artworkId } = await request.json();
  if (!artworkId) return NextResponse.json({ error: "artworkId required" }, { status: 400 });

  await pool.query(
    "INSERT INTO purchases (customer_id, artwork_id) VALUES ($1, $2)",
    [session.id, artworkId]
  );

  return NextResponse.json({ success: true });
}
