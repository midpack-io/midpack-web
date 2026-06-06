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

  // — Stage 04 Закупівля (2, done) —
  {
    id: "f-247-9" as FileId,
    productId: "prod-247" as ProductId,
    name: "PO_001_wool_240gsm",
    ext: ".pdf",
    kind: "pdf",
    stage: "procurement",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-21T10:00:00.000Z", // 1d ago
        uploadedBy: "p-yulia" as PersonId,
        note: "замовлення розміщено, постачальник #2",
      },
    ],
    updatedAt: "2026-05-21T10:00:00.000Z",
    updatedBy: "p-yulia" as PersonId,
  },
  {
    id: "f-247-10" as FileId,
    productId: "prod-247" as ProductId,
    name: "supplier_confirmation",
    ext: ".pdf",
    kind: "pdf",
    stage: "procurement",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-22T09:00:00.000Z", // 5h ago
        uploadedBy: "p-yulia" as PersonId,
        note: "підтверджено строк доставки — 14 днів",
      },
    ],
    updatedAt: "2026-05-22T09:00:00.000Z",
    updatedBy: "p-yulia" as PersonId,
  },

  // — Stage 05 Лекала (3, active) —
  {
    id: "f-247-11" as FileId,
    productId: "prod-247" as ProductId,
    name: "pattern_pieces_base",
    ext: ".pdf",
    kind: "pdf",
    stage: "patterns",
    folderPath: "patterns/",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-22T13:30:00.000Z", // 1h ago
        uploadedBy: "p-pavlo" as PersonId,
        note: "базовий комплект лекал, розмір 38",
      },
    ],
    updatedAt: "2026-05-22T13:30:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },
  {
    id: "f-247-12" as FileId,
    productId: "prod-247" as ProductId,
    name: "pattern_layout",
    ext: ".pdf",
    kind: "pdf",
    stage: "patterns",
    folderPath: "patterns/",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-22T13:45:00.000Z", // 1h ago
        uploadedBy: "p-pavlo" as PersonId,
      },
    ],
    updatedAt: "2026-05-22T13:45:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },
  {
    id: "f-247-13" as FileId,
    productId: "prod-247" as ProductId,
    name: "seam_allowance_notes",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "patterns",
    position: 10,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-22T14:00:00.000Z", // now
        uploadedBy: "p-pavlo" as PersonId,
        note: "припуски на шви, чернетка",
      },
    ],
    updatedAt: "2026-05-22T14:00:00.000Z",
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

  // ────────────────────────────────────────────────────────────────────────
  // Style 246 — Cotton trench (full lifecycle, all stages done, shipped)
  // A complete bundle: linked components + files under every stage section,
  // matching the all-stages-done product in products.ts.
  // ────────────────────────────────────────────────────────────────────────

  // — Linked components (2) —
  {
    id: "f-246-linked-1" as FileId,
    productId: "prod-246" as ProductId,
    name: "brand_size_chart",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea",
    position: 0,
    linkedFrom: SRC_SS26_LINEN,
    versions: [
      {
        version: "v4",
        uploadedAt: "2026-05-02T09:00:00.000Z",
        uploadedBy: "p-olena" as PersonId,
      },
    ],
    updatedAt: "2026-05-02T09:00:00.000Z",
    updatedBy: "p-olena" as PersonId,
  },
  {
    id: "f-246-linked-2" as FileId,
    productId: "prod-246" as ProductId,
    name: "care_labels_master",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "idea",
    position: 1,
    linkedFrom: SRC_SS26_LINEN,
    versions: [
      {
        version: "v2",
        uploadedAt: "2026-05-11T10:00:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
      },
    ],
    updatedAt: "2026-05-11T10:00:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },

  // — Stage 01 Ідея (2) —
  {
    id: "f-246-1" as FileId,
    productId: "prod-246" as ProductId,
    name: "mood_board",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea",
    position: 10,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-01T10:00:00.000Z",
        uploadedBy: "p-anna" as PersonId,
      },
      {
        version: "v2",
        uploadedAt: "2026-05-02T11:00:00.000Z",
        uploadedBy: "p-anna" as PersonId,
        note: "тепліші референси на бежевий твіл",
      },
    ],
    updatedAt: "2026-05-02T11:00:00.000Z",
    updatedBy: "p-anna" as PersonId,
  },
  {
    id: "f-246-2" as FileId,
    productId: "prod-246" as ProductId,
    name: "collection_brief",
    ext: ".pdf",
    kind: "pdf",
    stage: "idea",
    position: 11,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-01T09:30:00.000Z",
        uploadedBy: "p-anna" as PersonId,
      },
    ],
    updatedAt: "2026-05-01T09:30:00.000Z",
    updatedBy: "p-anna" as PersonId,
  },

  // — Stage 02 Ескізи (3) —
  {
    id: "f-246-3" as FileId,
    productId: "prod-246" as ProductId,
    name: "front",
    ext: ".pdf",
    kind: "pdf",
    stage: "sketch",
    folderPath: "sketches/",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-05T14:00:00.000Z",
        uploadedBy: "p-lina" as PersonId,
      },
      {
        version: "v2",
        uploadedAt: "2026-05-05T17:30:00.000Z",
        uploadedBy: "p-lina" as PersonId,
        note: "лацкан звужено, довжина нижче коліна −5см",
      },
    ],
    updatedAt: "2026-05-05T17:30:00.000Z",
    updatedBy: "p-lina" as PersonId,
  },
  {
    id: "f-246-4" as FileId,
    productId: "prod-246" as ProductId,
    name: "back",
    ext: ".pdf",
    kind: "pdf",
    stage: "sketch",
    folderPath: "sketches/",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-05T14:05:00.000Z",
        uploadedBy: "p-lina" as PersonId,
      },
    ],
    updatedAt: "2026-05-05T14:05:00.000Z",
    updatedBy: "p-lina" as PersonId,
  },
  {
    id: "f-246-5" as FileId,
    productId: "prod-246" as ProductId,
    name: "fabric_swatches",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "sketch",
    position: 10,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-06T10:00:00.000Z",
        uploadedBy: "p-yulia" as PersonId,
      },
      {
        version: "v2",
        uploadedAt: "2026-05-07T15:00:00.000Z",
        uploadedBy: "p-yulia" as PersonId,
        note: "бавовняний твіл 220г/м², два постачальники",
      },
    ],
    updatedAt: "2026-05-07T15:00:00.000Z",
    updatedBy: "p-yulia" as PersonId,
  },

  // — Stage 03 Тех-пак (2) —
  {
    id: "f-246-6" as FileId,
    productId: "prod-246" as ProductId,
    name: "TP_246_trench",
    ext: ".pdf",
    kind: "pdf",
    stage: "techpack",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-08T11:00:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
        note: "початковий чорновик тех-паку",
      },
      {
        version: "v2",
        uploadedAt: "2026-05-09T12:00:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
        note: "ширина паска 4см, виноска про строчку на комірі",
      },
    ],
    updatedAt: "2026-05-09T12:00:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },
  {
    id: "f-246-7" as FileId,
    productId: "prod-246" as ProductId,
    name: "BOM_246",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "techpack",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-08T11:30:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
      },
    ],
    updatedAt: "2026-05-08T11:30:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },

  // — Stage 04 Закупівля (2) —
  {
    id: "f-246-8" as FileId,
    productId: "prod-246" as ProductId,
    name: "supplier_quotes",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "procurement",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-11T11:00:00.000Z",
        uploadedBy: "p-yulia" as PersonId,
        note: "котирування від трьох постачальників",
      },
    ],
    updatedAt: "2026-05-11T11:00:00.000Z",
    updatedBy: "p-yulia" as PersonId,
  },
  {
    id: "f-246-9" as FileId,
    productId: "prod-246" as ProductId,
    name: "fabric_po",
    ext: ".pdf",
    kind: "pdf",
    stage: "procurement",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-11T16:00:00.000Z",
        uploadedBy: "p-yulia" as PersonId,
        note: "замовлення розміщено, постачальник #1",
      },
    ],
    updatedAt: "2026-05-11T16:00:00.000Z",
    updatedBy: "p-yulia" as PersonId,
  },

  // — Stage 05 Лекала (2) —
  {
    id: "f-246-10" as FileId,
    productId: "prod-246" as ProductId,
    name: "pattern_set",
    ext: ".pdf",
    kind: "pdf",
    stage: "patterns",
    folderPath: "patterns/",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-13T11:00:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
      },
      {
        version: "v2",
        uploadedAt: "2026-05-14T13:00:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
        note: "глибину пройми спинки виправлено за тех-паком",
      },
    ],
    updatedAt: "2026-05-14T13:00:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },
  {
    id: "f-246-11" as FileId,
    productId: "prod-246" as ProductId,
    name: "marker",
    ext: ".pdf",
    kind: "pdf",
    stage: "patterns",
    folderPath: "patterns/",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-13T11:10:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
        note: "розкладка, витрата 1.8м на розмір M",
      },
    ],
    updatedAt: "2026-05-13T11:10:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },

  // — Stage 06 Перевірка лекал (1) —
  {
    id: "f-246-12" as FileId,
    productId: "prod-246" as ProductId,
    name: "pattern_review_notes",
    ext: ".pdf",
    kind: "pdf",
    stage: "pattern-review",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-14T15:00:00.000Z",
        uploadedBy: "p-olena" as PersonId,
        note: "нотатки перевірки лекал",
      },
    ],
    updatedAt: "2026-05-14T15:00:00.000Z",
    updatedBy: "p-olena" as PersonId,
  },

  // — Stage 07 Перший зразок (2) —
  {
    id: "f-246-13" as FileId,
    productId: "prod-246" as ProductId,
    name: "sample_photos",
    ext: ".jpg",
    kind: "jpg",
    stage: "sample",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-15T13:00:00.000Z",
        uploadedBy: "p-marta" as PersonId,
      },
    ],
    updatedAt: "2026-05-15T13:00:00.000Z",
    updatedBy: "p-marta" as PersonId,
  },
  {
    id: "f-246-14" as FileId,
    productId: "prod-246" as ProductId,
    name: "sample_report",
    ext: ".pdf",
    kind: "pdf",
    stage: "sample",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-15T13:10:00.000Z",
        uploadedBy: "p-marta" as PersonId,
        note: "звіт по першому відшиву",
      },
    ],
    updatedAt: "2026-05-15T13:10:00.000Z",
    updatedBy: "p-marta" as PersonId,
  },

  // — Stage 08 Примірка (1) —
  {
    id: "f-246-15" as FileId,
    productId: "prod-246" as ProductId,
    name: "fitting_notes",
    ext: ".pdf",
    kind: "pdf",
    stage: "fitting",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-17T11:00:00.000Z",
        uploadedBy: "p-anna" as PersonId,
        note: "рукав −1.5см, посадка ок",
      },
    ],
    updatedAt: "2026-05-17T11:00:00.000Z",
    updatedBy: "p-anna" as PersonId,
  },

  // — Stage 09 Градація (2) —
  {
    id: "f-246-16" as FileId,
    productId: "prod-246" as ProductId,
    name: "graded_nest",
    ext: ".pdf",
    kind: "pdf",
    stage: "grading",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-18T10:00:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
        note: "градація XS–XL, рукав з урахуванням −1.5см",
      },
    ],
    updatedAt: "2026-05-18T10:00:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },
  {
    id: "f-246-17" as FileId,
    productId: "prod-246" as ProductId,
    name: "size_spec",
    ext: ".xlsx",
    kind: "xlsx",
    stage: "grading",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-18T10:15:00.000Z",
        uploadedBy: "p-pavlo" as PersonId,
      },
    ],
    updatedAt: "2026-05-18T10:15:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
  },

  // — Stage 10 Виробництво (3) —
  {
    id: "f-246-18" as FileId,
    productId: "prod-246" as ProductId,
    name: "production_pack",
    ext: ".pdf",
    kind: "pdf",
    stage: "production",
    position: 0,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-19T09:00:00.000Z",
        uploadedBy: "p-yuri" as PersonId,
        note: "фінальний виробничий пакет",
      },
    ],
    updatedAt: "2026-05-19T09:00:00.000Z",
    updatedBy: "p-yuri" as PersonId,
  },
  {
    id: "f-246-19" as FileId,
    productId: "prod-246" as ProductId,
    name: "label_artwork",
    ext: ".svg",
    kind: "svg",
    stage: "production",
    position: 1,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-19T09:30:00.000Z",
        uploadedBy: "p-yuri" as PersonId,
      },
    ],
    updatedAt: "2026-05-19T09:30:00.000Z",
    updatedBy: "p-yuri" as PersonId,
  },
  {
    id: "f-246-20" as FileId,
    productId: "prod-246" as ProductId,
    name: "final_qc",
    ext: ".pdf",
    kind: "pdf",
    stage: "production",
    position: 2,
    versions: [
      {
        version: "v1",
        uploadedAt: "2026-05-20T11:00:00.000Z",
        uploadedBy: "p-yuri" as PersonId,
        note: "QC пройдено, 150 одиниць упаковано",
      },
    ],
    updatedAt: "2026-05-20T11:00:00.000Z",
    updatedBy: "p-yuri" as PersonId,
  },
];

export const filesById = new Map<FileId, ProductFile>(
  FILES.map((f) => [f.id, f]),
);
