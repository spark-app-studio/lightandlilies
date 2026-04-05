"use client";

import { useState } from "react";
import Link from "next/link";
import Hero from "@/components/layout/Hero";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
  }

  return (
    <>
      <Hero title="Reset Password" />
      <section className="py-24 px-6">
        <div className="max-w-sm mx-auto">
          {submitted ? (
            <div className="text-center">
              <p className="text-text-secondary mb-6">If an account exists with that email, a password reset link has been sent.</p>
              <Link href="/login" className="text-purple hover:text-purple-dark underline underline-offset-2">Back to sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-text-secondary text-sm text-center mb-4">Enter your email and we&apos;ll send you a reset link.</p>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3 border border-purple-light rounded-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-green-light" />
              <button type="submit" className="w-full px-4 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide">Send Reset Link</button>
              <p className="text-center text-sm"><Link href="/login" className="text-text-secondary hover:text-purple-dark underline underline-offset-2">Back to sign in</Link></p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
