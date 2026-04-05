import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getResend } from "@/lib/resend";
import { customerRegistrationSchema } from "@/lib/validation";
import { collectionDefs } from "@/lib/collections";
import { createCustomerSession } from "@/lib/customer-auth";
import { welcomeCustomer, newMemberNotify } from "@/lib/email-templates";
import pool, { initDb } from "@/lib/db";

let dbInitialized = false;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = customerRegistrationSchema.parse(body);

    if (!dbInitialized) { await initDb(); dbInitialized = true; }

    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(data.password, 12);

    const existing = await pool.query("SELECT id FROM customers WHERE email = $1", [data.email]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const { rows } = await pool.query(
      `INSERT INTO customers (full_name, email, password_hash, agree_to_emails, agreed_to_emails_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [data.fullName, data.email, passwordHash, true, now]
    );
    const customerId = rows[0].id;

    await pool.query("DELETE FROM customer_collections WHERE customer_id = $1", [customerId]);
    for (const collectionId of data.collections) {
      await pool.query("INSERT INTO customer_collections (customer_id, collection_id) VALUES ($1, $2)", [customerId, collectionId]);
    }

    const selectedCollections = data.collections.map((id) => {
      const c = collectionDefs.find((d) => d.id === id);
      return { name: c?.name || id, subtitle: c?.subtitle || "" };
    });
    const agreedDate = new Date(now).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const collectionNames = selectedCollections.map((c) => c.name).join(", ");

    await getResend().emails.send({
      from: "Light & Lilies <curator@lightandlilies.com>",
      to: data.email,
      subject: "Welcome to Light & Lilies",
      html: welcomeCustomer(data.fullName, selectedCollections, agreedDate),
    });

    await getResend().emails.send({
      from: "Light & Lilies <curator@lightandlilies.com>",
      to: "Curator@lightandlilies.com",
      subject: `New Member: ${data.fullName}`,
      html: newMemberNotify(data.fullName, data.email, collectionNames),
    });

    await createCustomerSession(customerId, data.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer registration error:", error);
    return NextResponse.json({ success: false, error: "Failed to process registration" }, { status: 500 });
  }
}
