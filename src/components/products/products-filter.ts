import type {
  CollectionId,
  PersonId,
  Product,
  ProductsQuery,
  ProductsSort,
  ProductsTab,
  Stage,
} from "@/lib/api/types";

// The union types now live in the shared contract (api/types.ts) so the views
// resource and a future server-side query speak the same shape. Re-exported
// here so existing component-layer importers keep their import path.
export type { ProductsQuery, ProductsSort, ProductsTab } from "@/lib/api/types";

// The products-list filter state is exactly the serializable query — no
// transient UI-only fields (search input, etc.) live here for now.
export type ProductsFilterState = ProductsQuery;

export const EMPTY_QUERY: ProductsFilterState = {
  tab: "all",
  sort: "activity-newest",
  stages: [],
  tags: [],
  assignee: [],
  fieldValues: {},
};

// The query a freshly opened collection lands on: the "В роботі" lens, sorted
// by progress (most-complete first). EMPTY_QUERY stays the "cleared" baseline
// for the save/modified logic; this is only the initial selection.
export const DEFAULT_QUERY: ProductsFilterState = {
  ...EMPTY_QUERY,
  tab: "in-progress",
  sort: "progress-most",
};

// System-view labels, in display order. Shared by the View menu and the
// workspace's group header so the lens labels never drift.
export const TAB_LABELS: { tab: ProductsTab; label: string }[] = [
  { tab: "all", label: "Усі" },
  { tab: "in-progress", label: "В роботі" },
  { tab: "needs-you", label: "Потребує вас" },
  { tab: "in-review", label: "На перевірку" },
  { tab: "returned", label: "Повернуто" },
  { tab: "blocked", label: "Заблоковано" },
  { tab: "done", label: "Готово" },
];

// Produces a clean query for selecting a system view: keep the chosen lens,
// reset every other filter to its empty state.
export function systemViewQuery(tab: ProductsTab): ProductsFilterState {
  return { ...EMPTY_QUERY, tab };
}

// Predicates for each tab. Computed client-side; the eventual server endpoint
// should accept the same set of values via ?tab=…
export function tabMatches(p: Product, tab: ProductsTab, viewerId?: PersonId): boolean {
  switch (tab) {
    case "all":
      return true;
    case "in-progress":
      return p.stages.some((s) => s.status !== "done" && s.status !== "canceled");
    case "needs-you":
      if (!viewerId) return false;
      return needsViewerAttention(p, viewerId);
    case "in-review":
      return p.status === "in_review";
    case "returned":
      return p.status === "returned";
    case "blocked":
      return p.stages.some((s) => s.status === "blocked");
    case "done":
      return p.status === "done";
  }
}

function needsViewerAttention(p: Product, viewerId: PersonId): boolean {
  if (p.status !== "in_progress" && p.status !== "in_review" && p.status !== "returned") {
    return false;
  }
  if (p.performerId === viewerId || p.approverId === viewerId) {
    return true;
  }
  // Catches multi-approver cases.
  const current = p.stages.find((s) => s.n === p.currentStageN);
  if (current) {
    if (current.performerId === viewerId) return true;
    if (Array.isArray(current.approverId)) return current.approverId.includes(viewerId);
    if (current.approverId === viewerId) return true;
  }
  return false;
}

function isInProduction(p: Product): boolean {
  const current = p.stages.find((s) => s.n === p.currentStageN);
  return current?.stage === "production" && p.status !== "done";
}

export function countByTab(
  products: Product[],
  viewerId?: PersonId,
): Record<ProductsTab, number> {
  return {
    all: products.length,
    "in-progress": products.filter((p) => tabMatches(p, "in-progress")).length,
    "needs-you": products.filter((p) => tabMatches(p, "needs-you", viewerId)).length,
    "in-review": products.filter((p) => tabMatches(p, "in-review")).length,
    returned: products.filter((p) => tabMatches(p, "returned")).length,
    blocked: products.filter((p) => tabMatches(p, "blocked")).length,
    done: products.filter((p) => tabMatches(p, "done")).length,
  };
}

