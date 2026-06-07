"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type UserMenuProps = {
  name?: string;
  email?: string;
  // Two-letter avatar fallback. Derived from name/email when omitted.
  initials?: string;
  onSignOut?: () => void;
  signOutLabel?: string;
  triggerLabel?: string;
};

function deriveInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last) || first;
  }
  return (email?.[0] ?? "?").toUpperCase();
}

// Presentational signed-in menu — avatar trigger + name/email + sign-out. The
// host app injects the identity and the sign-out handler (it stays auth-free so
// it can live in the base UI layer and be reused by app + admin).
export function UserMenu({
  name,
  email,
  initials,
  onSignOut,
  signOutLabel = "Вийти",
  triggerLabel = "Меню користувача",
}: UserMenuProps) {
  const fallback = (initials ?? deriveInitials(name, email)).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={triggerLabel}
          className="ml-[4px] inline-flex cursor-pointer items-center justify-center rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          <Avatar className="size-[28px]">
            <AvatarFallback className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-xs font-semibold text-white">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-[220px]">
        {(name || email) && (
          <>
            <DropdownMenuLabel className="flex flex-col gap-[2px] py-[8px]">
              {name && (
                <span className="text-sm font-medium text-foreground">{name}</span>
              )}
              {email && (
                <span className="text-xs font-normal text-zinc-500">{email}</span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem variant="destructive" onSelect={() => onSignOut?.()}>
          <LogOut className="size-4" />
          <span>{signOutLabel}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
