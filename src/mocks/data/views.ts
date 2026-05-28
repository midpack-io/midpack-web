import type { CollectionId, PersonId, SavedView, ViewId } from "@/lib/api/types";

// Saved filter presets, collection-scoped. Mutated in place by the POST/PATCH/
// DELETE handlers in handlers/views.ts; state resets on full page reload.

const SPRING_2026_VIEWS: SavedView[] = [
  {
    id: "view-outerwear" as ViewId,
    collectionId: "col-spring-2026" as CollectionId,
    name: "Верхній одяг",
    query: {
      tab: "all",
      sort: "due-soonest",
      stages: [],
      tags: ["outerwear"],
      assignee: [],
      fieldValues: {},
    },
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "view-my-samples" as ViewId,
    collectionId: "col-spring-2026" as CollectionId,
    name: "Мої зразки",
    query: {
      tab: "in-progress",
      sort: "activity-newest",
      stages: ["sample", "fitting"],
      tags: [],
      assignee: ["p-anna" as PersonId],
      fieldValues: {},
    },
    createdAt: "2026-05-12T14:30:00.000Z",
    updatedAt: "2026-05-12T14:30:00.000Z",
  },
  {
    id: "view-wool" as ViewId,
    collectionId: "col-spring-2026" as CollectionId,
    name: "Вовняні моделі",
    query: {
      tab: "all",
      sort: "name-asc",
      stages: [],
      tags: [],
      assignee: [],
      fieldValues: { Fabric: ["Wool 240gsm", "Wool gabardine 280gsm"] },
    },
    createdAt: "2026-05-15T11:15:00.000Z",
    updatedAt: "2026-05-15T11:15:00.000Z",
  },
];

export const VIEWS_BY_COLLECTION: Map<CollectionId, SavedView[]> = new Map([
  ["col-spring-2026" as CollectionId, SPRING_2026_VIEWS],
]);

export const viewsById = new Map<ViewId, SavedView>(
  SPRING_2026_VIEWS.map((v) => [v.id, v]),
);

export function newViewId(): ViewId {
  return `view-${crypto.randomUUID()}` as ViewId;
}
