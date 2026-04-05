import type { Metadata } from "next";
import Hero from "@/components/layout/Hero";
import ArtistForm from "@/components/register/ArtistForm";

export const metadata: Metadata = {
  title: "Register as Artist | Light & Lilies",
  description: "Submit your artwork for consideration on Light & Lilies.",
};

export default function RegisterPage() {
  return (
    <>
      <Hero title="Register as an Artist" />
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-text-secondary text-center leading-relaxed mb-12">
            We welcome submissions from artists whose work reflects beauty,
            craftsmanship, and meaning. Please complete the form below to begin
            the consignment process.
          </p>
          <ArtistForm />
        </div>
      </section>
    </>
  );
}
