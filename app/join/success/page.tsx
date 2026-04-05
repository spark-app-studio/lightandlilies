import type { Metadata } from "next";
import Hero from "@/components/layout/Hero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome | Light & Lilies",
};

export default function JoinSuccessPage() {
  return (
    <>
      <Hero title="Welcome" />
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-text-secondary leading-relaxed text-lg mb-6">
            Thank you for joining Light &amp; Lilies. A confirmation has been sent
            to your email.
          </p>
          <p className="text-text-secondary leading-relaxed mb-10">
            We look forward to sharing beautiful, meaningful art with you.
          </p>
          <Link
            href="/"
            className="px-8 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide inline-block"
          >
            Explore Collections
          </Link>
        </div>
      </section>
    </>
  );
}
