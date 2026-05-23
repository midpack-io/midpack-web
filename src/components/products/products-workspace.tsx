"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/shell/top-bar";
import { useCollection } from "@/hooks/useCollection";
import { useProducts } from "@/hooks/useProducts";
import { usePeople, indexPeople } from "@/hooks/usePeople";
import type { CollectionId, PersonId } from "@/lib/api/types";
import { ProductsPageHeader } from "./products-page-header";
import { ProductsFilterBar } from "./products-filter-bar";
import { ProductsList } from "./products-list";
import {
  countByTab,
  sortProducts,
  stagesMatches,
  tabMatches,
  type ProductsFilterState,
} from "./products-filter";

type ProductsWorkspaceProps = {
  collectionId: CollectionId;
};

// Demo "current user" — Anna Kovalenko in the seed people set. Used so
// "Needs you" can render a meaningful count and pills get the warn glyph on
// stages where she's the performer/approver.
const CURRENT_USER_ID = "p-anna" as PersonId;

export function ProductsWorkspace({ collectionId }: ProductsWorkspaceProps) {
  const collection = useCollection(collectionId);
  const products = useProducts(collectionId);
  const peopleQuery = usePeople();
  const peopleMap = useMemo(() => indexPeople(peopleQuery.data), [peopleQuery.data]);

  const [filter, setFilter] = useState<ProductsFilterState>({
    tab: "all",
    sort: "stage",
    stages: [],
  });

  const allProducts = products.data ?? [];
  const tabCounts = useMemo(
    () => countByTab(allProducts, CURRENT_USER_ID),
    [allProducts],
  );

  const visibleProducts = useMemo(() => {
    const filtered = allProducts.filter(
      (p) => tabMatches(p, filter.tab, CURRENT_USER_ID) && stagesMatches(p, filter.stages),
    );
    return sortProducts(filtered, filter.sort);
  }, [allProducts, filter]);

  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[
          "Робочий простір",
          "Колекції",
          collection.data?.name ?? "…",
        ]}
      />
      <div className="mx-auto max-w-page px-[24px]">
        <ProductsPageHeader
          collection={collection.data}
          collectionLoading={collection.isLoading || collection.isPending}
        />
      </div>
      <ProductsFilterBar
        state={filter}
        onChange={setFilter}
        tabCounts={tabCounts}
        needsYouAttention={tabCounts["needs-you"] > 0}
      />
      <div className="mx-auto max-w-page px-[24px]">
        <GroupHeader
          label={groupLabel(filter.tab)}
          meta={`${visibleProducts.length} styles · sorted by ${SORT_META[filter.sort]}`}
        />
        <ProductsList
          query={products}
          visibleProducts={visibleProducts}
          filter={filter}
          peopleMap={peopleMap}
        />
        <div className="h-[48px]" />
      </div>
    </main>
  );
}

const SORT_META = {
  stage: "stage order",
  activity: "latest activity",
  due: "due date",
  name: "name",
  progress: "progress",
} as const;

function groupLabel(tab: ProductsFilterState["tab"]): string {
  switch (tab) {
    case "all":
      return "All styles";
    case "needs-you":
      return "Needs you";
    case "in-review":
      return "In review";
    case "returned":
      return "Returned";
    case "in-production":
      return "In production";
    case "done":
      return "Done";
  }
}

function GroupHeader({ label, meta }: { label: string; meta: string }) {
  return (
    <div className="flex items-baseline gap-[10px] py-[18px]">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </span>
      <span className="font-mono text-sm text-zinc-400">{meta}</span>
    </div>
  );
}
