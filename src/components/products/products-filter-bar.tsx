"use client";

import {
  ArrowDownAZ,
  ArrowDownZA,
  CalendarClock,
  Clock,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { FilterAddMenu } from "@/components/ds/filter-add-menu";
import { FilterBar } from "@/components/ds/filter-bar";
import { FilterDropdown } from "@/components/ds/filter-dropdown";
import {
  FilterMultiselect,
  type FilterMultiselectOption,
} from "@/components/ds/filter-multiselect";
import { TabBar, type TabItem } from "@/components/ds/tab-bar";
import type { CustomFieldDef, Stage, Tag } from "@/lib/api/types";
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
  tagCatalog: Tag[];
  customFieldCatalog: CustomFieldDef[];
};

const TAB_LABELS: { id: ProductsTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress" },
  { id: "needs-you", label: "Needs you" },
  { id: "in-review", label: "In review" },
  { id: "returned", label: "Returned" },
  { id: "blocked", label: "Blocked" },
  { id: "done", label: "Done" },
];

const SORT_LABEL: Record<ProductsSort, string> = {
  "activity-newest": "Latest activity (newest)",
  "activity-oldest": "Latest activity (oldest)",
  "due-soonest": "Due date (soonest)",
  "due-latest": "Due date (latest)",
  "progress-most": "Progress (most)",
  "progress-least": "Progress (least)",
  "name-asc": "Name (A → Z)",
  "name-desc": "Name (Z → A)",
};

const SORT_ICON: Record<ProductsSort, LucideIcon> = {
  "activity-newest": Clock,
  "activity-oldest": Clock,
  "due-soonest": CalendarClock,
  "due-latest": CalendarClock,
  "progress-most": TrendingUp,
  "progress-least": TrendingDown,
  "name-asc": ArrowDownAZ,
  "name-desc": ArrowDownZA,
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

export function ProductsFilterBar({
  state,
  onChange,
  tabCounts,
  needsYouAttention,
  tagCatalog,
  customFieldCatalog,
}: ProductsFilterBarProps) {
  const tabs: TabItem<ProductsTab>[] = TAB_LABELS.map((t) => ({
    id: t.id,
    label: t.label,
    count: tabCounts[t.id],
    attention: t.id === "needs-you" && !!needsYouAttention,
  }));

  const tagOptions: FilterMultiselectOption[] = tagCatalog.map((t) => ({
    value: t.label,
    label: t.label,
  }));

  // Presence of a key in fieldValues == "the chip is shown". The user adds a
  // chip via the + Add filter menu (initial empty array) and removes it via
  // the chip's "Remove filter" footer item. Empty array == filter is inactive
  // (the predicate ignores it), but the chip stays visible.
  const activeFieldKeys = Object.keys(state.fieldValues);
  const activeFieldDefs = customFieldCatalog.filter((def) =>
    activeFieldKeys.includes(def.key),
  );
  const availableToAdd = customFieldCatalog.filter(
    (def) => !activeFieldKeys.includes(def.key),
  );

  const setField = (key: string, values: string[]) => {
    onChange({
      ...state,
      fieldValues: { ...state.fieldValues, [key]: values },
    });
  };

  const removeField = (key: string) => {
    const next = { ...state.fieldValues };
    delete next[key];
    onChange({ ...state, fieldValues: next });
  };

  const addField = (key: string) => {
    onChange({
      ...state,
      fieldValues: { ...state.fieldValues, [key]: [] },
    });
  };

  return (
    <FilterBar>
      <TabBar tabs={tabs} active={state.tab} onChange={(tab) => onChange({ ...state, tab })} />

      <div className="flex min-w-0 flex-1 flex-wrap items-end justify-end gap-x-[8px] gap-y-[2px] py-[8px] pl-[80px]">
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

        <FilterMultiselect
          label="Tags"
          options={tagOptions}
          values={state.tags}
          onChange={(values) => onChange({ ...state, tags: values })}
          emptyLabel="Any"
        />

        {activeFieldDefs.map((def) => (
          <FilterMultiselect
            key={def.key}
            label={def.label}
            options={def.values.map((v) => ({ value: v, label: v }))}
            values={state.fieldValues[def.key] ?? []}
            onChange={(values) => setField(def.key, values)}
            emptyLabel="Any"
            onRemove={() => removeField(def.key)}
          />
        ))}

        {availableToAdd.length > 0 && (
          <FilterAddMenu
            options={availableToAdd.map((def) => ({
              value: def.key,
              label: def.label,
            }))}
            onSelect={addField}
          />
        )}
      </div>
    </FilterBar>
  );
}
