import Link from "next/link";
import { Logo } from "@midpack/ui/chrome/logo";
import { Backdrop } from "./backdrop";
import { Footer } from "./footer";

type LegalSection = { heading: string; body: string };

// Shared chrome for the lightweight legal routes (/terms, /privacy). Same paper
// backdrop, header and footer as the landing page so the surface stays cohesive
// when a visitor follows a footer link.
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-bg text-foreground">
      <Backdrop />

      <header className="relative z-20 flex items-center justify-between px-8 py-6 lg:px-12">
        <Logo href="/" />
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          ← Back home
        </Link>
      </header>

      <article className="relative z-10 mx-auto w-full max-w-[720px] flex-1 px-8 py-16 lg:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-strong">
          Legal · Updated {updated}
        </p>
        <h1 className="mt-4 text-[clamp(2.1rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.025em]">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-zinc-600">{intro}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                {section.heading}
              </h2>
              <p className="text-[15px] leading-relaxed text-zinc-600">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 text-[13px] leading-relaxed text-zinc-400">
          Midpack is a concept project; this page is placeholder copy, not legal advice or a binding
          agreement.
        </p>
      </article>

      <Footer />
    </main>
  );
}
