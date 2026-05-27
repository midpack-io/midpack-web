"use client";

import {
  Check,
  ChevronDown,
  CircleDashed,
  Eye,
  Lock,
  Pause,
  Play,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { AvatarDot, PersonPicker } from "@/components/ds/person-picker";
import { StatusSelector } from "@/components/ds/status-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePeople } from "@/hooks/usePeople";
import type { Person, PersonId, StageInstance, StageStatus } from "@/lib/api/types";
import { DeadlineChip } from "./deadline-chip";
import { IterMark } from "./iter-mark";

// Accent color for the pill — see product/specs/stages-and-statuses.md
// "Accent colors". Only active stages get an accent; the resting (done /
// canceled / locked / waiting) styles are picked separately below.
type Accent = "orange" | "blue" | "red" | "grey";

function accentForActive(stage: StageInstance): Accent {
  if (stage.isReview) return "orange";
  switch (stage.status) {
    case "in-progress":
      return "blue";
    case "blocked":
      return "red";
    case "to-do":
      return "grey";
    // `done` and `canceled` can never reach an active pill — see `isStageActive`.
    default:
      return "grey";
  }
}

// Each status maps to a ~15% tint of its hue mixed into the base
// `--color-border` (#e6e6e1). The selected halo therefore matches the pill's
// own border in lightness but carries the same warm/cool undertone as the
// status — green for done, red-ish for blocked, etc.
const STATUS_TINT = {
  "in-progress": "outline-[#cfcee1]", // indigo undertone
  "to-do": "outline-[#ced0cf]", // slate undertone
  blocked: "outline-[#decbc5]", // coral undertone
  done: "outline-[#cbd6ca]", // ok-green undertone
  canceled: "outline-[#d3d3d0]", // muted neutral
  review: "outline-[#decfc0]", // warn/amber undertone
} as const;

function selectedOutlineColor(stage: StageInstance): string {
  if (
    stage.isReview &&
    (stage.status === "to-do" || stage.status === "in-progress")
  ) {
    return STATUS_TINT.review;
  }
  return STATUS_TINT[stage.status];
}

// ── Accent visual tokens ────────────────────────────────────────────────────

const ACCENT_SHELL: Record<Accent, string> = {
  // Each active pill keeps near-`border-border` (#e6e6e1) lightness but mixes
  // ~15% of the status hue into the border — a soft warm/cool undertone
  // instead of a saturated accent. Same hex used for the selected outline
  // (see STATUS_TINT below) so border and halo stay in the same key.
  orange: "border-[#decfc0] bg-surface text-foreground font-medium",
  blue: "border-[#cfcee1] bg-surface text-foreground font-medium",
  red: "border-[#decbc5] bg-surface text-foreground font-medium",
  grey: "border-[#ced0cf] bg-surface text-foreground font-medium",
};

const ACCENT_ICON_TONE: Record<Accent, string> = {
  orange: "bg-warn text-white",
  blue: "bg-accent-strong text-white",
  red: "bg-coral text-white",
  grey: "border border-dashed border-zinc-300 bg-transparent text-zinc-500",
};


// ── Resting (no-accent) visual tokens ───────────────────────────────────────

// Done/canceled get the same ~15% status-tinted border as the active pills,
// so the perimeter color carries hue even when the pill isn't active.
const RESTING_SHELL_DONE = "border-[#cbd6ca] bg-surface text-zinc-700";
const RESTING_SHELL_CANCELED = "border-[#d3d3d0] bg-surface text-zinc-400";
const RESTING_SHELL_LOCKED = "border-transparent bg-transparent text-zinc-400";

const RESTING_ICON_DONE = "bg-ok-soft text-ok";
const RESTING_ICON_CANCELED =
  "border border-border bg-muted-soft text-zinc-400";
const RESTING_ICON_LOCKED =
  "border border-dashed border-zinc-300 bg-transparent text-zinc-400";

function restingShell(stage: StageInstance, selected?: boolean): string {
  // A selected locked pill is being focused on purpose — borrow the Done
  // shell (white surface + neutral border) so it reads as a first-class
  // target instead of fading away in the locked transparent treatment.
  if (stage.locked && selected) return RESTING_SHELL_DONE;
  if (stage.locked) return RESTING_SHELL_LOCKED;
  if (stage.status === "canceled") return RESTING_SHELL_CANCELED;
  if (stage.status === "done") return RESTING_SHELL_DONE;
  return RESTING_SHELL_LOCKED;
}

function restingIconTone(stage: StageInstance): string {
  if (stage.locked) return RESTING_ICON_LOCKED;
  if (stage.status === "canceled") return RESTING_ICON_CANCELED;
  if (stage.status === "done") return RESTING_ICON_DONE;
  return RESTING_ICON_LOCKED;
}

// ── Inline status chip ──────────────────────────────────────────────────────

// One chip variant per StageStatus — plus dedicated review variants so a
// review stage waiting/active reads as "To Review" / "In Review" instead of
// the generic "To Do" / "In Progress".
type ChipVariant =
  | "to-do"
  | "in-progress"
  | "blocked"
  | "done"
  | "canceled"
  | "to-review"
  | "in-review";

function chipVariantFor(stage: StageInstance): ChipVariant {
  // Review stages have their own vocabulary for the two "live" statuses.
  // Blocked / done / canceled review stages fall through to the shared chip.
  if (stage.isReview) {
    if (stage.status === "to-do") return "to-review";
    if (stage.status === "in-progress") return "in-review";
  }
  switch (stage.status) {
    case "in-progress":
      return "in-progress";
    case "to-do":
      return "to-do";
    case "blocked":
      return "blocked";
    case "done":
      return "done";
    case "canceled":
      return "canceled";
  }
}

const CHIP_LABEL: Record<ChipVariant, string> = {
  "to-do": "До роботи",
  "in-progress": "В роботі",
  blocked: "Заблоковано",
  done: "Готово",
  canceled: "Скасовано",
  "to-review": "На перевірку",
  "in-review": "Перевіряється",
};

const CHIP_ICON: Record<ChipVariant, LucideIcon> = {
  "to-do": CircleDashed,
  "in-progress": Play,
  blocked: Pause,
  done: Check,
  canceled: X,
  // Review chips share the Eye glyph — to-review vs in-review is communicated
  // by label + color, not icon, mirroring how to-do/in-progress share visual
  // family while differing in tone.
  "to-review": Eye,
  "in-review": Eye,
};

// Chip color tone is keyed directly by status — review stages get the orange
// border on the shell, but the chip itself always reflects the underlying
// status (blue / grey / red / green / muted).
const CHIP_TONE: Record<ChipVariant, string> = {
  "to-do":
    "bg-todo-soft text-todo shadow-[0_0_0_1px_var(--color-todo-ring)_inset]",
  "in-progress":
    "bg-accent-soft text-accent-ink shadow-[0_0_0_1px_var(--color-accent-ring)_inset]",
  blocked:
    "bg-coral-soft text-coral shadow-[0_0_0_1px_var(--color-coral-ring)_inset]",
  // No `ok-ring` / `muted-ring` tokens yet — inlined pastels picked to match
  // the existing ring pattern (~3× lighter than the text color, sitting
  // between text and `*-soft` bg).
  done: "bg-ok-soft text-ok shadow-[0_0_0_1px_#a8d5b8_inset]",
  canceled:
    "bg-muted-soft text-muted shadow-[0_0_0_1px_var(--color-border-strong)_inset]",
  // Review variants share the warn (amber) family and the same light inset
  // ring. `in-review` is the saturated form (warm warn-soft bg, full warn
  // text); `to-review` is the quieter form — near-white bg and a warm taupe
  // text/icon (grey-leaning but still amber-tinted) so it reads as "waiting"
  // without competing with the active state.
  "to-review":
    "bg-[#fffdf5] text-[#8e7560] shadow-[0_0_0_1px_#fde68a_inset]",
  "in-review":
    "bg-warn-soft text-warn shadow-[0_0_0_1px_#fde68a_inset]",
};

// ── Component ──────────────────────────────────────────────────────────────

type StepperPillProps = {
  stage: StageInstance;
  size?: "default" | "compact"; // compact = inside a parallel group (26px height)
  // The stepper's mode (threaded from BundleStepper). Drives whether the
  // hover-preview behavior is active. "tabs" → no preview ever; "info" →
  // a 1 s hover on a non-active pill reveals its as-if-active form.
  mode?: "tabs" | "info";
  selected?: boolean;
  onClick?: () => void;
  // Whether the stage is "active" — i.e., all predecessors are done/canceled
  // and the stage itself is not locked. Computed by the parent so it can see
  // all stages (see `isStageActive` in ./index.tsx). Drives both the accent
  // shell and the inline status chip — these always travel together.
  isActive?: boolean;
  // When provided, the status chip becomes interactive — clicking it opens
  // the StatusSelector and selecting a status fires this callback.
  onStatusChange?: (next: StageStatus) => void;
  // When provided, the performer avatar slot becomes interactive — clicking
  // it opens the PersonPicker and choosing a person (or Unassigned) fires
  // this callback. When absent, the slot is read-only.
  onPerformerChange?: (next: PersonId | "unassigned") => void;
  // When provided AND the stage is locked, the lock icon becomes an
  // interactive button — clicking it fires this callback (so the parent can
  // mark the stage as manually unlocked). When absent, the lock icon is a
  // static informational marker.
  onUnlock?: () => void;
};

// How long the user has to hover a non-active pill in info mode before the
// preview commits. Matched by the wash's `duration-1000` transition so the
// grey overlay acts as a literal progress indicator for the wait.
const HOVER_PREVIEW_MS = 1000;
// After the user picks from an inner dropdown (status / performer), the wash
// re-appears at full width and `scale-x` shrinks 1 → 0 over this window. The
// wash's origin is `left`, so shrinking pulls the right edge toward the left
// — visually a right-to-left wipe. Slightly slower than the load sweep so
// the user has a more generous window to mouse back over the pill and cancel
// the retreat (which snaps the pill back to preview-active).
const PREVIEW_RETREAT_MS = 1500;

// Hover-preview lives in a small state machine so the wash visuals and the
// pill's preview-active rendering stay in lock-step across all transitions.
//
//   • idle         — no preview. Wash invisible. Pill in resting form.
//   • loading      — wash growing left→right while the 1 s timer ticks.
//                    Pill still in resting form (the wash plays *over* it).
//   • committed    — load timer fired. Wash hidden. Pill renders its
//                    as-if-active form (accent shell + status chip + slot).
//   • retreating   — user picked from an inner dropdown; the wash reappears
//                    at full width and scale-x shrinks back to zero over 1 s.
//                    Pill stays in preview-active form so the user can mouse
//                    back and keep interacting before it goes idle.
type PreviewPhase = "idle" | "loading" | "committed" | "retreating";

export const StepperPill = forwardRef<HTMLButtonElement, StepperPillProps>(
  function StepperPill(
    {
      stage,
      size = "default",
      mode = "info",
      selected,
      onClick,
      isActive,
      onStatusChange,
      onPerformerChange,
      onUnlock,
    },
    ref,
  ) {
    const compact = size === "compact";
    const isCanceled = stage.status === "canceled";

    // Hover-preview is the info-mode-only "hold for 1s to reveal" gesture.
    // Only one pill is ever hovered at a time, so the state lives locally.
    // Selected pills skip the wash entirely so the selection halo is the
    // dominant visual.
    const previewable = mode === "info" && !isActive && !selected;
    const [phase, setPhase] = useState<PreviewPhase>("idle");
    const [innerOpen, setInnerOpen] = useState(false);
    const mouseOverRef = useRef(false);
    const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const retreatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      // If the row unmounts (sort/filter/etc.) while either timer is in
      // flight, clear them so they don't fire setState on a dead component.
      return () => {
        if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
        if (retreatTimerRef.current) clearTimeout(retreatTimerRef.current);
      };
    }, []);

    const clearLoadTimer = () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    };
    const clearRetreatTimer = () => {
      if (retreatTimerRef.current) {
        clearTimeout(retreatTimerRef.current);
        retreatTimerRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      if (!previewable) return;
      mouseOverRef.current = true;
      // Mid-retreat hover-back: cancel the retreat and snap to preview-active
      // so the user can keep interacting with the pill.
      if (phase === "retreating") {
        clearRetreatTimer();
        setPhase("committed");
        return;
      }
      if (phase === "idle") {
        clearLoadTimer();
        setPhase("loading");
        loadTimerRef.current = setTimeout(() => {
          setPhase("committed");
          loadTimerRef.current = null;
        }, HOVER_PREVIEW_MS);
      }
      // loading / committed: nothing to do, already engaged
    };
    const handleMouseLeave = () => {
      if (!previewable) return;
      mouseOverRef.current = false;
      // While an inner dropdown is open, the cursor moves through the portal
      // and triggers mouseleave on the pill — keep the preview alive so the
      // user can pick something. The dropdown's `onOpenChange` handles the
      // cleanup when it closes.
      if (innerOpen) return;
      if (phase === "loading") {
        clearLoadTimer();
        setPhase("idle");
      } else if (phase === "committed") {
        setPhase("idle");
      }
      // retreating: leave the timer running; the wash recede plays out
    };

    const startRetreat = () => {
      if (!previewable) return;
      clearLoadTimer();
      clearRetreatTimer();
      setPhase("retreating");
      retreatTimerRef.current = setTimeout(() => {
        setPhase("idle");
        retreatTimerRef.current = null;
      }, PREVIEW_RETREAT_MS);
    };

    const handleInnerOpenChange = (open: boolean) => {
      setInnerOpen(open);
      // When the dropdown closes without a selection (escape / click-outside)
      // and the mouse is no longer over the pill, fall back to idle. The
      // selection path triggers `startRetreat` first, switching `phase` to
      // "retreating" before this fires — so we only mop up the committed-
      // dangling case here.
      if (!open && !mouseOverRef.current && phase === "committed") {
        setPhase("idle");
      }
    };

    // The originals pass straight through, but in info mode we wrap them so
    // selecting from either inner dropdown also kicks off the retreat wash.
    // In tabs mode (`!previewable`) no wrapping happens — the retreat would
    // be a no-op visually anyway (`previewable` gates the wash render).
    const handleStatusSelect = onStatusChange
      ? (next: StageStatus) => {
          onStatusChange(next);
          startRetreat();
        }
      : undefined;
    const handlePerformerSelect = onPerformerChange
      ? (next: PersonId | "unassigned") => {
          onPerformerChange(next);
          startRetreat();
        }
      : undefined;

    const isPreviewActive = phase === "committed" || phase === "retreating";

    // Visual computations route through `effectivelyActive` so that preview
    // and real activity produce identical pill rendering. The semantic
    // `isActive` is left untouched — only the rendering forks here.
    const effectivelyActive = !!isActive || isPreviewActive;
    // A pill reveals its full set of details — status chip, iter mark,
    // deadline chip — when it's either currently (or preview-)active OR
    // selected by the user. Other state markers (the lock icon) are
    // unconditional.
    const showDetails = effectivelyActive || !!selected;
    // Locked pills never wear the accent shell — even when promoted via the
    // hover-preview wash. They borrow the Done shell instead (see restingShell)
    // so the wash reveal reads as "this stage could become a focus target"
    // rather than masquerading as a fully active stage.
    const accent =
      effectivelyActive && !stage.locked ? accentForActive(stage) : null;
    const lockedPromoted = stage.locked && (!!selected || isPreviewActive);
    const chipVariant = chipVariantFor(stage);
    const showIter = !!stage.iter && stage.iter > 1 && showDetails;
    const showDeadline =
      !!stage.deadline &&
      (stage.deadline.kind === "overdue" || stage.deadline.kind === "missed") &&
      showDetails;

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        onMouseEnter={previewable ? handleMouseEnter : undefined}
        onMouseLeave={previewable ? handleMouseLeave : undefined}
        data-stage={stage.n}
        data-status={stage.status}
        data-locked={stage.locked || undefined}
        data-review={stage.isReview || undefined}
        data-accent={accent ?? undefined}
        data-phase={previewable ? phase : undefined}
        aria-current={selected ? "step" : undefined}
        title={`${stage.n} · ${stage.label}`}
        className={cn(
          "relative inline-flex shrink-0 items-center gap-[6px] whitespace-nowrap rounded-md border pl-[4px] pr-[6px] font-sans text-[12px] outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-accent-ring",
          compact
            ? "h-[26px] min-h-[26px] max-h-[26px] text-[11.5px]"
            : "h-[32px] min-h-[32px] max-h-[32px]",
          accent ? ACCENT_SHELL[accent] : restingShell(stage, lockedPromoted),
          // Click affordance only when the pill is actually clickable.
          // Skip the hover bg-shift on the currently-selected pill so the
          // selection stays visually stable when the mouse passes over it.
          onClick && "cursor-pointer",
          onClick && !selected && "hover:bg-surface-3",
          // Selected ring — orthogonal to the active/resting state. Color
          // tracks the pill's status (blue / grey / red / green / muted) so
          // selection feels cohesive with the chip inside. Hairline width +
          // 1px offset across both sizes so the halo reads as a precise
          // outline, not a bold ring.
          selected &&
            cn("outline outline-1 outline-offset-1", selectedOutlineColor(stage)),
          // Locked stages mute their treatment so the performer reads them as
          // "not yet actionable" without removing them from the flow view.
          // Drop the mute the moment the pill becomes a focus target —
          // selected, manually unlocked / active, OR promoted via the
          // hover-preview wash. In every promoted case the pill borrows the
          // Done shell, and the dim treatment would fight it.
          stage.locked && !lockedPromoted && !isActive && "opacity-60",
          // The hover-preview wash is clipped to the pill's rounded shape so
          // partially-filled wash never bleeds beyond the border on bowed
          // corners. `isolate` creates a local stacking context so the wash's
          // negative z-index is contained inside the pill — without it, a
          // negative-z child can fall behind the pill's own background (or
          // ancestor stacking contexts) and disappear.
          previewable && "isolate overflow-hidden",
        )}
      >
        {previewable && (
          // Info-mode hover wash. Stays mounted across all four preview
          // phases so the scale-x transition can interpolate smoothly across
          // them; opacity is left out of `transition-property` so visibility
          // flips instantly when phases hand off.
          //
          //   • loading   — scale-x 0 → 100 over 1 s (origin-left). Pill is
          //                 still resting underneath; the wash plays *over* it.
          //   • committed — scale-x stays 100, opacity drops to 0 instantly.
          //                 Pill renders its as-if-active form on a clean bg.
          //   • retreating— scale-x 100 → 0 over 1 s with the same origin-left.
          //                 Because the origin is fixed at left, scale-x
          //                 shrinking pulls the right edge leftward — visually
          //                 reads as a right-to-left wipe of the wash. Opacity
          //                 flips back to 100 instantly so the wash is visible
          //                 the moment the retreat begins.
          //   • idle      — scale-x snaps to 0, opacity to 0. Both instant
          //                 (duration-0) so canceling or finishing a phase
          //                 doesn't leak animations into the next one.
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 origin-left rounded-md bg-zinc-100/70 transition-transform ease-linear",
              phase === "loading" &&
                "scale-x-100 opacity-100 duration-1000",
              phase === "committed" &&
                "scale-x-100 opacity-0 duration-0",
              phase === "retreating" &&
                "scale-x-0 opacity-100 duration-[1500ms]",
              phase === "idle" && "scale-x-0 opacity-0 duration-0",
            )}
          />
        )}
        {showDetails ? (
          handleStatusSelect ? (
            <StatusSelector
              stage={stage}
              onSelect={handleStatusSelect}
              onOpenChange={previewable ? handleInnerOpenChange : undefined}
            >
              <PillStatusChip variant={chipVariant} interactive />
            </StatusSelector>
          ) : (
            <PillStatusChip variant={chipVariant} />
          )
        ) : (
          <StatusIcon stage={stage} accent={accent} />
        )}
        <span className={cn("leading-none", isCanceled && "line-through decoration-zinc-300")}>
          {stage.label}
        </span>

        {showDetails && (
          <PerformerAvatarSlot
            stage={stage}
            onPerformerChange={handlePerformerSelect}
            onOpenChange={previewable ? handleInnerOpenChange : undefined}
          />
        )}
        {stage.locked && <LockMark onUnlock={onUnlock} />}
        {showIter && <IterMark count={stage.iter ?? 1} />}
        {showDeadline && stage.deadline && <DeadlineChip deadline={stage.deadline} />}
      </button>
    );
  },
);

