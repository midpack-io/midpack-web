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

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Меню користувача"
          className="ml-[4px] inline-flex cursor-pointer items-center justify-center rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          <Avatar className="size-[28px]">
            <AvatarFallback className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-xs font-semibold text-white">
              AK
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-[220px]">
        <DropdownMenuLabel className="flex flex-col gap-[2px] py-[8px]">
          <span className="text-sm font-medium text-foreground">
            Anna Kovalenko
          </span>
          <span className="text-xs font-normal text-zinc-500">
            anna@midpack.app
          </span>
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
  );
}
