import { Logo } from "@midpack/ui/chrome/logo";
import { LanguageSwitcher } from "@midpack/ui/chrome/language-switcher";
import { CrossAppLinks } from "./cross-app-links";
import { HeroProductStack } from "./hero-product-stack";

// Stages echoed under the CTAs — a quiet visual restatement of "through every
// stage" that ties the headline to the live steppers on the right.
const STAGES = ["Idea", "Tech-pack", "Patterns", "Sample", "Production"];

export default function LandingPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-bg text-foreground">
      {/* Atmosphere: warm paper + a faint dotted grid and a soft indigo wash in
          the top-right so the canvas reads as designed, not blank. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(22,22,26,0.04) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(120% 90% at 30% 0%, #000 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 30% 0%, #000 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 100% 0%, rgba(79,70,229,0.07), transparent 68%)",
        }}
      />

      {/* Top bar: brand (home link) + language toggle. */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 lg:px-12">
        <Logo href="/" />
        <LanguageSwitcher />
      </header>

      <section className="relative mx-auto my-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-14 px-8 py-16 lg:grid-cols-[minmax(480px,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:px-12">
        {/* ── Left: headline · CTAs ── */}
        <div className="flex flex-col gap-8">
          <div className="space-y-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-strong">
              Product workflow · SS-26
            </p>
            <h1 className="text-[clamp(2.6rem,4.6vw,4rem)] font-semibold leading-[1.03] tracking-[-0.025em] text-foreground">
              Every product bundle,
              <br />
              through every stage.
            </h1>
            <p className="max-w-xl text-[16px] leading-relaxed text-zinc-600">
              Midpack moves bundled files through approver-gated stages, so teams ship the right
              thing, in the right order — together.
            </p>
          </div>

          <CrossAppLinks />

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
    </main>
  );
}
