"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent } from "react";
import { BundleStepper } from "@/components/ds/bundle-stepper";
import { ProductRowHeadV2 } from "./product-row-head-v2";
import { ReturnNotice } from "./return-notice";
import { cn } from "@/lib/utils";
import type { Person, PersonId, Product } from "@/lib/api/types";

// Allow-list of in-row interactive children. Clicks that match any of these
// don't navigate the row — they belong to the inline editors, hover actions,
// stepper, etc.
const INTERACTIVE =
  'button, a, input, select, textarea, [role="button"], [data-stepper]';

type ProductRowV2Props = {
  product: Product;
  peopleMap: Map<PersonId, Person>;
};

export function ProductRowV2({ product, peopleMap }: ProductRowV2Props) {
  const router = useRouter();
  const href = `/products/${product.id}`;

  const navigate = () => router.push(href);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE)) return;
    navigate();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate();
    }
  };

  return (
    <article
      tabIndex={0}
      role="link"
      aria-label={`${product.styleNo} — ${product.name}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group/row cursor-pointer overflow-hidden rounded-[12px] border border-border bg-surface shadow-md outline-none transition-all duration-150 hover:border-border-strong hover:shadow-lg focus-visible:ring-[3px] focus-visible:ring-accent-ring",
      )}
    >
      <ProductRowHeadV2 product={product} peopleMap={peopleMap} />
      <BundleStepper
        stages={product.stages}
        variant="inline-row"
        className="bg-gradient-to-b from-surface-2 to-surface"
        scrollerClassName="px-[14px]"
        footer={product.status === "returned" ? <ReturnNotice product={product} /> : undefined}
      />
    </article>
  );
}
