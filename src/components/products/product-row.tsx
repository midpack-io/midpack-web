"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent } from "react";
import { BundleStepper } from "@/components/ds/bundle-stepper";
import { ProductRowHead } from "./product-row-head";
import { ReturnNotice } from "./return-notice";
import { cn } from "@/lib/utils";
import type { Person, PersonId, Product } from "@/lib/api/types";

// CSS-selector form of the interactive-children allow-list. Anything matching
// this swallows the row-level click so dropdowns, links, buttons, the stepper,
// and inputs don't navigate.
const INTERACTIVE =
  'button, a, input, select, textarea, [role="button"], [data-stepper]';

type ProductRowProps = {
  product: Product;
  peopleMap: Map<PersonId, Person>;
};

export function ProductRow({ product, peopleMap }: ProductRowProps) {
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
      <ProductRowHead product={product} peopleMap={peopleMap} />
      <BundleStepper
        stages={product.stages}
        variant="inline-row"
        footer={product.status === "returned" ? <ReturnNotice product={product} /> : undefined}
      />
    </article>
  );
}
