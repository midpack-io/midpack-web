import type { PersonId, Product, Stage } from "@/lib/api/types";

export type ProductsTab =
  | "all"
  | "in-progress"
  | "needs-you"
  | "in-review"
  | "returned"
  | "blocked"
  | "done";

export type ProductsSort =
  | "activity-newest"
  | "activity-oldest"
  | "due-soonest"
  | "due-latest"
  | "progress-most"
  | "progress-least"
  | "name-asc"
  | "name-desc";

export type ProductsFilterState = {
  tab: ProductsTab;
  sort: ProductsSort;
  // Empty array means "all stages". When non-empty, only products whose
  // current stage is in the set are shown.
  stages: Stage[];
  // Selected tag labels. Empty == "any tag". Multi-select is AND across
  // selected tags — each tag narrows the result further.
  tags: string[];
  // Per-key selected values for custom fields, e.g. { Fabric: ["Wool 240gsm"] }.
  // Missing key or empty array means that field is unfiltered. Multi-select
  // within a key is OR; across keys is AND.
  fieldValues: Record<string, string[]>;
};

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
