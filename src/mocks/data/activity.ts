import type {
  ActivityId,
  ActivityItem,
  CollectionId,
  PersonId,
  ProductId,
} from "@/lib/api/types";

// Three to four items per collection — feeds the "Latest activity" rows
// on each Collections card.

export const ACTIVITY: ActivityItem[] = [
  // ─── Spring 2026 Launch ─────────────────────────────────────────────────────
  {
    id: "act-sp-1" as ActivityId,
    kind: "return",
    time: "2026-05-22T14:46:00.000Z", // 14 min ago
    actorId: "p-olena" as PersonId,
    collectionId: "col-spring-2026" as CollectionId,
    productId: "prod-249" as ProductId,
    entityName: "Style 249 · Linen wrap dress",
    fromStage: "procurement",
    toStage: "techpack",
  },
  {
    id: "act-sp-2" as ActivityId,
    kind: "mention",
    time: "2026-05-22T13:00:00.000Z", // 2h ago
    actorId: "p-olena" as PersonId,
    collectionId: "col-spring-2026" as CollectionId,
    productId: "prod-248" as ProductId,
    entityName: "Style 248 · Silk midi dress",
  },
  {
    id: "act-sp-3" as ActivityId,
    kind: "move",
    time: "2026-05-22T14:00:00.000Z", // 1h ago
    actorId: "p-marta" as PersonId,
    collectionId: "col-spring-2026" as CollectionId,
    productId: "prod-247" as ProductId,
    entityName: "Style 247 · Navy blazer",
    fromStage: "sketch",
    toStage: "techpack",
  },
  {
    id: "act-sp-4" as ActivityId,
    kind: "approve",
    time: "2026-05-20T11:00:00.000Z", // 2d ago
    actorId: "p-founder" as PersonId,
    collectionId: "col-spring-2026" as CollectionId,
    productId: "prod-246" as ProductId,
    entityName: "Style 246 · Cotton trench",
    fromStage: "grading",
    toStage: "production",
  },

  // ─── Summer Capsule 2026 ────────────────────────────────────────────────────
  {
    id: "act-su-1" as ActivityId,
    kind: "create",
    time: "2026-05-21T15:00:00.000Z", // yesterday
    actorId: "p-anna" as PersonId,
    collectionId: "col-summer-2026" as CollectionId,
    entityName: "Style 301 · Linen shirt dress",
  },
  {
    id: "act-su-2" as ActivityId,
    kind: "create",
    time: "2026-05-21T10:30:00.000Z", // yesterday
    actorId: "p-lina" as PersonId,
    collectionId: "col-summer-2026" as CollectionId,
    entityName: "Style 302 · Cotton tank",
  },
  {
    id: "act-su-3" as ActivityId,
    kind: "move",
    time: "2026-05-20T14:00:00.000Z", // 2d ago
    actorId: "p-lina" as PersonId,
    collectionId: "col-summer-2026" as CollectionId,
    entityName: "Style 304 · Wide-leg shorts",
    fromStage: "idea",
    toStage: "sketch",
  },

  // ─── Holiday Gift Box 2025 ──────────────────────────────────────────────────
  {
    id: "act-hg-1" as ActivityId,
    kind: "mention",
    time: "2026-05-22T10:00:00.000Z", // 5h ago
    actorId: "p-anna" as PersonId,
    collectionId: "col-holiday-2025" as CollectionId,
    entityName: "OOH Poster A",
  },
  {
    id: "act-hg-2" as ActivityId,
    kind: "approve",
    time: "2026-05-21T09:00:00.000Z", // yesterday
    actorId: "p-founder" as PersonId,
    collectionId: "col-holiday-2025" as CollectionId,
    entityName: "Style 198 · Cashmere scarf",
    fromStage: "grading",
    toStage: "production",
  },
  {
    id: "act-hg-3" as ActivityId,
    kind: "move",
    time: "2026-05-20T16:00:00.000Z", // 2d ago
    actorId: "p-yuri" as PersonId,
    collectionId: "col-holiday-2025" as CollectionId,
    entityName: "Style 201 · Leather card holder",
    fromStage: "production",
    toStage: "production", // shipment milestone — same stage, status change
  },

  // ─── Brand Refresh ──────────────────────────────────────────────────────────
  {
    id: "act-br-1" as ActivityId,
    kind: "create",
    time: "2026-05-20T12:00:00.000Z", // 2d ago
    actorId: "p-anna" as PersonId,
    collectionId: "col-brand-refresh" as CollectionId,
    entityName: "Hero Landing Page",
  },
  {
    id: "act-br-2" as ActivityId,
    kind: "move",
    time: "2026-05-19T15:30:00.000Z", // 3d ago
    actorId: "p-lina" as PersonId,
    collectionId: "col-brand-refresh" as CollectionId,
    entityName: "Logo lockup v3",
    fromStage: "sketch",
    toStage: "techpack",
  },
  {
    id: "act-br-3" as ActivityId,
    kind: "approve",
    time: "2026-05-18T17:00:00.000Z", // 4d ago
    actorId: "p-founder" as PersonId,
    collectionId: "col-brand-refresh" as CollectionId,
    entityName: "Brand color tokens",
    fromStage: "techpack",
    toStage: "procurement",
  },
];

export const activityById = new Map<ActivityId, ActivityItem>(
  ACTIVITY.map((a) => [a.id, a]),
);
