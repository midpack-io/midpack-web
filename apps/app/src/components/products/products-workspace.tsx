"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/shell/top-bar";
import { useCollection } from "@/hooks/useCollection";
import { useCollectionCustomFields } from "@/hooks/useCollectionCustomFields";
import { useCollectionTags } from "@/hooks/useCollectionTags";
import { useCollectionViews } from "@/hooks/useCollectionViews";
import { useCreateView } from "@/hooks/useCreateView";
import { useDeleteView } from "@/hooks/useDeleteView";
import { useUpdateView } from "@/hooks/useUpdateView";
import { useProducts } from "@/hooks/useProducts";
import { usePeople, indexPeople } from "@/hooks/usePeople";
import type { CollectionId, PersonId, ProductsTab, ViewId } from "@/lib/api/types";
import { ProductsPageHeader } from "./products-page-header";
import { ProductsFilterBar } from "./products-filter-bar";
import { ProductsList } from "./products-list";
import {
  countByTab,
  DEFAULT_QUERY,
  matchesQuery,
  nameMatches,
  queriesEqual,
  sortProducts,
  systemViewQuery,
  TAB_LABELS,
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
  const viewsQuery = useCollectionViews(collectionId);
  const createView = useCreateView();
  const updateView = useUpdateView();
  const deleteView = useDeleteView();

  const [filter, setFilter] = useState<ProductsFilterState>(DEFAULT_QUERY);
  const [search, setSearch] = useState("");
  const [activeViewId, setActiveViewId] = useState<ViewId | null>(null);

  const allProducts = products.data ?? [];
  const savedViews = viewsQuery.data ?? [];
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
    deleteView.mutate({ collectionId, viewId: id });
    if (id === activeViewId) setActiveViewId(null);
  };
  const handleSaveAsNew = (name: string) => {
    createView.mutate(
      { collectionId, name, query: filter },
      { onSuccess: (view) => setActiveViewId(view.id) },
    );
  };
  const handleSaveChanges = () => {
    if (!activeViewId) return;
    updateView.mutate({ collectionId, viewId: activeViewId, patch: { query: filter } });
  };

  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[
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
      />
      <div className="mx-auto max-w-page px-[24px] pt-[20px]">
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

