import Link from "next/link";

export default function EmailSignup() {
  return (
    <section className="py-24 px-6 bg-purple-light/10">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-purple-dark tracking-wide mb-4">
          Email
        </h2>
        <p className="text-text-secondary leading-relaxed mb-8">
          Receive new collections and thoughtfully selected pieces.
        </p>
        <Link
          href="/join"
          className="px-8 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide inline-block"
        >
          Join
        </Link>
      </div>
    </section>
  );
}
