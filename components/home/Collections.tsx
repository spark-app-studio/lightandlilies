import { collectionDefs } from "@/lib/collections";
import { getArtworksByCollection } from "@/lib/artworks";
import type { Collection } from "@/lib/collections";
import CollectionCarousel from "./CollectionCarousel";

export default async function Collections() {
  const collections: Collection[] = await Promise.all(
    collectionDefs.map(async (def) => {
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
    <section className="pt-10 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-purple-dark tracking-wide text-center mb-6">
          Collections
        </h2>
        {collections.map((collection) => (
          <CollectionCarousel key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
