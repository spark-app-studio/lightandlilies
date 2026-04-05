import type { Artwork } from "@/lib/collections";

interface ArtworkModalProps {
  artwork: Artwork;
}

export default function ArtworkModal({ artwork }: ArtworkModalProps) {
  return (
    <div className="absolute inset-0 bg-purple-dark/80 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h4 className="font-heading text-cream text-lg mb-1">{artwork.title}</h4>
      <p className="text-cream/70 text-sm mb-1">{artwork.medium}</p>
      <p className="text-cream/80 text-xs text-center mb-3 line-clamp-2">
        {artwork.description}
      </p>
      <a
        href={artwork.buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cream/90 text-sm underline underline-offset-2 hover:text-cream transition-colors"
      >
        View &amp; Purchase
      </a>
    </div>
  );
}
