"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/layout/Hero";

const COLLECTIONS = [
  { id: "light-and-landscape", name: "Light & Landscape", subtitle: "The beauty of creation expressed through light and place" },
  { id: "quiet-spaces", name: "Quiet Spaces", subtitle: "Art for stillness, reflection, and rest" },
  { id: "timeless-works", name: "Timeless Works", subtitle: "Vintage and antique works chosen for enduring beauty" },
  { id: "light-and-shadow", name: "Light & Shadow", subtitle: "Form and contrast expressed through simplicity" },
  { id: "lilies-and-florals", name: "Lilies & Florals", subtitle: "Symbolic beauty drawn from creation" },
];

export default function JoinPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [agreeToEmails, setAgreeToEmails] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleCollection(id: string) {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function selectAll() {
    setSelectedCollections(COLLECTIONS.map((c) => c.id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (selectedCollections.length === 0) {
      setError("Please select at least one collection.");
      return;
    }
    if (!agreeToEmails) {
      setError("You must agree to receive email updates.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        password,
        collections: selectedCollections,
        agreeToEmails: true,
      }),
    });

    if (res.ok) {
      window.location.href = "/account";
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full px-4 py-3 border border-purple-light rounded-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-green-light";

  return (
    <>
      <Hero title="Join Light & Lilies" />
      <section className="py-24 px-6">
        <div className="max-w-md mx-auto">
          <p className="text-text-secondary text-center leading-relaxed mb-10">
            Create an account to receive updates when new pieces are added to the
            collections you love.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Full Name *</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Password * (min 8 characters)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClasses}
              />
            </div>

            {/* Collection preferences */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm text-text-secondary">
                  Collections you&apos;d like to follow *
                </label>
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-purple hover:text-purple-dark transition-colors underline underline-offset-2"
                >
                  Select all
                </button>
              </div>
              <div className="space-y-3">
                {COLLECTIONS.map((collection) => (
                  <label
                    key={collection.id}
                    className={`flex items-start gap-3 p-3 border rounded-sm cursor-pointer transition-colors ${
                      selectedCollections.includes(collection.id)
                        ? "border-purple bg-purple-light/20"
                        : "border-purple-light hover:border-purple/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={() => toggleCollection(collection.id)}
                      className="mt-0.5 w-4 h-4 accent-purple-dark"
                    />
                    <div>
                      <span className="text-sm text-text-primary font-medium">
                        {collection.name}
                      </span>
                      <p className="text-xs text-text-secondary/70 mt-0.5">
                        {collection.subtitle}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Email agreement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToEmails}
                onChange={(e) => setAgreeToEmails(e.target.checked)}
                className="mt-1 w-4 h-4 accent-purple-dark"
              />
              <span className="text-sm text-text-secondary">
                I agree to receive email updates from Light &amp; Lilies about new artwork
                in my selected collections. You can unsubscribe at any time.
              </span>
            </label>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
