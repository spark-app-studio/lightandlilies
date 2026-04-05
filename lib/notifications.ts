import pool from "./db";
import { getResend } from "./resend";
import { collectionDefs } from "./collections";
import { newArtworkNotification } from "./email-templates";
import type { StoredArtwork } from "./artworks";

export async function notifyCollectionSubscribers(artwork: StoredArtwork) {
  const collectionName = collectionDefs.find((c) => c.id === artwork.collectionId)?.name || artwork.collectionId;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const { rows } = await pool.query(
    `SELECT c.full_name, c.email
     FROM customers c
     JOIN customer_collections cc ON c.id = cc.customer_id
     WHERE cc.collection_id = $1 AND c.agree_to_emails = TRUE`,
    [artwork.collectionId]
  );

  if (rows.length === 0) return;

  const resend = getResend();

  for (const subscriber of rows) {
    try {
      await resend.emails.send({
        from: "Light & Lilies <curator@lightandlilies.com>",
        to: subscriber.email,
        subject: `New in ${collectionName}: ${artwork.title}`,
        html: newArtworkNotification(
          subscriber.full_name,
          artwork.title,
          artwork.medium,
          artwork.description,
          artwork.imagePath,
          artwork.buyUrl,
          collectionName,
          baseUrl
        ),
      });
    } catch (err) {
      console.error(`Failed to notify ${subscriber.email}:`, err);
    }
  }

  console.log(`Notified ${rows.length} subscriber(s) about new artwork in ${collectionName}`);
}