export function sortProducts(products: Product[], sort: ProductsSort): Product[] {
  const copy = [...products];
  const dueOf = (p: Product) =>
    p.stages.find((s) => s.n === p.currentStageN)?.deadline?.date ?? "9999";
  const doneCount = (p: Product) =>
    p.stages.filter((s) => s.status === "done").length;
  switch (sort) {
    case "activity-newest":
      return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "activity-oldest":
      return copy.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    case "due-soonest":
      return copy.sort((a, b) => dueOf(a).localeCompare(dueOf(b)));
    case "due-latest":
      // Products without a due date sink to the bottom in both directions —
      // a "no deadline" row reading first when sorting by latest due would be
      // misleading. Among dated products, newest-due first.
      return copy.sort((a, b) => {
        const da = dueOf(a);
        const db = dueOf(b);
        if (da === "9999" && db !== "9999") return 1;
        if (db === "9999" && da !== "9999") return -1;
        return db.localeCompare(da);
      });
    case "progress-most":
      return copy.sort((a, b) => doneCount(b) - doneCount(a));
    case "progress-least":
      return copy.sort((a, b) => doneCount(a) - doneCount(b));
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
  }
}

// Applies the full query (lens + all filter predicates). Used for the visible
// list and for each saved view's count badge. Keyword search is applied
// separately by the workspace — it's transient UI, not part of the query.
export function matchesQuery(
  p: Product,
  q: ProductsQuery,
  viewerId?: PersonId,
): boolean {
  return (
    tabMatches(p, q.tab, viewerId) &&
    stagesMatches(p, q.stages) &&
    tagsMatches(p, q.tags) &&
    assigneeMatches(p, q.assignee) &&
    collectionsMatches(p, q.collections) &&
    fieldValuesMatches(p, q.fieldValues)
  );
}

// Cross-collection scoping (Worklist only). Missing/empty == all collections.
export function collectionsMatches(p: Product, collections?: CollectionId[]): boolean {
  if (!collections || collections.length === 0) return true;
  return collections.includes(p.collectionId);
}

// Keyword search over name + style number. Transient UI state applied
// separately from the query (not persisted in saved views).
export function nameMatches(p: Product, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return p.name.toLowerCase().includes(q) || p.styleNo.toLowerCase().includes(q);
}

export function stagesMatches(p: Product, stages: Stage[]): boolean {
  if (stages.length === 0) return true;
  const current = p.stages.find((s) => s.n === p.currentStageN);
  return !!current && stages.includes(current.stage);
}

export function tagsMatches(p: Product, tags: string[]): boolean {
  if (tags.length === 0) return true;
  const labels = new Set(p.tags.map((t) => t.label));
  return tags.every((t) => labels.has(t));
}

// Matches the product's performer only (approver is intentionally excluded).
// OR semantics: empty == anyone, otherwise the performer must be one of the
// selected people.
export function assigneeMatches(p: Product, assignee: PersonId[]): boolean {
  if (assignee.length === 0) return true;
  if (!p.performerId || p.performerId === "unassigned") return false;
  return assignee.includes(p.performerId);
}

export function fieldValuesMatches(
  p: Product,
  fieldValues: Record<string, string[]>,
): boolean {
  for (const [key, values] of Object.entries(fieldValues)) {
    if (values.length === 0) continue;
    const cf = p.customFields.find((f) => f.key === key);
    if (!cf || cf.unset || !values.includes(cf.value)) return false;
  }
  return true;
}

// Page-header summary counts: design groups by lifecycle phase.
export function summaryStats(products: Product[]): {
  inDesign: number;
  inReview: number;
  returned: number;
  inProduction: number;
} {
  let inDesign = 0;
  let inReview = 0;
  let returned = 0;
  let inProduction = 0;
  for (const p of products) {
    if (p.status === "in_review") inReview += 1;
    else if (p.status === "returned") returned += 1;
    else if (isInProduction(p)) inProduction += 1;
    else if (p.status === "in_progress" || p.status === "ready") inDesign += 1;
  }
  return { inDesign, inReview, returned, inProduction };
}

// Deep-equality for two queries — drives the saved-view "modified" indicator.
// Order-insensitive for the array fields (selection order isn't meaningful).
export function queriesEqual(a: ProductsQuery, b: ProductsQuery): boolean {
  if (a.tab !== b.tab || a.sort !== b.sort) return false;
  if (!sameSet(a.stages, b.stages)) return false;
  if (!sameSet(a.tags, b.tags)) return false;
  if (!sameSet(a.assignee, b.assignee)) return false;
  if (!sameSet(a.collections ?? [], b.collections ?? [])) return false;
  const aKeys = Object.keys(a.fieldValues).filter((k) => a.fieldValues[k]?.length);
  const bKeys = Object.keys(b.fieldValues).filter((k) => b.fieldValues[k]?.length);
  if (!sameSet(aKeys, bKeys)) return false;
  return aKeys.every((k) => sameSet(a.fieldValues[k] ?? [], b.fieldValues[k] ?? []));
}

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((v) => set.has(v));
}
