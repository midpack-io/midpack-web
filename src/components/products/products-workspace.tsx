"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/shell/top-bar";
import { GroupHeader } from "@/components/ds/group-header";
import { useCollection } from "@/hooks/useCollection";
import { useCollectionCustomFields } from "@/hooks/useCollectionCustomFields";
import { useCollectionTags } from "@/hooks/useCollectionTags";
import { useProducts } from "@/hooks/useProducts";
import { usePeople, indexPeople } from "@/hooks/usePeople";
import type { CollectionId, PersonId } from "@/lib/api/types";
import { ProductsPageHeader } from "./products-page-header";
import { ProductsFilterBar } from "./products-filter-bar";
import { ProductsList } from "./products-list";
import {
  countByTab,
  fieldValuesMatches,
  sortProducts,
  stagesMatches,
  tabMatches,
  tagsMatches,
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
  const tagsQuery = useCollectionTags(collectionId);
  const customFieldsQuery = useCollectionCustomFields(collectionId);

  const [filter, setFilter] = useState<ProductsFilterState>({
    tab: "all",
    sort: "activity-newest",
    stages: [],
    tags: [],
    fieldValues: {},
  });

  const allProducts = products.data ?? [];
  const tabCounts = useMemo(
    () => countByTab(allProducts, CURRENT_USER_ID),
    [allProducts],
  );

  const visibleProducts = useMemo(() => {
    const filtered = allProducts.filter(
      (p) =>
        tabMatches(p, filter.tab, CURRENT_USER_ID) &&
        stagesMatches(p, filter.stages) &&
        tagsMatches(p, filter.tags) &&
        fieldValuesMatches(p, filter.fieldValues),
    );
    return sortProducts(filtered, filter.sort);
  }, [allProducts, filter]);

  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[
          { label: "Робочий простір", href: "/" },
          { label: "Колекції", href: "/collections" },
          { label: collection.data?.name ?? "…" },
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
        tagCatalog={tagsQuery.data ?? []}
        customFieldCatalog={customFieldsQuery.data ?? []}
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
  "activity-newest": "newest activity first",
  "activity-oldest": "oldest activity first",
  "due-soonest": "soonest due first",
  "due-latest": "latest due first",
  "progress-most": "most progress first",
  "progress-least": "least progress first",
  "name-asc": "name A → Z",
  "name-desc": "name Z → A",
} as const;

function groupLabel(tab: ProductsFilterState["tab"]): string {
  switch (tab) {
    case "all":
      return "All styles";
    case "in-progress":
      return "In progress";
    case "needs-you":
      return "Needs you";
    case "in-review":
      return "In review";
    case "returned":
      return "Returned";
    case "blocked":
      return "Blocked";
    case "done":
      return "Done";
  }
}

