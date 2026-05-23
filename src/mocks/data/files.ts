import type {
  CollectionId,
  FileId,
  PersonId,
  ProductFile,
  ProductId,
} from "@/lib/api/types";

// File rows verbatim from `bundle-page/01-default-desktop.html` for Style 247,
// plus plausible analogues for the two other products whose comments reference
// files (Style 248 in-review and Style 249 returned with iter-2 techpack).
//
// Linked components appear once per linking product — duplicating the row is
// the trade-off documented in the data-shape decision (see plan file).

const SPRING = "col-spring-2026" as CollectionId;

// Source descriptors for linked components (shared, edited-at-source files).
const SRC_SS26_LINEN = {
  kind: "collection" as const,
  collectionId: SPRING,
  label: "SS-26 · Linen Series",
};
const SRC_MTM_WORKFLOW = {
  kind: "workflow" as const,
  workflowKey: "made-to-measure-v4",
  label: "Made-to-Measure · v4",
};

export const FILES: ProductFile[] = [
  // ────────────────────────────────────────────────────────────────────────
  // Style 247 — Navy blazer (11 items, verbatim from prototype)
  // ────────────────────────────────────────────────────────────────────────

  // — Linked components (3) —
  {
    id: "f-247-linked-1" as FileId,
    productId: "prod-247" as ProductId,
    name: "brand_size_chart",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea", // linked components sort above stage sections in the UI
    position: 0,
    linkedFrom: SRC_SS26_LINEN,
    versions: [
      {
        version: "v4",
        uploadedAt: "2026-05-17T10:00:00.000Z", // 5d ago
        uploadedBy: "p-olena" as PersonId,
      },
    ],
    updatedAt: "2026-05-17T10:00:00.000Z",
    updatedBy: "p-olena" as PersonId,
  },
  {
    id: "f-247-linked-2" as FileId,
    productId: "prod-247" as ProductId,
    name: "care_labels_master",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "idea",
    position: 1,
    linkedFrom: SRC_SS26_LINEN,
    versions: [
      {
        version: "v2",
        uploadedAt: "2026-05-08T09:00:00.000Z", // 2w ago
        uploadedBy: "p-pavlo" as PersonId,
      },
    ],
    updatedAt: "2026-05-08T09:00:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },
  {
    id: "f-247-linked-3" as FileId,
    productId: "prod-247" as ProductId,
    name: "tech_pack_template",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea",
    position: 2,
    linkedFrom: SRC_MTM_WORKFLOW,
    versions: [
      {
        version: "v4",
        uploadedAt: "2026-05-21T12:00:00.000Z", // 1d ago
        uploadedBy: "p-pavlo" as PersonId,
      },
    ],
    updatedAt: "2026-05-21T12:00:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },

  // — Stage 01 Ідея (2) —
  {
    id: "f-247-1" as FileId,
    productId: "prod-247" as ProductId,
    name: "mood_board",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea",
    position: 10,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-04T10:00:00.000Z",
        uploadedBy: "p-anna" as PersonId,
      },
      {
        version: "v2",
        uploadedAt: "2026-05-08T11:00:00.000Z", // 2w ago
        uploadedBy: "p-anna" as PersonId,
        note: "added warmer palette refs",
      },
    ],
    updatedAt: "2026-05-08T11:00:00.000Z",
    updatedBy: "p-anna" as PersonId,
  },
  {
    id: "f-247-2" as FileId,
    productId: "prod-247" as ProductId,
    name: "collection_brief",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea",
    position: 11,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-08T09:30:00.000Z", // 2w ago
        uploadedBy: "p-anna" as PersonId,
      },
    ],
    updatedAt: "2026-05-08T09:30:00.000Z",
    updatedBy: "p-anna" as PersonId,
  },

  // — Stage 02 Ескізи (4) —
  {
    id: "f-247-3" as FileId,
    productId: "prod-247" as ProductId,
    name: "front",
    ext: ".pdf",
    kind: "pdf",
    stage: "sketch",
    folderPath: "sketches/",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-19T14:00:00.000Z", // 3d ago
        uploadedBy: "p-lina" as PersonId,
      },
    ],
    updatedAt: "2026-05-19T14:00:00.000Z",
    updatedBy: "p-lina" as PersonId,
  },
  {
    id: "f-247-4" as FileId,
    productId: "prod-247" as ProductId,
    name: "back",
    ext: ".pdf",
    kind: "pdf",
    stage: "sketch",
    folderPath: "sketches/",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-19T14:05:00.000Z", // 3d ago
        uploadedBy: "p-lina" as PersonId,
      },
    ],
    updatedAt: "2026-05-19T14:05:00.000Z",
    updatedBy: "p-lina" as PersonId,
  },
  {
    id: "f-247-5" as FileId,
    productId: "prod-247" as ProductId,
    name: "fabric_swatches",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "sketch",
    position: 10,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-18T10:00:00.000Z",
        uploadedBy: "p-yulia" as PersonId,
      },
      {
        version: "v2",
        uploadedAt: "2026-05-20T15:00:00.000Z",
        uploadedBy: "p-yulia" as PersonId,
      },
      {
        version: "v3",
        uploadedAt: "2026-05-21T16:00:00.000Z", // 1d ago
        uploadedBy: "p-yulia" as PersonId,
        note: "supplier #2 final selection",
      },
    ],
    updatedAt: "2026-05-21T16:00:00.000Z",
    updatedBy: "p-yulia" as PersonId,
  },
  {
    id: "f-247-6" as FileId,
    productId: "prod-247" as ProductId,
    name: "trims_inspiration",
    ext: "",
    kind: "figma",
    stage: "sketch",
    position: 11,
    externalUrl: "https://figma.com/file/AB12",
    externalDomain: "figma.com/file/AB12",
    versions: [],
    updatedAt: "2026-05-20T13:00:00.000Z", // 2d ago
    updatedBy: "p-roma" as PersonId,
  },

  // — Stage 03 Тех-пак (2, active) —
  {
    id: "f-247-7" as FileId,
    productId: "prod-247" as ProductId,
    name: "TP_001_dress",
    ext: ".pdf",
    kind: "pdf",
    stage: "techpack",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-18T11:00:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
        note: "initial techpack draft",
      },
      {
        version: "v2",
        uploadedAt: "2026-05-21T12:00:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
        note: "addressed Olena's v1 review",
      },
      {
        version: "v3",
        uploadedAt: "2026-05-22T13:00:00.000Z", // 2h ago
        uploadedBy: "p-marta" as PersonId,
        note: "cuff width corrected per Olena (6.5cm)",
      },
    ],
    updatedAt: "2026-05-22T13:00:00.000Z",
    updatedBy: "p-marta" as PersonId,
  },
  {
    id: "f-247-8" as FileId,
    productId: "prod-247" as ProductId,
    name: "BOM_001",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "techpack",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-20T09:00:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
      },
      {
        version: "v2",
        uploadedAt: "2026-05-22T11:00:00.000Z", // 4h ago
        uploadedBy: "p-pavlo" as PersonId,
        note: "updated yardage estimates",
      },
    ],
    updatedAt: "2026-05-22T11:00:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },

  // ────────────────────────────────────────────────────────────────────────
  // Style 248 — Silk midi dress (4 items)
  // Demonstrates linked-component sharing (same brand_size_chart as 247).
  // ────────────────────────────────────────────────────────────────────────
  {
    id: "f-248-linked-1" as FileId,
    productId: "prod-248" as ProductId,
    name: "brand_size_chart",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea",
    position: 0,
    linkedFrom: SRC_SS26_LINEN,
    versions: [
      {
        version: "v4",
        uploadedAt: "2026-05-17T10:00:00.000Z",
        uploadedBy: "p-olena" as PersonId,
      },
    ],
    updatedAt: "2026-05-17T10:00:00.000Z",
    updatedBy: "p-olena" as PersonId,
  },
  {
    id: "f-248-1" as FileId,
    productId: "prod-248" as ProductId,
    name: "mood_board",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea",
    position: 10,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-10T10:00:00.000Z",
        uploadedBy: "p-anna" as PersonId,
      },
    ],
    updatedAt: "2026-05-10T10:00:00.000Z",
    updatedBy: "p-anna" as PersonId,
  },
  {
    id: "f-248-2" as FileId,
    productId: "prod-248" as ProductId,
    name: "silk_swatches",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "sketch",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-16T11:00:00.000Z",
        uploadedBy: "p-yulia" as PersonId,
      },
    ],
    updatedAt: "2026-05-16T11:00:00.000Z",
    updatedBy: "p-yulia" as PersonId,
  },
  {
    id: "f-248-3" as FileId,
    productId: "prod-248" as ProductId,
    name: "TP_002_dress",
    ext: ".pdf",
    kind: "pdf",
    stage: "techpack",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-22T11:30:00.000Z",
        uploadedBy: "p-olena" as PersonId,
        note: "techpack ready for procurement review",
      },
    ],
    updatedAt: "2026-05-22T11:30:00.000Z",
    updatedBy: "p-olena" as PersonId,
  },

  // ────────────────────────────────────────────────────────────────────────
  // Style 249 — Linen wrap dress (3 items)
  // Supports the iter-2 return comment from Olena about cuff width.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: "f-249-1" as FileId,
    productId: "prod-249" as ProductId,
    name: "concept",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-05T10:00:00.000Z",
        uploadedBy: "p-anna" as PersonId,
      },
    ],
    updatedAt: "2026-05-05T10:00:00.000Z",
    updatedBy: "p-anna" as PersonId,
  },
  {
    id: "f-249-2" as FileId,
    productId: "prod-249" as ProductId,
    name: "linen_swatches",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "sketch",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-14T13:00:00.000Z",
        uploadedBy: "p-yulia" as PersonId,
      },
    ],
    updatedAt: "2026-05-14T13:00:00.000Z",
    updatedBy: "p-yulia" as PersonId,
  },
  {
    id: "f-249-3" as FileId,
    productId: "prod-249" as ProductId,
    name: "TP_003_dress",
    ext: ".pdf",
    kind: "pdf",
    stage: "techpack",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-18T10:00:00.000Z",
        uploadedBy: "p-marta" as PersonId,
        note: "first techpack draft",
      },
      {
        version: "v2",
        uploadedAt: "2026-05-21T15:00:00.000Z",
        uploadedBy: "p-marta" as PersonId,
        note: "iter 2 — addressing Olena's feedback",
      },
    ],
    updatedAt: "2026-05-21T15:00:00.000Z",
    updatedBy: "p-marta" as PersonId,
  },
];

export const filesById = new Map<FileId, ProductFile>(
  FILES.map((f) => [f.id, f]),
);
