"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ImageIcon, Plus } from "lucide-react";
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

type StatusIndicator = "complete" | "blocked" | "review" | null;

function isComplete(product: Product): boolean {
  return (
    product.stages.length > 0 &&
    product.stages.every((s) => s.status === "done" || s.status === "canceled")
  );
}

function getStatusIndicator(product: Product): StatusIndicator {
  // Complete wins — once the product is wrapped up, the attention signals
  // ("blocked", "in review") no longer apply.
  if (isComplete(product)) return "complete";
  if (product.stages.some((s) => s.status === "blocked")) return "blocked";
  if (
    product.status === "in_review" ||
    product.stages.some((s) => s.isReview && s.status === "in-progress")
  ) {
    return "review";
  }
  return null;
}

function sortRank(product: Product): number {
  const indicator = getStatusIndicator(product);
  if (indicator === "blocked") return 0;
  if (indicator === "review") return 1;
  if (indicator === "complete") return 3;
  return 2;
}

export function ProductCollectionStrip({
  collectionId,
  activeProductId,
}: ProductCollectionStripProps) {
  const productsQuery = useProducts(collectionId);

  const products = useMemo(() => {
    const list = productsQuery.data ?? [];
    return [...list].sort((a, b) => {
      // Sort by urgency: blocked → in review → rest → complete. Within each
      // bucket, products stay ordered by style number.
      const ra = sortRank(a);
      const rb = sortRank(b);
      if (ra !== rb) return ra - rb;
      return a.styleNo.localeCompare(b.styleNo);
    });
  }, [productsQuery.data]);

  // Open state: hover OR keyboard focus expands the panel; mouse leaving
  // collapses it. Pointer leave also clears `focused` — otherwise a click
  // on a Link leaves DOM focus on the link, and the panel would stay
  // expanded indefinitely after the user moves the mouse away.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const expanded = hovered || focused;

  return (
    // The aside reserves a 12px column in layout. The interactive panel
    // inside expands to 60px on hover/focus and overlays the workspace to
    // the right rather than reflowing it — so opening the strip never
    // jolts the content the user is reading.
    <aside
      aria-label="Other products in this collection"
      className="relative h-full w-[12px] shrink-0"
    >
      <div
        data-expanded={expanded}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => {
          setHovered(false);
          setFocused(false);
        }}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setFocused(false);
          }
        }}
        className={cn(
          "absolute inset-y-0 left-0 z-30 overflow-hidden border-r border-border bg-surface",
          "transition-[width,box-shadow] duration-200 ease-out",
          expanded
            ? "w-[60px] shadow-[0_8px_24px_-10px_rgba(0,0,0,0.18)]"
            : "w-[12px]",
        )}
      >
        <StripScrollArea>
          <div className="relative">
            {/* Thumbnails layer: drives the scroll height, hidden until the
              rail is open. */}
            <nav
              className={cn(
                "flex flex-col items-center gap-[6px] p-[6px]",
                "transition-opacity duration-150",
                expanded ? "opacity-100" : "opacity-0",
              )}
            >
              {productsQuery.isPending ? (
                <SkeletonList />
              ) : (
                <>
                  {products.map((product) => (
                    <StripItem
                      key={product.id}
                      product={product}
                      active={product.id === activeProductId}
                    />
                  ))}
                  <AddProductItem />
                </>
              )}
            </nav>

            {/* Rail layer: tiny dots overlaying the thumbnail positions one-
              to-one, so the active product's vertical position stays
              anchored as the panel expands. aria-hidden because the nav
              above is the real interactive surface. */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 flex w-[12px] flex-col items-center gap-[6px] p-[6px]",
                "transition-opacity duration-150",
                expanded ? "opacity-0" : "opacity-100",
              )}
            >
              {!productsQuery.isPending &&
                products.map((p) => (
                  <div
                    key={p.id}
                    className="flex h-[48px] w-full items-center justify-center"
                  >
                    <RailDot product={p} active={p.id === activeProductId} />
                  </div>
                ))}
            </div>
          </div>
        </StripScrollArea>
      </div>
    </aside>
  );
}

function StripScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="strip-scroll h-full overflow-y-auto"
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

function RailDot({ product, active }: { product: Product; active: boolean }) {
  // Status colour wins over neutral so attention signals stay visible even
  // while the panel is collapsed. Size encodes which product the page is
  // currently on.
  const indicator = getStatusIndicator(product);
  return (
    <span
      className={cn(
        "block shrink-0 rounded-full transition-[width,height,background-color]",
        active ? "size-[6px]" : "size-[4px]",
        indicator === "blocked"
          ? "bg-coral"
          : indicator === "review"
            ? "bg-amber-400"
            : indicator === "complete"
              ? "bg-ok/60"
              : active
                ? "bg-foreground/70"
                : "bg-zinc-300",
      )}
    />
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
  // Sits in the thumbnail's top-right, with a white outline so the indicator
  // reads against any underlying photo. "complete" uses a larger pill with a
  // check glyph so it doesn't get confused with the urgent dots.
  if (kind === "complete") {
    return (
      <span
        aria-hidden
        className="absolute right-[-2px] top-[-2px] flex size-[14px] items-center justify-center rounded-full bg-ok text-surface ring-2 ring-surface"
      >
        <Check className="size-[9px]" strokeWidth={3} />
      </span>
    );
  }
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
    <div className="flex flex-col items-center gap-[6px] p-[6px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="size-[48px] shrink-0 animate-pulse rounded-[8px] bg-surface-3"
        />
      ))}
    </div>
  );
}
