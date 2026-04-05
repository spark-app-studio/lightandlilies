import { NextResponse } from "next/server";
import { Resend } from "resend";
import { emailSignupSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = emailSignupSchema.parse(body);

    await resend.emails.send({
      from: "Light & Lilies <curator@lightandlilies.com>",
      to: "Curator@lightandlilies.com",
      subject: "New Email Subscriber",
      html: `<p>New email signup: <strong>${email}</strong></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process signup" },
      { status: 500 }
    );
  }
}
