"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { TypeFilter } from "./utils";

const OPTIONS: Array<{
  value: TypeFilter;
  label: string;
  sub: string;
}> = [
  { value: "all", label: "All", sub: "Comments + activity" },
  { value: "msg", label: "Comments", sub: "Human messages only" },
  { value: "sys", label: "Activity", sub: "System events · file updates" },
];

const LABELS: Record<TypeFilter, string> = {
  all: "All",
  msg: "Comments",
  sys: "Activity",
};

type TypeSwitchProps = {
  value: TypeFilter;
  onChange: (next: TypeFilter) => void;
  counts: Record<TypeFilter, number>;
};

export function TypeSwitch({ value, onChange, counts }: TypeSwitchProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-[28px] items-center gap-[6px] rounded-[6px] border border-border bg-surface pr-[8px] pl-[10px] text-[12.5px] leading-none text-zinc-700 transition-colors hover:border-muted data-[state=open]:border-foreground data-[state=open]:shadow-[0_0_0_3px_var(--color-surface-3)]"
        >
          <span className="text-muted">Showing</span>
          <span className="font-medium text-foreground">{LABELS[value]}</span>
          <span className="ml-[2px] rounded-[3px] bg-surface-3 px-[5px] py-[1px] font-mono text-[10.5px] text-zinc-600">
            {counts[value]}
          </span>
          <ChevronDown className="ml-[2px] size-[10px] text-muted" strokeWidth={1.6} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="min-w-[240px] rounded-[9px] border-border bg-surface p-[4px] shadow-md"
      >
        {OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => onChange(opt.value)}
            className={cn(
              "grid grid-cols-[1fr_auto] grid-rows-[auto_auto] items-center gap-x-[10px] gap-y-[1px] rounded-[6px] px-[10px] py-[8px] focus:bg-surface-2",
              value === opt.value && "bg-surface-3 focus:bg-surface-3",
            )}
          >
            <span className="col-start-1 row-start-1 text-[13px] font-medium text-foreground">
              {opt.label}
            </span>
            <span className="col-start-1 row-start-2 text-[11.5px] text-muted">
              {opt.sub}
            </span>
            <span
              className={cn(
                "col-start-2 row-start-1 row-end-3 rounded-[4px] px-[7px] py-[2px] font-mono text-[11px]",
                value === opt.value
                  ? "bg-foreground text-white"
                  : "bg-surface-3 text-zinc-600",
              )}
            >
              {counts[opt.value]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