// PillStatusChip is forwardRef'd so it can be composed by Radix' `asChild`
// dropdown trigger when `interactive` is true. The interactive variant also
// becomes focusable + stops click propagation, so opening the StatusSelector
// doesn't double-trigger pill selection.
type PillStatusChipProps = {
  variant: ChipVariant;
  interactive?: boolean;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

const PillStatusChip = forwardRef<HTMLSpanElement, PillStatusChipProps>(
  function PillStatusChip(
    { variant, interactive, className, onClick, onKeyDown, ...rest },
    ref,
  ) {
    const Icon = CHIP_ICON[variant];
    return (
      <span
        ref={ref}
        // Named group `chip` so the chevron child can react to hover/open
        // scoped to the chip itself (not the surrounding pill or the row).
        // The `data-[state=open]` selectors track Radix' dropdown-trigger
        // state when this chip is used as a menu trigger.
        className={cn(
          "group/chip inline-flex h-[22px] min-h-[22px] max-h-[22px] shrink-0 items-center gap-[5px] whitespace-nowrap rounded-[5px] px-[8px] font-mono text-[10.5px] font-semibold uppercase leading-none tracking-[0.04em] outline-none transition-shadow",
          CHIP_TONE[variant],
          interactive &&
            "cursor-pointer focus-visible:ring-[3px] focus-visible:ring-accent-ring/70",
          className,
        )}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={(event) => {
          // Stop the click from bubbling to the outer pill button — clicking
          // the chip is exclusively a "change status" gesture, not a "select
          // this stage" gesture.
          if (interactive) event.stopPropagation();
          onClick?.(event);
        }}
        onKeyDown={(event) => {
          // Mirror the click-stop above for keyboard activation, so pressing
          // Enter/Space on a focused chip doesn't also fire pill selection.
          if (interactive && (event.key === "Enter" || event.key === " ")) {
            event.stopPropagation();
          }
          onKeyDown?.(event);
        }}
        {...rest}
      >
        <Icon className="size-[12px]" strokeWidth={2} />
        <span className="leading-none">{CHIP_LABEL[variant]}</span>
        {/* Always occupies space (the chip is sized for it) — paints on hover
            over the chip OR when the dropdown is open, rotating ~180° at that
            point so the affordance reads as "this menu is currently down". */}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-[10px] opacity-0 transition-[opacity,transform] duration-200",
            "group-hover/chip:opacity-100 group-data-[state=open]/chip:opacity-100 group-data-[state=open]/chip:rotate-180",
          )}
          strokeWidth={2}
        />
      </span>
    );
  },
);

