"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import type { Collection } from "@/lib/collections";
import ArtworkModal from "./ArtworkModal";

interface CollectionCarouselProps {
  collection: Collection;
}

export default function CollectionCarousel({ collection }: CollectionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const hasArtworks = collection.artworks.length > 0;

  return (
    <div className="mb-16">
      <div className="text-center mb-3">
        <h3 className="font-heading text-2xl md:text-3xl text-purple-dark mb-2">
          {collection.name}
        </h3>
        <p className="text-text-secondary italic">{collection.subtitle}</p>
      </div>

      {hasArtworks ? (
        <div className="relative">
          <button
            onClick={scrollPrev}
            aria-label="Previous artwork"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-cream/90 border border-purple-light rounded-full flex items-center justify-center text-purple-dark hover:bg-purple-light transition-colors -ml-3"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next artwork"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-cream/90 border border-purple-light rounded-full flex items-center justify-center text-purple-dark hover:bg-purple-light transition-colors -mr-3"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="overflow-hidden mx-6" ref={emblaRef}>
            <div className="flex gap-4 py-12">
              {collection.artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="relative flex-[0_0_280px] md:flex-[0_0_320px] aspect-[4/3] rounded-xl group cursor-pointer"
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:z-20">
                    <Image
                      src={artwork.imagePath}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      sizes="320px"
                      unoptimized
                    />
                    <ArtworkModal artwork={artwork} collectionId={collection.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-10">
          <div className="w-[280px] md:w-[320px] aspect-[4/3] rounded-sm border border-dashed border-purple-light bg-purple-light/10 flex flex-col items-center justify-center">
            <p className="font-heading text-lg text-purple-dark/60">Coming Soon</p>
            <p className="text-text-secondary/50 text-sm mt-1">New pieces arriving shortly</p>
          </div>
        </div>
      )}
    </div>
  );
}
