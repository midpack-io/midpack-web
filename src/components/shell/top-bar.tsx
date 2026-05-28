"use client";

import Link from "next/link";
import { Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/hooks/useWorkspace";
import { NotificationsPanel } from "@/components/notifications/notifications-panel";
import { LanguageSwitcher } from "./language-switcher";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";

export type Breadcrumb = { label: string; href?: string };

type TopBarProps = {
  // Trailing crumbs after the workspace root. The root (workspace name → "/")
  // is rendered by TopBar itself from the workspace resource.
  breadcrumbs?: Breadcrumb[];
  className?: string;
};

export function TopBar({ breadcrumbs = [], className }: TopBarProps) {
  const workspace = useWorkspace();
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
      {/* Brand wordmark */}
      <Link
        href="/"
        className="relative inline-flex items-baseline text-lg tracking-tight cursor-pointer rounded-[4px] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
      >
        <span className="font-semibold text-foreground">Mid</span>
        <span className="font-normal text-zinc-500">pack</span>
      </Link>

      {/* Divider */}
      <span className="h-[20px] w-px bg-border" aria-hidden />

      {/* Breadcrumbs */}
      <nav className="flex items-center font-mono text-sm text-zinc-500">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          const crumbClass = cn(
            "rounded-md px-[7px] py-[3px] transition-colors",
            isLast && "text-foreground",
            crumb.href && "cursor-pointer hover:bg-accent hover:text-foreground",
          );
          return (
            <span key={i} className="flex items-center">
              {crumb.href ? (
                <Link href={crumb.href} className={crumbClass}>
                  {crumb.label}
                </Link>
              ) : (
                <span className={crumbClass}>{crumb.label}</span>
              )}
              {!isLast && <span className="mx-[2px] text-zinc-300">/</span>}
            </span>
          );
        })}
      </nav>

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
      <UserMenu />
    </header>
  );
}
