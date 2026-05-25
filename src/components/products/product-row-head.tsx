"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { TagRow } from "@/components/ds/tag-row";
import { CustomFieldRow } from "@/components/ds/custom-field-row";
import { DateField } from "@/components/ds/date-field";
import { TextEditable } from "@/components/ds/text-editable";
import { RowHoverActions } from "./row-hover-actions";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Person, PersonId, Product } from "@/lib/api/types";

type ProductRowHeadProps = {
  product: Product;
  peopleMap: Map<PersonId, Person>;
};

// Grid columns: 96px cover · 1fr title · auto right-corner.
// Items stretch so the cover image picks up the full body height.
export function ProductRowHead({ product, peopleMap }: ProductRowHeadProps) {
  const updatedBy = product.updatedBy ? peopleMap.get(product.updatedBy) : undefined;

  // Stage 1: local state for the demo. Stage-2 will swap this for a useMutation
  // on PATCH /products/:id. `product.dueDate` is full ISO; the native date input
  // expects YYYY-MM-DD, so slice. Empty string represents "not set".
  const [dueDate, setDueDate] = useState<string>(
    product.dueDate ? product.dueDate.slice(0, 10) : "",
  );
  const [name, setName] = useState(product.name);

  return (
    <div className="grid grid-cols-[96px_1fr_auto] items-stretch gap-[16px] p-[14px]">
      <Thumbnail product={product} />

      <div className="flex min-w-0 flex-col justify-center gap-[6px]">
        <TextEditable
          value={name}
          onChange={setName}
          ariaLabel={`Edit ${name}`}
          className="text-xl font-semibold leading-tight tracking-[-0.01em] text-foreground"
        />
        <div className="flex flex-wrap items-center gap-[8px] text-base text-zinc-500">
          <TagRow tags={product.tags} />
        </div>
        <CustomFieldRow fields={product.customFields} />
      </div>

      <RightCorner
        updatedAt={product.updatedAt}
        updatedByName={updatedBy?.name}
        productHref={`/products/${product.id}`}
        dueDate={dueDate}
        onDueDateChange={setDueDate}
      />
    </div>
  );
}

function Thumbnail({ product }: { product: Product }) {
  const shell =
    "relative w-[96px] h-full min-h-[96px] overflow-hidden rounded-md border border-border bg-surface-3";
  if (!product.thumbnail) {
    return (
      <div className={cn(shell, "flex items-center justify-center")}>
        <ImageIcon
          aria-hidden
          strokeWidth={1.5}
          className="size-[42px] text-zinc-300"
        />
      </div>
    );
  }
  return (
    <div className={shell}>
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

// ─── Right corner ────────────────────────────────────────────────────────────

type RightCornerProps = {
  updatedAt: string;
  updatedByName?: string;
  productHref: string;
  dueDate: string;
  onDueDateChange: (next: string) => void;
};

function RightCorner({
  updatedAt,
  updatedByName,
  productHref,
  dueDate,
  onDueDateChange,
}: RightCornerProps) {
  return (
    <div className="flex min-w-[180px] flex-col items-end justify-between gap-[8px] py-[2px] text-right">
      {/* Top slot — same flex cell holds the resting "Updated …" line and the
          hover actions. Fixed height so the display swap doesn't reflow the
          row, and no absolute layering so hit-testing has only one candidate. */}
      <div className="flex h-[26px] items-center justify-end">
        <div className="text-xs leading-snug text-zinc-500 group-hover/row:hidden group-focus-within/row:hidden group-has-[[data-state=open]]/row:hidden">
          Updated{" "}
          <span className="font-medium text-zinc-700">{timeAgo(updatedAt)}</span>
          {updatedByName && (
            <>
              {" by "}
              <span className="text-zinc-700">{updatedByName}</span>
            </>
          )}
        </div>
        {/* The has-[data-state=open] variant keeps the cluster visible while
            the kebab dropdown is open — Radix portals the menu out of the
            row, which ends :hover; without this, the trigger would flip to
            display:none and the popper would re-anchor at (0,0). */}
        <div className="hidden group-hover/row:flex group-focus-within/row:flex group-has-[[data-state=open]]/row:flex">
          <RowHoverActions
            href={productHref}
            className="opacity-100 translate-x-0 transition-none"
          />
        </div>
      </div>

      <DateField
        value={dueDate}
        onChange={onDueDateChange}
        label="Deadline"
        ariaLabel="Edit product deadline"
      />
    </div>
  );
}

