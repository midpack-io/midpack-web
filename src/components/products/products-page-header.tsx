"use client";

import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TextEditable } from "@/components/ds/text-editable";
import { DateField } from "@/components/ds/date-field";
import { CollectionProgress } from "@/components/ds/collection-progress";
import { useUpdateCollection } from "@/hooks/useUpdateCollection";
import type { Collection } from "@/lib/api/types";

type ProductsPageHeaderProps = {
  collection: Collection | undefined;
  collectionLoading: boolean;
};

// Page header for the products workspace.
// Diverges from the shared shell PageHeader because the layout puts a
// 56×56 collection cover thumbnail to the left of the title block.
export function ProductsPageHeader({
  collection,
  collectionLoading,
}: ProductsPageHeaderProps) {
  const updateCollection = useUpdateCollection();
  return (
    <div className="flex items-end gap-[18px] pt-[22px] pb-[12px]">
      <CoverThumbnail collection={collection} loading={collectionLoading} />

      <div className="min-w-0 flex-1">
        {collection ? (
          <h1 className="m-0 leading-tight">
            <TextEditable
              value={collection.name}
              onChange={(name) =>
                updateCollection.mutate({ id: collection.id, patch: { name } })
              }
              ariaLabel="Редагувати назву колекції"
              className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground"
            />
          </h1>
        ) : (
          <Skeleton className="h-[32px] w-[280px] bg-surface-3" />
        )}

        <div className="mt-[7px] flex flex-wrap items-center gap-[10px] text-base text-zinc-500">
          {collection ? (
            <>
              <CollectionProgress
                pct={collection.progressPct}
                tone={collection.progressTone}
                className="w-[240px]"
                trackClassName="bg-zinc-200"
              />
              <span aria-hidden className="h-[14px] w-px shrink-0 bg-border" />
              <DateField
                value={collection.dueDate.slice(0, 10)}
                onChange={(next) =>
                  updateCollection.mutate({
                    id: collection.id,
                    patch: { dueDate: next },
                  })
                }
                label="Дедлайн"
                ariaLabel="Редагувати дедлайн колекції"
              />
            </>
          ) : (
            <Skeleton className="h-[14px] w-[320px] bg-surface-3" />
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-[8px] self-center">
        <Button className="h-[40px] px-[18px] text-base">
          <Plus className="h-[16px] w-[16px]" strokeWidth={2} />
          Новий продукт
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Більше"
          className="size-[40px] bg-surface"
        >
          <MoreHorizontal className="size-[16px]" strokeWidth={1.8} />
        </Button>
      </div>
    </div>
  );
}

function CoverThumbnail({
  collection,
  loading,
}: {
  collection: Collection | undefined;
  loading: boolean;
}) {
  if (loading || !collection) {
    return <Skeleton className="size-[56px] shrink-0 rounded-[9px] bg-surface-3" />;
  }
  return (
    <div className="relative size-[56px] shrink-0 overflow-hidden rounded-[9px] border border-border shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={collection.cover.url}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20"
      />
    </div>
  );
}
