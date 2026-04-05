import { redirect } from "next/navigation";
import { verifyCustomerSession } from "@/lib/customer-auth";
import { getArtworksByCollection } from "@/lib/artworks";
import { collectionDefs } from "@/lib/collections";
import pool, { initDb } from "@/lib/db";
import Hero from "@/components/layout/Hero";
import CollectionCarousel from "@/components/home/CollectionCarousel";
import type { Collection } from "@/lib/collections";

export const dynamic = "force-dynamic";

let dbInit = false;

export default async function MyCollectionsPage() {
  const session = await verifyCustomerSession();
  if (!session) redirect("/login");

  if (!dbInit) { await initDb(); dbInit = true; }

  // Get customer's subscribed collections
  const { rows: subRows } = await pool.query(
    "SELECT collection_id FROM customer_collections WHERE customer_id = $1",
    [session.id]
  );
  const subscribedIds = subRows.map((r: { collection_id: string }) => r.collection_id);

  // Build collection data with artworks from DB
  const collections: Collection[] = await Promise.all(
    collectionDefs
      .filter((def) => subscribedIds.includes(def.id))
      .map(async (def) => {
        const dbArtworks = await getArtworksByCollection(def.id);
        return {
          ...def,
          artworks: dbArtworks.map((a) => ({
            id: a.id,
            title: a.title,
            medium: a.medium,
            description: a.description,
            imagePath: a.imagePath,
            buyUrl: a.buyUrl,
          })),
        };
      })
  );

  return (
    <>
      <Hero title="My Collections" />
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {collections.length === 0 ? (
            <p className="text-text-secondary text-center">
              You haven&apos;t subscribed to any collections yet.
            </p>
          ) : (
            collections.map((collection) => (
              <CollectionCarousel key={collection.id} collection={collection} />
            ))
          )}
        </div>
      </section>
    </>
  );
}
