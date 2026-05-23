import type { PersonId, Product, Stage } from "@/lib/api/types";

export type ProductsTab =
  | "all"
  | "needs-you"
  | "in-review"
  | "returned"
  | "in-production"
  | "done";

export type ProductsSort = "stage" | "activity" | "due" | "name" | "progress";

export type ProductsFilterState = {
  tab: ProductsTab;
  sort: ProductsSort;
  // Empty array means "all stages". When non-empty, only products whose
  // current stage is in the set are shown.
  stages: Stage[];
};

// Predicates for each tab. Computed client-side; the eventual server endpoint
// should accept the same set of values via ?tab=…
export function tabMatches(p: Product, tab: ProductsTab, viewerId?: PersonId): boolean {
  switch (tab) {
    case "all":
      return true;
    case "needs-you":
      if (!viewerId) return false;
      return needsViewerAttention(p, viewerId);
    case "in-review":
      return p.status === "in_review";
    case "returned":
      return p.status === "returned";
    case "in-production":
      return isInProduction(p);
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
    "needs-you": products.filter((p) => tabMatches(p, "needs-you", viewerId)).length,
    "in-review": products.filter((p) => tabMatches(p, "in-review")).length,
    returned: products.filter((p) => tabMatches(p, "returned")).length,
    "in-production": products.filter((p) => tabMatches(p, "in-production")).length,
    done: products.filter((p) => tabMatches(p, "done")).length,
  };
}

export function sortProducts(products: Product[], sort: ProductsSort): Product[] {
  const copy = [...products];
  switch (sort) {
    case "stage":
      return copy.sort((a, b) => a.currentStageN.localeCompare(b.currentStageN));
    case "activity":
      return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "due": {
      const dueOf = (p: Product) =>
        p.stages.find((s) => s.n === p.currentStageN)?.deadline?.date ?? "9999";
      return copy.sort((a, b) => dueOf(a).localeCompare(dueOf(b)));
    }
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "progress": {
      const passedCount = (p: Product) => p.stages.filter((s) => s.status === "passed").length;
      return copy.sort((a, b) => passedCount(b) - passedCount(a));
    }
  }
}

export function stagesMatches(p: Product, stages: Stage[]): boolean {
  if (stages.length === 0) return true;
  const current = p.stages.find((s) => s.n === p.currentStageN);
  return !!current && stages.includes(current.stage);
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
