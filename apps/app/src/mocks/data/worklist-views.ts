import type { CollectionId, PersonId, SavedView, ViewId } from "@/lib/api/types";

// Saved filter presets for the Worklist (cross-collection). Stored separately
// from the per-collection product views (src/mocks/data/views.ts) — worklist
// views are global and omit `collectionId`. Mutated in place by the handlers;
// state resets on full page reload.

const WORKLIST_VIEWS_SEED: SavedView[] = [
  {
    id: "wlview-returns" as ViewId,
    name: "Мої повернення",
    query: {
      tab: "returned",
      sort: "due-soonest",
      stages: [],
      tags: [],
      assignee: ["p-anna" as PersonId],
      fieldValues: {},
    },
    createdAt: "2026-05-16T09:00:00.000Z",
    updatedAt: "2026-05-16T09:00:00.000Z",
  },
  {
    id: "wlview-summer" as ViewId,
    name: "Літня капсула",
    query: {
      tab: "all",
      sort: "activity-newest",
      stages: [],
      tags: [],
      assignee: [],
      fieldValues: {},
      collections: ["col-summer-2026" as CollectionId],
    },
    createdAt: "2026-05-17T10:30:00.000Z",
    updatedAt: "2026-05-17T10:30:00.000Z",
  },
  {
    id: "wlview-outerwear" as ViewId,
    name: "Верхній одяг (усі колекції)",
    query: {
      tab: "all",
      sort: "name-asc",
      stages: [],
      tags: ["outerwear"],
      assignee: [],
      fieldValues: {},
    },
    createdAt: "2026-05-18T08:15:00.000Z",
    updatedAt: "2026-05-18T08:15:00.000Z",
  },
];

export const WORKLIST_VIEWS: SavedView[] = WORKLIST_VIEWS_SEED;

export const worklistViewsById = new Map<ViewId, SavedView>(
  WORKLIST_VIEWS.map((v) => [v.id, v]),
);

export function newWorklistViewId(): ViewId {
  return `wlview-${crypto.randomUUID()}` as ViewId;
}
