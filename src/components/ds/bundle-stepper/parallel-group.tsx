import { cn } from "@/lib/utils";
import type { StageInstance } from "@/lib/api/types";
import { StepperPill } from "./stepper-pill";

type ParallelGroupProps = {
  pills: StageInstance[];
  // Stage `n` values that should render their status chip. Computed by the
  // top-level stepper so the "first todo" rule sees all stages, not just the
  // ones inside this parallel group.
  showStatusByN?: Set<string>;
  className?: string;
};

// Bracket frame + vertical stack of compact pills.
// Connectors before/after the group should be drawn by the parent (split/merge).
export function ParallelGroup({
  pills,
  showStatusByN,
  className,
}: ParallelGroupProps) {
  return (
    <span className={cn("relative inline-flex shrink-0 flex-col gap-[4px] px-[4px]", className)}>
      {/* Bracket marks left + right */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[3px] top-[14px] bottom-[14px] w-[6px] rounded-l-[4px] border border-border-strong border-r-0"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[3px] top-[14px] bottom-[14px] w-[6px] rounded-r-[4px] border border-border-strong border-l-0"
      />
      {pills.map((stage) => (
        <StepperPill
          key={stage.n}
          stage={stage}
          size="compact"
          showStatus={showStatusByN?.has(stage.n)}
        />
      ))}
    </span>
  );
}
