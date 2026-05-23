"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { StageInstance } from "@/lib/api/types";
import { ParallelGroup } from "./parallel-group";
import { PillConnector } from "./pill-connector";
import { StepperNav } from "./stepper-nav";
import { StepperPill } from "./stepper-pill";

export type BundleStepperProps = {
  stages: StageInstance[];
  variant?: "inline-row" | "page";
  // Bundle-page-only — selection drives the active-detail bar.
  selectedStageN?: string;
  onSelectStage?: (n: string) => void;
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
  selectedStageN,
  onSelectStage,
  showDetailBar = false,
  detailBar,
  footer,
  className,
  scrollerClassName,
}: BundleStepperProps) {
  const items = useMemo(() => groupStages(stages), [stages]);
  const showStatusByN = useMemo(() => computeShowStatus(stages), [stages]);
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
                selectedStageN={selectedStageN}
                onSelectStage={onSelectStage}
                showStatusByN={showStatusByN}
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
  selectedStageN,
  onSelectStage,
  showStatusByN,
}: {
  item: StepperItem;
  connector: "linear" | "split" | "merge" | null;
  selectedStageN?: string;
  onSelectStage?: (n: string) => void;
  showStatusByN: Set<string>;
}) {
  const node =
    item.kind === "pill" ? (
      <StepperPill
        stage={item.stage}
        selected={selectedStageN === item.stage.n}
        onClick={onSelectStage ? () => onSelectStage(item.stage.n) : undefined}
        showStatus={showStatusByN.has(item.stage.n)}
      />
    ) : (
      <ParallelGroup pills={item.pills} showStatusByN={showStatusByN} />
    );
  return (
    <>
      {node}
      {connector && <PillConnector kind={connector} />}
    </>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

// Which stages should render their inline status chip. Live statuses always
// show; among `todo` stages only the earliest one does (so a long tail of
// upcoming todos doesn't repeat the same chip down the row).
function computeShowStatus(stages: StageInstance[]): Set<string> {
  const set = new Set<string>();
  let firstTodoSeen = false;
  for (const stage of stages) {
    if (
      stage.status === "active" ||
      stage.status === "in-review" ||
      stage.status === "reopened"
    ) {
      set.add(stage.n);
    } else if (stage.status === "todo" && !firstTodoSeen) {
      set.add(stage.n);
      firstTodoSeen = true;
    }
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
