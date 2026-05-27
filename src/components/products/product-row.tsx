"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, type KeyboardEvent, type MouseEvent } from "react";
import { BundleStepper } from "@/components/ds/bundle-stepper";
import { ProductRowHead } from "./product-row-head";
import { ReturnNotice } from "./return-notice";
import { cn } from "@/lib/utils";
import type {
  Person,
  PersonId,
  Product,
  StageStatus,
} from "@/lib/api/types";

// Allow-list of in-row interactive children. Clicks that match any of these
// don't navigate the row — they belong to the inline editors, hover actions,
// stepper, etc.
const INTERACTIVE =
  'button, a, input, select, textarea, [role="button"], [data-stepper]';

type ProductRowProps = {
  product: Product;
  peopleMap: Map<PersonId, Person>;
};

export function ProductRow({ product, peopleMap }: ProductRowProps) {
  const router = useRouter();
  const href = `/products/${product.id}?collection=${product.collectionId}`;

  // Local working copy so the inline StatusSelector + PersonPicker on each
  // active pill can commit changes optimistically. Mirrors the showcase
  // pattern; swap for a useUpdateProduct mutation once that hook lands.
  const [stages, setStages] = useState(product.stages);
  const handleStatusChange = useCallback((n: string, next: StageStatus) => {
    setStages((prev) =>
      prev.map((s) => (s.n === n ? { ...s, status: next } : s)),
    );
  }, []);
  const handlePerformerChange = useCallback(
    (n: string, next: PersonId | "unassigned") => {
      setStages((prev) =>
        prev.map((s) => (s.n === n ? { ...s, performerId: next } : s)),
      );
    },
    [],
  );
  const handleUnlock = useCallback((n: string) => {
    setStages((prev) =>
      prev.map((s) =>
        s.n === n ? { ...s, locked: false, manuallyUnlocked: true } : s,
      ),
    );
  }, []);

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
        stages={stages}
        variant="inline-row"
        mode="info"
        onStatusChange={handleStatusChange}
        onPerformerChange={handlePerformerChange}
        onUnlock={handleUnlock}
        className="bg-gradient-to-b from-[#fbfbfa] to-surface"
        scrollerClassName="px-[14px]"
        footer={product.status === "returned" ? <ReturnNotice product={product} /> : undefined}
      />
    </article>
  );
}
