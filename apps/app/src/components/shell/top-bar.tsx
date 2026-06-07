"use client";

import { Search, HelpCircle } from "lucide-react";
import {
  BrandLink,
  Breadcrumbs,
  type Breadcrumb,
  LanguageSwitcher,
  UserMenu,
} from "@midpack/ui";
import { useAuth } from "@midpack/auth";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/hooks/useWorkspace";
import { NotificationsPanel } from "@/components/notifications/notifications-panel";
import { cn } from "@/lib/utils";

export type { Breadcrumb };

type TopBarProps = {
  // Trailing crumbs after the workspace root. The root (workspace name → "/")
  // is rendered by TopBar itself from the workspace resource.
  breadcrumbs?: Breadcrumb[];
  className?: string;
};

export function TopBar({ breadcrumbs = [], className }: TopBarProps) {
  const workspace = useWorkspace();
  const { user, logout } = useAuth();
  const crumbs: Breadcrumb[] = [
    { label: workspace.data?.name ?? "…", href: "/" },
    ...breadcrumbs,
  ];
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[48px] items-center gap-[14px] border-b border-border bg-surface px-[24px]",
        className,
      )}
    >
      {/* Brand → marketing landing (root domain). */}
      <BrandLink />

      {/* Divider */}
      <span className="h-[20px] w-px bg-border" aria-hidden />

      <Breadcrumbs items={crumbs} />

      <div className="flex-1" />

      {/* Search */}
      <label className="flex h-[34px] w-[360px] items-center gap-[8px] rounded-md border border-transparent bg-surface-2 px-[12px] transition-colors [&:hover:not(:focus-within)]:border-border focus-within:border-accent-ring focus-within:bg-surface">
        <Search className="size-[16px] shrink-0 text-zinc-400" strokeWidth={1.75} />
        <input
          type="search"
          placeholder="Пошук колекцій, продуктів, файлів…"
          className="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-base leading-none text-foreground placeholder:text-zinc-400 outline-none"
        />
      </label>

      {/* Actions */}
      <NotificationsPanel />
      <Button variant="ghost" size="icon" aria-label="Довідка" className="size-[32px]">
        <HelpCircle className="size-[18px] text-zinc-700" strokeWidth={1.75} />
      </Button>

      <LanguageSwitcher />
      <UserMenu
        name={user?.name ?? undefined}
        email={user?.email ?? undefined}
        onSignOut={() => void logout()}
      />
    </header>
  );
}
