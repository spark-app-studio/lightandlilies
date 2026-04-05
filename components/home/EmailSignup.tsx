"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="py-24 px-6 bg-purple-light/10">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-purple-dark tracking-wide mb-4">
          Email
        </h2>
        <p className="text-text-secondary leading-relaxed mb-8">
          Receive new collections and thoughtfully selected pieces.
        </p>
        {submitted ? (
          <p className="text-green font-body">Thank you for joining.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="px-4 py-3 border border-purple-light rounded-sm bg-cream text-text-primary focus:outline-none focus:ring-2 focus:ring-green-light flex-1 max-w-sm"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide"
            >
              Join
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
