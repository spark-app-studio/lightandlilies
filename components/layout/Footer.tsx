import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-purple-light/20 border-t border-purple-light/30 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-4">
        <div className="flex gap-8 text-sm text-text-secondary">
          <Link href="/about" className="hover:text-purple-dark transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-purple-dark transition-colors">
            Contact
          </Link>
        </div>
        <p className="text-xs text-text-secondary/60">
          &copy; {new Date().getFullYear()} Light &amp; Lilies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
