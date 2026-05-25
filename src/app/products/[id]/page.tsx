"use client";

import { use, useMemo, useState } from "react";
import { BundleStepper } from "@/components/ds/bundle-stepper";
import { ProductDetailBar } from "@/components/products/product-detail-bar";
import { ProductPageHeader } from "@/components/products/product-page-header";
import { ProductWorkspacePane } from "@/components/products/product-workspace-pane";
import { TopBar } from "@/components/shell/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection } from "@/hooks/useCollection";
import { indexPeople, usePeople } from "@/hooks/usePeople";
import { useProduct } from "@/hooks/useProduct";
import type {
  PersonId,
  ProductId,
  StageInstance,
  StageStatus,
} from "@/lib/api/types";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = id as ProductId;

  const productQuery = useProduct(productId);
  const product = productQuery.data;
  const collection = useCollection(product?.collectionId);
  const peopleQuery = usePeople();
  const peopleMap = useMemo(
    () => indexPeople(peopleQuery.data),
    [peopleQuery.data],
  );

  const [selectedStageN, setSelectedStageN] = useState<string | undefined>(
    undefined,
  );
  // Stage-1 local overrides for stage assignments. Persisted in component
  // state so the user's picks survive query refetches; reset on remount /
  // navigation. Stage 2 will replace this with a real mutation hook.
  const [stageOverrides, setStageOverrides] = useState<
    Record<
      string,
      {
        performerId?: PersonId | "unassigned";
        status?: StageStatus;
        locked?: boolean;
        manuallyUnlocked?: boolean;
      }
    >
  >({});
  const stages: StageInstance[] = useMemo(() => {
    if (!product?.stages) return [];
    return product.stages.map((s) => {
      const override = stageOverrides[s.n];
      return override ? { ...s, ...override } : s;
    });
  }, [product?.stages, stageOverrides]);
  const effectiveStageN = selectedStageN ?? product?.currentStageN;
  const selectedStage = stages.find((s) => s.n === effectiveStageN);

  const handlePerformerChange = useMemo(
    () => (n: string, next: PersonId | "unassigned") => {
      setStageOverrides((prev) => ({
        ...prev,
        [n]: { ...prev[n], performerId: next },
      }));
    },
    [],
  );
  const handleStatusChange = useMemo(
    () => (n: string, next: StageStatus) => {
      setStageOverrides((prev) => ({
        ...prev,
        [n]: { ...prev[n], status: next },
      }));
    },
    [],
  );
  const handleUnlock = useMemo(
    () => (n: string) => {
      setStageOverrides((prev) => ({
        ...prev,
        [n]: { ...prev[n], locked: false, manuallyUnlocked: true },
      }));
    },
    [],
  );

  return (
    <main className="flex min-h-screen flex-col bg-bg">
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

      <div className="border-b border-border bg-surface px-[24px]">
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

      {product && selectedStage && (
        <BundleStepper
          stages={stages}
          variant="page"
          mode="tabs"
          selectedStageN={selectedStage.n}
          onSelectStage={setSelectedStageN}
          onStatusChange={handleStatusChange}
          onPerformerChange={handlePerformerChange}
          onUnlock={handleUnlock}
          showDetailBar
          className="bg-surface"
          detailBar={
            <ProductDetailBar
              key={selectedStage.n}
              product={product}
              stage={selectedStage}
              peopleMap={peopleMap}
            />
          }
        />
      )}

      {product && <ProductWorkspacePane productId={product.id} />}
    </main>
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
