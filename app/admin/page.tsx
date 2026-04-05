import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { getAllArtworks } from "@/lib/artworks";
import { collectionDefs } from "@/lib/collections";
import pool, { initDb } from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

let dbInit = false;

export default async function AdminPage() {
  if (!(await verifySession())) {
    redirect("/admin/login");
  }

  if (!dbInit) { await initDb(); dbInit = true; }

  const artworks = await getAllArtworks();
  const { rows: news } = await pool.query("SELECT * FROM news ORDER BY created_at DESC");

  return <AdminDashboard artworks={artworks} collections={collectionDefs} news={news} />;
}
