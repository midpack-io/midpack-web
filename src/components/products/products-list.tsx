"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductRow } from "./product-row";
import { NewProductRow } from "./new-product-row";
import type { CollectionId, Person, PersonId, Product } from "@/lib/api/types";
import type { ProductsFilterState } from "./products-filter";

type ProductsListProps = {
  query: UseQueryResult<Product[]>;
  visibleProducts: Product[];
  filter: ProductsFilterState;
  peopleMap: Map<PersonId, Person>;
  // The single-collection Products page allows creating a row inline; the
  // cross-collection Worklist doesn't (no target collection), so it hides it.
  showNewProductRow?: boolean;
  // When provided (Worklist), each row shows a collection pill.
  collectionsById?: Map<CollectionId, { name: string }>;
};

export function ProductsList({
  query,
  visibleProducts,
  filter,
  peopleMap,
  showNewProductRow = true,
  collectionsById,
}: ProductsListProps) {
  if (query.isLoading || query.isPending) {
    return <ListSkeleton count={4} />;
  }
  if (query.isError) {
    return (
      <ErrorState
        message={query.error instanceof Error ? query.error.message : "Не вдалося завантажити продукти"}
        onRetry={() => query.refetch()}
      />
    );
  }
  if (visibleProducts.length === 0) {
    return <EmptyState filter={filter} allowCreate={showNewProductRow} />;
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {visibleProducts.map((p) => (
        <ProductRow
          key={p.id}
          product={p}
          peopleMap={peopleMap}
          collectionName={collectionsById?.get(p.collectionId)?.name}
        />
      ))}
      {showNewProductRow && <NewProductRow />}
    </div>
  );
}

function ListSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-[12px]">
      {Array.from({ length: count }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-surface">
      <div className="grid grid-cols-[64px_1fr_auto] items-center gap-[16px] px-[18px] py-[14px]">
        <Skeleton className="size-[64px] rounded-md bg-surface-3" />
        <div className="flex flex-col gap-[8px]">
          <Skeleton className="h-[18px] w-[55%] rounded-sm bg-surface-3" />
          <Skeleton className="h-[12px] w-[40%] rounded-sm bg-surface-3" />
          <Skeleton className="h-[20px] w-[70%] rounded-sm bg-surface-3" />
        </div>
        <div className="flex flex-col items-end gap-[8px]">
          <Skeleton className="h-[20px] w-[80px] rounded-sm bg-surface-3" />
          <Skeleton className="h-[22px] w-[60px] rounded-full bg-surface-3" />
        </div>
      </div>
      <div className="flex items-center gap-[8px] border-t border-border bg-surface-2 px-[18px] py-[14px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-[30px] w-[80px] rounded-md bg-surface-3" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  filter,
  allowCreate,
}: {
  filter: ProductsFilterState;
  allowCreate: boolean;
}) {
  const hasFilters =
    filter.stages.length > 0 ||
    filter.tags.length > 0 ||
    filter.assignee.length > 0 ||
    (filter.collections?.length ?? 0) > 0 ||
    Object.values(filter.fieldValues).some((v) => v.length > 0);
  // A truly empty collection vs. a query that just hides everything — only the
  // former should prompt "add the first style", and only where creating is allowed.
  const trulyEmpty = allowCreate && filter.tab === "all" && !hasFilters;
  return (
    <div className="flex flex-col items-center justify-center gap-[8px] rounded-[12px] border border-dashed border-border-strong bg-surface py-[64px] text-center">
      <h3 className="text-lg font-medium text-foreground">
        {trulyEmpty ? "Поки що немає стилів" : "У цьому виді нічого немає"}
      </h3>
      <p className="max-w-[420px] text-sm text-zinc-500">
        {trulyEmpty
          ? "Додайте перший стиль, щоб відстежувати його шлях через колекцію."
          : "Спробуйте інший вид або очистіть фільтри, щоб побачити більше продуктів."}
      </p>
      {trulyEmpty && <Button className="mt-[8px]">Додати стиль</Button>}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] rounded-[12px] border border-coral-ring bg-coral-soft py-[48px]">
      <h3 className="font-mono text-xs uppercase tracking-[0.07em] text-coral">
        Не вдалося завантажити продукти
      </h3>
      <p className="text-sm text-coral">{message}</p>
      <Button variant="outline" onClick={onRetry} className="mt-[8px]">
        <RefreshCw className="size-[14px]" strokeWidth={1.8} />
        Повторити
      </Button>
    </div>
  );
}
