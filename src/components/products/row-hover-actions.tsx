"use client";

import { ExternalLink, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type RowHoverActionsProps = {
  href: string;
  className?: string;
};

// Open-in-new-tab + kebab dropdown. Both stop event propagation so the parent
// row's click handler doesn't navigate.
export function RowHoverActions({ href, className }: RowHoverActionsProps) {
  return (
    <div
      className={cn(
        "row-hover-actions flex items-center gap-[4px] opacity-0 -translate-x-[3px] transition-all duration-150 group-hover/row:opacity-100 group-hover/row:translate-x-0",
        className,
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open in new tab"
        onClick={(e) => e.stopPropagation()}
        className="flex size-[26px] items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-surface-3 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
      >
        <ExternalLink className="size-[13px]" strokeWidth={1.8} />
      </a>
      {/* modal={false} keeps the page scroll container intact while open —
          otherwise Radix sets body overflow:hidden and breaks position:sticky
          on the page top bar. The menu still dismisses on outside click. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Опції"
            onClick={(e) => e.stopPropagation()}
            className="flex size-[26px] items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-surface-3 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
          >
            <MoreHorizontal className="size-[14px]" strokeWidth={1.8} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[170px]">
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Відкрити</DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Дублювати</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Архівувати</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
