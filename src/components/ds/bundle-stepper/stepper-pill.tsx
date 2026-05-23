"use client";

import { CircleDashed, Clock, Play, RotateCw, type LucideIcon } from "lucide-react";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { StageInstance, StageStatus } from "@/lib/api/types";
import { DeadlineChip } from "./deadline-chip";
import { IterMark } from "./iter-mark";

// Statuses that can surface a status chip inside the pill. Whether the chip
// actually renders is decided by the parent via the `showStatus` prop —
// supporting a status here only means the chip styling exists.
type PillChipStatus = "active" | "in-review" | "reopened" | "todo";

const PILL_CHIP_TONE: Record<PillChipStatus, string> = {
  active:
    "bg-accent-soft text-accent-ink shadow-[0_0_0_1px_var(--color-accent-ring)_inset]",
  reopened:
    "bg-accent-soft text-accent-ink shadow-[0_0_0_1px_var(--color-accent-ring)_inset]",
  "in-review":
    "bg-warn-soft text-warn shadow-[0_0_0_1px_var(--color-warn-ring)_inset]",
  todo:
    "bg-todo-soft text-todo shadow-[0_0_0_1px_#cbd5e1_inset]",
};

const PILL_CHIP_LABEL: Record<PillChipStatus, string> = {
  active: "In Progress",
  reopened: "Reopened",
  "in-review": "In Review",
  todo: "To Do",
};

const PILL_CHIP_ICON: Record<PillChipStatus, LucideIcon> = {
  active: Play,
  reopened: RotateCw,
  "in-review": Clock,
  todo: CircleDashed,
};

function isPillChipStatus(s: StageStatus): s is PillChipStatus {
  return s === "active" || s === "in-review" || s === "reopened" || s === "todo";
}

// Lifecycle status → pill shell classes. Shapes mirror stepper.css `.pill.<status>`.
// Live statuses (active / in-review / returned / reopened) get a colored ring
// and slightly taller pill; non-live statuses keep the compact 30px height.
const STATUS_SHELL: Record<StageStatus, string> = {
  todo:
    "border-transparent bg-transparent text-zinc-400 hover:bg-surface-3",
  ready:
    "border-dashed border-border-strong bg-transparent text-zinc-500 hover:bg-surface-3",
  active:
    "h-[32px] border-accent-strong bg-surface text-foreground font-medium shadow-[0_0_0_1px_var(--color-accent-ring),0_1px_2px_rgba(20,20,28,0.04)] pr-[12px] hover:bg-surface-3",
  "in-review":
    "h-[32px] border-warn-ring bg-surface text-warn font-medium shadow-[0_0_0_1px_rgba(252,211,77,0.5),0_1px_2px_rgba(180,83,9,0.06)] pr-[12px] hover:bg-surface-3",
  returned:
    "h-[32px] border-coral-ring bg-surface text-coral font-medium shadow-[0_0_0_1px_rgba(245,183,176,0.55),0_1px_2px_rgba(181,53,39,0.05)] pr-[12px] hover:bg-surface-3",
  reopened:
    "h-[32px] border-accent-strong bg-surface text-foreground font-medium shadow-[0_0_0_1px_var(--color-accent-ring),0_1px_2px_rgba(20,20,28,0.04)] pr-[12px] hover:bg-surface-3",
  passed:
    "border-border bg-surface text-zinc-700 hover:bg-surface-3",
  canceled:
    "border-border bg-surface text-zinc-400 hover:bg-surface-3",
};

// Color of the status-icon dot inside the pill (the 16x16 circle to the left).
const ICON_TONE: Record<StageStatus, string> = {
  todo: "border border-dashed border-zinc-300 bg-transparent text-zinc-400",
  ready: "border border-dashed border-zinc-300 bg-transparent text-zinc-400",
  active: "bg-accent-strong text-white",
  "in-review": "bg-warn text-white",
  returned: "bg-coral text-white",
  reopened: "bg-accent-strong text-white",
  passed: "bg-ok-soft text-ok",
  canceled: "border border-border bg-muted-soft text-zinc-400",
};

