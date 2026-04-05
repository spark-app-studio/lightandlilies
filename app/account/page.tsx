import { redirect } from "next/navigation";
import { verifyCustomerSession } from "@/lib/customer-auth";
import pool, { initDb } from "@/lib/db";
import { collectionDefs } from "@/lib/collections";
import CustomerAccount from "@/components/account/CustomerAccount";

export const dynamic = "force-dynamic";

let dbInit = false;

export default async function AccountPage() {
  const session = await verifyCustomerSession();
  if (!session) redirect("/login");

  if (!dbInit) { await initDb(); dbInit = true; }

  // Customer info
  const { rows: customerRows } = await pool.query(
    "SELECT id, full_name, email, created_at FROM customers WHERE id = $1",
    [session.id]
  );
  if (customerRows.length === 0) redirect("/login");
  const customer = customerRows[0];

  // Subscribed collections
  const { rows: subRows } = await pool.query(
    "SELECT collection_id FROM customer_collections WHERE customer_id = $1",
    [session.id]
  );
  const subscribedIds = subRows.map((r: { collection_id: string }) => r.collection_id);
  const subscriptions = collectionDefs
    .filter((c) => subscribedIds.includes(c.id))
    .map((c) => ({ id: c.id, name: c.name, subtitle: c.subtitle }));

  // Purchase history
  const { rows: purchaseRows } = await pool.query(
    `SELECT p.id, p.status, p.created_at, a.title, a.medium, a.image_path, a.collection_id
     FROM purchases p
     JOIN artworks a ON p.artwork_id = a.id
     WHERE p.customer_id = $1
     ORDER BY p.created_at DESC
     LIMIT 50`,
    [session.id]
  );
  const purchases = purchaseRows.map((r) => ({
    id: r.id,
    artworkTitle: r.title,
    medium: r.medium,
    imagePath: r.image_path,
    collectionName: collectionDefs.find((c) => c.id === r.collection_id)?.name || r.collection_id,
    status: r.status,
    date: r.created_at,
  }));

  // View history (recent unique artworks)
  const { rows: viewRows } = await pool.query(
    `SELECT DISTINCT ON (a.id) vh.viewed_at, a.title, a.medium, a.image_path, vh.collection_id
     FROM view_history vh
     JOIN artworks a ON vh.artwork_id = a.id
     WHERE vh.customer_id = $1
     ORDER BY a.id, vh.viewed_at DESC`,
    [session.id]
  );
  // Re-sort by most recently viewed
  const viewHistory = viewRows
    .sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime())
    .slice(0, 20)
    .map((r) => ({
      artworkTitle: r.title,
      medium: r.medium,
      imagePath: r.image_path,
      collectionName: collectionDefs.find((c) => c.id === r.collection_id)?.name || r.collection_id,
      viewedAt: r.viewed_at,
    }));

  // Active news
  const { rows: newsRows } = await pool.query(
    "SELECT id, title, body, created_at FROM news WHERE active = TRUE ORDER BY created_at DESC LIMIT 5"
  );
  const news = newsRows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    date: r.created_at,
  }));

  return (
    <CustomerAccount
      customer={{ id: customer.id, fullName: customer.full_name, email: customer.email, createdAt: customer.created_at }}
      subscriptions={subscriptions}
      purchases={purchases}
      viewHistory={viewHistory}
      news={news}
    />
  );
}
