"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/shell/top-bar";
import { PageHeader } from "@/components/shell/page-header";
import { useAllProducts } from "@/hooks/useAllProducts";
import { useAllTags } from "@/hooks/useAllTags";
import { useAllCustomFields } from "@/hooks/useAllCustomFields";
import { useCollections } from "@/hooks/useCollections";
import { useWorklistViews } from "@/hooks/useWorklistViews";
import { useCreateWorklistView } from "@/hooks/useCreateWorklistView";
import { useUpdateWorklistView } from "@/hooks/useUpdateWorklistView";
import { useDeleteWorklistView } from "@/hooks/useDeleteWorklistView";
import { usePeople, indexPeople } from "@/hooks/usePeople";
import type { CollectionId, PersonId, ProductsTab, ViewId } from "@/lib/api/types";
import { ProductsFilterBar } from "@/components/products/products-filter-bar";
import { ProductsList } from "@/components/products/products-list";
import {
  countByTab,
  EMPTY_QUERY,
  matchesQuery,
  nameMatches,
  queriesEqual,
  sortProducts,
  systemViewQuery,
  TAB_LABELS,
  type ProductsFilterState,
} from "@/components/products/products-filter";

// Demo "current user" — same as the products workspace. Drives the "Needs you"
// counts, now spanning every collection.
const CURRENT_USER_ID = "p-anna" as PersonId;

export function WorklistWorkspace() {
  const products = useAllProducts();
  const peopleQuery = usePeople();
  const peopleMap = useMemo(() => indexPeople(peopleQuery.data), [peopleQuery.data]);
  const tagsQuery = useAllTags();
  const customFieldsQuery = useAllCustomFields();
  const collectionsQuery = useCollections();
  const viewsQuery = useWorklistViews();
  const createView = useCreateWorklistView();
  const updateView = useUpdateWorklistView();
  const deleteView = useDeleteWorklistView();

  // Worklist defaults to "my work": the performer filter is pre-seeded with the
  // current user so the cross-collection list opens scoped to me, not everyone.
  const [filter, setFilter] = useState<ProductsFilterState>({
    ...EMPTY_QUERY,
    assignee: [CURRENT_USER_ID],
  });
  const [search, setSearch] = useState("");
  const [activeViewId, setActiveViewId] = useState<ViewId | null>(null);

  const allProducts = products.data ?? [];
  const savedViews = viewsQuery.data ?? [];
  const collections = collectionsQuery.data ?? [];

  const collectionCatalog = useMemo(
    () => collections.map((c) => ({ id: c.id, label: c.name })),
    [collections],
  );
  const collectionsById = useMemo(
    () => new Map(collections.map((c) => [c.id, { name: c.name }])),
    [collections],
  );

  const tabCounts = useMemo(
    () => countByTab(allProducts, CURRENT_USER_ID),
    [allProducts],
  );

  const visibleProducts = useMemo(() => {
    const filtered = allProducts.filter(
      (p) => matchesQuery(p, filter, CURRENT_USER_ID) && nameMatches(p, search),
    );
    return sortProducts(filtered, filter.sort);
  }, [allProducts, filter, search]);

  const systemViews = TAB_LABELS.map((t) => ({
    tab: t.tab,
    label: t.label,
    count: tabCounts[t.tab],
    attention: t.tab === "needs-you" && tabCounts["needs-you"] > 0,
  }));

  const savedViewItems = useMemo(
    () =>
      savedViews.map((v) => ({
        id: v.id,
        name: v.name,
        count: allProducts.filter((p) => matchesQuery(p, v.query, CURRENT_USER_ID)).length,
      })),
    [savedViews, allProducts],
  );

  const activeView = savedViews.find((v) => v.id === activeViewId);
  const activeLabel =
    activeView?.name ??
    TAB_LABELS.find((t) => t.tab === filter.tab)?.label ??
    "Усі";
  const modified = !!activeView && !queriesEqual(filter, activeView.query);

  const selectSystem = (tab: ProductsTab) => {
    setActiveViewId(null);
    setFilter(systemViewQuery(tab));
  };
  const selectSaved = (id: ViewId) => {
    const view = savedViews.find((v) => v.id === id);
    if (!view) return;
    setActiveViewId(id);
    setFilter(view.query);
  };
  const handleDelete = (id: ViewId) => {
    deleteView.mutate(id);
    if (id === activeViewId) setActiveViewId(null);
  };
  const handleSaveAsNew = (name: string) => {
    createView.mutate(
      { name, query: filter },
      { onSuccess: (view) => setActiveViewId(view.id) },
    );
  };
  const handleSaveChanges = () => {
    if (!activeViewId) return;
    updateView.mutate({ viewId: activeViewId, patch: { query: filter } });
  };

  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[{ label: "Worklist" }]}
      />
      <div className="mx-auto max-w-page px-[24px]">
        <PageHeader title="Worklist" className="pb-[12px]" />
      </div>
      <ProductsFilterBar
        state={filter}
        onChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        activeLabel={activeLabel}
        needsYouAttention={tabCounts["needs-you"] > 0}
        systemViews={systemViews}
        savedViews={savedViewItems}
        activeViewId={activeViewId}
        onSelectSystem={selectSystem}
        onSelectSaved={selectSaved}
        onDeleteView={handleDelete}
        onSaveAsNew={handleSaveAsNew}
        onSaveChanges={modified ? handleSaveChanges : undefined}
        meId={CURRENT_USER_ID}
        tagCatalog={tagsQuery.data ?? []}
        customFieldCatalog={customFieldsQuery.data ?? []}
        collectionCatalog={collectionCatalog}
      />
      <div className="mx-auto max-w-page px-[24px] pt-[20px]">
        <ProductsList
          query={products}
          visibleProducts={visibleProducts}
          filter={filter}
          peopleMap={peopleMap}
          showNewProductRow={false}
          collectionsById={collectionsById}
        />
        <div className="h-[48px]" />
      </div>
    </main>
  );
}
