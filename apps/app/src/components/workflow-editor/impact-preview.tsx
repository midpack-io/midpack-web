"use client";

import { ChevronDown, ShieldCheck } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SAMPLE_USAGE } from "./sample-data";

// The signature trust moment. Publishing a template never rewrites products
// already running it — each stays pinned to the revision it started on. This
// popover is the editor's calm answer to "will publishing break what's running?"
export function ImpactPreview({ hasUnpublishedChanges }: { hasUnpublishedChanges: boolean }) {
  const count = SAMPLE_USAGE.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group/impact inline-flex h-[32px] items-center gap-[7px] rounded-md border border-border bg-surface pl-[9px] pr-[8px] text-[12px] leading-none text-zinc-600 outline-none transition-colors duration-150",
            "hover:border-zinc-400 hover:bg-surface-2 focus-visible:ring-[3px] focus-visible:ring-accent-ring",
          )}
        >
          <ShieldCheck className="size-[14px] text-ok" strokeWidth={1.8} />
          <span className="font-medium text-foreground tabular-nums">{count}</span>
          <span className="text-zinc-500">продуктів у роботі</span>
          <ChevronDown
            className="size-[13px] text-zinc-400 transition-transform duration-200 group-data-[state=open]/impact:rotate-180"
            strokeWidth={1.8}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="w-[336px] p-0">
        {/* Reassurance header */}
        <div className="flex gap-[10px] border-b border-border bg-surface-2 px-[14px] py-[12px]">
          <span className="mt-[1px] inline-flex size-[28px] shrink-0 items-center justify-center rounded-full bg-ok-soft text-ok">
            <ShieldCheck className="size-[16px]" strokeWidth={1.9} />
          </span>
          <div className="flex flex-col gap-[3px]">
            <p className="text-[12.5px] font-semibold leading-snug text-foreground">
              Публікація не змінює запущені продукти
            </p>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              {count} активних продуктів виконують цей шаблон. Кожен лишається на
              ревізії, з якою стартував — зміни підхоплять лише нові продукти.
            </p>
          </div>
        </div>

        {/* Product list */}
        <div className="max-h-[244px] overflow-y-auto px-[8px] py-[8px]">
          <ul className="flex flex-col gap-[1px]">
            {SAMPLE_USAGE.map((p) => (
              <li
                key={p.productId}
                className="flex items-center gap-[10px] rounded-[7px] px-[8px] py-[7px] transition-colors hover:bg-surface-2"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[12px] font-medium leading-tight text-foreground">
                    {p.productName}
                  </span>
                  <span className="truncate text-[10.5px] leading-tight text-zinc-400">
                    {p.collectionName} · {p.stage}
                  </span>
                </div>
                <span className="shrink-0 rounded-[4px] bg-surface-3 px-[6px] py-[2px] font-mono text-[9.5px] font-semibold text-zinc-500">
                  pinned v{p.pinnedRevision}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {hasUnpublishedChanges && (
          <div className="border-t border-border px-[14px] py-[9px]">
            <p className="text-[10.5px] leading-relaxed text-zinc-500">
              Публікація створить нову ревізію. Перелічені продукти її{" "}
              <span className="font-semibold text-foreground">не</span> отримають.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
