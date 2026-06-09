"use client";

import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@midpack/ui";

// Selectable tile for the onboarding questions. Two layouts:
//  - "tile"  → icon + label (+ optional hint), check badge top-right.
//  - "check" → wide row with a left checkbox, for the multi-select pains.
// A button (not a div) so keyboard + focus come for free; the parent owns
// radiogroup vs multi semantics via the `multi` flag (aria-pressed/aria-checked).
export interface ChoiceTileProps {
  label: string;
  hint?: string;
  icon?: LucideIcon;
  selected: boolean;
  multi?: boolean;
  variant?: "tile" | "check";
  stack?: boolean; // tile: stack icon above label (used by sizes/industries)
  onSelect: () => void;
}

export function ChoiceTile({
  label,
  hint,
  icon: Icon,
  selected,
  multi = false,
  variant = "tile",
  stack = false,
  onSelect,
}: ChoiceTileProps) {
  const aria = multi
    ? { "aria-pressed": selected }
    : { role: "radio", "aria-checked": selected };

  if (variant === "check") {
    return (
      <button
        type="button"
        {...aria}
        onClick={onSelect}
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-sm leading-snug transition-all duration-200",
          "hover:translate-x-0.5",
          selected
            ? "border-accent-strong bg-accent-soft text-foreground shadow-sm"
            : "border-border bg-surface text-foreground hover:border-border-strong hover:shadow-sm",
        )}
      >
        <span
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-[6px] border transition-all duration-200",
            selected
              ? "border-accent-strong bg-accent-strong text-white"
              : "border-border-strong bg-surface text-transparent group-hover:border-muted",
          )}
        >
          <Check className="size-3" strokeWidth={3} />
        </span>
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      {...aria}
      onClick={onSelect}
      className={cn(
        "group relative flex rounded-lg border px-3.5 py-3 text-left text-sm font-medium transition-all duration-200",
        stack ? "flex-col items-start gap-2" : "items-center gap-3",
        "hover:-translate-y-0.5",
        selected
          ? "border-accent-strong bg-accent-soft text-foreground shadow-sm ring-1 ring-accent-strong"
          : "border-border bg-surface text-foreground hover:border-border-strong hover:shadow-md",
      )}
    >
      {Icon && (
        <span
          className={cn(
            "transition-colors duration-200",
            selected ? "text-accent-ink" : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          <Icon className="size-[18px]" strokeWidth={1.6} />
        </span>
      )}
      <span className="flex flex-col leading-tight">
        {label}
        {hint && (
          <span className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground">
            {hint}
          </span>
        )}
      </span>

      {/* selected tick */}
      <span
        className={cn(
          "absolute right-2.5 top-2.5 grid size-4 place-items-center rounded-full bg-accent-strong text-white transition-all duration-200",
          selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        <Check className="size-2.5" strokeWidth={3} />
      </span>
    </button>
  );
}
