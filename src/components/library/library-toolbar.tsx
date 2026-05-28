"use client";

import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import type { LibraryItemStatus, LibrarySort } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export type StatusFilter = LibraryItemStatus | "all";

const SORT_LABELS: Record<LibrarySort, string> = {
  updated_desc: "Last updated",
  name_asc: "Name A→Z",
  usage_desc: "Most used",
};

type LibraryToolbarProps = {
  searchPlaceholder: string;
  search: string;
  onSearchChange: (v: string) => void;
  filter: StatusFilter;
  onFilterChange: (f: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
  sort: LibrarySort;
  onSortChange: (s: LibrarySort) => void;
};

const SEGMENTS: { id: StatusFilter; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
  { id: "all", label: "All" },
];

export function LibraryToolbar({
  searchPlaceholder,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  counts,
  sort,
  onSortChange,
}: LibraryToolbarProps) {
  return (
    <div className="mb-[16px] flex flex-wrap items-center gap-[8px]">
      <div className="relative w-[280px]">
        <Search
          className="pointer-events-none absolute left-[10px] top-1/2 size-[13px] -translate-y-1/2 text-zinc-400"
          strokeWidth={1.6}
        />
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-[32px] rounded-[7px] pl-[30px] text-[12.5px]"
        />
      </div>

      <div className="inline-flex h-[32px] items-center rounded-[7px] border border-border bg-surface-2 p-[2px]">
        {SEGMENTS.map((seg) => (
          <button
            key={seg.id}
            type="button"
            onClick={() => onFilterChange(seg.id)}
            className={cn(
              "inline-flex h-[26px] items-center gap-[5px] rounded-[5px] px-[10px] text-[12px] font-medium leading-none transition-colors",
              filter === seg.id
                ? "bg-surface text-foreground shadow-sm"
                : "text-zinc-500 hover:text-foreground",
            )}
          >
            {seg.label}
            <span className="font-mono text-[10px] tabular-nums text-zinc-400">
              {counts[seg.id]}
            </span>
          </button>
        ))}
      </div>

      <span className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-[32px] items-center gap-[6px] rounded-[7px] border border-border bg-surface px-[10px] text-[12px] text-zinc-700 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
          >
            {SORT_LABELS[sort]}
            <ChevronDown className="size-[11px] text-zinc-400" strokeWidth={1.6} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={(v) => onSortChange(v as LibrarySort)}
          >
            {(Object.keys(SORT_LABELS) as LibrarySort[]).map((key) => (
              <DropdownMenuRadioItem key={key} value={key}>
                {SORT_LABELS[key]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
