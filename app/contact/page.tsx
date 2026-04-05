import type { Metadata } from "next";
import Hero from "@/components/layout/Hero";

export const metadata: Metadata = {
  title: "Contact | Light & Lilies",
  description: "Get in touch with Light & Lilies.",
};

export default function ContactPage() {
  return (
    <>
      <Hero title="Contact" />
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-text-secondary leading-relaxed text-lg mb-8">
            We would love to hear from you. For inquiries about artwork,
            consignment, or anything else, please reach out.
          </p>
          <a
            href="mailto:Curator@lightandlilies.com"
            className="font-heading text-2xl text-purple-dark hover:text-purple transition-colors"
          >
            Curator@lightandlilies.com
          </a>
        </div>
      </section>
    </>
  );
}
