"use client";

import { useState } from "react";
import {
  ArrowDownAZ,
  ArrowDownZA,
  Bookmark,
  CalendarClock,
  ChevronDown,
  Clock,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { ActiveFilterChip } from "@/components/ds/active-filter-chip";
import { FilterBar } from "@/components/ds/filter-bar";
import { FilterDropdown } from "@/components/ds/filter-dropdown";
import {
  FilterMultiselect,
  type FilterMultiselectOption,
} from "@/components/ds/filter-multiselect";
import { PeopleMultiselect } from "@/components/ds/people-multiselect";
import {
  ViewsMenu,
  type SavedViewItem,
  type SystemViewItem,
} from "@/components/ds/views-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import type {
  CollectionId,
  CustomFieldDef,
  PersonId,
  ProductsTab,
  Stage,
  Tag,
  ViewId,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";
import {
  EMPTY_QUERY,
  queriesEqual,
  type ProductsFilterState,
  type ProductsSort,
} from "./products-filter";

type ProductsFilterBarProps = {
  state: ProductsFilterState;
  onChange: (state: ProductsFilterState) => void;
  search: string;
  onSearchChange: (s: string) => void;
  // Views
  activeLabel: string;
  needsYouAttention?: boolean;
  systemViews: SystemViewItem[];
  savedViews: SavedViewItem[];
  activeViewId: ViewId | null;
  onSelectSystem: (tab: ProductsTab) => void;
  onSelectSaved: (id: ViewId) => void;
  onDeleteView: (id: ViewId) => void;
  onSaveAsNew: (name: string) => void;
  // Present only when a saved view is active and the query diverges from it.
  onSaveChanges?: () => void;
  // Catalogs
  meId: PersonId;
  tagCatalog: Tag[];
  customFieldCatalog: CustomFieldDef[];
  // When provided (Worklist), renders a pinned "Колекція" filter + chips.
  // Omitted on the single-collection Products page.
  collectionCatalog?: { id: CollectionId; label: string }[];
};

const SORT_LABEL: Record<ProductsSort, string> = {
  "activity-newest": "Активність ↓",
  "activity-oldest": "Активність ↑",
  "due-soonest": "Дедлайн ↑",
  "due-latest": "Дедлайн ↓",
  "progress-most": "Прогрес ↓",
  "progress-least": "Прогрес ↑",
  "name-asc": "Назва А → Я",
  "name-desc": "Назва Я → А",
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

const STAGE_LABEL = new Map(STAGE_OPTIONS.map((o) => [o.value, o.label]));

export function ProductsFilterBar({
  state,
  onChange,
  search,
  onSearchChange,
  activeLabel,
  needsYouAttention,
  systemViews,
  savedViews,
  activeViewId,
  onSelectSystem,
  onSelectSaved,
  onDeleteView,
  onSaveAsNew,
  onSaveChanges,
  meId,
  tagCatalog,
  customFieldCatalog,
  collectionCatalog,
}: ProductsFilterBarProps) {
  const tagOptions: FilterMultiselectOption[] = tagCatalog.map((t) => ({
    value: t.label,
    label: t.label,
  }));

  const activeFieldKeys = Object.keys(state.fieldValues);
  const fieldDefByKey = new Map(customFieldCatalog.map((d) => [d.key, d]));

  const selectedCollections = state.collections ?? [];
  const collectionLabelById = new Map(
    (collectionCatalog ?? []).map((c) => [c.id, c.label]),
  );

  const canSaveAsNew = !queriesEqual(state, EMPTY_QUERY);
  const hasChips =
    state.tags.length > 0 ||
    state.stages.length > 0 ||
    activeFieldKeys.length > 0 ||
    selectedCollections.length > 0;
  const modified = !!onSaveChanges;

  const removeTag = (tag: string) =>
    onChange({ ...state, tags: state.tags.filter((t) => t !== tag) });

  const removeStage = (stage: Stage) =>
    onChange({ ...state, stages: state.stages.filter((s) => s !== stage) });

  const toggleField = (key: string, value: string) => {
    const current = state.fieldValues[key] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...state, fieldValues: { ...state.fieldValues, [key]: next } });
  };

  const removeField = (key: string) => {
    const next = { ...state.fieldValues };
    delete next[key];
    onChange({ ...state, fieldValues: next });
  };

  const removeCollection = (id: CollectionId) =>
    onChange({ ...state, collections: selectedCollections.filter((c) => c !== id) });

  const clearAll = () =>
    onChange({
      ...state,
      stages: [],
      tags: [],
      assignee: [],
      fieldValues: {},
      collections: [],
    });

  return (
    <FilterBar>
      <div className="flex w-full flex-col gap-[8px] py-[8px]">
        {/* Toolbar row */}
        <div className="flex min-w-0 flex-wrap items-center gap-x-[6px] gap-y-[4px]">
          <ViewsMenu
            activeLabel={activeLabel}
            attention={needsYouAttention}
            systemViews={systemViews}
            savedViews={savedViews}
            activeTab={state.tab}
            activeViewId={activeViewId}
            onSelectSystem={onSelectSystem}
            onSelectSaved={onSelectSaved}
            onDeleteSaved={onDeleteView}
          />

          <span aria-hidden className="mx-[2px] h-[18px] w-px bg-border" />

          <FilterDropdown
            label="Сортування"
            value={SORT_LABEL[state.sort]}
            showSelectedIcon
            options={(Object.keys(SORT_LABEL) as ProductsSort[]).map((k) => ({
              label: SORT_LABEL[k],
              icon: SORT_ICON[k],
              value: k,
            }))}
            onSelect={(v) => onChange({ ...state, sort: v as ProductsSort })}
            align="start"
          />

          <PeopleMultiselect
            label="Виконавець"
            values={state.assignee}
            onChange={(values) => onChange({ ...state, assignee: values as PersonId[] })}
            meId={meId}
          />

          <FilterMultiselect
            label="Теги"
            openerOnly
            align="start"
            options={tagOptions}
            values={state.tags}
            onChange={(values) => onChange({ ...state, tags: values })}
          />

          <FilterMultiselect
            label="Етап"
            openerOnly
            align="start"
            options={STAGE_OPTIONS}
            values={state.stages}
            onChange={(values) => onChange({ ...state, stages: values as Stage[] })}
          />

          {collectionCatalog && (
            <FilterMultiselect
              label="Колекція"
              openerOnly
              align="start"
              options={collectionCatalog.map((c) => ({ value: c.id, label: c.label }))}
              values={selectedCollections}
              onChange={(values) =>
                onChange({ ...state, collections: values as CollectionId[] })
              }
            />
          )}

          <AddFilterMenu
            fields={customFieldCatalog}
            fieldValues={state.fieldValues}
            onToggle={toggleField}
          />

          <div className="ml-auto flex items-center gap-[8px]">
            {(canSaveAsNew || modified) && (
              <FilterActionsMenu
                modified={modified}
                activeViewName={activeViewId ? activeLabel : undefined}
                canSaveAsNew={canSaveAsNew}
                hasChips={hasChips}
                onSaveChanges={onSaveChanges}
                onSaveAsNew={onSaveAsNew}
                onClearAll={clearAll}
              />
            )}
            <SearchBox value={search} onChange={onSearchChange} />
          </div>
        </div>

        {/* Active-filter chip row */}
        {hasChips && (
          <div className="flex min-w-0 flex-wrap items-center gap-[6px]">
            {selectedCollections.map((id) => (
              <ActiveFilterChip
                key={`col-${id}`}
                label="КОЛЕКЦІЯ"
                value={collectionLabelById.get(id) ?? id}
                onRemove={() => removeCollection(id)}
              />
            ))}
            {state.tags.map((tag) => (
              <ActiveFilterChip
                key={`tag-${tag}`}
                label="ТЕГ"
                value={tag}
                onRemove={() => removeTag(tag)}
              />
            ))}
            {state.stages.map((stage) => (
              <ActiveFilterChip
                key={`stage-${stage}`}
                label="ЕТАП"
                value={STAGE_LABEL.get(stage) ?? stage}
                onRemove={() => removeStage(stage)}
              />
            ))}
            {activeFieldKeys.map((key) => {
              const def = fieldDefByKey.get(key);
              if (!def) return null;
              return (
                <CustomFieldChip
                  key={`cf-${key}`}
                  def={def}
                  values={state.fieldValues[key] ?? []}
                  onToggle={(value) => toggleField(key, value)}
                  onRemove={() => removeField(key)}
                />
              );
            })}
          </div>
        )}
      </div>
    </FilterBar>
  );
}

