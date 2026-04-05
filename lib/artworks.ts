import pool, { initDb } from "./db";

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

function rowToArtwork(row: Record<string, unknown>): StoredArtwork {
  return {
    id: row.id as string,
    collectionId: row.collection_id as string,
    title: row.title as string,
    medium: (row.medium as string) || "",
    description: (row.description as string) || "",
    imagePath: row.image_path as string,
    buyUrl: (row.buy_url as string) || "",
    createdAt: (row.created_at as Date).toISOString(),
  };
}

let initialized = false;

async function ensureDb() {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

export async function getAllArtworks(): Promise<StoredArtwork[]> {
  await ensureDb();
  const { rows } = await pool.query("SELECT * FROM artworks ORDER BY created_at DESC");
  return rows.map(rowToArtwork);
}

export async function getArtworksByCollection(collectionId: string): Promise<StoredArtwork[]> {
  await ensureDb();
  const { rows } = await pool.query(
    "SELECT * FROM artworks WHERE collection_id = $1 ORDER BY created_at ASC",
    [collectionId]
  );
  return rows.map(rowToArtwork);
}

export async function getArtworkById(id: string): Promise<StoredArtwork | null> {
  await ensureDb();
  const { rows } = await pool.query("SELECT * FROM artworks WHERE id = $1", [id]);
  return rows.length > 0 ? rowToArtwork(rows[0]) : null;
}

export async function createArtwork(
  artwork: Omit<StoredArtwork, "id" | "createdAt">
): Promise<StoredArtwork> {
  await ensureDb();
  const { rows } = await pool.query(
    `INSERT INTO artworks (collection_id, title, medium, description, image_path, buy_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [artwork.collectionId, artwork.title, artwork.medium, artwork.description, artwork.imagePath, artwork.buyUrl]
  );
  return rowToArtwork(rows[0]);
}

export async function updateArtwork(
  id: string,
  updates: Partial<Omit<StoredArtwork, "id" | "createdAt">>
): Promise<StoredArtwork | null> {
  await ensureDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  const columnMap: Record<string, string> = {
    collectionId: "collection_id",
    title: "title",
    medium: "medium",
    description: "description",
    imagePath: "image_path",
    buyUrl: "buy_url",
  };

  for (const [key, col] of Object.entries(columnMap)) {
    if (key in updates) {
      fields.push(`${col} = $${idx}`);
      values.push(updates[key as keyof typeof updates]);
      idx++;
    }
  }

  if (fields.length === 0) return getArtworkById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE artworks SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows.length > 0 ? rowToArtwork(rows[0]) : null;
}

export async function deleteArtwork(id: string): Promise<boolean> {
  await ensureDb();
  const { rowCount } = await pool.query("DELETE FROM artworks WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
