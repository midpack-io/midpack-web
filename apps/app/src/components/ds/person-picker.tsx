"use client";

import { useState, type ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AVATAR_GRADIENT } from "@/components/ds/avatar-gradient";
import { usePeople } from "@/hooks/usePeople";
import type { Person, PersonId } from "@/lib/api/types";
import { cn } from "@/lib/utils";

// Shared people picker — used by both the detail-bar's PersonField and the
// stepper pill's avatar slot. The visual shell (Popover, listbox layout,
// Unassigned row, role tag) lives here so the two triggers can stay tiny
// and entirely focused on their own affordances.

type PersonPickerProps = {
  value: PersonId | "unassigned" | undefined;
  onChange: (next: PersonId | "unassigned") => void;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  // Notifier for the parent — fires whenever the picker toggles open/closed.
  // Used by the stepper pill to keep its hover-preview alive while the picker
  // is open and to coordinate the post-selection retreat.
  onOpenChange?: (open: boolean) => void;
  // The trigger element. Passed through Radix `asChild` — must accept a ref
  // and arbitrary DOM props (a forwardRef'd button/span works well).
  children: ReactNode;
};

export function PersonPicker({
  value,
  onChange,
  align = "start",
  side = "bottom",
  onOpenChange,
  children,
}: PersonPickerProps) {
  const [open, setOpen] = useState(false);
  const people = usePeople();
  const isSet = value !== undefined && value !== "unassigned";
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={6}
        // Suppress the focus restore so the trigger doesn't end up with a
        // lingering focus ring after a click-driven pick — mirrors the
        // status-selector convention.
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="w-[240px] p-[6px]"
        onClick={(event) => event.stopPropagation()}
      >
        <ul role="listbox" className="flex flex-col gap-[1px]">
          <li>
            <PickerRow
              selected={!isSet}
              onClick={() => {
                onChange("unassigned");
                handleOpenChange(false);
              }}
            >
              <span
                aria-hidden
                className="size-[20px] rounded-full border border-dashed border-border-strong"
              />
              <span className="text-zinc-500">Не призначено</span>
            </PickerRow>
          </li>
          {people.data?.map((p) => (
            <li key={p.id}>
              <PickerRow
                selected={p.id === value}
                onClick={() => {
                  onChange(p.id);
                  handleOpenChange(false);
                }}
              >
                <AvatarDot person={p} size={20} />
                <span className="flex-1 truncate text-foreground">{p.name}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-zinc-400">
                  {p.role}
                </span>
              </PickerRow>
            </li>
          ))}
          {people.isLoading && (
            <li className="px-[8px] py-[6px] text-xs text-zinc-400">Завантаження…</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function AvatarDot({
  person,
  size = 18,
}: {
  person: Person;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "inline-flex items-center justify-center rounded-full text-[9.5px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",
        AVATAR_GRADIENT[person.avatarKey],
      )}
    >
      {person.initial}
    </span>
  );
}

function PickerRow({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-[8px] rounded-[8px] px-[8px] py-[6px] text-left text-base transition-colors",
        "hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none",
        selected && "bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
