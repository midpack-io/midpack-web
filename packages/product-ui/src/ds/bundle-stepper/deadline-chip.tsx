import { cn } from "../../lib/utils";
import type { Deadline, DeadlineKind } from "../../lib/types";

const TONE: Record<DeadlineKind, string> = {
  upcoming: "bg-surface-3 text-zinc-700",
  "at-risk": "bg-warn-soft text-warn",
  overdue: "bg-coral-soft text-coral before:content-[''] before:size-[5px] before:rounded-full before:bg-current",
  met: "bg-ok-soft text-ok",
  missed: "bg-coral-soft text-coral line-through",
};

type DeadlineChipProps = {
  deadline: Deadline;
  className?: string;
};

export function DeadlineChip({ deadline, className }: DeadlineChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[3px] rounded-sm px-[5px] py-[2px] font-mono text-[10px] font-medium leading-none tracking-[0.01em]",
        TONE[deadline.kind],
        className,
      )}
    >
      {deadline.label}
    </span>
  );
}
