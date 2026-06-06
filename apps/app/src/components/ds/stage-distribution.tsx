"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getStageBackground, getStageColor } from "./stage-theme";
import type { Stage } from "@/lib/api/types";

type StageDistributionProps = {
  distribution: Record<Stage, number>;
  hideLegend?: boolean;
  className?: string;
};

// Canonical stage order — matches the workflow defined in products.ts.
const STAGES: Stage[] = [
  "idea",
  "sketch",
  "techpack",
  "procurement",
  "patterns",
  "pattern-review",
  "sample",
  "fitting",
  "grading",
  "production",
];

// Ukrainian labels — abbreviated to fit the 3-column legend cell width.
const STAGE_LABEL: Record<Stage, string> = {
  idea: "Ідея",
  sketch: "Ескізи",
  techpack: "Тех-пак",
  procurement: "Закупівля",
  patterns: "Лекала",
  "pattern-review": "Перев. лекал",
  sample: "Зразок",
  fitting: "Примірка",
  grading: "Градація",
  production: "Виробництво",
};

export function StageDistribution({
  distribution,
  hideLegend = false,
  className,
}: StageDistributionProps) {
  const [hovered, setHovered] = useState<Stage | null>(null);
  const total = STAGES.reduce((sum, s) => sum + (distribution[s] ?? 0), 0);

  return (
    <div className={cn("flex flex-col gap-[18px]", className)}>
      {/* Strip — only renders stages with at least 1 product. Empty stages
          are skipped entirely; the legend below still lists all 9. */}
      <div className="flex h-[14px] items-stretch gap-[2px] rounded-[4px] bg-surface-3 p-[1px]">
        {STAGES.filter((s) => (distribution[s] ?? 0) > 0).map((s) => {
          const n = distribution[s] ?? 0;
          const isHovered = hovered === s;
          // Flex-grow proportional to count. Use flex-basis 0 + flex-grow N
          // so each non-empty segment takes the same baseline + extra per count.
          // Hover grows the segment via direct height change (not scaleY) so
          // the background pattern keeps its native pixel size.
          return (
            <div
              key={s}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "self-center rounded-[4px] transition-[height,box-shadow,filter] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                isHovered
                  ? "h-[20px] relative z-10 shadow-sm brightness-105"
                  : "h-[12px]",
              )}
              style={{
                background: getStageBackground(s),
                flexGrow: n,
                flexBasis: 0,
              }}
              aria-label={`${STAGE_LABEL[s]}: ${n}`}
            />
          );
        })}
      </div>

      {/* Legend — 3-column grid */}
      {!hideLegend && (
      <div className="grid grid-cols-3 gap-[6px]">
        {STAGES.map((s) => {
          const n = distribution[s] ?? 0;
          const isEmpty = n === 0;
          const isHovered = hovered === s;
          return (
            <div
              key={s}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "relative flex flex-col rounded-[6px] border px-2 pt-[6px] pb-[7px] transition-all duration-150",
                isEmpty
                  ? "border-dashed border-zinc-300 bg-transparent opacity-60"
                  : "border-border bg-surface-2",
                isHovered && !isEmpty && "-translate-y-[1px] bg-surface",
                isHovered && isEmpty && "opacity-100",
              )}
              style={
                isHovered && !isEmpty
                  ? { borderColor: getStageColor(s) }
                  : undefined
              }
            >
              <div
                className={cn(
                  "absolute right-[6px] top-[6px] h-[8px] w-[8px] rounded-[1.5px] transition-transform duration-150",
                  isHovered && !isEmpty && "scale-[1.4]",
                  isEmpty && "opacity-50",
                )}
                style={{ background: getStageBackground(s) }}
              />
              <span
                className={cn(
                  "font-mono text-lg font-semibold leading-none tabular-nums",
                  isEmpty ? "text-zinc-400" : "text-foreground",
                )}
              >
                {n}
              </span>
              <div className="mt-[6px]">
                <span className="font-mono text-xs uppercase tracking-[0.05em] text-zinc-500">
                  {STAGE_LABEL[s]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* sr-only total — accessible summary */}
      <span className="sr-only">{total} products across stages</span>
    </div>
  );
}