function StatusIcon({
  stage,
  accent,
}: {
  stage: StageInstance;
  accent: Accent | null;
}): ReactNode {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-[3px] inline-flex size-[16px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold leading-none",
        accent ? ACCENT_ICON_TONE[accent] : restingIconTone(stage),
      )}
    >
      <IconGlyph stage={stage} />
    </span>
  );
}

function IconGlyph({ stage }: { stage: StageInstance }) {
  switch (stage.status) {
    case "done":
      return (
        <svg viewBox="0 0 14 14" className="size-[10px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 7.4 6 9.7l4.7-5" />
        </svg>
      );
    case "in-progress":
      return (
        <svg viewBox="0 0 10 10" className="size-[8px]" fill="currentColor">
          <polygon points="2,1 9,5 2,9" />
        </svg>
      );
    case "canceled":
      return (
        <svg viewBox="0 0 14 14" className="size-[10px]" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 4 6 6M10 4l-6 6" />
        </svg>
      );
    case "blocked":
      return <Pause className="size-[8px]" strokeWidth={2} />;
    case "to-do":
      return null; // dashed ring is the indicator itself
  }
}

// LockMark — sits to the right of the label on locked pills. Read-only by
// default (just signals "this stage is gated by its predecessors"). When the
// pill receives an `onUnlock` callback, the mark becomes an interactive
// button: hover scales it up + darkens, click stops propagation and fires
// the callback so the parent can flip `locked` on the stage. Mirrors the
// chip / avatar pattern so all three in-pill controls feel consistent.
function LockMark({ onUnlock }: { onUnlock?: () => void }) {
  if (!onUnlock) {
    return (
      <span
        aria-hidden
        title="Заблоковано — очікує попередніх етапів"
        className="inline-flex size-[12px] shrink-0 items-center justify-center text-zinc-400"
      >
        <Lock className="size-[10px]" strokeWidth={2} />
      </span>
    );
  }
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="Розблокувати цей етап"
      title="Натисніть, щоб розблокувати"
      onClick={(event) => {
        event.stopPropagation();
        onUnlock();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onUnlock();
        }
      }}
      className={cn(
        "inline-flex size-[14px] shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 outline-none",
        "transition-[transform,color,background-color] duration-150",
        "hover:scale-110 hover:bg-surface-3 hover:text-zinc-700",
        "focus-visible:ring-[2px] focus-visible:ring-accent-ring/70",
      )}
    >
      <Lock className="size-[10px]" strokeWidth={2} />
    </span>
  );
}

