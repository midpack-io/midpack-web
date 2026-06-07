"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { TagRow } from "../ds/tag-row";
import { CustomFieldRow } from "../ds/custom-field-row";
import { DateField } from "../ds/date-field";
import { TextEditable } from "../ds/text-editable";
import { Badge } from "../ui/badge";
import { RowHoverActions } from "./row-hover-actions";
import { formatDeadline, timeAgo } from "../lib/time";
import { cn } from "../lib/utils";
import type { Person, PersonId, Product } from "../lib/types";

type ProductRowHeadProps = {
  product: Product;
  peopleMap: Map<PersonId, Person>;
  collectionName?: string;
  // When false (e.g. the marketing hero), the head renders as a pure display:
  // the name + deadline are static text and the hover actions are hidden, so
  // the whole row reads as a single click-through target. Defaults to true.
  interactive?: boolean;
};

// Grid columns: 96px cover · 1fr title · auto right-corner.
// Items stretch so the cover image picks up the full body height.
export function ProductRowHead({
  product,
  peopleMap,
  collectionName,
  interactive = true,
}: ProductRowHeadProps) {
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
        {interactive ? (
          <TextEditable
            value={name}
            onChange={setName}
            ariaLabel={`Редагувати ${name}`}
            className="text-xl font-semibold leading-tight tracking-[-0.01em] text-foreground"
          />
        ) : (
          <span className="truncate text-xl font-semibold leading-tight tracking-[-0.01em] text-foreground">
            {name}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-[8px] text-base text-zinc-500">
          {collectionName && (
            <Badge
              variant="ghost"
              className="rounded-sm border border-border bg-surface-2 px-[7px] py-[2px] font-mono text-[10.5px] uppercase tracking-[0.04em] font-medium text-zinc-500"
            >
              {collectionName}
            </Badge>
          )}
          <TagRow tags={product.tags} />
        </div>
        <CustomFieldRow fields={product.customFields} />
      </div>

      <RightCorner
        updatedAt={product.updatedAt}
        updatedByName={updatedBy?.name}
        productHref={`/products/${product.id}?collection=${product.collectionId}`}
        dueDate={dueDate}
        onDueDateChange={setDueDate}
        interactive={interactive}
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
  interactive: boolean;
};

function RightCorner({
  updatedAt,
  updatedByName,
  productHref,
  dueDate,
  onDueDateChange,
  interactive,
}: RightCornerProps) {
  return (
    <div className="flex min-w-[180px] flex-col items-end justify-between gap-[8px] py-[2px] text-right">
      {/* Top slot — same flex cell holds the resting "Updated …" line and the
          hover actions. Fixed height so the display swap doesn't reflow the
          row, and no absolute layering so hit-testing has only one candidate. */}
      <div className="flex h-[26px] items-center justify-end">
        <div
          className={cn(
            "text-xs leading-snug text-zinc-500",
            interactive &&
              "group-hover/row:hidden group-focus-within/row:hidden group-has-[[data-state=open]]/row:hidden",
          )}
        >
          Оновлено{" "}
          <span className="font-medium text-zinc-700">{timeAgo(updatedAt)}</span>
          {updatedByName && (
            <>
              {" · "}
              <span className="text-zinc-700">{updatedByName}</span>
            </>
          )}
        </div>
        {/* The has-[data-state=open] variant keeps the cluster visible while
            the kebab dropdown is open — Radix portals the menu out of the
            row, which ends :hover; without this, the trigger would flip to
            display:none and the popper would re-anchor at (0,0). */}
        {interactive && (
          <div className="hidden group-hover/row:flex group-focus-within/row:flex group-has-[[data-state=open]]/row:flex">
            <RowHoverActions
              href={productHref}
              className="opacity-100 translate-x-0 transition-none"
            />
          </div>
        )}
      </div>

      {interactive ? (
        <DateField
          value={dueDate}
          onChange={onDueDateChange}
          label="Дедлайн"
          ariaLabel="Редагувати дедлайн продукту"
        />
      ) : dueDate ? (
        <span className="font-mono text-xs leading-none text-zinc-500">
          Дедлайн{" "}
          <span className="text-zinc-700">{formatDeadline(dueDate).text}</span>
        </span>
      ) : null}
    </div>
  );
}

