"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useMarkNotificationRead } from "@/hooks/useMarkNotificationRead";
import { usePeople, indexPeople } from "@/hooks/usePeople";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { notifBucket } from "@/lib/time";
import type { Notification, NotificationFilter } from "@/lib/api/types";
import { NotificationRow } from "./notification-row";

// Distance from the bottom (px) at which scrolling triggers the next page.
const LOAD_THRESHOLD = 140;

function EmptyState({ filter }: { filter: NotificationFilter }) {
  const title = filter === "all" ? "Поки що порожньо" : "Усе переглянуто";
  const sub =
    filter === "mentions"
      ? "Немає згадок."
      : filter === "unread"
        ? "Немає непрочитаних сповіщень."
        : "Сповіщення з’являться тут.";
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-[8px] px-[24px] text-center text-zinc-400">
      <Check className="size-[26px] opacity-60" strokeWidth={1.75} />
      <div className="text-[13px] font-medium text-zinc-500">{title}</div>
      <div className="text-[12px]">{sub}</div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-[10px] border-b border-border px-[14px] py-[11px]">
          <Skeleton className="size-[30px] shrink-0 rounded-full" />
          <div className="flex-1 space-y-[6px] pt-[2px]">
            <Skeleton className="h-[10px] w-[85%]" />
            <Skeleton className="h-[10px] w-[40%]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationList({ filter }: { filter: NotificationFilter }) {
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(filter);
  const peopleQuery = usePeople();
  const peopleIndex = indexPeople(peopleQuery.data);
  const markRead = useMarkNotificationRead();
  const listRef = React.useRef<HTMLDivElement>(null);

  // Reset scroll to the top whenever the active tab changes.
  React.useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [filter]);

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  // Group consecutive rows by time bucket, in arrival order, so a bucket that
  // spans a page boundary renders one sticky header (not two).
  const groups: { label: string; rows: Notification[] }[] = [];
  for (const n of items) {
    const label = notifBucket(n.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.rows.push(n);
    else groups.push({ label, rows: [n] });
  }

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      el.scrollTop + el.clientHeight >= el.scrollHeight - LOAD_THRESHOLD &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <div
      ref={listRef}
      onScroll={onScroll}
      className="h-[432px] overflow-y-auto overscroll-contain"
    >
      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-[10px] px-[24px] text-center">
          <div className="text-[12.5px] text-zinc-500">Не вдалося завантажити сповіщення.</div>
          <Button variant="outline" size="xs" onClick={() => refetch()}>
            Спробувати ще
          </Button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <>
          {groups.map((g) => (
            <div key={g.label}>
              <div className="sticky top-0 z-[1] border-b border-border bg-surface-2 px-[14px] pb-[6px] pt-[11px] font-mono text-[9.5px] font-semibold uppercase tracking-[0.07em] text-zinc-400">
                {g.label}
              </div>
              {g.rows.map((n) => (
                <NotificationRow
                  key={n.id}
                  n={n}
                  person={n.actorId ? peopleIndex.get(n.actorId) : undefined}
                  onRead={(id) => markRead.mutate(id)}
                />
              ))}
            </div>
          ))}

          {isFetchingNextPage && (
            <div className="flex items-center justify-center gap-[8px] py-[16px] text-[12px] text-zinc-400">
              <Loader2 className="size-[14px] animate-spin" /> Завантаження…
            </div>
          )}
          {!hasNextPage && (
            <div className="py-[14px] text-center text-[11.5px] text-zinc-400">
              Це все за останні 30 днів
            </div>
          )}
        </>
      )}
    </div>
  );
}
