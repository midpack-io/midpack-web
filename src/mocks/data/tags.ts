import type { CollectionId, Tag } from "@/lib/api/types";

// Tag presets shared across products in a collection. Re-exported here so the
// catalog handler (GET /collections/:id/tags) and the product seed in
// products.ts read from one source. Per-product "bundle / sNNN" slate tags are
// not catalog entries — they're row-visual markers.
export const TAG_SS26: Tag = { label: "SS26", tone: "teal" };
export const TAG_OUTERWEAR: Tag = { label: "outerwear", tone: "indigo" };
export const TAG_DRESSES: Tag = { label: "dresses", tone: "indigo" };
export const TAG_BOTTOMS: Tag = { label: "bottoms", tone: "indigo" };
export const TAG_TOPS: Tag = { label: "tops", tone: "indigo" };
export const TAG_HERO: Tag = { label: "hero piece", tone: "pink" };
export const TAG_SAMPLE_READY: Tag = { label: "sample-ready", tone: "amber" };
export const TAG_APPROVED: Tag = { label: "approved", tone: "green" };

const SPRING_2026_TAGS: Tag[] = [
  TAG_SS26,
  TAG_OUTERWEAR,
  TAG_DRESSES,
  TAG_BOTTOMS,
  TAG_TOPS,
  TAG_HERO,
  TAG_SAMPLE_READY,
  TAG_APPROVED,
];

export const TAGS_BY_COLLECTION: Map<CollectionId, Tag[]> = new Map([
  ["col-spring-2026" as CollectionId, SPRING_2026_TAGS],
]);
