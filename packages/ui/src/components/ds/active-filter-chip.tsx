"use client";

import type * as React from "react";
import { X } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

type ActiveFilterChipProps = {
  // Uppercase mono prefix, e.g. "TAG" / "ETAP".
  label: string;
  value: React.ReactNode;
  onRemove: () => void;
  className?: string;
};

// A removable `LABEL value ×` chip — the single source of truth for an active
// filter. Mirrors the CfChip visual so it reads as the same family.
export function ActiveFilterChip({ label, value, onRemove, className }: ActiveFilterChipProps) {
  return (
    <Badge
      variant="ghost"
      className={cn(
        "gap-[6px] overflow-visible whitespace-nowrap rounded-sm border border-border bg-surface py-[3px] pr-[3px] pl-2 text-[12.5px] font-normal text-foreground",
        className,
      )}
    >
      <span className="font-mono text-[12.5px] uppercase tracking-[0.04em] text-zinc-400">
        {label}
      </span>
      <span className="font-mono text-[12.5px] font-medium text-foreground">{value}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Прибрати фільтр: ${label}`}
        className="ml-[1px] flex size-[16px] items-center justify-center rounded-[3px] text-zinc-400 transition-colors hover:bg-surface-3 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-accent-ring focus-visible:outline-none"
      >
        <X className="size-[11px]" strokeWidth={2} />
      </button>
    </Badge>
  );
}
