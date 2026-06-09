"use client";

import {
  ArrowDownAZ,
  CalendarClock,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { FilterBar } from "@/components/ds/filter-bar";
import { FilterDropdown, type FilterDropdownOption } from "@/components/ds/filter-dropdown";
import { TabBar, type TabItem } from "@/components/ds/tab-bar";

type Tab = "active" | "archived";

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

export function CollectionsFilterBar({
  tab,
  onTabChange,
  activeCount,
  archivedCount,
}: CollectionsFilterBarProps) {
  const [sort, setSort] = useState<string>("За дедлайном");
  const [brand, setBrand] = useState<string>("All");

  const tabs: TabItem<Tab>[] = [
    { id: "active", label: "Активні", count: activeCount },
    { id: "archived", label: "Архівовані", count: archivedCount },
  ];

  return (
    <FilterBar>
      <TabBar tabs={tabs} active={tab} onChange={onTabChange} />

      <div className="flex min-w-0 flex-1 flex-wrap items-end justify-end gap-x-[8px] gap-y-[2px] py-[8px] pl-[80px]">
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
      </div>
    </FilterBar>
  );
}
