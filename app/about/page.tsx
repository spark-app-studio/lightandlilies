import type { Metadata } from "next";
import Hero from "@/components/layout/Hero";

export const metadata: Metadata = {
  title: "About | Light & Lilies",
  description: "Learn about Light & Lilies and our mission to curate meaningful art.",
};

export default function AboutPage() {
  return (
    <>
      <Hero title="About" />
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-text-secondary leading-relaxed text-lg space-y-6">
          <p>
            Light &amp; Lilies was created from a simple belief:<br />
            The art in our homes matters.
          </p>
          <p>
            Much of what is readily available today is mass-produced and lacks the
            beauty, craftsmanship, and meaning that art should carry.
          </p>
          <p>
            We exist to curate works that reflect something deeper: The truth of the
            Christian faith, the beauty of creation, and the quiet order of the world
            Jesus made. Some of the pieces we feature are explicitly Christian in
            subject and intention. Others, particularly vintage and antique works,
            are selected for their natural beauty, composition, and ability to
            reflect truth through creation itself.
          </p>
          <p>
            We carefully select each piece based on its artistic quality, beauty,
            and, where appropriate, its reflection of Christian truth.
          </p>
          <p>
            Our goal is to help increase the quality of art in our homes and move
            away from disposable decor and toward something lasting, meaningful, and
            true.
          </p>
        </div>
      </section>
    </>
  );
}
