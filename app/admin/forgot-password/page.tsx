"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-3xl text-purple-dark text-center tracking-wide mb-4">
          Reset Password
        </h1>
        {submitted ? (
          <div className="text-center">
            <p className="text-text-secondary mb-6">
              If an account exists with that email, a password reset link has been sent to the recovery email on file.
            </p>
            <Link href="/admin/login" className="text-purple hover:text-purple-dark underline underline-offset-2">
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-text-secondary text-sm text-center mb-6">
              Enter your admin email. A reset link will be sent to your recovery email.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                required
                className="w-full px-4 py-3 border border-purple-light rounded-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-green-light"
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full px-4 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide"
              >
                Send Reset Link
              </button>
              <p className="text-center text-sm">
                <Link href="/admin/login" className="text-text-secondary hover:text-purple-dark transition-colors underline underline-offset-2">
                  Back to login
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
