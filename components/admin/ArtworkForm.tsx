"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collections } from "@/lib/collections";
import type { StoredArtwork } from "@/lib/artworks";

interface ArtworkFormProps {
  artwork?: StoredArtwork;
}

export default function ArtworkForm({ artwork }: ArtworkFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCollection = searchParams.get("collection") || "";

  const [form, setForm] = useState({
    collectionId: artwork?.collectionId || preselectedCollection,
    title: artwork?.title || "",
    medium: artwork?.medium || "",
    description: artwork?.description || "",
    imagePath: artwork?.imagePath || "",
    buyUrl: artwork?.buyUrl || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = artwork
      ? `/api/admin/artworks/${artwork.id}`
      : "/api/admin/artworks";
    const method = artwork ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Failed to save artwork");
      setSaving(false);
    }
  }

  const inputClasses =
    "w-full px-4 py-3 border border-purple-light rounded-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-green-light";
  const labelClasses = "block text-sm text-text-secondary mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className={labelClasses}>Collection *</label>
        <select
          value={form.collectionId}
          onChange={(e) => update("collectionId", e.target.value)}
          required
          className={inputClasses}
        >
          <option value="">Select a collection</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasses}>Title *</label>
        <input
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Medium</label>
        <input
          value={form.medium}
          onChange={(e) => update("medium", e.target.value)}
          placeholder="e.g. Oil on canvas"
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Image URL *</label>
        <input
          value={form.imagePath}
          onChange={(e) => update("imagePath", e.target.value)}
          required
          placeholder="https://... or /images/collections/..."
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Purchase Link</label>
        <input
          value={form.buyUrl}
          onChange={(e) => update("buyUrl", e.target.value)}
          placeholder="https://..."
          className={inputClasses}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide disabled:opacity-50"
        >
          {saving ? "Saving..." : artwork ? "Update Artwork" : "Add Artwork"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-3 border border-purple-light text-text-secondary rounded-sm hover:bg-purple-light/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
