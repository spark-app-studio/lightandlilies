import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { emailSignupSchema } from "@/lib/validation";
import { emailSubscriberNotify } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = emailSignupSchema.parse(body);

    await getResend().emails.send({
      from: "Light & Lilies <curator@lightandlilies.com>",
      to: "Curator@lightandlilies.com",
      subject: "New Email Subscriber",
      html: emailSubscriberNotify(email),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, error: "Failed to process signup" }, { status: 500 });
  }
}
