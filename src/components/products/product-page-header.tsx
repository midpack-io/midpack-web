"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ImageIcon, Link as LinkIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TextEditable } from "@/components/ds/text-editable";
import { TagRow } from "@/components/ds/tag-row";
import { CustomFieldRow } from "@/components/ds/custom-field-row";
import { DateField } from "@/components/ds/date-field";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Collection, Person, PersonId, Product } from "@/lib/api/types";

type ProductPageHeaderProps = {
  product: Product;
  collection: Collection | undefined;
  peopleMap: Map<PersonId, Person>;
};

// Top section of /products/[id]. Cover + editable title + tags + custom fields
// on the left; people counter + Copy link + Approve on the right.
// Inline edits are local state only — matches ProductRowHead until the
// useUpdateProduct hook lands.
export function ProductPageHeader({
  product,
  collection,
  peopleMap,
}: ProductPageHeaderProps) {
  const [name, setName] = useState(product.name);
  const [dueDate, setDueDate] = useState<string>(
    product.dueDate ? product.dueDate.slice(0, 10) : "",
  );

  const updatedBy = product.updatedBy ? peopleMap.get(product.updatedBy) : undefined;

  // "People involved" is a placeholder count: performer + approver + every
  // unique person referenced across stage assignments. Real meaning is TBD —
  // the user said "just add anything default" for this chip.
  const peopleCount = countPeople(product);

  return (
    <div className="flex items-start gap-[18px] py-[22px]">
      <Thumbnail product={product} />

      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        <h1 className="m-0 leading-tight">
          <TextEditable
            value={name}
            onChange={setName}
            ariaLabel="Edit product name"
            className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground"
          />
        </h1>

        <div className="flex flex-wrap items-baseline gap-x-[10px] gap-y-[6px] text-sm text-zinc-500">
          {collection ? (
            <span className="inline-flex items-baseline gap-[4px]">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.07em] text-zinc-400">
                Collection
              </span>
              <Link
                href={`/products?collection=${collection.id}`}
                className="rounded-[4px] text-zinc-700 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
              >
                {collection.name}
              </Link>
            </span>
          ) : (
            <Skeleton className="h-[14px] w-[140px] bg-surface-3" />
          )}
          <TagRow tags={product.tags} />
        </div>

        <CustomFieldRow fields={product.customFields} />
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-[8px] self-stretch pt-[2px]">
        <div className="flex items-center gap-[8px]">
          <span className="text-xs leading-snug text-zinc-500">
            Updated{" "}
            <span className="font-medium text-zinc-700">
              {timeAgo(product.updatedAt)}
            </span>
            {updatedBy && (
              <>
                {" by "}
                <span className="text-zinc-700">{updatedBy.name}</span>
              </>
            )}
          </span>
          <PeopleChip count={peopleCount} />
          <Button
            variant="outline"
            className="h-[36px] gap-[6px] bg-surface px-[12px] text-base"
          >
            <LinkIcon className="size-[14px]" strokeWidth={1.8} />
            Copy link
          </Button>
          <Button className="h-[36px] gap-[6px] px-[16px] text-base">
            <Check className="size-[14px]" strokeWidth={2.2} />
            Approve
          </Button>
        </div>
        <DateField
          value={dueDate}
          onChange={setDueDate}
          label="Deadline"
          ariaLabel="Edit product deadline"
        />
      </div>
    </div>
  );
}

// ─── Cover ────────────────────────────────────────────────────────────────────

function Thumbnail({ product }: { product: Product }) {
  const shell =
    "relative size-[96px] shrink-0 overflow-hidden rounded-md border border-border bg-surface-3";
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
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20"
      />
    </div>
  );
}

// ─── People chip ──────────────────────────────────────────────────────────────

function PeopleChip({ count }: { count: number }) {
  return (
    <span
      className="inline-flex h-[36px] items-center gap-[6px] rounded-md border border-border bg-surface px-[10px] font-mono text-sm text-zinc-600"
      aria-label={`${count} people on this product`}
    >
      <Users className="size-[14px] text-zinc-500" strokeWidth={1.8} />
      <span className="font-medium tabular-nums text-foreground">{count}</span>
    </span>
  );
}

function countPeople(product: Product): number {
  const ids = new Set<string>();
  if (product.performerId && product.performerId !== "unassigned") {
    ids.add(product.performerId);
  }
  if (product.approverId && product.approverId !== "unassigned") {
    ids.add(product.approverId);
  }
  for (const stage of product.stages) {
    if (stage.performerId && stage.performerId !== "unassigned") {
      ids.add(stage.performerId);
    }
    const a = stage.approverId;
    if (a && a !== "unassigned" && a !== "not_required") {
      if (Array.isArray(a)) {
        for (const id of a) ids.add(id);
      } else {
        ids.add(a);
      }
    }
  }
  return ids.size;
}
