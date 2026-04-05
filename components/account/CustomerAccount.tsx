"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/layout/Hero";

interface Purchase {
  id: string;
  artworkTitle: string;
  medium: string;
  imagePath: string;
  collectionName: string;
  status: string;
  date: string;
}

interface ViewItem {
  artworkTitle: string;
  medium: string;
  imagePath: string;
  collectionName: string;
  viewedAt: string;
}

interface NewsItem {
  id: string;
  title: string;
  body: string | null;
  date: string;
}

interface CustomerAccountProps {
  customer: {
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
  };
  subscriptions: { id: string; name: string; subtitle: string }[];
  purchases: Purchase[];
  viewHistory: ViewItem[];
  news: NewsItem[];
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function CustomerAccount({ customer, subscriptions, purchases, viewHistory, news }: CustomerAccountProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <>
      <Hero title={`Welcome, ${customer.fullName}`} />

      {/* News Bar */}
      {news.length > 0 && (
        <div className="bg-purple-dark text-cream">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-4 overflow-x-auto">
            <span className="text-green-light text-xs font-medium tracking-wider shrink-0">NEWS</span>
            <div className="flex gap-6">
              {news.map((item) => (
                <p key={item.id} className="text-sm text-cream/90 whitespace-nowrap">
                  {item.title}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Account Info */}
          <div className="mb-12">
            <h2 className="font-heading text-xl text-purple-dark tracking-wide mb-4">Account</h2>
            <div className="bg-white border border-purple-light/30 rounded-sm p-6 text-sm text-text-secondary space-y-2">
              <p><span className="text-text-primary font-medium">Email:</span> {customer.email}</p>
              <p><span className="text-text-primary font-medium">Member since:</span> {formatDate(customer.createdAt)}</p>
            </div>
          </div>

          {/* News Detail */}
          {news.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading text-xl text-purple-dark tracking-wide mb-4">Latest News</h2>
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="bg-white border border-purple-light/30 rounded-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-text-primary font-medium">{item.title}</h3>
                      <span className="text-xs text-text-secondary/50 shrink-0">{formatDate(item.date)}</span>
                    </div>
                    {item.body && <p className="text-text-secondary text-sm mt-2">{item.body}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscribed Collections */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl text-purple-dark tracking-wide">Your Collections</h2>
              <Link href="/collections" className="text-sm text-purple hover:text-purple-dark underline underline-offset-2 transition-colors">
                Browse all
              </Link>
            </div>
            {subscriptions.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="bg-white border border-purple-light/30 rounded-sm p-4">
                    <p className="text-text-primary font-medium">{sub.name}</p>
                    <p className="text-text-secondary text-sm">{sub.subtitle}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary/50">No collection subscriptions yet.</p>
            )}
          </div>

          {/* Purchase Tracking */}
          <div className="mb-12">
            <h2 className="font-heading text-xl text-purple-dark tracking-wide mb-4">Purchase History</h2>
            {purchases.length > 0 ? (
              <div className="space-y-3">
                {purchases.map((p) => (
                  <div key={p.id} className="bg-white border border-purple-light/30 rounded-sm p-4 flex items-center gap-4">
                    <div className="relative w-16 h-12 rounded-sm overflow-hidden shrink-0">
                      <Image src={p.imagePath} alt={p.artworkTitle} fill className="object-cover" sizes="64px" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary font-medium truncate">{p.artworkTitle}</p>
                      <p className="text-text-secondary text-xs">{p.collectionName} &middot; {p.medium}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-sm ${p.status === "clicked" ? "bg-purple-light/30 text-purple" : "bg-green-light text-green"}`}>
                        {p.status}
                      </span>
                      <p className="text-xs text-text-secondary/50 mt-1">{formatDate(p.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary/50">No purchases yet. Browse our collections to find your first piece.</p>
            )}
          </div>

          {/* View History */}
          <div className="mb-12">
            <h2 className="font-heading text-xl text-purple-dark tracking-wide mb-4">Recently Viewed</h2>
            {viewHistory.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {viewHistory.map((v, i) => (
                  <div key={i} className="bg-white border border-purple-light/30 rounded-sm p-4 flex items-center gap-4">
                    <div className="relative w-16 h-12 rounded-sm overflow-hidden shrink-0">
                      <Image src={v.imagePath} alt={v.artworkTitle} fill className="object-cover" sizes="64px" unoptimized />
                    </div>
                    <div className="min-w-0">
                      <p className="text-text-primary font-medium text-sm truncate">{v.artworkTitle}</p>
                      <p className="text-text-secondary text-xs">{v.collectionName}</p>
                      <p className="text-text-secondary/50 text-xs">{formatDate(v.viewedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary/50">No viewing history yet.</p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-purple-light text-text-secondary rounded-sm hover:bg-purple-light/20 transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </section>
    </>
  );
}
