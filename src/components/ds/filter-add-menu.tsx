"use client";

import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type FilterAddOption = {
  value: string;
  label: string;
};

type FilterAddMenuProps = {
  options: FilterAddOption[];
  onSelect: (value: string) => void;
  // Trigger label. Defaults to "Add filter".
  label?: string;
  align?: "start" | "end";
  disabled?: boolean;
  menuClassName?: string;
};

// Trigger that opens a list of inactive filters the user can promote to the
// bar. Disappears (renders disabled) when `options` is empty — i.e. every
// available filter is already showing.
export function FilterAddMenu({
  options,
  onSelect,
  label = "Фільтр",
  align = "end",
  disabled,
  menuClassName,
}: FilterAddMenuProps) {
  const isDisabled = disabled || options.length === 0;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={isDisabled}>
        <button
          type="button"
          className={cn(
            "flex h-[28px] items-center gap-[6px] rounded-md border border-dashed border-border px-[8px] text-sm leading-none text-zinc-500 outline-none transition-colors hover:border-border-strong hover:bg-surface hover:text-zinc-700 focus-visible:ring-[3px] focus-visible:ring-accent-ring",
            isDisabled &&
              "cursor-default text-zinc-400 hover:border-border hover:bg-transparent hover:text-zinc-400",
          )}
        >
          <Plus className="size-[12px]" strokeWidth={1.8} />
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn("min-w-[180px]", menuClassName)}
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => onSelect(opt.value)}
            className="text-sm"
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
