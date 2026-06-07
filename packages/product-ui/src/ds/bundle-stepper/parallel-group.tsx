import { cn } from "../../lib/utils";
import type { PersonId, StageInstance, StageStatus } from "../../lib/types";
import { StepperPill } from "./stepper-pill";

type ParallelGroupProps = {
  pills: StageInstance[];
  // The stepper's mode — threaded down so each compact pill knows whether to
  // engage hover-preview (info) or selection (tabs).
  mode?: "tabs" | "info";
  // Stage `n` values considered "active" — computed by the top-level stepper
  // from the full stage list so the predecessor check sees stages outside this
  // group. See `isStageActive` in ./index.tsx.
  activeByN?: Set<string>;
  // Selection state threaded from the top-level stepper. When defined, the
  // compact pill whose `n` matches renders selected; the onClick wires the
  // pill back to the stepper's selection callback.
  selectedStageN?: string;
  onSelectStage?: (n: string) => void;
  // Wires the per-pill status chip up to the StatusSelector. Called with the
  // pill's `n` plus the chosen status.
  onStatusChange?: (n: string, next: StageStatus) => void;
  // Wires the per-pill avatar slot up to the PersonPicker. Called with the
  // pill's `n` plus the chosen performer (or "unassigned").
  onPerformerChange?: (n: string, next: PersonId | "unassigned") => void;
  // Wires the per-pill lock mark — when defined, the lock icon on a locked
  // pill becomes a click-to-unlock button. Called with the pill's `n`.
  onUnlock?: (n: string) => void;
  className?: string;
};

// Bracket frame + vertical stack of compact pills.
// Connectors before/after the group should be drawn by the parent (split/merge).
export function ParallelGroup({
  pills,
  mode,
  activeByN,
  selectedStageN,
  onSelectStage,
  onStatusChange,
  onPerformerChange,
  onUnlock,
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
          mode={mode}
          isActive={activeByN?.has(stage.n)}
          selected={selectedStageN === stage.n}
          onClick={onSelectStage ? () => onSelectStage(stage.n) : undefined}
          onStatusChange={
            onStatusChange
              ? (next) => onStatusChange(stage.n, next)
              : undefined
          }
          onPerformerChange={
            onPerformerChange
              ? (next) => onPerformerChange(stage.n, next)
              : undefined
          }
          onUnlock={onUnlock ? () => onUnlock(stage.n) : undefined}
        />
      ))}
    </span>
  );
}
