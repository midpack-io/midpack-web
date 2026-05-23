"use client";

import {
  ArrowDownAZ,
  CalendarClock,
  Clock,
  LayoutGrid,
  List,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { FilterBar } from "@/components/ds/filter-bar";
import { FilterDropdown, type FilterDropdownOption } from "@/components/ds/filter-dropdown";
import { TabBar, type TabItem } from "@/components/ds/tab-bar";
import { ViewToggle, type ViewToggleOption } from "@/components/ds/view-toggle";

type Tab = "active" | "archived";
type View = "grid" | "list";

type CollectionsFilterBarProps = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  activeCount: number;
  archivedCount: number;
};

const SORT_OPTIONS: FilterDropdownOption[] = [
  { label: "За останньою активністю", icon: Clock },
  { label: "За дедлайном", icon: CalendarClock },
  { label: "За прогресом", icon: TrendingUp },
  { label: "За алфавітом", icon: ArrowDownAZ },
];

const BRAND_OPTIONS: FilterDropdownOption[] = [
  { label: "All" },
  { label: "Midpack" },
  { label: "Atelier North" },
  { label: "Hearth & Hand" },
];

const VIEW_OPTIONS: ViewToggleOption<View>[] = [
  { id: "grid", label: "Сітка", icon: LayoutGrid },
  { id: "list", label: "Список", icon: List },
];

export function CollectionsFilterBar({
  tab,
  onTabChange,
  activeCount,
  archivedCount,
}: CollectionsFilterBarProps) {
  const [view, setView] = useState<View>("grid");
  const [sort, setSort] = useState<string>("За останньою активністю");
  const [brand, setBrand] = useState<string>("All");

  const tabs: TabItem<Tab>[] = [
    { id: "active", label: "Активні", count: activeCount },
    { id: "archived", label: "Архівовані", count: archivedCount },
  ];

  return (
    <FilterBar>
      <TabBar tabs={tabs} active={tab} onChange={onTabChange} />

      <div className="flex-1" />

      <FilterDropdown
        label="Сортування"
        value={sort}
        options={SORT_OPTIONS}
        onSelect={setSort}
        showSelectedIcon
        hideActiveOption
      />

      <FilterDropdown
        label="Brand"
        value={brand}
        options={BRAND_OPTIONS}
        onSelect={setBrand}
        hideActiveOption
      />

      <ViewToggle options={VIEW_OPTIONS} active={view} onChange={setView} />
    </FilterBar>
  );
}