type StepperPillProps = {
  stage: StageInstance;
  size?: "default" | "compact"; // compact = inside a parallel group (26px height)
  selected?: boolean;
  onClick?: () => void;
  // Whether to render the inline status chip. The decision is the parent's —
  // typically: true for live statuses (active / in-review / reopened) and the
  // first todo in the sequence; false everywhere else.
  showStatus?: boolean;
};

// One pill — the building block of the stepper. Renders the stage number,
// label, status icon, deadline, and iteration mark.
export const StepperPill = forwardRef<HTMLButtonElement, StepperPillProps>(
  function StepperPill(
    { stage, size = "default", selected, onClick, showStatus },
    ref,
  ) {
    const compact = size === "compact";
    const showIter = !!stage.iter && stage.iter > 1;
    const isCanceled = stage.status === "canceled";
    const showChip = !!showStatus && isPillChipStatus(stage.status);
    // When a `todo` pill surfaces its status chip it becomes a "live" pill —
    // mirror the active/in-review shell (border + surface + taller box) so the
    // visual treatment matches In Progress.
    const todoLive = showChip && stage.status === "todo";

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        data-stage={stage.n}
        data-status={stage.status}
        aria-current={selected ? "step" : undefined}
        title={`${stage.n} · ${stage.label}`}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-md border pr-[10px] font-sans text-[12px] outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-accent-ring",
          showChip ? "pl-[5px]" : "pl-[8px]",
          compact ? "h-[26px] text-[11.5px]" : "h-[30px]",
          todoLive
            ? "h-[32px] border-zinc-300 bg-surface text-foreground font-medium shadow-[0_0_0_1px_#cbd5e1,0_1px_2px_rgba(20,20,28,0.04)] pr-[12px] hover:bg-surface-3"
            : STATUS_SHELL[stage.status],
        )}
      >
        {showChip ? (
          <PillStatusChip status={stage.status as PillChipStatus} />
        ) : (
          <StatusIcon status={stage.status} />
        )}
        <span className={cn("leading-none", isCanceled && "line-through decoration-zinc-300")}>
          {stage.label}
        </span>

        {showIter && <IterMark count={stage.iter ?? 1} />}
        {stage.deadline && <DeadlineChip deadline={stage.deadline} />}
      </button>
    );
  },
);

function PillStatusChip({ status }: { status: PillChipStatus }): ReactNode {
  const Icon = PILL_CHIP_ICON[status];
  return (
    <span
      className={cn(
        "inline-flex h-[22px] shrink-0 items-center gap-[5px] whitespace-nowrap rounded-[5px] px-[8px] font-mono text-[10.5px] font-semibold uppercase leading-none tracking-[0.04em]",
        PILL_CHIP_TONE[status],
      )}
    >
      <Icon className="size-[12px]" strokeWidth={2} />
      <span className="leading-none">{PILL_CHIP_LABEL[status]}</span>
    </span>
  );
}

function StatusIcon({ status }: { status: StageStatus }): ReactNode {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-[16px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold leading-none",
        ICON_TONE[status],
      )}
    >
      <IconGlyph status={status} />
    </span>
  );
}

function IconGlyph({ status }: { status: StageStatus }) {
  switch (status) {
    case "passed":
      return (
        <svg viewBox="0 0 14 14" className="size-[10px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 7.4 6 9.7l4.7-5" />
        </svg>
      );
    case "active":
    case "reopened":
      return (
        <svg viewBox="0 0 10 10" className="size-[8px]" fill="currentColor">
          <polygon points="2,1 9,5 2,9" />
        </svg>
      );
    case "in-review":
      return (
        <svg viewBox="0 0 14 14" className="size-[10px]" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="7" r="4.7" />
          <path d="M7 4.2v2.8l1.8 1.4" />
        </svg>
      );
    case "returned":
      return (
        <svg viewBox="0 0 14 14" className="size-[10px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 4.5H5.5a2.5 2.5 0 0 0 0 5h2" />
          <path d="M7.2 2.5 5.2 4.5l2 2" />
        </svg>
      );
    case "canceled":
      return (
        <svg viewBox="0 0 14 14" className="size-[10px]" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 4 6 6M10 4l-6 6" />
        </svg>
      );
    case "ready":
    case "todo":
      return null; // dashed ring is the indicator itself
  }
}

