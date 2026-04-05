import { NextResponse } from "next/server";
import { getAllArtworks, createArtwork } from "@/lib/artworks";
import { artworkSchema } from "@/lib/validation";
import { notifyCollectionSubscribers } from "@/lib/notifications";

export async function GET() {
  const artworks = await getAllArtworks();
  return NextResponse.json(artworks);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = artworkSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.issues },
      { status: 400 }
    );
  }

  const artwork = await createArtwork(result.data);

  // Notify subscribers in the background (don't block the response)
  notifyCollectionSubscribers(artwork).catch((err) =>
    console.error("Failed to send subscriber notifications:", err)
  );

  return NextResponse.json(artwork, { status: 201 });
}
