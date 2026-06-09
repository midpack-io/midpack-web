"use client";

import { Check } from "lucide-react";
import { Badge, StatusChip, cn } from "@midpack/ui";
import {
  PAINS,
  ROLES,
  SIGNED_IN,
  SIZES,
  templateFor,
  type PainDef,
} from "./constants";

const ROLE_LABELS: Record<string, string> = Object.fromEntries(ROLES.map((r) => [r.value, r.label]));
const ROLE_GATES: Record<string, string> = Object.fromEntries(ROLES.map((r) => [r.value, r.gate]));

// The living preview — the right panel that assembles from the user's answers.
// Domain-aware (knows about styles / stages / approvers), so in a real build it
// would live in @midpack/product-ui. Pure presentation: every prop is a piece
// of onboarding state; nothing here mutates or fetches.
export interface WorkspacePreviewProps {
  brand: string;
  role: string | null;
  otherRole?: string;
  size: string | null;
  industry: string;
  otherIndustry?: string;
  pains: Set<string>;
  done: boolean;
}

export function WorkspacePreview({ brand, role, otherRole, size, industry, otherIndustry, pains, done }: WorkspacePreviewProps) {
  const tpl = templateFor(industry);
  // "Something else" + a typed value personalizes the workspace chip, the way
  // otherRole personalizes the approver chip below.
  const chipLabel = industry === "other" && otherIndustry?.trim() ? otherIndustry.trim() : tpl.chip;
  const hasBrand = brand.trim().length > 0;
  const monogram = hasBrand ? brand.trim()[0]!.toUpperCase() : "·";

  const litStages = new Set<number>();
  let bundleLit = false;
  pains.forEach((p) => {
    const def = PAINS.find((x) => x.value === p);
    if (!def) return;
    if (def.stage === "bundle") bundleLit = true;
    else litStages.add(def.stage);
  });

  const sizeCfg = SIZES.find((s) => s.value === size);
  const roleLabel = role
    ? role === "other" && otherRole?.trim()
      ? otherRole.trim()
      : roleToLabel(role)
    : "";
  const roleGate = role ? roleToGate(role) : "";
  const chosenPains: PainDef[] = PAINS.filter((p) => pains.has(p.value));

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-surface-2">
      {/* "pattern-paper" backdrop — mirrors the landing surface (apps/web
          backdrop.tsx): cutting-table grid + indigo dawn + warm counter-glow +
          paper grain, on a near-white base. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(to right, rgba(22,22,26,0.035) 1px, transparent 1px)",
              "linear-gradient(to bottom, rgba(22,22,26,0.035) 1px, transparent 1px)",
              "linear-gradient(to right, rgba(22,22,26,0.05) 1px, transparent 1px)",
              "linear-gradient(to bottom, rgba(22,22,26,0.05) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "28px 28px, 28px 28px, 140px 140px, 140px 140px",
            maskImage: "radial-gradient(115% 85% at 18% -5%, #000 0%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(115% 85% at 18% -5%, #000 0%, transparent 72%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(58% 52% at 100% 0%, rgba(79,70,229,0.10), transparent 66%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(46% 46% at 0% 100%, rgba(176,138,110,0.06), transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[430px] px-2">
        {/* eyebrow */}
        <div className="mb-4 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-strong opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent-strong" />
          </span>
          {done ? "Your workspace" : "Building your workspace"}
        </div>

        {/* workspace header */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-lg bg-foreground font-semibold text-surface shadow-sm transition-all duration-300",
              hasBrand ? "text-lg" : "text-2xl text-surface/40",
            )}
          >
            {monogram}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "truncate text-[17px] font-semibold leading-tight tracking-tight transition-colors",
                hasBrand ? "text-foreground" : "italic text-muted-foreground",
              )}
            >
              {hasBrand ? brand : "Your workspace"}
            </div>
            <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">{chipLabel} workspace</div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 border-accent-ring bg-accent-soft font-mono text-[9px] uppercase tracking-[0.12em] text-accent-ink transition-colors",
            )}
          >
            {done ? "Ready" : "New"}
          </Badge>
        </div>

        {/* the style card */}
        <div
          className={cn(
            "rounded-xl border bg-surface p-4 transition-all duration-500",
            bundleLit
              ? "border-accent-strong shadow-[0_0_0_1px_var(--color-accent-strong),var(--shadow-lg)]"
              : "border-border shadow-lg",
          )}
        >
          <div className="flex gap-3.5">
            {/* fabric swatch thumbnail */}
            <div
              className="relative size-[58px] shrink-0 overflow-hidden rounded-md ring-1 ring-black/5"
              style={{
                background:
                  "repeating-linear-gradient(46deg, rgba(0,0,0,0.08) 0 2px, transparent 2px 5px), linear-gradient(150deg, var(--color-st-sample), var(--color-st-patterns))",
              }}
            >
              <span className="absolute bottom-1 left-1.5 font-mono text-[8.5px] text-white/85">v1</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  {tpl.noun} 001
                </span>
                <StatusChip status={done ? "done" : "todo"} label={done ? "READY" : "DRAFT"} />
              </div>
              <div className="mt-1 truncate text-[15px] font-semibold text-foreground">
                Untitled {tpl.noun}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="font-mono text-[9px] uppercase tracking-[0.06em]">
                  {chipLabel}
                </Badge>
              </div>
            </div>
          </div>

          {/* stepper */}
          <div className="mt-4 border-t border-dashed border-border pt-3.5">
            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              Workflow
            </div>
            <div className="flex items-start justify-between">
              {tpl.stages.map((label, i) => {
                const lit = litStages.has(i);
                return (
                  <div
                    key={`${industry}-${i}`}
                    className="relative flex flex-1 flex-col items-center gap-1.5"
                  >
                    {/* connector */}
                    {i > 0 && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute right-1/2 top-[14px] h-px w-full transition-colors duration-300",
                          lit && litStages.has(i - 1) ? "bg-accent-ring" : "bg-border",
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10 grid size-7 place-items-center rounded-lg font-mono text-[11px] font-semibold transition-all duration-300",
                        lit
                          ? "scale-110 bg-accent-soft text-accent-ink shadow-sm ring-1 ring-accent-strong"
                          : "bg-surface-3 text-muted-foreground ring-1 ring-border",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={cn(
                        "max-w-[58px] text-center text-[9.5px] leading-tight transition-colors duration-300",
                        lit ? "font-semibold text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* approver chip */}
          {role && (
            <div className="mt-3.5 flex items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3 py-2 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent-ink">
                {SIGNED_IN.name[0]}
              </span>
              <div className="min-w-0 leading-tight">
                <div className="truncate text-[12.5px] font-semibold text-foreground">{SIGNED_IN.name}</div>
                <div className="truncate font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground">
                  {roleLabel}
                </div>
              </div>
              <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-ok">
                <span className="size-1.5 rounded-full bg-ok" />
                {roleGate}
              </span>
            </div>
          )}
        </div>

        {/* seats */}
        <div className={cn("mt-4 flex items-center gap-3.5 transition-opacity duration-300", sizeCfg ? "opacity-100" : "opacity-40")}>
          {sizeCfg ? (
            <>
              <div className="flex">
                {Array.from({ length: sizeCfg.seats.dots }).map((_, i) => (
                  <span
                    key={i}
                    className="-ml-2 grid size-8 place-items-center rounded-full border-[2.5px] border-surface-3 bg-gradient-to-br from-muted to-foreground/70 first:ml-0 duration-300 animate-in zoom-in-50"
                    style={{ animationDelay: `${i * 55}ms`, animationFillMode: "both" }}
                  />
                ))}
                {sizeCfg.seats.more > 0 && (
                  <span
                    className="-ml-2 grid size-8 place-items-center rounded-full border-[2.5px] border-surface-3 bg-accent-soft font-mono text-[10px] font-semibold text-accent-ink duration-300 animate-in zoom-in-50"
                    style={{ animationDelay: `${sizeCfg.seats.dots * 55}ms`, animationFillMode: "both" }}
                  >
                    +{sizeCfg.seats.more}
                  </span>
                )}
              </div>
              <span className="text-[13px] text-muted-foreground">
                <b className="font-semibold text-foreground">{sizeCfg.seats.text}</b> · seats ready
              </span>
            </>
          ) : (
            <span className="text-[13px] text-muted-foreground">Just you, for now</span>
          )}
        </div>

        {/* fixes */}
        <div className="mt-4">
          <div
            className={cn(
              "mb-2 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors",
              chosenPains.length ? "text-muted-foreground" : "text-muted-foreground/50",
            )}
          >
            What Midpack fixes for you
            {chosenPains.length > 0 && <span className="text-accent-ink"> · {chosenPains.length}</span>}
          </div>
          <div>
            {chosenPains.map((p, i) => (
              <div
                key={p.value}
                className="flex items-start gap-2.5 border-b border-border py-1.5 text-[12px] leading-snug text-muted-foreground last:border-0 duration-400 animate-in fade-in-0 slide-in-from-left-2"
                style={{ animationDelay: `${i * 55}ms`, animationFillMode: "both" }}
              >
                <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-ok-soft">
                  <Check className="size-2.5 text-ok" strokeWidth={3} />
                </span>
                <span dangerouslySetInnerHTML={{ __html: p.fix }} />
              </div>
            ))}
            {chosenPains.length === 0 && (
              <div className="text-[12px] italic text-muted-foreground/60">
                Pick what's slowing you down — we'll point the workflow at it.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function roleToLabel(role: string): string {
  return ROLE_LABELS[role] ?? "Member";
}
function roleToGate(role: string): string {
  return ROLE_GATES[role] ?? "on the team";
}
