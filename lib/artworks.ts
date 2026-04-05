import fs from "fs";
import path from "path";

export interface StoredArtwork {
  id: string;
  collectionId: string;
  title: string;
  medium: string;
  description: string;
  imagePath: string;
  buyUrl: string;
  createdAt: string;
}

const DATA_PATH = path.join(process.cwd(), "data", "artworks.json");

function readData(): { artworks: StoredArtwork[] } {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: { artworks: StoredArtwork[] }) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function getAllArtworks(): StoredArtwork[] {
  return readData().artworks;
}

export function getArtworksByCollection(collectionId: string): StoredArtwork[] {
  return readData().artworks.filter((a) => a.collectionId === collectionId);
}

export function getArtworkById(id: string): StoredArtwork | undefined {
  return readData().artworks.find((a) => a.id === id);
}

export function createArtwork(artwork: Omit<StoredArtwork, "id" | "createdAt">): StoredArtwork {
  const data = readData();
  const newArtwork: StoredArtwork = {
    ...artwork,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  data.artworks.push(newArtwork);
  writeData(data);
  return newArtwork;
}

export function updateArtwork(id: string, updates: Partial<Omit<StoredArtwork, "id" | "createdAt">>): StoredArtwork | null {
  const data = readData();
  const index = data.artworks.findIndex((a) => a.id === id);
  if (index === -1) return null;
  data.artworks[index] = { ...data.artworks[index], ...updates };
  writeData(data);
  return data.artworks[index];
}

export function deleteArtwork(id: string): boolean {
  const data = readData();
  const before = data.artworks.length;
  data.artworks = data.artworks.filter((a) => a.id !== id);
  if (data.artworks.length === before) return false;
  writeData(data);
  return true;
}
