import { cn } from "@/lib/utils";
import type { ProgressTone } from "@/lib/api/types";

type ProgressTrackProps = {
  pct: number;
  tone: ProgressTone;
  className?: string;
  trackClassName?: string;
};

const toneClass: Record<ProgressTone, string> = {
  low: "bg-[linear-gradient(90deg,#6b6b73_0%,#8a8a91_100%)]",
  mid: "bg-[linear-gradient(90deg,#4f46e5_0%,#6960ea_100%)]",
  high: "bg-[linear-gradient(90deg,#2f7a4a_0%,#3f9460_100%)]",
};

export function ProgressTrack({
  pct,
  tone,
  className,
  trackClassName,
}: ProgressTrackProps) {
  const clamped = Math.max(0, Math.min(100, pct));
  const isZero = clamped === 0;
  return (
    <div className={cn("flex items-center gap-[12px]", className)}>
      <div
        className={cn(
          "relative h-[6px] flex-1 overflow-hidden rounded-[3px] bg-surface-3",
          trackClassName,
        )}
      >
        <div
          className={cn(
            "h-full rounded-[3px] transition-[width] duration-300",
            isZero ? "bg-zinc-300" : toneClass[tone],
          )}
          style={{ width: isZero ? "4px" : `${clamped}%` }}
        />
      </div>
      <span className="min-w-[42px] text-right font-mono text-base text-zinc-700 tabular-nums">
        {clamped}%
      </span>
    </div>
  );
}
