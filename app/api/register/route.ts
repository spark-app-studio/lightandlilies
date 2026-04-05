import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { artistRegistrationSchema } from "@/lib/validation";
import { artistRegistrationConfirmation, artistRegistrationNotify } from "@/lib/email-templates";
import { sanitizeHtml } from "@/lib/sanitize";
import pool, { initDb } from "@/lib/db";

let dbInitialized = false;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = artistRegistrationSchema.parse(body);

    if (!dbInitialized) { await initDb(); dbInitialized = true; }

    const now = new Date().toISOString();
    const agreedDate = new Date(now).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    await pool.query(
      `INSERT INTO artists (full_name, email, phone, website, medium, description, agreed_to_terms, agreed_to_terms_at, agreed_to_consignment, agreed_to_consignment_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (email) DO UPDATE SET
         full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, website = EXCLUDED.website,
         medium = EXCLUDED.medium, description = EXCLUDED.description,
         agreed_to_terms = EXCLUDED.agreed_to_terms, agreed_to_terms_at = EXCLUDED.agreed_to_terms_at,
         agreed_to_consignment = EXCLUDED.agreed_to_consignment, agreed_to_consignment_at = EXCLUDED.agreed_to_consignment_at`,
      [data.fullName, data.email, data.phone || null, data.website || null, data.medium, data.description, data.agreeToTerms, now, data.agreeToConsignment, now]
    );

    const safeName = sanitizeHtml(data.fullName);
    const safeMedium = sanitizeHtml(data.medium);
    const safeDesc = sanitizeHtml(data.description);
    const safeEmail = sanitizeHtml(data.email);
    const safePhone = sanitizeHtml(data.phone || "Not provided");
    const safeWebsite = sanitizeHtml(data.website || "Not provided");

    await getResend().emails.send({
      from: "Light & Lilies <curator@lightandlilies.com>",
      to: "Curator@lightandlilies.com",
      subject: `New Artist Registration: ${safeName}`,
      html: artistRegistrationNotify(safeName, safeEmail, safePhone, safeWebsite, safeMedium, safeDesc, agreedDate),
    });

    await getResend().emails.send({
      from: "Light & Lilies <curator@lightandlilies.com>",
      to: data.email,
      subject: "Registration Received — Light & Lilies",
      html: artistRegistrationConfirmation(safeName, safeMedium, safeDesc, agreedDate),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: "Failed to process registration" }, { status: 500 });
  }
}
