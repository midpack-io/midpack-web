"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ProductCollectionStrip } from "@/components/products/product-collection-strip";
import { ProductPageHeader } from "@/components/products/product-page-header";
import { TopBar } from "@/components/shell/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection } from "@/hooks/useCollection";
import { indexPeople, usePeople } from "@/hooks/usePeople";
import { useProduct } from "@/hooks/useProduct";
import type { CollectionId, ProductId } from "@/lib/api/types";

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ id: string }>();
  const productId = params.id as ProductId;

  const searchParams = useSearchParams();
  const collectionFromUrl = searchParams.get("collection") as
    | CollectionId
    | null;

  const productQuery = useProduct(productId);
  const product = productQuery.data;

  // Prefer the URL's collection id so the strip renders from cache instantly
  // on cold load (no wait on useProduct). Fall back to the product's resolved
  // collectionId for deep-links that arrive without the query param.
  const collectionId = collectionFromUrl ?? product?.collectionId;

  const collection = useCollection(collectionId);
  const peopleQuery = usePeople();
  const peopleMap = useMemo(
    () => indexPeople(peopleQuery.data),
    [peopleQuery.data],
  );

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-bg">
      <TopBar
        breadcrumbs={[
          { label: "Робочий простір", href: "/" },
          { label: "Колекції", href: "/collections" },
          collection.data
            ? {
                label: collection.data.name,
                href: `/products?collection=${collection.data.id}`,
              }
            : { label: "…" },
          { label: product ? `${product.styleNo} — ${product.name}` : "…" },
        ]}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ProductCollectionStrip
          collectionId={collectionId}
          activeProductId={productId}
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-border bg-surface px-[24px]">
            {productQuery.isError ? (
              <NotFound />
            ) : product ? (
              <ProductPageHeader
                product={product}
                collection={collection.data}
                peopleMap={peopleMap}
              />
            ) : (
              <HeaderSkeleton />
            )}
          </div>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-bg">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-[18px] py-[22px]">
      <Skeleton className="size-[96px] shrink-0 rounded-md bg-surface-3" />
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        <Skeleton className="h-[32px] w-[320px] bg-surface-3" />
        <Skeleton className="h-[16px] w-[420px] bg-surface-3" />
        <Skeleton className="h-[24px] w-[360px] bg-surface-3" />
      </div>
      <div className="flex shrink-0 items-center gap-[8px] self-start pt-[4px]">
        <Skeleton className="h-[36px] w-[56px] bg-surface-3" />
        <Skeleton className="h-[36px] w-[110px] bg-surface-3" />
        <Skeleton className="h-[36px] w-[110px] bg-surface-3" />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="py-[80px] text-center">
      <p className="text-base text-zinc-500">Продукт не знайдено.</p>
    </div>
  );
}
