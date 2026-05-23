"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type FilterDropdownOption = {
  label: string;
  // If provided, this is what's passed to onSelect; otherwise `label` is.
  value?: string;
  icon?: LucideIcon;
};

type FilterDropdownProps = {
  label: string;
  value: string;
  options: FilterDropdownOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  align?: "start" | "end";
  // When true, render the selected option's icon next to the value in the trigger.
  showSelectedIcon?: boolean;
  // When true, hide the currently-active option from the dropdown menu list.
  hideActiveOption?: boolean;
  menuClassName?: string;
};

// `Label: Value ▾` trigger with a Radix dropdown menu of options.
// Used on both the collections and products filter bars.
export function FilterDropdown({
  label,
  value,
  options,
  onSelect,
  disabled,
  align = "end",
  showSelectedIcon,
  hideActiveOption,
  menuClassName,
}: FilterDropdownProps) {
  const selected = options.find((o) => (o.value ?? o.label) === value || o.label === value);
  const SelectedIcon = showSelectedIcon ? selected?.icon : undefined;
  const visibleOptions = hideActiveOption
    ? options.filter((o) => (o.value ?? o.label) !== value && o.label !== value)
    : options;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "flex h-[28px] items-center gap-[6px] rounded-md border border-transparent px-[8px] text-sm text-zinc-700 outline-none transition-colors hover:border-border hover:bg-surface focus-visible:ring-[3px] focus-visible:ring-accent-ring",
            disabled &&
              "cursor-default text-zinc-400 hover:border-transparent hover:bg-transparent",
          )}
        >
          <span className="text-zinc-400">{label}:</span>
          <span className="flex items-center gap-[6px] font-medium text-foreground">
            {SelectedIcon && (
              <SelectedIcon className="size-[14px] text-zinc-500" strokeWidth={1.8} />
            )}
            {value}
          </span>
          <ChevronDown className="size-[12px] text-zinc-400" strokeWidth={1.8} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        // Don't restore focus to the trigger when the menu closes — avoids
        // a lingering focus ring after select / outside-click.
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn("min-w-[200px]", menuClassName)}
      >
        {visibleOptions.map(({ label: optLabel, icon: Icon, value: optValue }) => (
          <DropdownMenuItem
            key={optLabel}
            className="text-sm"
            onSelect={() => onSelect(optValue ?? optLabel)}
          >
            {Icon && <Icon className="size-[14px] text-zinc-500" strokeWidth={1.8} />}
            {optLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