// PerformerAvatarSlot — the small avatar to the right of the stage label.
// Shows the assigned performer's initial-circle or a dashed empty slot. When
// `onPerformerChange` is provided, the slot becomes a PersonPicker trigger
// (focusable, click-stop-propagation so it never doubles as pill selection,
// hover-scale to hint at interactivity). When the callback is absent, the
// slot renders as a static span — visible but inert.
function PerformerAvatarSlot({
  stage,
  onPerformerChange,
  onOpenChange,
}: {
  stage: StageInstance;
  onPerformerChange?: (next: PersonId | "unassigned") => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const people = usePeople();
  const performerId = stage.performerId;
  const person =
    performerId && performerId !== "unassigned"
      ? people.data?.find((p) => p.id === performerId)
      : undefined;
  const interactive = !!onPerformerChange;

  // Tooltip lives on a thin wrapper span, NOT on the same element as the
  // PopoverTrigger. Nesting two Radix `asChild` triggers on one element races
  // — Tooltip dismisses on `pointerdown` while Popover toggles on `click`,
  // and Slot-composed handlers can swallow each other depending on order.
  // The wrapper keeps the two interaction surfaces fully separate: hover on
  // the wrapper triggers the tooltip, click on the inner avatar triggers
  // the picker. Layout stays identical because the wrapper is a 0-padding
  // inline-flex that hugs the avatar.
  const tooltipLabel = person ? person.name : "Не призначено";
  const slot = (
    <PerformerSlotTrigger
      person={person}
      interactive={interactive}
      ariaLabel={
        person
          ? `Змінити виконавця, зараз ${person.name}`
          : "Призначити виконавця"
      }
    />
  );
  const inner = interactive ? (
    <PersonPicker
      value={performerId ?? "unassigned"}
      onChange={onPerformerChange}
      onOpenChange={onOpenChange}
      align="start"
      side="bottom"
    >
      {slot}
    </PersonPicker>
  ) : (
    slot
  );

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <span className="inline-flex">{inner}</span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {tooltipLabel}
      </TooltipContent>
    </Tooltip>
  );
}

