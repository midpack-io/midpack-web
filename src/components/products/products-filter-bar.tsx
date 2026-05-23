"use client";

import {
  ArrowDownAZ,
  CalendarClock,
  Clock,
  Layers,
  LayoutGrid,
  List,
  Rows3,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { FilterBar } from "@/components/ds/filter-bar";
import { FilterDropdown } from "@/components/ds/filter-dropdown";
import {
  FilterMultiselect,
  type FilterMultiselectOption,
} from "@/components/ds/filter-multiselect";
import { TabBar, type TabItem } from "@/components/ds/tab-bar";
import { ViewToggle, type ViewToggleOption } from "@/components/ds/view-toggle";
import type { Stage } from "@/lib/api/types";
import type {
  ProductsFilterState,
  ProductsSort,
  ProductsTab,
} from "./products-filter";

type ProductsFilterBarProps = {
  state: ProductsFilterState;
  onChange: (state: ProductsFilterState) => void;
  tabCounts: Record<ProductsTab, number>;
  needsYouAttention?: boolean; // shows a coral dot on the "Needs you" tab
};

const TAB_LABELS: { id: ProductsTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs-you", label: "Needs you" },
  { id: "in-review", label: "In review" },
  { id: "returned", label: "Returned" },
  { id: "in-production", label: "In production" },
  { id: "done", label: "Done" },
];

const SORT_LABEL: Record<ProductsSort, string> = {
  stage: "Stage order",
  activity: "Latest activity",
  due: "Due date",
  name: "Name",
  progress: "Progress",
};

const SORT_ICON: Record<ProductsSort, LucideIcon> = {
  stage: Layers,
  activity: Clock,
  due: CalendarClock,
  name: ArrowDownAZ,
  progress: TrendingUp,
};

// Stage labels match the Ukrainian copy used in the seed data
// (src/mocks/data/products.ts FLOW). Centralized here for the filter UI.
const STAGE_OPTIONS: FilterMultiselectOption[] = [
  { value: "idea", label: "Ідея" },
  { value: "sketch", label: "Ескізи" },
  { value: "techpack", label: "Тех-пак" },
  { value: "procurement", label: "Закупівля" },
  { value: "patterns", label: "Лекала" },
  { value: "sample", label: "Перший зразок" },
  { value: "fitting", label: "Примірка" },
  { value: "grading", label: "Градація" },
  { value: "production", label: "Виробництво" },
];

type View = "card" | "list" | "board";

const VIEW_OPTIONS: ViewToggleOption<View>[] = [
  { id: "card", label: "Card", icon: LayoutGrid, comingSoon: true },
  { id: "list", label: "List", icon: Rows3 },
  { id: "board", label: "Board", icon: List, comingSoon: true },
];

export function ProductsFilterBar({
  state,
  onChange,
  tabCounts,
  needsYouAttention,
}: ProductsFilterBarProps) {
  const [view, setView] = useState<View>("list");

  const tabs: TabItem<ProductsTab>[] = TAB_LABELS.map((t) => ({
    id: t.id,
    label: t.label,
    count: tabCounts[t.id],
    attention: t.id === "needs-you" && !!needsYouAttention,
  }));

  return (
    <FilterBar>
      <TabBar tabs={tabs} active={state.tab} onChange={(tab) => onChange({ ...state, tab })} />

      <div className="flex-1" />

      <FilterDropdown
        label="Sort"
        value={SORT_LABEL[state.sort]}
        options={(Object.keys(SORT_LABEL) as ProductsSort[]).map((k) => ({
          label: SORT_LABEL[k],
          icon: SORT_ICON[k],
          value: k,
        }))}
        onSelect={(v) => onChange({ ...state, sort: v as ProductsSort })}
      />

      <FilterMultiselect
        label="Stage"
        options={STAGE_OPTIONS}
        values={state.stages}
        onChange={(values) => onChange({ ...state, stages: values as Stage[] })}
        emptyLabel="All"
      />

      <ViewToggle options={VIEW_OPTIONS} active={view} onChange={setView} />
    </FilterBar>
  );
}
