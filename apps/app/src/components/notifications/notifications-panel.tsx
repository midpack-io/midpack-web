"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Check, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PillInline } from "@/components/ds/pill-inline";
import { useNotificationsUnreadCount } from "@/hooks/useNotificationsUnreadCount";
import { useMarkAllNotificationsRead } from "@/hooks/useMarkAllNotificationsRead";
import { cn } from "@/lib/utils";
import type { NotificationFilter } from "@/lib/api/types";
import { NotificationList } from "./notification-list";

const TABS: { id: NotificationFilter; label: string }[] = [
  { id: "all", label: "Усі" },
  { id: "unread", label: "Непрочитані" },
  { id: "mentions", label: "Згадки" },
];

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<NotificationFilter>("all");
  const countQuery = useNotificationsUnreadCount();
  // On a failed refetch TanStack keeps the last good `data`, so `unread` never
  // blanks to a wrong 0 (spec §8). `undefined` (initial) ⇒ no badge.
  const unread = countQuery.data?.count ?? 0;
  const markAll = useMarkAllNotificationsRead();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Сповіщення"
          className="relative size-[32px]"
        >
          <Bell className="size-[18px] text-zinc-700" strokeWidth={1.75} />
          {unread > 0 && !open && (
            <span className="absolute right-[2px] top-[2px] flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-coral px-[3px] font-mono text-[9px] font-bold text-white ring-[1.5px] ring-surface">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[392px] overflow-hidden rounded-[12px] p-0 shadow-lg"
      >
        <div className="px-[14px] pt-[13px]">
          <div className="flex items-center gap-[8px]">
            <span className="text-[13.5px] font-semibold text-foreground">Сповіщення</span>
            {unread > 0 && (
              <PillInline color="coral" className="px-[5px] pb-[1px] pt-[2px] text-[9.5px]">
                {`${unread} НОВИХ`}
              </PillInline>
            )}
            <span className="flex-1" />
            <Button
              variant="ghost"
              size="xs"
              className="gap-[5px] text-zinc-600"
              onClick={() => markAll.mutate(undefined)}
            >
              <Check className="size-[12px]" /> Прочитати всі
            </Button>
          </div>

          <div className="mt-[10px] flex gap-[2px] border-b border-border">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "-mb-px flex items-center gap-[5px] border-b-2 px-[9px] pb-[9px] pt-[6px] text-[12px] leading-none transition-colors",
                    active
                      ? "border-foreground font-semibold text-foreground"
                      : "border-transparent font-medium text-zinc-500 hover:text-foreground",
                  )}
                >
                  {t.label}
                  {t.id === "unread" && unread > 0 && (
                    <span
                      className={cn(
                        "rounded-[3px] px-[4px] py-[1px] font-mono text-[9.5px] font-semibold",
                        active ? "bg-accent-soft text-accent-ink" : "bg-surface-3 text-zinc-400",
                      )}
                    >
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <NotificationList filter={tab} />

        <div className="flex items-center justify-end border-t border-border bg-surface-2 px-[14px] py-[9px]">
          <Link
            href="/settings/notifications"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-[6px] text-[12px] font-medium text-zinc-500 transition-colors hover:text-foreground"
          >
            <Settings className="size-[13px]" /> Налаштування сповіщень
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
