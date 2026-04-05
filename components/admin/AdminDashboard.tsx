"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import type { StoredArtwork } from "@/lib/artworks";
interface CollectionDef {
  id: string;
  name: string;
  subtitle: string;
}

interface NewsItem {
  id: string;
  title: string;
  body: string | null;
  active: boolean;
  created_at: string;
}

interface AdminDashboardProps {
  artworks: StoredArtwork[];
  collections: CollectionDef[];
  news: NewsItem[];
}

export default function AdminDashboard({ artworks, collections, news }: AdminDashboardProps) {
  const router = useRouter();
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this artwork?")) return;
    await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleAddNews(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newsTitle, body: newsBody || null }),
    });
    setNewsTitle("");
    setNewsBody("");
    router.refresh();
  }

  async function handleDeleteNews(id: string) {
    await fetch("/api/admin/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin header */}
      <header className="bg-purple-dark text-cream px-6 py-4 flex items-center justify-between">
        <h1 className="font-heading text-xl tracking-wide">Light &amp; Lilies Admin</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-cream/70 hover:text-cream text-sm transition-colors">
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="text-cream/70 hover:text-cream text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-2xl text-purple-dark tracking-wide">Artworks</h2>
          <Link
            href="/admin/artworks/new"
            className="px-5 py-2 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors text-sm tracking-wide"
          >
            Add Artwork
          </Link>
        </div>

        {/* News Management */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl text-purple-dark tracking-wide mb-6">News</h2>
          <form onSubmit={handleAddNews} className="flex flex-col gap-3 mb-6">
            <input
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="News title"
              required
              className="px-4 py-2 border border-purple-light rounded-sm bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-green-light"
            />
            <input
              value={newsBody}
              onChange={(e) => setNewsBody(e.target.value)}
              placeholder="Details (optional)"
              className="px-4 py-2 border border-purple-light rounded-sm bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-green-light"
            />
            <button type="submit" className="self-start px-5 py-2 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors text-sm tracking-wide">
              Post News
            </button>
          </form>
          {news.length > 0 ? (
            <div className="space-y-2">
              {news.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-purple-light/30 py-3">
                  <div>
                    <p className="text-text-primary text-sm">{item.title}</p>
                    {item.body && <p className="text-text-secondary text-xs">{item.body}</p>}
                    <p className="text-text-secondary/50 text-xs mt-0.5">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDeleteNews(item.id)} className="text-red-500 hover:text-red-700 text-sm transition-colors">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary/50 text-sm">No news items.</p>
          )}
        </div>

        {collections.map((collection) => {
          const collectionArtworks = artworks.filter(
            (a) => a.collectionId === collection.id
          );
          return (
            <div key={collection.id} className="mb-10">
              <h3 className="font-heading text-lg text-purple-dark mb-1">
                {collection.name}
              </h3>
              <p className="text-text-secondary text-sm italic mb-4">
                {collection.subtitle}
              </p>

              {collectionArtworks.length === 0 ? (
                <p className="text-text-secondary/50 text-sm py-4 border border-dashed border-purple-light rounded-sm text-center">
                  No artworks yet.{" "}
                  <Link
                    href={`/admin/artworks/new?collection=${collection.id}`}
                    className="text-purple underline"
                  >
                    Add one
                  </Link>
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-purple-light text-left text-text-secondary">
                        <th className="py-2 pr-4">Title</th>
                        <th className="py-2 pr-4">Medium</th>
                        <th className="py-2 pr-4">Buy URL</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionArtworks.map((artwork) => (
                        <tr key={artwork.id} className="border-b border-purple-light/30">
                          <td className="py-3 pr-4 text-text-primary">{artwork.title}</td>
                          <td className="py-3 pr-4 text-text-secondary">{artwork.medium}</td>
                          <td className="py-3 pr-4 text-text-secondary truncate max-w-[200px]">
                            {artwork.buyUrl || "—"}
                          </td>
                          <td className="py-3 text-right space-x-3">
                            <Link
                              href={`/admin/artworks/${artwork.id}/edit`}
                              className="text-purple hover:text-purple-dark transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(artwork.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
