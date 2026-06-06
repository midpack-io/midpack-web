"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { FileKind } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type PickerItem = {
  id: string;
  name: string;
  kind: FileKind;
  meta?: string; // e.g. source label for components, "required" for templates
};

// "Add from library" — a compact searchable popover fed by the inline sample
// list. Already-attached items are filtered out by the caller.
export function LibraryAttachPicker({
  label,
  accent,
  items,
  onPick,
}: {
  label: string;
  accent: "indigo" | "violet";
  items: PickerItem[];
  onPick: (item: PickerItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) => i.name.toLowerCase().includes(needle));
  }, [items, q]);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQ("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-[28px] items-center gap-[5px] rounded-md border border-dashed px-[9px] text-[11.5px] font-medium leading-none outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-accent-ring",
            accent === "violet"
              ? "border-linked-border text-linked-ink hover:bg-linked-soft"
              : "border-border-strong text-zinc-600 hover:bg-surface-2",
          )}
        >
          <Plus className="size-[12px]" strokeWidth={2} />
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[280px] p-[6px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <label className="mb-[6px] flex h-[32px] items-center gap-[7px] rounded-md border border-border bg-surface-2 px-[9px] focus-within:border-accent-ring focus-within:bg-surface">
          <Search className="size-[13px] shrink-0 text-zinc-400" strokeWidth={1.75} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Пошук у бібліотеці…"
            className="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-[12.5px] leading-none text-foreground placeholder:text-zinc-400 outline-none"
          />
        </label>

        <ul className="flex max-h-[230px] flex-col gap-[1px] overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-[8px] py-[14px] text-center text-[11.5px] text-zinc-400">
              Нічого не знайдено
            </li>
          ) : (
            filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onPick(item);
                    setOpen(false);
                    setQ("");
                  }}
                  className="group/row flex w-full items-center gap-[8px] rounded-[7px] px-[8px] py-[6px] text-left outline-none transition-colors hover:bg-surface-2 focus-visible:bg-surface-2"
                >
                  <span className="inline-flex shrink-0 rounded-[3px] bg-surface-3 px-[5px] py-[2px] font-mono text-[9px] font-semibold uppercase tracking-[0.04em] text-zinc-600">
                    {item.kind}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] text-foreground">
                      {item.name}
                    </span>
                    {item.meta && (
                      <span className="block truncate text-[10.5px] text-zinc-400">
                        {item.meta}
                      </span>
                    )}
                  </span>
                  <Plus
                    className="size-[13px] shrink-0 text-zinc-300 transition-colors group-hover/row:text-accent-strong"
                    strokeWidth={2}
                  />
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
