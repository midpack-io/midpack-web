"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { ImageIcon, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import type { CollectionId, Product, ProductId } from "@/lib/api/types";

type ProductCollectionStripProps = {
  collectionId: CollectionId | undefined;
  activeProductId: ProductId;
};

type StatusIndicator = "blocked" | "review" | null;

function getStatusIndicator(product: Product): StatusIndicator {
  // Blocked wins over review — it's the more urgent attention signal.
  if (product.stages.some((s) => s.status === "blocked")) return "blocked";
  if (
    product.status === "in_review" ||
    product.stages.some((s) => s.isReview && s.status === "in-progress")
  ) {
    return "review";
  }
  return null;
}

export function ProductCollectionStrip({
  collectionId,
  activeProductId,
}: ProductCollectionStripProps) {
  const productsQuery = useProducts(collectionId);

  const products = useMemo(() => {
    const list = productsQuery.data ?? [];
    return [...list].sort((a, b) => a.styleNo.localeCompare(b.styleNo));
  }, [productsQuery.data]);

  return (
    <aside
      aria-label="Other products in this collection"
      className="flex h-full w-[56px] shrink-0 flex-col border-r border-border bg-surface"
    >
      <StripScrollArea>
        {productsQuery.isPending ? (
          <SkeletonList />
        ) : (
          <nav className="flex flex-col items-center gap-[4px] py-[8px]">
            {products.map((product) => (
              <StripItem
                key={product.id}
                product={product}
                active={product.id === activeProductId}
              />
            ))}
            <AddProductItem />
          </nav>
        )}
      </StripScrollArea>
    </aside>
  );
}

function StripScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="strip-scroll min-h-0 flex-1 overflow-y-auto"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0, #000 12px, #000 calc(100% - 12px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0, #000 12px, #000 calc(100% - 12px), transparent 100%)",
      }}
    >
      {children}
    </div>
  );
}

function StripItem({ product, active }: { product: Product; active: boolean }) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  // Keep the active thumbnail visible whenever the page changes products.
  useEffect(() => {
    if (!active) return;
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active]);

  const label = `${product.styleNo} — ${product.name}`;
  const indicator = getStatusIndicator(product);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          ref={ref}
          href={`/products/${product.id}?collection=${product.collectionId}`}
          aria-current={active ? "page" : undefined}
          className="group relative flex shrink-0 items-center justify-center rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          <Thumbnail product={product} active={active} />
          {indicator && <StatusDot kind={indicator} />}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={2}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function Thumbnail({ product, active }: { product: Product; active: boolean }) {
  // Active gets a whisper-thin foreground ring + soft shadow — far less
  // aggressive than the previous solid ring. Non-active stays muted; hover
  // restores full color so the user can preview.
  const shell = cn(
    "relative size-[48px] shrink-0 overflow-hidden rounded-[8px] bg-surface-3 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] transition-[filter,opacity,box-shadow] duration-150",
    active
      ? "shadow-md ring-1 ring-foreground/15"
      : "opacity-55 grayscale group-hover:opacity-100 group-hover:grayscale-0",
  );
  if (!product.thumbnail) {
    return (
      <div className={cn(shell, "flex items-center justify-center")}>
        <ImageIcon
          aria-hidden
          strokeWidth={1.5}
          className="size-[22px] text-zinc-300"
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

function StatusDot({ kind }: { kind: Exclude<StatusIndicator, null> }) {
  // Sits in the thumbnail's top-right, with a white outline so the dot reads
  // against any underlying photo.
  return (
    <span
      aria-hidden
      className={cn(
        "absolute right-[2px] top-[2px] size-[8px] rounded-full ring-2 ring-surface",
        kind === "blocked" ? "bg-coral" : "bg-amber-400",
      )}
    />
  );
}

function AddProductItem() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Add product"
          className="group relative flex size-[48px] shrink-0 items-center justify-center rounded-[8px] border border-dashed border-border bg-transparent text-zinc-400 transition-colors hover:border-foreground/30 hover:bg-surface-3 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          <Plus className="size-[18px]" strokeWidth={1.5} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={2}>
        Add product
      </TooltipContent>
    </Tooltip>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col items-center gap-[4px] py-[8px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="size-[48px] shrink-0 animate-pulse rounded-[8px] bg-surface-3"
        />
      ))}
    </div>
  );
}
