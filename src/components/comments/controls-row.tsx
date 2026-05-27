"use client";

import { FilterChip } from "./filter-chip";
import { TypeSwitch } from "./type-switch";
import type { ScopeFilter, TypeFilter } from "./utils";

type ControlsRowProps = {
  typeFilter: TypeFilter;
  onTypeChange: (next: TypeFilter) => void;
  scopeFilter: ScopeFilter;
  onScopeChange: (next: ScopeFilter) => void;
  // Total per type-filter value (`all` / `msg` / `sys`), all-comments wide
  // (before scope is applied). Drives the count badge in the type switch.
  typeCounts: Record<TypeFilter, number>;
  // Per-scope counts *within* the current type filter. Drives chip badges.
  stageCount: number;
  mentionsCount: number;
  // Visible count after both filters apply + a scope label for the right side.
  visibleCount: number;
  scopeLabel: string;
};

export function ControlsRow({
  typeFilter,
  onTypeChange,
  scopeFilter,
  onScopeChange,
  typeCounts,
  stageCount,
  mentionsCount,
  visibleCount,
  scopeLabel,
}: ControlsRowProps) {
  return (
    <div className="relative flex shrink-0 items-center gap-[8px] border-b border-border bg-surface px-[12px] py-[9px]">
      <TypeSwitch value={typeFilter} onChange={onTypeChange} counts={typeCounts} />
      <div className="inline-flex items-center gap-[6px]">
        <FilterChip
          active={scopeFilter === "stage"}
          onClick={() =>
            onScopeChange(scopeFilter === "stage" ? "all" : "stage")
          }
          count={stageCount}
        >
          Current stage
        </FilterChip>
        <FilterChip
          active={scopeFilter === "mentions"}
          onClick={() =>
            onScopeChange(scopeFilter === "mentions" ? "all" : "mentions")
          }
          count={mentionsCount}
        >
          @ Me
        </FilterChip>
      </div>
      <span className="ml-auto font-mono text-[11px] whitespace-nowrap text-muted">
        {visibleCount} · {scopeLabel}
      </span>
    </div>
  );
}
