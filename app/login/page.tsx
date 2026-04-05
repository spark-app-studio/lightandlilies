"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Hero from "@/components/layout/Hero";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/account");
    } else {
      const data = await res.json();
      setError(data.error || "Invalid credentials");
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full px-4 py-3 border border-purple-light rounded-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-green-light";

  return (
    <>
      <Hero title="Sign In" />
      <section className="py-24 px-6">
        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className={inputClasses} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className={inputClasses} />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-text-secondary space-y-2">
            <p><Link href="/forgot-password" className="hover:text-purple-dark underline underline-offset-2">Forgot password?</Link></p>
            <p>Don&apos;t have an account? <Link href="/join" className="hover:text-purple-dark underline underline-offset-2">Join</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
