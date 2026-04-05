import { NextResponse } from "next/server";
import { verifyCustomerSession } from "@/lib/customer-auth";
import pool, { initDb } from "@/lib/db";

let dbInit = false;

export async function POST(request: Request) {
  const session = await verifyCustomerSession();
  if (!session) return NextResponse.json({ success: true });

  if (!dbInit) { await initDb(); dbInit = true; }

  const { artworkId, collectionId } = await request.json();
  if (!artworkId || !collectionId) return NextResponse.json({ error: "artworkId and collectionId required" }, { status: 400 });

  await pool.query(
    "INSERT INTO view_history (customer_id, artwork_id, collection_id) VALUES ($1, $2, $3)",
    [session.id, artworkId, collectionId]
  );

  return NextResponse.json({ success: true });
}
