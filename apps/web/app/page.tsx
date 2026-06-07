import { Logo } from "@midpack/ui/chrome/logo";
import { LanguageSwitcher } from "@midpack/ui/chrome/language-switcher";
import { Backdrop } from "./backdrop";
import { AuthLinks } from "./auth-links";
import { Footer } from "./footer";
import { HeroProductStack } from "./hero-product-stack";
import { headers } from "next/headers";

// Stages echoed under the CTAs — a quiet restatement of "moves through stages"
// that ties the headline to the live steppers on the right.
const STAGES = ["Idea", "Tech-pack", "Patterns", "Sample", "Production"];

export default async function LandingPage() {
  // Resolve the customer-app origin from the request host (server-side mirror of
  // @midpack/ui getAppUrls) so the Login/Register hrefs are correct on the first
  // paint — no "#" placeholder that swaps to the real URL after mount. Follows the
  // host, so it's right for every front door (localhost, local.midpack.io, prod).
  const h = await headers();
  const host = h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const appUrl = host ? `${proto}://app.${host.replace(/^(?:app\.|admin\.)/, "")}` : "";

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-bg text-foreground">
      <Backdrop />

      {/* Top bar: brand (home link) + language toggle. */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 lg:px-12">
        <Logo href="/" />
        <LanguageSwitcher />
      </header>

      <section className="relative z-10 mx-auto my-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-14 px-8 py-16 lg:grid-cols-[minmax(480px,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:px-12">
        {/* ── Left: headline · CTAs ── */}
        <div className="flex flex-col gap-8">
          <div className="space-y-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-strong">
              Workflow for product teams
            </p>
            <h1 className="text-[clamp(2.5rem,4.4vw,3.8rem)] font-semibold leading-[1.04] tracking-[-0.025em] text-foreground">
              Every product —
              <br />
              from sketch to final —
              <br />
              in one place.
            </h1>
            <p className="max-w-xl text-[16px] leading-relaxed text-zinc-600">
              Midpack makes every product a set of files that moves through configurable stages, with
              one owner at each. Files, versions, decisions, and status — all in one place.
            </p>
          </div>

          <AuthLinks appUrl={appUrl} />

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-400">
                  {stage}
                </span>
                {i < STAGES.length - 1 && (
                  <span aria-hidden className="text-zinc-300">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: the real product rows, fully contained in the track ──
            min-w-0 lets the grid track stay at its fraction so an expanded
            stepper pill scrolls inside the row instead of widening it. */}
        <div className="relative min-w-0">
          <HeroProductStack />
        </div>
      </section>

      <Footer />
    </main>
  );
}
