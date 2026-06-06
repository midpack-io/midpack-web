"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useLibraryUsage } from "@/hooks/useLibraryUsage";
import type { LibraryKind } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type UsageChipProps = {
  kind: LibraryKind;
  id: string;
  count: number;
  verb: string;
};

// The clickable usage chip in a card foot. Opens a popover listing the active
// products using this item (name, collection, current stage) — so the user can
// judge blast radius before changing or removing it.
export function UsageChip({ kind, id, count, verb }: UsageChipProps) {
  const [open, setOpen] = useState(false);
  const usage = useLibraryUsage(kind, open ? id : null);
  const zero = count === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex items-center gap-[5px] rounded-[5px] border border-border bg-surface px-[7px] py-[2px] font-mono text-[11px] font-semibold leading-none transition-colors hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring",
            zero ? "text-zinc-400" : "text-foreground",
          )}
        >
          <span className="tabular-nums">{count}</span>
          <span
            className={cn(
              "text-[10.5px] font-medium uppercase tracking-[0.04em]",
              zero ? "text-zinc-400" : "text-zinc-500",
            )}
          >
            {verb}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[300px] p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-[14px] py-[10px]">
          <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em] text-zinc-400">
            {count} {verb}
          </div>
        </div>
        <div className="max-h-[280px] overflow-y-auto p-[6px]">
          {usage.isLoading && (
            <div className="flex flex-col gap-[6px] p-[6px]">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-[34px] w-full rounded-md" />
              ))}
            </div>
          )}
          {usage.isError && (
            <div className="flex flex-col items-start gap-[6px] p-[10px] text-[12px] text-zinc-500">
              <span>Couldn&apos;t load the usage list.</span>
              <button
                type="button"
                onClick={() => usage.refetch()}
                className="font-medium text-accent-strong hover:underline"
              >
                Retry
              </button>
            </div>
          )}
          {usage.data && usage.data.length === 0 && (
            <div className="p-[10px] text-[12px] text-zinc-500">
              No active products use this yet.
            </div>
          )}
          {usage.data?.map((ref) => (
            <div
              key={ref.productId}
              className="flex flex-col gap-[2px] rounded-md px-[8px] py-[6px] hover:bg-surface-2"
            >
              <span className="truncate text-[12.5px] font-medium text-foreground">
                {ref.productName}
              </span>
              <span className="truncate text-[11px] text-zinc-500">
                {ref.collectionName} · {ref.stage}
              </span>
            </div>
          ))}
          {usage.data && usage.data.length < count && (
            <div className="px-[8px] py-[6px] text-[11px] text-zinc-400">
              Showing {usage.data.length} of {count}.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
