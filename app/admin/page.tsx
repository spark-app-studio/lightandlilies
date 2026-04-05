import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { getAllArtworks } from "@/lib/artworks";
import { collections as collectionDefs } from "@/lib/collections";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await verifySession())) {
    redirect("/admin/login");
  }

  const artworks = await getAllArtworks();

  return <AdminDashboard artworks={artworks} collections={collectionDefs} />;
}
