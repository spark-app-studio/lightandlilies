import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Light & Lilies | Curated Art for the Christian Home",
  description:
    "Art that reflects light, truth, and the beauty of God's creation. Selectively curated original works for the Christian home.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("ll-customer-token")?.value;

  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream text-text-primary font-body antialiased">
        <Header isLoggedIn={isLoggedIn} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
