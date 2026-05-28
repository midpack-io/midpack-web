"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { LibraryItemStatus } from "@/lib/api/types";

type CardMenuProps = {
  status: LibraryItemStatus;
  usageCount: number;
  onRename: () => void;
  onDuplicate: () => void;
  onArchiveToggle: () => void;
  onDelete: () => void;
};

// Overflow menu on a library card: Rename / Duplicate / Archive·Restore / Delete.
// Delete is hard-guarded — disabled while anything active uses the item, with the
// reason shown and Archive offered instead (spec §6.2).
export function CardMenu({
  status,
  usageCount,
  onRename,
  onDuplicate,
  onArchiveToggle,
  onDelete,
}: CardMenuProps) {
  const archived = status === "archived";
  const deleteBlocked = usageCount > 0;

  return (
    // modal={false} keeps the page scroll container intact so position:sticky
    // top bar isn't broken while the menu is open (mirrors RowHoverActions).
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Actions"
          onClick={(e) => e.stopPropagation()}
          className="flex size-[22px] shrink-0 items-center justify-center rounded-[5px] text-zinc-400 opacity-0 transition-all duration-150 hover:bg-surface-3 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring group-hover/card:opacity-100 data-[state=open]:opacity-100"
        >
          <MoreHorizontal className="size-[13px]" strokeWidth={1.8} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[180px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onSelect={() => onRename()}>Rename</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onDuplicate()}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onArchiveToggle()}>
          {archived ? "Restore" : "Archive"}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={deleteBlocked}
          onSelect={() => onDelete()}
        >
          Delete
        </DropdownMenuItem>
        {deleteBlocked && (
          <DropdownMenuLabel className="px-2 py-1 text-[11px] font-normal text-zinc-400">
            In use by {usageCount} — archive instead.
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
