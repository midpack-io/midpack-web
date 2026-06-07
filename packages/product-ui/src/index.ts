// @midpack/product-ui — the real product-item UI (product row + bundle stepper)
// and the domain types it speaks, shared by the customer app and the marketing
// site. Components are data-agnostic: people + navigation are injected via the
// contexts below, so this package never touches react-query / MSW / the router.

// ── Domain types (single source of truth; apps re-export from "/types") ──
export * from "./lib/types";

// ── Utilities ──
export { cn } from "./lib/utils";
export * from "./lib/time";

// ── Injection contexts ──
export {
  PeopleProvider,
  usePeopleMap,
  usePeopleList,
} from "./context/people-context";
export { ProductNavProvider, useProductNav } from "./context/nav-context";

// ── shadcn / Radix primitives (themed) ──
export * from "./ui/badge";
export * from "./ui/button";
export * from "./ui/tooltip";
export * from "./ui/popover";
export * from "./ui/dropdown-menu";
export * from "./ui/calendar";
export * from "./ui/scroll-area";
export * from "./ui/skeleton";
export * from "./ui/avatar";

// ── Design-system parts ──
export * from "./ds/avatar-gradient";
export * from "./ds/person-picker";
export * from "./ds/status-selector";
export * from "./ds/date-field";
export * from "./ds/text-editable";
export * from "./ds/tag-row";
export * from "./ds/custom-field-row";
export * from "./ds/cf-chip";
export * from "./ds/pill-inline";

// ── Bundle stepper ──
export * from "./ds/bundle-stepper";

// ── Product row ──
export * from "./products/product-row";
export * from "./products/product-row-head";
export * from "./products/return-notice";
export * from "./products/row-hover-actions";

// ── Static sample data for showcases (no data layer) ──
export * from "./fixtures/sample-people";
export * from "./fixtures/sample-products";
