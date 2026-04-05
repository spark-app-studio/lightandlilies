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

export const collectionDefs: { id: string; name: string; subtitle: string }[] = [
  {
    id: "light-and-landscape",
    name: "Light & Landscape",
    subtitle: "The beauty of creation expressed through light and place",
  },
  {
    id: "quiet-spaces",
    name: "Quiet Spaces",
    subtitle: "Art for stillness, reflection, and rest",
  },
  {
    id: "timeless-works",
    name: "Timeless Works",
    subtitle: "Vintage and antique works chosen for enduring beauty",
  },
  {
    id: "light-and-shadow",
    name: "Light & Shadow",
    subtitle: "Form and contrast expressed through simplicity",
  },
  {
    id: "lilies-and-florals",
    name: "Lilies & Florals",
    subtitle: "Symbolic beauty drawn from creation",
  },
];
