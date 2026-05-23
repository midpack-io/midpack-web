"use client";

import { ImageIcon } from "lucide-react";
import { TagRow } from "@/components/ds/tag-row";
import { CustomFieldRow } from "@/components/ds/custom-field-row";
import { RowHoverActions } from "./row-hover-actions";
import { timeAgo } from "@/lib/time";
import type { Person, PersonId, Product } from "@/lib/api/types";

type ProductRowHeadProps = {
  product: Product;
  peopleMap: Map<PersonId, Person>;
};

// Top section of a product row: thumbnail + title block + hover actions.
// Grid columns: 64px cover · 1fr title · auto actions.
export function ProductRowHead({ product, peopleMap }: ProductRowHeadProps) {
  const updatedBy = product.updatedBy ? peopleMap.get(product.updatedBy) : undefined;

  return (
    <div className="grid grid-cols-[64px_1fr_auto] items-center gap-[16px] px-[18px] py-[14px]">
      <Thumbnail product={product} />

      <div className="min-w-0">
        <h2 className="m-0 text-xl font-semibold leading-tight tracking-[-0.01em] text-foreground">
          {product.name}
        </h2>
        <div className="mt-[6px] flex flex-wrap items-center gap-[8px] text-base text-zinc-500">
          <TagRow tags={product.tags} />
          <span className="size-[3px] shrink-0 rounded-full bg-zinc-300" aria-hidden />
          <span>
            Updated <b className="font-medium text-zinc-700">{timeAgo(product.updatedAt)}</b>
            {updatedBy && (
              <>
                <span> by </span>
                <span className="text-zinc-700">{updatedBy.name}</span>
              </>
            )}
          </span>
        </div>
        <CustomFieldRow fields={product.customFields} className="mt-[3px]" />
      </div>

      <RowHoverActions href={`/products/${product.id}`} />
    </div>
  );
}

function Thumbnail({ product }: { product: Product }) {
  if (!product.thumbnail) {
    return (
      <div className="relative flex size-[64px] items-center justify-center overflow-hidden rounded-md border border-border bg-surface-3">
        <ImageIcon
          aria-hidden
          strokeWidth={1.5}
          className="size-[34px] text-zinc-300"
        />
      </div>
    );
  }
  return (
    <div className="relative size-[64px] overflow-hidden rounded-md border border-border bg-surface-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.thumbnail}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-[center_28%]"
      />
    </div>
  );
}
