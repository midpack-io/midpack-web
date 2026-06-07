import * as React from "react";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

export type StatusValue =
  | "todo"
  | "in-progress"
  | "in-review"
  | "done"
  | "canceled"
  | "reopened";

const STATUS_LABEL: Record<StatusValue, string> = {
  todo: "TO DO",
  "in-progress": "IN PROGRESS",
  "in-review": "IN REVIEW",
  done: "DONE",
  canceled: "CANCELED",
  reopened: "REOPENED",
};

const STATUS_CLASSES: Record<StatusValue, string> = {
  todo: "bg-todo-soft text-todo shadow-[0_0_0_1px_#cbd5e1_inset]",
  "in-progress": "bg-info-soft text-info-ink shadow-[0_0_0_1px_#b4cdfa_inset]",
  "in-review": "bg-warn-soft text-warn shadow-[0_0_0_1px_#fcd34d_inset]",
  done: "bg-ok-soft text-ok shadow-[0_0_0_1px_#b8d8c2_inset]",
  canceled: "bg-surface-3 text-zinc-400 shadow-[0_0_0_1px_#e6e6e1_inset]",
  reopened: "bg-coral-soft text-coral shadow-[0_0_0_1px_#f5b7b0_inset]",
};

function StatusIcon({ status }: { status: StatusValue }) {
  const common = {
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: 11,
    height: 11,
    "aria-hidden": true,
  };
  switch (status) {
    case "todo":
      return (
        <svg {...common} strokeWidth={1.4}>
          <circle cx="7" cy="7" r="4.5" strokeDasharray="2 1.6" />
        </svg>
      );
    case "in-progress":
      return (
        <svg {...common} strokeWidth={1.4}>
          <circle cx="7" cy="7" r="4.5" />
          <circle cx="7" cy="7" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "in-review":
      return (
        <svg {...common} strokeWidth={1.4}>
          <circle cx="7" cy="7" r="4.7" />
          <path d="M7 4.2v2.8l1.8 1.4" />
        </svg>
      );
    case "done":
      return (
        <svg {...common} strokeWidth={1.5}>
          <circle cx="7" cy="7" r="4.7" />
          <path d="M4.6 7.2 6.3 8.9 9.6 5.3" />
        </svg>
      );
    case "canceled":
      return (
        <svg {...common} strokeWidth={1.4}>
          <circle cx="7" cy="7" r="4.7" />
          <path d="M4.6 4.6l4.8 4.8M9.4 4.6l-4.8 4.8" />
        </svg>
      );
    case "reopened":
      return (
        <svg {...common} strokeWidth={1.5}>
          <path d="M2.8 7.6a4.2 4.2 0 0 0 8-1.2" />
          <path d="M11.3 4.2v2.4H8.9" />
          <path d="M11.2 6.4A4.2 4.2 0 0 0 3.2 7.6" />
        </svg>
      );
  }
}

type StatusChipProps = {
  status: StatusValue;
  label?: string;
  className?: string;
};

export function StatusChip({ status, label, className }: StatusChipProps) {
  return (
    <Badge
      variant="ghost"
      className={cn(
        "h-[22px] gap-[5px] rounded-chip border-0 px-2 pt-[3px] pb-[2px] font-mono text-[10.5px] font-semibold uppercase leading-none tracking-[0.04em] [&>svg]:size-[11px]",
        STATUS_CLASSES[status],
        className,
      )}
    >
      <StatusIcon status={status} />
      <span className={cn(status === "canceled" && "line-through decoration-zinc-300")}>
        {label ?? STATUS_LABEL[status]}
      </span>
    </Badge>
  );
}
