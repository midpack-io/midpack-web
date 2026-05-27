"use client";

import { Check, ChevronDown, X, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type FilterMultiselectOption = {
  label: string;
  value: string;
  icon?: LucideIcon;
};

type FilterMultiselectProps = {
  label: string;
  options: FilterMultiselectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  // Shown in the trigger when no values are selected. Defaults to "Any".
  emptyLabel?: string;
  disabled?: boolean;
  align?: "start" | "end";
  menuClassName?: string;
  // When provided, renders a "Remove filter" footer item in the menu so the
  // caller can drop the whole filter (not just clear its values). Used by the
  // products workspace for dynamically-added custom-field chips.
  onRemove?: () => void;
};

// `Label: Value ▾` multi-select trigger. Mirrors the visual shape of
// `FilterDropdown` (the single-select sibling) so the two read as one family
// of controls inside a filter bar. When more than one option is selected, the
// trigger shows the first label as text plus a `+N` count chip — keeps the
// bar compact regardless of how many values are picked.
export function FilterMultiselect({
  label,
  options,
  values,
  onChange,
  emptyLabel = "Будь-які",
  disabled,
  align = "end",
  menuClassName,
  onRemove,
}: FilterMultiselectProps) {
  const selectedLabels = options.filter((o) => values.includes(o.value)).map((o) => o.label);
  const selectedCount = selectedLabels.length;
  const singleLabel = selectedCount === 1 ? selectedLabels[0] : undefined;

  const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "flex h-[28px] items-center gap-[6px] rounded-md border border-transparent px-[8px] text-sm leading-none text-zinc-700 outline-none transition-colors hover:border-border hover:bg-surface focus-visible:ring-[3px] focus-visible:ring-accent-ring",
            disabled &&
              "cursor-default text-zinc-400 hover:border-transparent hover:bg-transparent",
          )}
        >
          <span className="text-zinc-400">{label}:</span>
          {selectedCount === 0 && (
            <span className="font-medium text-foreground">{emptyLabel}</span>
          )}
          {selectedCount === 1 && (
            <span className="font-medium text-foreground">{singleLabel}</span>
          )}
          {selectedCount > 1 && (
            <span className="rounded-sm bg-primary px-[6px] py-[1.5px] font-mono text-[10.5px] font-medium tabular-nums text-primary-foreground">
              {selectedCount}
            </span>
          )}
          <ChevronDown className="size-[12px] text-zinc-400" strokeWidth={1.8} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        // Don't restore focus to the trigger when the menu closes — avoids
        // a lingering focus ring after select / outside-click.
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn("min-w-[220px]", menuClassName)}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isChecked = values.includes(opt.value);
          return (
            <DropdownMenuItem
              key={opt.value}
              // Keep the menu open while the user picks multiple values.
              onSelect={(e) => {
                e.preventDefault();
                toggle(opt.value);
              }}
              className="gap-[10px] text-sm"
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-[14px] items-center justify-center rounded-[3px] border transition-colors",
                  isChecked
                    ? "border-foreground bg-foreground text-white"
                    : "border-border-strong bg-surface text-transparent",
                )}
              >
                <Check className="size-[10px]" strokeWidth={3} />
              </span>
              {Icon && <Icon className="size-[14px] text-zinc-500" strokeWidth={1.8} />}
              {opt.label}
            </DropdownMenuItem>
          );
        })}
        {onRemove && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => onRemove()}
              className="gap-[10px] text-sm text-zinc-500"
            >
              <X className="size-[14px]" strokeWidth={1.8} />
              Видалити фільтр
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
