"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-purple-light/30">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-heading text-2xl text-purple-dark tracking-wide">
          Light &amp; Lilies
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-text-secondary hover:text-purple-dark transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-text-secondary hover:text-purple-dark transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-text-secondary hover:text-purple-dark transition-colors">
            Contact
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors text-sm tracking-wide"
          >
            Register as Artist
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-purple-dark transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-purple-dark transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-purple-dark transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-purple-light/30 bg-cream px-6 py-4 flex flex-col gap-4">
          <Link href="/" className="text-text-secondary hover:text-purple-dark" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className="text-text-secondary hover:text-purple-dark" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/contact" className="text-text-secondary hover:text-purple-dark" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-purple-dark text-cream rounded-sm text-center text-sm tracking-wide"
            onClick={() => setMenuOpen(false)}
          >
            Register as Artist
          </Link>
        </div>
      )}
    </header>
  );
}
