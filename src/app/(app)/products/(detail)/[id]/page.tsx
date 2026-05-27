"use client";

import { use, useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BundleStepper } from "@/components/ds/bundle-stepper";
import { ProductDetailBar } from "@/components/products/product-detail-bar";
import { ProductWorkspacePane } from "@/components/products/product-workspace-pane";
import { indexPeople, usePeople } from "@/hooks/usePeople";
import { useProduct } from "@/hooks/useProduct";
import type {
  PersonId,
  ProductId,
  StageInstance,
  StageStatus,
} from "@/lib/api/types";

// First stage that is still actionable — not done and not canceled. Drives the
// default tab selection when the URL doesn't carry a ?stage= param.
function firstNonTerminalStage(
  stages: StageInstance[],
): StageInstance | undefined {
  return stages.find((s) => s.status !== "done" && s.status !== "canceled");
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = id as ProductId;

  const productQuery = useProduct(productId);
  const product = productQuery.data;
  const peopleQuery = usePeople();
  const peopleMap = useMemo(
    () => indexPeople(peopleQuery.data),
    [peopleQuery.data],
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlStage = searchParams.get("stage") ?? undefined;
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

  // Effective stage: URL ?stage= wins (if it points at a real stage on this
  // product); otherwise default to the first non-done/non-canceled stage;
  // otherwise fall back to the product's canonical current stage. URL is the
  // source of truth — we don't write the default back, keeping shareable URLs
  // clean for the common case.
  const urlStageIsValid = useMemo(
    () => !!urlStage && stages.some((s) => s.n === urlStage),
    [urlStage, stages],
  );
  const effectiveStageN =
    (urlStageIsValid ? urlStage : undefined) ??
    firstNonTerminalStage(stages)?.n ??
    product?.currentStageN;
  const selectedStage = stages.find((s) => s.n === effectiveStageN);

  const handleSelectStage = useCallback(
    (n: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("stage", n);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

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
    <>
      {product && selectedStage && (
        <BundleStepper
          stages={stages}
          variant="page"
          mode="tabs"
          selectedStageN={selectedStage.n}
          onSelectStage={handleSelectStage}
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

      {product && (
        <ProductWorkspacePane
          productId={product.id}
          selectedStageN={selectedStage?.n}
        />
      )}

      {productQuery.isError && !product && null}
    </>
  );
}
