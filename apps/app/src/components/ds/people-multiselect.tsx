"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AvatarDot } from "@/components/ds/person-picker";
import { usePeople } from "@/hooks/usePeople";
import type { Person, PersonId } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type PeopleMultiselectProps = {
  label: string;
  values: PersonId[];
  onChange: (values: PersonId[]) => void;
  // Current user — sorted first and flagged "ви". The concept's "Me" fast-path.
  meId?: PersonId;
  emptyLabel?: string;
  align?: "start" | "end";
};

// Multi-select people picker whose trigger shows the selection as a stacked
// avatar strip (the products bar's Assignee control). Deliberately NOT built on
// PersonPicker — that one is single-select and closes on each pick.
export function PeopleMultiselect({
  label,
  values,
  onChange,
  meId,
  emptyLabel = "Будь-хто",
  align = "start",
}: PeopleMultiselectProps) {
  const [open, setOpen] = useState(false);
  const people = usePeople();

  const ordered = sortPeople(people.data ?? [], meId);
  const selected = ordered.filter((p) => values.includes(p.id));

  const toggle = (id: PersonId) => {
    if (values.includes(id)) onChange(values.filter((v) => v !== id));
    else onChange([...values, id]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-[28px] items-center gap-[6px] rounded-md border border-transparent px-[8px] text-sm leading-none text-zinc-700 outline-none transition-colors hover:border-border hover:bg-surface focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          <span className="text-zinc-400">{label}:</span>
          {selected.length === 0 ? (
            <span className="font-medium text-foreground">{emptyLabel}</span>
          ) : (
            <span className="flex items-center">
              {selected.slice(0, 3).map((p, i) => (
                <span
                  key={p.id}
                  className={cn(
                    "rounded-full ring-2 ring-bg",
                    i > 0 && "-ml-[6px]",
                  )}
                >
                  <AvatarDot person={p} size={18} />
                </span>
              ))}
              {selected.length > 3 && (
                <span className="ml-[4px] font-mono text-[10.5px] font-medium tabular-nums text-zinc-500">
                  +{selected.length - 3}
                </span>
              )}
            </span>
          )}
          <ChevronDown className="size-[12px] text-zinc-400" strokeWidth={1.8} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={6}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-[240px] p-[6px]"
      >
        <ul role="listbox" aria-multiselectable className="flex flex-col gap-[1px]">
          {ordered.map((p) => {
            const checked = values.includes(p.id);
            const isMe = p.id === meId;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(p.id)}
                  className={cn(
                    "flex w-full items-center gap-[8px] rounded-[8px] px-[8px] py-[6px] text-left text-base transition-colors",
                    "hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none",
                    checked && "bg-surface-2",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-[14px] items-center justify-center rounded-[3px] border transition-colors",
                      checked
                        ? "border-foreground bg-foreground text-white"
                        : "border-border-strong bg-surface text-transparent",
                    )}
                  >
                    <Check className="size-[10px]" strokeWidth={3} />
                  </span>
                  <AvatarDot person={p} size={20} />
                  <span className="flex-1 truncate text-foreground">{p.name}</span>
                  {isMe && (
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-zinc-400">
                      ви
                    </span>
                  )}
                </button>
              </li>
            );
          })}
          {people.isLoading && (
            <li className="px-[8px] py-[6px] text-xs text-zinc-400">Завантаження…</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function sortPeople(people: Person[], meId?: PersonId): Person[] {
  if (!meId) return people;
  return [...people].sort((a, b) => {
    if (a.id === meId) return -1;
    if (b.id === meId) return 1;
    return 0;
  });
}
