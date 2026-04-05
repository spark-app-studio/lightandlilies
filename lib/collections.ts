export interface Artwork {
  id: string;
  title: string;
  medium: string;
  description: string;
  imagePath: string;
  buyUrl: string;
}

export interface Collection {
  id: string;
  name: string;
  subtitle: string;
  artworks: Artwork[];
}

function placeholderImage(collection: number, index: number, hue: string): string {
  return `https://placehold.co/800x600/${hue}/ffffff?text=Artwork+${index + 1}`;
}

function generateArtworks(collectionNum: number, hue: string, count: number = 6): Artwork[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `c${collectionNum}-art-${i + 1}`,
    title: `Artwork ${i + 1}`,
    medium: "Oil on canvas",
    description: "A beautiful original work. Details coming soon.",
    imagePath: placeholderImage(collectionNum, i, hue),
    buyUrl: "mailto:Curator@lightandlilies.com?subject=Inquiry",
  }));
}

export const collections: Collection[] = [
  {
    id: "light-and-landscape",
    name: "Light & Landscape",
    subtitle: "The beauty of creation expressed through light and place",
    artworks: generateArtworks(1, "4a3566"),
  },
  {
    id: "quiet-spaces",
    name: "Quiet Spaces",
    subtitle: "Art for stillness, reflection, and rest",
    artworks: generateArtworks(2, "6B4C8A"),
  },
  {
    id: "timeless-works",
    name: "Timeless Works",
    subtitle: "Vintage and antique works chosen for enduring beauty",
    artworks: generateArtworks(3, "2D1B4E"),
  },
  {
    id: "light-and-shadow",
    name: "Light & Shadow",
    subtitle: "Form and contrast expressed through simplicity",
    artworks: generateArtworks(4, "5C4A6E"),
  },
  {
    id: "lilies-and-florals",
    name: "Lilies & Florals",
    subtitle: "Symbolic beauty drawn from creation",
    artworks: generateArtworks(5, "7BA67D"),
  },
];