// One labeled button (near search) that bundles the view/filter actions, each
// with a description so "save changes" vs "save as new" is unambiguous. The
// "save as new" path swaps the panel to a name-entry step in place.
function FilterActionsMenu({
  modified,
  activeViewName,
  canSaveAsNew,
  hasChips,
  onSaveChanges,
  onSaveAsNew,
  onClearAll,
}: {
  modified: boolean;
  activeViewName?: string;
  canSaveAsNew: boolean;
  hasChips: boolean;
  onSaveChanges?: () => void;
  onSaveAsNew: (name: string) => void;
  onClearAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "name">("menu");
  const [name, setName] = useState("");

  const submit = () => {
    const next = name.trim();
    if (!next) return;
    onSaveAsNew(next);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setMode("menu");
          setName("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-[28px] items-center gap-[6px] rounded-md border border-border bg-surface px-[8px] text-sm leading-none text-zinc-700 outline-none transition-colors hover:border-border-strong focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          <Bookmark className="size-[13px] text-zinc-500" strokeWidth={1.8} />
          Зберегти вигляд
          {modified && <span aria-hidden className="size-[5px] rounded-full bg-coral" />}
          <ChevronDown className="size-[12px] text-zinc-400" strokeWidth={1.8} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-[300px] p-[6px]"
      >
        {mode === "menu" ? (
          <div className="flex flex-col">
            {modified && onSaveChanges && (
              <ActionRow
                title="Зберегти зміни"
                description={
                  activeViewName
                    ? `Оновити «${activeViewName}» поточними фільтрами`
                    : "Оновити активний вигляд поточними фільтрами"
                }
                onClick={() => {
                  onSaveChanges();
                  setOpen(false);
                }}
              />
            )}
            <ActionRow
              title="Зберегти як новий вигляд"
              description="Створити окремий збережений вигляд із поточних фільтрів"
              disabled={!canSaveAsNew}
              onClick={() => setMode("name")}
            />
            <div className="my-[4px] h-px bg-border" />
            <ActionRow
              title="Очистити фільтри"
              description="Скинути всі активні фільтри"
              disabled={!hasChips}
              onClick={() => {
                onClearAll();
                setOpen(false);
              }}
            />
          </div>
        ) : (
          <div className="p-[6px]">
            <p className="mb-[6px] text-xs font-medium text-zinc-500">Назва вигляду</p>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="напр. Верхній одяг"
              className="h-[32px]"
            />
            <div className="mt-[10px] flex justify-end gap-[6px]">
              <Button variant="ghost" size="sm" onClick={() => setMode("menu")}>
                Назад
              </Button>
              <Button size="sm" disabled={!name.trim()} onClick={submit}>
                Зберегти
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function ActionRow({
  title,
  description,
  onClick,
  disabled,
}: {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col gap-[2px] rounded-[8px] px-[10px] py-[7px] text-left transition-colors",
        "hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none",
        disabled && "cursor-default opacity-40 hover:bg-transparent",
      )}
    >
      <span className="text-sm font-medium text-foreground">{title}</span>
      <span className="text-xs text-zinc-400">{description}</span>
    </button>
  );
}

// "+ Filter" → one submenu per custom field → a checklist of that field's enum
// values. Toggling a value adds/edits the field's chip in the row below.
function AddFilterMenu({
  fields,
  fieldValues,
  onToggle,
}: {
  fields: CustomFieldDef[];
  fieldValues: Record<string, string[]>;
  onToggle: (key: string, value: string) => void;
}) {
  if (fields.length === 0) return null;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-[28px] items-center gap-[6px] rounded-md border border-dashed border-border px-[8px] text-sm leading-none text-zinc-500 outline-none transition-colors hover:border-border-strong hover:bg-surface hover:text-zinc-700 focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          <Plus className="size-[12px]" strokeWidth={1.8} />
          Фільтр
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="min-w-[180px]"
      >
        {fields.map((def) => (
          <DropdownMenuSub key={def.key}>
            <DropdownMenuSubTrigger className="text-sm">{def.label}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-[200px]">
              {def.values.map((v) => (
                <DropdownMenuCheckboxItem
                  key={v}
                  checked={(fieldValues[def.key] ?? []).includes(v)}
                  onSelect={(e) => {
                    e.preventDefault();
                    onToggle(def.key, v);
                  }}
                  className="text-sm"
                >
                  {v}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// A custom-field chip: editable in place (re-opens the value checklist) and
// removable. No pinned toolbar control exists for custom fields, so the chip
// itself is the editor.
function CustomFieldChip({
  def,
  values,
  onToggle,
  onRemove,
}: {
  def: CustomFieldDef;
  values: string[];
  onToggle: (value: string) => void;
  onRemove: () => void;
}) {
  const display =
    values.length === 0
      ? "Будь-яке"
      : values.length === 1
        ? values[0]
        : `${values[0]} +${values.length - 1}`;

  return (
    <DropdownMenu modal={false}>
      <Badge
        variant="ghost"
        className="gap-0 overflow-visible whitespace-nowrap rounded-sm border border-border bg-surface p-0 text-[12.5px] font-normal text-foreground"
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-[6px] rounded-l-sm py-[3px] pr-[4px] pl-2 transition-colors hover:bg-surface-2 focus-visible:ring-[3px] focus-visible:ring-accent-ring focus-visible:outline-none"
          >
            <span className="font-mono text-[12.5px] uppercase tracking-[0.04em] text-zinc-400">
              {def.label}
            </span>
            <span className="font-mono text-[12.5px] font-medium text-foreground">
              {display}
            </span>
          </button>
        </DropdownMenuTrigger>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Прибрати фільтр: ${def.label}`}
          className="mr-[3px] flex size-[16px] items-center justify-center rounded-[3px] text-zinc-400 transition-colors hover:bg-surface-3 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-accent-ring focus-visible:outline-none"
        >
          <X className="size-[11px]" strokeWidth={2} />
        </button>
      </Badge>
      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="min-w-[200px]"
      >
        {def.values.map((v) => (
          <DropdownMenuCheckboxItem
            key={v}
            checked={values.includes(v)}
            onSelect={(e) => {
              e.preventDefault();
              onToggle(v);
            }}
            className="text-sm"
          >
            {v}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-[220px]">
      <Search
        className="pointer-events-none absolute top-1/2 left-[8px] size-[14px] -translate-y-1/2 text-zinc-400"
        strokeWidth={1.8}
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Пошук за назвою / SKU…"
        className="h-[28px] pl-[28px] text-sm"
      />
    </div>
  );
}
