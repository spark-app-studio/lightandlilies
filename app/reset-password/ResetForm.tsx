"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="max-w-sm mx-auto text-center">
        <p className="text-text-secondary mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-purple hover:text-purple-dark underline">Request a new link</Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to reset password");
      setLoading(false);
    }
  }

  const inputClasses = "w-full px-4 py-3 border border-purple-light rounded-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-green-light";

  return (
    <div className="max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password (min 8 characters)" required minLength={8} className={inputClasses} />
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" required className={inputClasses} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide disabled:opacity-50">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
