"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@midpack/auth";
import { BrandLink, Button, Input, Label, LanguageSwitcher, UserMenu, cn } from "@midpack/ui";
import { ChoiceTile } from "./choice-tile";
import { WorkspacePreview } from "./workspace-preview";
import { INDUSTRIES, PAINS, ROLES, SIGNED_IN, SIZES, templateFor } from "./constants";

// New-account "welcome" flow (handoffs/onboarding-registration-flow.md).
// UI/UX prototype: 3 questions (1 required + 2 skippable) → activation finale.
// State is local — no POST /onboarding, no routing gate. The right panel
// assembles live from each answer.

export function WelcomeFlow() {
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [brand, setBrand] = React.useState("");
  const [role, setRole] = React.useState<string | null>(null);
  const [otherRole, setOtherRole] = React.useState("");
  const [size, setSize] = React.useState<string | null>(null);
  const [industry, setIndustry] = React.useState("fashion");
  const [otherIndustry, setOtherIndustry] = React.useState("");
  const [pains, setPains] = React.useState<Set<string>>(new Set());
  const [creating, setCreating] = React.useState(false);
  const { logout } = useAuth();

  const canAdvance = step !== 0 || (brand.trim().length > 0 && role !== null);
  const tpl = templateFor(industry);

  function go(to: number) {
    if (to === step) return;
    if (to > step && step === 0 && !canAdvance) return;
    setDir(to > step ? 1 : -1);
    setStep(Math.max(0, Math.min(3, to)));
  }

  function togglePain(v: string) {
    setPains((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  }

  function restart() {
    setBrand("");
    setRole(null);
    setOtherRole("");
    setSize(null);
    setIndustry("fashion");
    setOtherIndustry("");
    setPains(new Set());
    setCreating(false);
    setDir(-1);
    setStep(0);
  }

  return (
    <div className="relative flex min-h-dvh overflow-x-hidden bg-surface">
      {/* top-right controls — language then user avatar (dropdown + sign out),
          pinned to the page corner over the preview panel. Insets match the
          auth header (px-8 lg:px-12, py-6) so they sit at the same height as
          the logo. */}
      <div className="absolute right-8 top-6 z-30 flex items-center gap-3 lg:right-12">
        <LanguageSwitcher />
        <UserMenu name={SIGNED_IN.name} email={SIGNED_IN.email} onSignOut={() => void logout()} />
      </div>

      {/* ── left: questions ───────────────────────────────────────── */}
      {/* px-8 py-6 lg:px-12 mirrors the (auth) layout header so the logo lands
          in the exact same spot as the login/signup pages. */}
      <div className="relative flex flex-1 flex-col px-8 py-6 lg:px-12">
        <header className="flex items-center">
          <BrandLink />
        </header>

        {/* progress */}
        <div className="mx-auto mt-8 w-full max-w-[480px] lg:mt-10">
          <StepRail step={step} />
        </div>

        {/* step viewport — scrolls when content exceeds height; my-auto keeps
            it vertically centered when there's room. */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto py-7">
          <div
            key={step}
            className={cn(
              "my-auto w-full duration-500 animate-in motion-reduce:animate-none",
              dir > 0 ? "slide-in-from-right-5" : "slide-in-from-left-5",
            )}
          >
            <div className="mx-auto w-full max-w-[480px]">
              {step === 0 && <StepIdentity {...{ brand, setBrand, role, setRole, otherRole, setOtherRole, canAdvance, go }} />}
              {step === 1 && <StepTeam {...{ size, setSize, industry, setIndustry, otherIndustry, setOtherIndustry }} />}
              {step === 2 && <StepFocus {...{ pains, togglePain }} />}
              {step === 3 && (
                <StepFinale
                  name={SIGNED_IN.name}
                  brand={brand}
                  noun={tpl.noun}
                  fixCount={pains.size}
                  creating={creating}
                  onCreate={() => setCreating(true)}
                  onExplore={restart}
                />
              )}
            </div>
          </div>
        </div>

        {/* footer nav (hidden on finale) */}
        {step < 3 && (
          <div className="mx-auto flex w-full max-w-[480px] items-center gap-4 border-t border-border pt-5">
            <button
              type="button"
              onClick={() => go(step - 1)}
              className={cn(
                "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                step === 0 && "pointer-events-none opacity-0",
              )}
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <div className="flex-1" />
            <Button size="lg" disabled={!canAdvance} onClick={() => go(step + 1)}>
              {step === 2 ? "Finish setup" : "Continue"}
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>

      {/* ── right: living preview ──────────────────────────────────── */}
      <aside className="hidden flex-1 border-l border-border lg:block">
        <WorkspacePreview brand={brand} role={role} otherRole={otherRole} size={size} industry={industry} otherIndustry={otherIndustry} pains={pains} done={step === 3} />
      </aside>
    </div>
  );
}

/* ─────────────────────────── shared bits ─────────────────────────── */

const RAIL_STEPS = [
  { n: 1, label: "Identity" },
  { n: 2, label: "Team" },
  { n: 3, label: "Focus" },
];

// Numbered-disc stepper with connectors. done → filled + check; active →
// filled + ring; upcoming → outlined + muted. Finale (step 3) reads all-done.
function StepRail({ step }: { step: number }) {
  return (
    <div className="flex items-center">
      {RAIL_STEPS.map((s, i) => {
        const done = step > i || step >= 3;
        const active = step === i && step < 3;
        return (
          <React.Fragment key={s.n}>
            {i > 0 && (
              <div className="mx-2 h-[2px] flex-1 overflow-hidden rounded-full bg-border sm:mx-3">
                <div
                  className={cn(
                    "h-full rounded-full bg-accent-strong transition-[width] duration-500 ease-out",
                    step >= i ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold transition-all duration-300",
                  done
                    ? "bg-accent-strong text-white"
                    : active
                      ? "bg-accent-strong text-white ring-2 ring-accent-ring ring-offset-2 ring-offset-surface"
                      : "border border-border bg-surface text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : s.n}
              </span>
              <span
                className={cn(
                  "hidden font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors duration-300 sm:inline",
                  done || active ? "text-foreground" : "text-muted-foreground/60",
                )}
              >
                {s.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Staggered entrance via a mount-gated transition (not a fill-mode CSS
// animation). The resting state is fully visible, so a bfcache restore (browser
// back/forward) shows content immediately instead of leaving it stranded at
// opacity:0 — which is what a delayed `animation-fill-mode: both` does when the
// page is frozen mid-delay.
function Reveal({ delay = 0, className, children }: { delay?: number; className?: string; children: React.ReactNode }) {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      className={cn(
        "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent-strong before:h-px before:w-5 before:bg-accent-strong/50 before:content-['']">
      {children}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-3 text-[27px] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-[33px]">
      {children}
    </h1>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p className="mb-7 max-w-[42ch] text-[14.5px] leading-relaxed text-muted-foreground">{children}</p>;
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <Label htmlFor={htmlFor} className="mb-3 block font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
      {children}
    </Label>
  );
}

/* ─────────────────────────── steps ─────────────────────────── */

function StepIdentity({
  brand, setBrand, role, setRole, otherRole, setOtherRole, canAdvance, go,
}: {
  brand: string; setBrand: (v: string) => void;
  role: string | null; setRole: (v: string) => void;
  otherRole: string; setOtherRole: (v: string) => void;
  canAdvance: boolean; go: (to: number) => void;
}) {
  return (
    <>
      <Reveal><Eyebrow>Welcome to Midpack</Eyebrow></Reveal>
      <Reveal delay={60}><Title>First, the basics.</Title></Reveal>
      <Reveal delay={120}>
        <Sub>Name your workspace and tell us where you sit. Ten seconds — the rest builds itself, right there.</Sub>
      </Reveal>

      <Reveal delay={190} className="mb-7">
        <FieldLabel htmlFor="brand">Brand or studio name</FieldLabel>
        <Input
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && canAdvance) go(1); }}
          placeholder="e.g. CHER'17"
          autoComplete="organization"
          className="h-12 text-lg"
        />
        <p className="mt-2.5 text-[12px] text-muted-foreground">You can rename this anytime in settings.</p>
      </Reveal>

      <Reveal delay={250}>
        <FieldLabel>Your role</FieldLabel>
        <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Your role">
          {ROLES.map((r) => (
            <ChoiceTile key={r.value} label={r.label} icon={r.icon} selected={role === r.value} onSelect={() => setRole(r.value)} />
          ))}
        </div>
        {role === "other" && (
          <div className="mt-2.5 duration-300 animate-in fade-in-0 slide-in-from-top-1">
            <Input
              value={otherRole}
              onChange={(e) => setOtherRole(e.target.value)}
              placeholder="What's your role?"
              aria-label="Your role"
              autoFocus
              maxLength={40}
              className="h-10"
            />
          </div>
        )}
      </Reveal>
    </>
  );
}

function StepTeam({
  size, setSize, industry, setIndustry, otherIndustry, setOtherIndustry,
}: {
  size: string | null; setSize: (v: string) => void;
  industry: string; setIndustry: (v: string) => void;
  otherIndustry: string; setOtherIndustry: (v: string) => void;
}) {
  return (
    <>
      <Reveal><Eyebrow>About your team</Eyebrow></Reveal>
      <Reveal delay={60}><Title>Who&rsquo;s it for?</Title></Reveal>
      <Reveal delay={120}>
        <Sub>So your workspace fits the team on day one. Not sure yet? Skip it — you can invite people anytime.</Sub>
      </Reveal>

      <Reveal delay={190} className="mb-7">
        <FieldLabel>How big is your team?</FieldLabel>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" role="radiogroup" aria-label="Team size">
          {SIZES.map((s) => (
            <ChoiceTile key={s.value} label={s.label} hint={s.hint} stack selected={size === s.value} onSelect={() => setSize(s.value)} />
          ))}
        </div>
      </Reveal>

      <Reveal delay={250}>
        <FieldLabel>What do you make?</FieldLabel>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Industry">
          {INDUSTRIES.map((ind) => (
            <ChoiceTile key={ind.value} label={ind.label} icon={ind.icon} stack selected={industry === ind.value} onSelect={() => setIndustry(ind.value)} />
          ))}
        </div>
        {industry === "other" && (
          <div className="mt-2.5 duration-300 animate-in fade-in-0 slide-in-from-top-1">
            <Input
              value={otherIndustry}
              onChange={(e) => setOtherIndustry(e.target.value)}
              placeholder="e.g. Stationery, toys, signage"
              aria-label="What do you make?"
              autoFocus
              maxLength={40}
              className="h-10"
            />
          </div>
        )}
      </Reveal>
    </>
  );
}

function StepFocus({ pains, togglePain }: { pains: Set<string>; togglePain: (v: string) => void }) {
  return (
    <>
      <Reveal><Eyebrow>What we&rsquo;ll set up around</Eyebrow></Reveal>
      <Reveal delay={60}><Title>What&rsquo;s slowing you down?</Title></Reveal>
      <Reveal delay={120}>
        <Sub>Pick whatever stings — watch the workflow light up on the right. Totally optional; skip if you&rsquo;d rather explore.</Sub>
      </Reveal>
      <Reveal delay={190}>
        <div className="grid gap-2.5" aria-label="Your pains">
          {PAINS.map((p) => (
            <ChoiceTile key={p.value} variant="check" multi label={p.copy} selected={pains.has(p.value)} onSelect={() => togglePain(p.value)} />
          ))}
        </div>
      </Reveal>
    </>
  );
}

function StepFinale({
  name, brand, noun, fixCount, creating, onCreate, onExplore,
}: {
  name: string; brand: string; noun: string; fixCount: number;
  creating: boolean; onCreate: () => void; onExplore: () => void;
}) {
  return (
    <div className="flex flex-col">
      <Reveal>
        <span className="mb-6 grid size-14 place-items-center rounded-2xl bg-accent-strong text-white shadow-cta duration-500 animate-in zoom-in-50">
          <Check className="size-7" strokeWidth={2.5} />
        </span>
      </Reveal>
      <Reveal delay={80}><Eyebrow>Ready</Eyebrow></Reveal>
      <Reveal delay={140}>
        <Title>
          Your workspace is <span className="text-accent-strong">set</span>, {name}.
        </Title>
      </Reveal>
      <Reveal delay={200}>
        <Sub>
          We&rsquo;ve scaffolded your first {noun}
          {brand.trim() && <> in <b className="font-semibold text-foreground">{brand}</b></>}
          {fixCount > 0
            ? <>, and pointed the workflow at the {fixCount} thing{fixCount > 1 ? "s" : ""} slowing you down.</>
            : <>.</>}
          {" "}Add a real one whenever you&rsquo;re ready.
        </Sub>
      </Reveal>
      <Reveal delay={260}>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" disabled={creating} onClick={onCreate}>
            {creating ? <><Check className="size-4" /> Opening the editor…</> : <>Create your first {noun} <ArrowRight /></>}
          </Button>
          <button type="button" onClick={onExplore} className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline">
            Take a look around
          </button>
        </div>
      </Reveal>
    </div>
  );
}
