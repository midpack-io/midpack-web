"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionCard } from "./collection-card";
import type { Collection } from "@/lib/api/types";

type CollectionsGridProps = {
  query: UseQueryResult<Collection[]>;
};

export function CollectionsGrid({ query }: CollectionsGridProps) {
  if (query.isLoading || query.isPending) {
    return <GridSkeleton count={4} />;
  }

  if (query.isError) {
    return (
      <ErrorState
        message={query.error instanceof Error ? query.error.message : "Не вдалося завантажити колекції"}
        onRetry={() => query.refetch()}
      />
    );
  }

  const items = query.data ?? [];
  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-2">
      {items.map((c) => (
        <CollectionCard key={c.id} collection={c} />
      ))}
    </div>
  );
}

function GridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex h-[460px] flex-col gap-[14px] rounded-[12px] border border-border bg-surface p-[18px]">
      <div className="flex gap-[14px]">
        <Skeleton className="h-[96px] w-[96px] rounded-[8px] bg-surface-3" />
        <div className="flex flex-1 flex-col gap-[8px]">
          <Skeleton className="h-[10px] w-[80px] rounded-[3px] bg-surface-3" />
          <Skeleton className="h-[22px] w-[60%] rounded-[4px] bg-surface-3" />
          <Skeleton className="h-[14px] w-[75%] rounded-[3px] bg-surface-3" />
        </div>
      </div>
      <Skeleton className="h-[6px] w-full rounded-[3px] bg-surface-3" />
      <Skeleton className="h-[10px] w-full rounded-[4px] bg-surface-3" />
      <div className="grid grid-cols-3 gap-[6px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-[42px] rounded-[6px] bg-surface-3" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] rounded-[12px] border border-dashed border-border bg-surface py-[64px]">
      <h3 className="text-lg font-medium text-foreground">Поки що немає колекцій</h3>
      <p className="text-base text-zinc-500">
        Створіть першу колекцію, щоб почати відстежувати продукти у робочому процесі.
      </p>
      <Button className="mt-[10px]">Нова колекція</Button>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] rounded-[12px] border border-coral-ring bg-coral-soft py-[48px]">
      <h3 className="font-mono text-xs uppercase tracking-[0.07em] text-coral">
        Не вдалося завантажити колекції
      </h3>
      <p className="text-base text-coral">{message}</p>
      <Button variant="outline" onClick={onRetry} className="mt-[10px]">
        <RefreshCw className="h-[14px] w-[14px]" strokeWidth={1.8} />
        Повторити
      </Button>
    </div>
  );
}
