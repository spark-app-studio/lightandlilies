import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getAllArtworks, createArtwork } from "@/lib/artworks";

export async function GET() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getAllArtworks());
}

export async function POST(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const artwork = createArtwork({
    collectionId: body.collectionId,
    title: body.title,
    medium: body.medium || "",
    description: body.description || "",
    imagePath: body.imagePath || "",
    buyUrl: body.buyUrl || "",
  });

  return NextResponse.json(artwork, { status: 201 });
}
