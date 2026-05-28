"use client";

import { Check, ChevronDown, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductsTab, ViewId } from "@/lib/api/types";

export type SystemViewItem = {
  tab: ProductsTab;
  label: string;
  count: number;
  attention?: boolean;
};

export type SavedViewItem = {
  id: ViewId;
  name: string;
  count: number;
};

type ViewsMenuProps = {
  activeLabel: string;
  // Coral dot on the closed trigger — mirrors the "needs-you" attention signal
  // that the old full-width tab bar showed inline.
  attention?: boolean;
  systemViews: SystemViewItem[];
  savedViews: SavedViewItem[];
  // Current selection: a system tab when no saved view is active, else the id.
  activeTab: ProductsTab;
  activeViewId: ViewId | null;
  onSelectSystem: (tab: ProductsTab) => void;
  onSelectSaved: (id: ViewId) => void;
  onDeleteSaved: (id: ViewId) => void;
};

export function ViewsMenu({
  activeLabel,
  attention,
  systemViews,
  savedViews,
  activeTab,
  activeViewId,
  onSelectSystem,
  onSelectSaved,
  onDeleteSaved,
}: ViewsMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-[28px] items-center gap-[6px] rounded-md border border-border bg-surface px-[8px] text-sm leading-none text-zinc-700 outline-none transition-colors hover:border-border-strong focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          <span className="text-zinc-400">Вигляд:</span>
          <span className="font-medium text-foreground">{activeLabel}</span>
          {attention && (
            <span aria-hidden className="size-[5px] rounded-full bg-coral" />
          )}
          <ChevronDown className="size-[12px] text-zinc-400" strokeWidth={1.8} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="min-w-[260px]"
      >
        <DropdownMenuLabel className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-zinc-400">
          Системні
        </DropdownMenuLabel>
        {systemViews.map((v) => (
          <DropdownMenuItem
            key={v.tab}
            onSelect={() => onSelectSystem(v.tab)}
            className="gap-[8px] text-sm"
          >
            <SelectedTick active={activeViewId === null && activeTab === v.tab} />
            <span className="flex-1 truncate">{v.label}</span>
            {v.attention && (
              <span aria-hidden className="size-[5px] rounded-full bg-coral" />
            )}
            <CountChip n={v.count} />
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-zinc-400">
          Збережені
        </DropdownMenuLabel>
        {savedViews.length === 0 ? (
          <div className="px-2 py-[6px] text-sm text-zinc-400">Немає збережених</div>
        ) : (
          savedViews.map((v) => (
            <DropdownMenuItem
              key={v.id}
              onSelect={() => onSelectSaved(v.id)}
              className="group gap-[8px] text-sm"
            >
              <SelectedTick active={activeViewId === v.id} />
              <span className="flex-1 truncate">{v.name}</span>
              <button
                type="button"
                aria-label={`Видалити вигляд: ${v.name}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSaved(v.id);
                }}
                className="flex size-[18px] items-center justify-center rounded-[3px] text-zinc-300 opacity-0 transition-colors group-hover:opacity-100 hover:bg-surface-3 hover:text-foreground"
              >
                <Trash2 className="size-[12px]" strokeWidth={1.8} />
              </button>
              <CountChip n={v.count} />
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SelectedTick({ active }: { active: boolean }) {
  return (
    <span className="flex size-[14px] items-center justify-center text-foreground">
      {active && <Check className="size-[14px]" strokeWidth={2} />}
    </span>
  );
}

function CountChip({ n }: { n: number }) {
  return (
    <span className="rounded-sm bg-surface-3 px-[6px] py-[1.5px] font-mono text-[10.5px] font-medium tabular-nums text-zinc-400">
      {n}
    </span>
  );
}
