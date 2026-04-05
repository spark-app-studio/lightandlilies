import type { Metadata } from "next";
import Hero from "@/components/layout/Hero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registration Received | Light & Lilies",
};

export default function RegisterSuccessPage() {
  return (
    <>
      <Hero title="Thank You" />
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-text-secondary leading-relaxed text-lg mb-6">
            Your registration has been received. We will review your submission
            and get back to you within 5 business days.
          </p>
          <p className="text-text-secondary leading-relaxed mb-10">
            If you have any questions in the meantime, please contact us at{" "}
            <a
              href="mailto:Curator@lightandlilies.com"
              className="text-purple-dark hover:text-purple transition-colors"
            >
              Curator@lightandlilies.com
            </a>
          </p>
          <Link
            href="/"
            className="px-8 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide inline-block"
          >
            Return Home
          </Link>
        </div>
      </section>
    </>
  );
}
