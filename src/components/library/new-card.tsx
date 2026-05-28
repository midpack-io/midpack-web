"use client";

import { Plus } from "lucide-react";

type NewCardProps = {
  title: string;
  sub: string;
  onClick: () => void;
};

// Dashed "+ New" slot at the end of a grid (workflows tab). Blank-or-duplicate
// entry point into a new template.
export function NewCard({ title, sub, onClick }: NewCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/new flex min-h-[184px] flex-col items-center justify-center gap-[8px] rounded-[11px] border-[1.5px] border-dashed border-border-strong p-[24px] text-center transition-colors hover:border-accent-strong hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
    >
      <span className="flex size-[32px] items-center justify-center rounded-[8px] border border-border-strong bg-surface text-zinc-700 transition-colors group-hover/new:border-accent-strong group-hover/new:text-accent-strong">
        <Plus className="size-[14px]" strokeWidth={1.6} />
      </span>
      <span className="text-[12.5px] font-semibold text-foreground group-hover/new:text-accent-ink">
        {title}
      </span>
      <span className="text-[11px] text-zinc-500">{sub}</span>
    </button>
  );
}
