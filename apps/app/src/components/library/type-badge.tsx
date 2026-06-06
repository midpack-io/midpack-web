import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BASE =
  "h-[18px] gap-[5px] rounded-[4px] px-[6px] py-0 font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.06em]";

// "Live" — a living, shared file. The pulsing dot signals that publishing a new
// version propagates to referencing products.
export function LiveBadge() {
  return (
    <Badge
      className={cn(BASE, "bg-linked/8 text-linked-ink ring-1 ring-inset ring-linked-border")}
    >
      <span className="size-[6px] rounded-full bg-linked live-pulse" aria-hidden />
      Live
    </Badge>
  );
}

// "Blueprint" — a starter file copied on use; edits don't propagate.
export function BlueprintBadge() {
  return (
    <Badge className={cn(BASE, "bg-surface-3 text-zinc-700 ring-1 ring-inset ring-border")}>
      <svg viewBox="0 0 10 10" fill="none" className="size-[9px]" aria-hidden>
        <rect x="1" y="1.5" width="6" height="7" rx="0.6" stroke="currentColor" strokeWidth="1" />
        <rect x="3" y="3.5" width="6" height="5" rx="0.6" stroke="currentColor" strokeWidth="1" fill="var(--color-surface)" />
      </svg>
      Blueprint
    </Badge>
  );
}

// "Workflow" — a pipeline a product runs.
export function WorkflowBadge() {
  return (
    <Badge className={cn(BASE, "bg-accent-soft text-accent-ink ring-1 ring-inset ring-accent-ring")}>
      Workflow
    </Badge>
  );
}
