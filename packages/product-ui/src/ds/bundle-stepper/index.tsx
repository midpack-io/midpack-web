"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import type { PersonId, StageInstance, StageStatus } from "../../lib/types";
import { ParallelGroup } from "./parallel-group";
import { PillConnector } from "./pill-connector";
import { StepperNav } from "./stepper-nav";
import { StepperPill } from "./stepper-pill";

export type BundleStepperProps = {
  stages: StageInstance[];
  variant?: "inline-row" | "page";
  // The stepper's role on the page.
  //
  // - "tabs" (used on the product detail page): pills behave like tabs.
  //   Clicking a pill selects it; the selected pill renders the status-tinted
  //   outline. `selectedStageN` + `onSelectStage` are honored. No hover
  //   preview — selection IS the interaction.
  //
  // - "info" (used on the products list, one stepper per row): pills are not
  //   selectable. Hovering a non-active pill triggers a 1-second grey wash
  //   that doubles as a progress indicator; when it completes, the pill
  //   reveals its as-if-active treatment (accent border + chip + deadline).
  //   On mouseleave the pill returns to resting. `selectedStageN` /
  //   `onSelectStage` are silently ignored here.
  mode?: "tabs" | "info";
  // Controlled selection. Only meaningful when `mode === "tabs"`.
  selectedStageN?: string;
  onSelectStage?: (n: string) => void;
  // When provided, every visible status chip becomes interactive: clicking it
  // opens the StatusSelector and selecting a status fires this callback with the
  // pill's `n` and the chosen status. Caller owns persistence.
  onStatusChange?: (n: string, next: StageStatus) => void;
  // When provided, every visible avatar slot becomes interactive: clicking it
  // opens the PersonPicker and choosing a person (or "unassigned") fires this
  // callback with the pill's `n` and the new assignment. Caller owns
  // persistence — same shape as `onStatusChange`.
  onPerformerChange?: (n: string, next: PersonId | "unassigned") => void;
  // When provided, the lock icon on each locked pill becomes a click-to-
  // unlock button — fires this callback with the pill's `n`. Caller flips
  // `locked` on its working copy of stages.
  onUnlock?: (n: string) => void;
  showDetailBar?: boolean;
  detailBar?: ReactNode;
  // Optional content rendered below the pill row, inside the same container,
  // inset with padding so the container surface shows around it. Used by the
  // products row to embed the return notice within the stepper area.
  footer?: ReactNode;
  className?: string;
  // Override classes on the inner horizontal-scroll container — lets row
  // variants tune the pill row's padding without forking the component.
  scrollerClassName?: string;
};

// Grouped item form: either a standalone pill or a parallel group of pills.
type StepperItem =
  | { kind: "pill"; stage: StageInstance }
  | { kind: "parallel"; pills: StageInstance[] };