type PerformerSlotTriggerProps = {
  person: Person | undefined;
  interactive: boolean;
  ariaLabel: string;
};

// Forwarded-ref span so Radix' `asChild` PopoverTrigger can compose onto it.
// Renders the visual: either the colored initial-avatar or a dashed empty
// circle. Interactive variant adds hover scale + focus ring + the click-stop
// behavior the chip uses for the same reason.
const PerformerSlotTrigger = forwardRef<
  HTMLSpanElement,
  PerformerSlotTriggerProps & Omit<ComponentPropsWithoutRef<"span">, "children">
>(function PerformerSlotTrigger(
  { person, interactive, ariaLabel, className, onClick, onKeyDown, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? ariaLabel : undefined}
      data-empty={person ? undefined : true}
      onClick={(event) => {
        if (interactive) event.stopPropagation();
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        if (interactive && (event.key === "Enter" || event.key === " ")) {
          event.stopPropagation();
        }
        onKeyDown?.(event);
      }}
      className={cn(
        "group/avatar inline-flex size-[18px] shrink-0 items-center justify-center rounded-full outline-none",
        interactive &&
          "cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-100 focus-visible:ring-[2px] focus-visible:ring-accent-ring/70",
        className,
      )}
      {...rest}
    >
      {person ? (
        <AvatarDot person={person} size={18} />
      ) : (
        <span
          aria-hidden
          className={cn(
            // Slight surface fill so the empty slot reads as a "drop zone"
            // rather than just an outlined hole — visible against both the
            // white active pill and the tinted hover states without competing
            // with assigned avatars.
            "size-[18px] rounded-full border border-dashed border-border-strong bg-surface-3 transition-colors duration-150",
            interactive && "group-hover/avatar:border-zinc-500 group-hover/avatar:bg-surface-2",
          )}
        />
      )}
    </span>
  );
});
