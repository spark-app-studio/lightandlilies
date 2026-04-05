import { NextResponse } from "next/server";
import pool, { initDb } from "@/lib/db";

let dbInit = false;
async function ensureDb() { if (!dbInit) { await initDb(); dbInit = true; } }

export async function GET() {
  await ensureDb();
  const { rows } = await pool.query("SELECT * FROM news ORDER BY created_at DESC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  await ensureDb();
  const { title, body } = await request.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const { rows } = await pool.query(
    "INSERT INTO news (title, body) VALUES ($1, $2) RETURNING *",
    [title, body || null]
  );
  return NextResponse.json(rows[0], { status: 201 });
}

export async function DELETE(request: Request) {
  await ensureDb();
  const { id } = await request.json();
  await pool.query("DELETE FROM news WHERE id = $1", [id]);
  return NextResponse.json({ success: true });
}