// 9-stage horizontal stepper with optional parallel branches, scroll arrows,
// and (on the bundle page) an active-detail slot below the row.
// On the products list page it renders without the detail bar — each row owns
// its own stepper and the row's click handler delegates pill clicks correctly.
export function BundleStepper({
  stages,
  variant = "inline-row",
  mode = "info",
  selectedStageN,
  onSelectStage,
  onStatusChange,
  onPerformerChange,
  onUnlock,
  showDetailBar = false,
  detailBar,
  footer,
  className,
  scrollerClassName,
}: BundleStepperProps) {
  // Selection plumbing is only active in tabs mode. In info mode, even if a
  // caller passes `selectedStageN` / `onSelectStage`, we silently drop them —
  // the surface's contract is "pills are not selectable here".
  const selectHandler =
    mode === "tabs" && onSelectStage ? onSelectStage : undefined;
  const activeSelectedN = mode === "tabs" ? selectedStageN : undefined;
  const items = useMemo(() => groupStages(stages), [stages]);
  const activeByN = useMemo(() => computeActiveByN(stages), [stages]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({
    atStart: true,
    atEnd: true,
    noOverflow: true,
  });

  // Watch scroll position so we can fade the arrows at the edges.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => setScrollState(measureScroll(el));
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [items]);

  const scrollBy = (direction: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div
      data-stepper
      data-variant={variant}
      className={cn(
        "relative",
        variant === "inline-row" && "bg-surface-2 border-t border-border",
        className,
      )}
    >
      <div className="relative">
        <StepperNav
          direction="prev"
          disabled={scrollState.atStart || scrollState.noOverflow}
          onClick={() => scrollBy("prev")}
        />
        <StepperNav
          direction="next"
          disabled={scrollState.atEnd || scrollState.noOverflow}
          onClick={() => scrollBy("next")}
        />
        {/* Edge fades — soften the cut-off behind the arrows */}
        {!scrollState.atStart && !scrollState.noOverflow && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-0 top-[14px] bottom-0 z-[2] w-[32px]",
              variant === "inline-row"
                ? "bg-gradient-to-r from-surface-2 via-surface-2/60 to-transparent"
                : "bg-gradient-to-r from-surface via-surface/60 to-transparent",
            )}
          />
        )}
        {!scrollState.atEnd && !scrollState.noOverflow && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute right-0 top-[14px] bottom-0 z-[2] w-[32px]",
              variant === "inline-row"
                ? "bg-gradient-to-l from-surface-2 via-surface-2/60 to-transparent"
                : "bg-gradient-to-l from-surface via-surface/60 to-transparent",
            )}
          />
        )}

        <div
          ref={scrollerRef}
          className={cn(
            "flex items-center gap-[2px] overflow-x-auto overflow-y-hidden px-[16px] py-[14px] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]",
            // A horizontal scroll container paints on its own layer, which Chrome
            // does NOT clip to an ancestor's border-radius — so its square bottom
            // corners poke past the row card's rounded corners. Round them to match
            // (inset 1px for the card's border). inline-row only — it's the card's
            // last element; the page variant isn't inside a rounded card.
            variant === "inline-row" && "rounded-b-[11px]",
            scrollerClassName,
          )}
        >
          {items.map((item, idx) => {
            const next = items[idx + 1];
            const connector = item && next ? connectorBetween(item, next) : null;
            return (
              <Item
                key={keyForItem(item, idx)}
                item={item}
                connector={connector}
                mode={mode}
                selectedStageN={activeSelectedN}
                onSelectStage={selectHandler}
                onStatusChange={onStatusChange}
                onPerformerChange={onPerformerChange}
                onUnlock={onUnlock}
                activeByN={activeByN}
              />
            );
          })}
        </div>
      </div>

      {showDetailBar && detailBar}
      {footer && (
        <div className={cn("px-[16px] pb-[14px]", scrollerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
}

// Render a single item (pill or parallel group), followed by the connector
// that links it to the next item. The connector is rendered after the item so
// the flex row reads left-to-right.
function Item({
  item,
  connector,
  mode,
  selectedStageN,
  onSelectStage,
  onStatusChange,
  onPerformerChange,
  onUnlock,
  activeByN,
}: {
  item: StepperItem;
  connector: "linear" | "split" | "merge" | null;
  mode: "tabs" | "info";
  selectedStageN?: string;
  onSelectStage?: (n: string) => void;
  onStatusChange?: (n: string, next: StageStatus) => void;
  onPerformerChange?: (n: string, next: PersonId | "unassigned") => void;
  onUnlock?: (n: string) => void;
  activeByN: Set<string>;
}) {
  const node =
    item.kind === "pill" ? (
      <StepperPill
        stage={item.stage}
        mode={mode}
        selected={selectedStageN === item.stage.n}
        onClick={onSelectStage ? () => onSelectStage(item.stage.n) : undefined}
        onStatusChange={
          onStatusChange
            ? (next) => onStatusChange(item.stage.n, next)
            : undefined
        }
        onPerformerChange={
          onPerformerChange
            ? (next) => onPerformerChange(item.stage.n, next)
            : undefined
        }
        onUnlock={onUnlock ? () => onUnlock(item.stage.n) : undefined}
        isActive={activeByN.has(item.stage.n)}
      />
    ) : (
      <ParallelGroup
        pills={item.pills}
        mode={mode}
        activeByN={activeByN}
        selectedStageN={selectedStageN}
        onSelectStage={onSelectStage}
        onStatusChange={onStatusChange}
        onPerformerChange={onPerformerChange}
        onUnlock={onUnlock}
      />
    );
  return (
    <>
      {node}
      {connector && <PillConnector kind={connector} />}
    </>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

// A stage is "active" when it is not locked and not done/canceled. `locked`
// is the source of truth for "ready to work on" (the spec already folds the
// predecessors-done rule and the manuallyUnlocked override into that flag),
// so this check stays a single-stage local computation.
//
// Active is the single switch that drives the pill's visual state — active
// pills get the accent shell + inline status chip; non-active pills fall back
// to the resting style (done / canceled / locked).
export function isStageActive(stage: StageInstance): boolean {
  if (stage.locked) return false;
  if (stage.status === "done" || stage.status === "canceled") return false;
  return true;
}

function computeActiveByN(stages: StageInstance[]): Set<string> {
  const set = new Set<string>();
  for (const stage of stages) {
    if (isStageActive(stage)) set.add(stage.n);
  }
  return set;
}

function groupStages(stages: StageInstance[]): StepperItem[] {
  const out: StepperItem[] = [];
  let i = 0;
  while (i < stages.length) {
    const stage = stages[i];
    if (!stage) break;
    if (stage.parallelGroup) {
      const group = stage.parallelGroup;
      const pills: StageInstance[] = [];
      while (i < stages.length && stages[i]?.parallelGroup === group) {
        pills.push(stages[i] as StageInstance);
        i += 1;
      }
      out.push({ kind: "parallel", pills });
    } else {
      out.push({ kind: "pill", stage });
      i += 1;
    }
  }
  return out;
}

function connectorBetween(a: StepperItem, b: StepperItem): "linear" | "split" | "merge" {
  if (a.kind === "pill" && b.kind === "parallel") return "split";
  if (a.kind === "parallel" && b.kind === "pill") return "merge";
  return "linear";
}

function keyForItem(item: StepperItem, idx: number): string {
  if (item.kind === "pill") return item.stage.n;
  return `parallel-${item.pills[0]?.n ?? idx}`;
}

type ScrollState = { atStart: boolean; atEnd: boolean; noOverflow: boolean };

function measureScroll(el: HTMLDivElement): ScrollState {
  const noOverflow = el.scrollWidth <= el.clientWidth + 1;
  const atStart = el.scrollLeft <= 1;
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
  return { atStart, atEnd, noOverflow };
}
