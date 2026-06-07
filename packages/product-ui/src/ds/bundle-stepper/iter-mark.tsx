import { RotateCw } from "lucide-react";
import { cn } from "../../lib/utils";

type IterMarkProps = {
  count: number;
  className?: string;
};

// Round-trip glyph + iteration count badge, e.g. ↻2.
// Used on pills whose stage has cycled (returned/reopened) to show the round count.
export function IterMark({ count, className }: IterMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[2px] rounded-sm border border-accent-ring bg-accent-soft px-[3px] py-px font-mono text-[10.5px] font-semibold leading-none tracking-[0.02em] text-accent-ink",
        className,
      )}
    >
      <RotateCw className="size-[10px]" strokeWidth={2} />
      <b className="font-semibold">{count}</b>
    </span>
  );
}
