import { NextResponse } from "next/server";
import { Resend } from "resend";
import { artistRegistrationSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = artistRegistrationSchema.parse(body);

    await resend.emails.send({
      from: "Light & Lilies <notifications@lightandlilies.com>",
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
        <p>Terms of Service: Accepted</p>
        <p>Consignment Fee (30%): Accepted</p>
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
