"use client";

import { useState } from "react";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { formatDeadline, type DeadlineVariant } from "../lib/time";
import { cn } from "../lib/utils";

type DateFieldProps = {
  value: string;
  onChange: (next: string) => void;
  variant?: DeadlineVariant;
  label?: string;
  className?: string;
  ariaLabel?: string;
};

// YYYY-MM-DD ⇄ local Date. We can't round-trip through `new Date(value)` for
// the calendar's `selected` prop because that parses as UTC midnight, which is
// the previous day in negative-offset zones and would highlight the wrong cell.
function parseLocalDate(value: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DateField({
  value,
  onChange,
  variant,
  label,
  className,
  ariaLabel,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);

  const isSet = !!value;
  const selected = parseLocalDate(value);
  const derived = isSet ? formatDeadline(new Date(value).toISOString()) : null;
  const finalVariant = variant ?? derived?.variant ?? "default";
  const text = derived?.text ?? "—";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          asChild
          variant="ghost"
          className={cn(
            "items-baseline gap-[10px] rounded-[14px] border border-transparent bg-transparent px-3 py-[3px]",
            "font-mono text-[12.5px] font-normal leading-none",
            "transition-[background-color,border-color,box-shadow] duration-100",
            "hover:bg-surface hover:border-border-strong hover:shadow-sm",
            "focus-visible:bg-surface focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-ring",
            "data-[state=open]:bg-surface data-[state=open]:border-border-strong data-[state=open]:shadow-sm",
            !isSet && "text-zinc-400",
            isSet && finalVariant === "default" && "text-zinc-700",
            isSet && finalVariant === "at-risk" && "text-warn",
            isSet && finalVariant === "overdue" && "text-coral font-semibold",
            className,
          )}
        >
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label={
              ariaLabel ?? (isSet ? `Редагувати дату, зараз ${text}` : "Встановити дату")
            }
          >
            {label && (
              <span className="font-mono text-xs font-medium uppercase tracking-[0.07em] text-zinc-400">
                {label}
              </span>
            )}
            <span>{text}</span>
          </button>
        </Badge>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-auto p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onChange(date ? formatLocalDate(date) : "");
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
