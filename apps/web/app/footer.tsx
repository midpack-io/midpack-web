import Link from "next/link";

// Legal links live in apps/web as their own routes.
const LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

// The footer mirrors the header bar: same horizontal padding and a 28px content
// row (matching the header's language switcher) so it lands at the header's
// exact height. Copyright left, legal links right — in the header's mono key.
export function Footer() {
  return (
    <footer className="relative z-20 border-t border-border/70 px-8 py-6 lg:px-12">
      <div className="flex min-h-[28px] flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
          © 2026 Midpack
        </p>
        <nav className="flex items-center gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
