import { redirect, notFound } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { getArtworkById } from "@/lib/artworks";
import Link from "next/link";
import ArtworkForm from "@/components/admin/ArtworkForm";

export const dynamic = "force-dynamic";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await verifySession())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const artwork = await getArtworkById(id);
  if (!artwork) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-purple-dark text-cream px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="font-heading text-xl tracking-wide">
          Light &amp; Lilies Admin
        </Link>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-heading text-2xl text-purple-dark tracking-wide mb-8">
          Edit Artwork
        </h2>
        <ArtworkForm artwork={artwork} />
      </div>
    </div>
  );
}
