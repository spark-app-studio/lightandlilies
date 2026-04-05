import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { artistRegistrationSchema } from "@/lib/validation";
import pool, { initDb } from "@/lib/db";

let dbInitialized = false;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = artistRegistrationSchema.parse(body);

    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const now = new Date().toISOString();

    // Store artist in database with agreement timestamps
    await pool.query(
      `INSERT INTO artists (full_name, email, phone, website, medium, description, agreed_to_terms, agreed_to_terms_at, agreed_to_consignment, agreed_to_consignment_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (email) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         phone = EXCLUDED.phone,
         website = EXCLUDED.website,
         medium = EXCLUDED.medium,
         description = EXCLUDED.description,
         agreed_to_terms = EXCLUDED.agreed_to_terms,
         agreed_to_terms_at = EXCLUDED.agreed_to_terms_at,
         agreed_to_consignment = EXCLUDED.agreed_to_consignment,
         agreed_to_consignment_at = EXCLUDED.agreed_to_consignment_at`,
      [
        data.fullName,
        data.email,
        data.phone || null,
        data.website || null,
        data.medium,
        data.description,
        data.agreeToTerms,
        data.agreeToTerms ? now : null,
        data.agreeToConsignment,
        data.agreeToConsignment ? now : null,
      ]
    );

    // Send notification to curator
    await getResend().emails.send({
      from: "Light & Lilies <curator@lightandlilies.com>",
      to: "Curator@lightandlilies.com",
      subject: `New Artist Registration: ${data.fullName}`,
      html: `
        <h2>New Artist Registration</h2>
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Website:</strong> ${data.website || "Not provided"}</p>
        <h3>About Their Work</h3>
        <p><strong>Medium:</strong> ${data.medium}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <h3>Agreements</h3>
        <p>Terms of Service: Accepted on ${new Date(now).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <p>Consignment Fee (30%): Accepted on ${new Date(now).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      `,
    });

    // Send confirmation to the artist
    await getResend().emails.send({
      from: "Light & Lilies <curator@lightandlilies.com>",
      to: data.email,
      subject: "Registration Received — Light & Lilies",
      html: `
        <p>Dear ${data.fullName},</p>
        <p>Thank you for registering with Light &amp; Lilies. We have received your submission and will review it shortly.</p>
        <h3>What you agreed to:</h3>
        <ul>
          <li><strong>Terms of Service</strong> — Accepted on ${new Date(now).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</li>
          <li><strong>Consignment Fee (30%)</strong> — Accepted on ${new Date(now).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</li>
        </ul>
        <h3>Your submission details:</h3>
        <p><strong>Medium:</strong> ${data.medium}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p>We will get back to you within 5 business days. If you have any questions, please reply to this email or contact us at Curator@lightandlilies.com.</p>
        <p>Warm regards,<br>Light &amp; Lilies<br><em>Operated by Spark App Studios LLC</em></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process registration" },
      { status: 500 }
    );
  }
}
