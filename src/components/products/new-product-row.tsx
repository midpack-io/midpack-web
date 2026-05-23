"use client";

import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NewProductRowProps = {
  onClick?: () => void;
  className?: string;
};

// Dashed-border tile rendered at the end of the products list.
export function NewProductRow({ onClick, className }: NewProductRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/new-row flex w-full items-center gap-[14px] rounded-[12px] border border-dashed border-border-strong bg-transparent px-[18px] py-[14px] text-left transition-colors hover:border-zinc-400 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring",
        className,
      )}
    >
      <span className="flex size-[40px] items-center justify-center rounded-full border border-dashed border-border-strong bg-surface text-zinc-400 transition-colors group-hover/new-row:border-zinc-400 group-hover/new-row:text-foreground">
        <Plus className="size-[18px]" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-base font-medium text-zinc-700 transition-colors group-hover/new-row:text-foreground">
          Додати стиль
        </div>
        <div className="mt-[2px] text-sm text-zinc-400">
          З нуля або з шаблону колекції
        </div>
      </div>
      <div className="flex items-center gap-[6px]">
        <Badge variant="ghost" className="rounded-md border border-border bg-surface px-[8px] py-[3px] font-mono text-[10.5px] uppercase tracking-[0.04em] text-zinc-500">
          Outerwear
        </Badge>
        <Badge variant="ghost" className="rounded-md border border-border bg-surface px-[8px] py-[3px] font-mono text-[10.5px] uppercase tracking-[0.04em] text-zinc-500">
          Dress
        </Badge>
        <Badge variant="ghost" className="rounded-md border border-border bg-surface px-[8px] py-[3px] font-mono text-[10.5px] uppercase tracking-[0.04em] text-zinc-500">
          Knit
        </Badge>
      </div>
    </button>
  );
}
