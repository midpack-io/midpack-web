"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Bottom-of-rail user chip. Shared between Workspace and Settings modes.
 *  The brief specifies a small popover with Account · Notifications · Sign out;
 *  for parity with the existing top-bar UserMenu we only show Sign out here
 *  (Account / Notifications live as their own rail entries in Settings mode). */
export function RailUserChip() {
  return (
    <div className="border-t border-border pt-[8px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-[8px] rounded-[7px] p-[8px] text-left transition-colors hover:bg-black/[0.05]"
          >
            <Avatar className="size-[26px]">
              <AvatarFallback className="bg-gradient-to-br from-[#c08a9a] to-[#8a4e64] text-[10px] font-semibold text-white">
                AK
              </AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[12.5px] font-medium leading-tight text-foreground">
                Anna Kovalenko
              </span>
              <span className="mt-[2px] truncate text-[11px] leading-tight text-zinc-500">
                Manager · anna@midpack.app
              </span>
            </span>
            <span className="shrink-0 text-zinc-400" aria-hidden>
              <svg viewBox="0 0 12 12" fill="none" className="size-[12px]">
                <path
                  d="M3 5l3 3 3-3M3 8.5l3-3 3 3"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                />
              </svg>
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-[220px]">
          <DropdownMenuLabel className="flex flex-col gap-[2px] py-[8px]">
            <span className="text-sm font-medium text-foreground">Anna Kovalenko</span>
            <span className="text-xs font-normal text-zinc-500">anna@midpack.app</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => console.log("logout")}
          >
            <LogOut className="size-4" />
            <span>Вийти</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
