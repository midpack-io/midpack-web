import type {
  CollectionId,
  PersonId,
  Product,
  ProductId,
  Stage,
  StageInstance,
  StageStatus,
} from "@/lib/api/types";

// ─── Stage flow ───────────────────────────────────────────────────────────────

interface FlowEntry {
  n: string;
  stage: Stage;
  label: string;
}

const FLOW: FlowEntry[] = [
  { n: "01", stage: "idea", label: "Ідея" },
  { n: "02", stage: "sketch", label: "Ескізи" },
  { n: "03", stage: "techpack", label: "Тех-пак" },
  { n: "04", stage: "procurement", label: "Закупівля" },
  { n: "05", stage: "patterns", label: "Лекала" },
  { n: "06", stage: "sample", label: "Перший зразок" },
  { n: "07", stage: "fitting", label: "Примірка" },
  { n: "08", stage: "grading", label: "Градація" },
  { n: "09", stage: "production", label: "Виробництво" },
];

// Typical performer/approver matrix per stage. Overrides can replace per-product.
const STAGE_ROLES: Record<
  Stage,
  { performer: PersonId; approver: PersonId | PersonId[] }
> = {
  idea: { performer: "p-anna" as PersonId, approver: "p-olena" as PersonId },
  sketch: { performer: "p-lina" as PersonId, approver: "p-anna" as PersonId },
  techpack: {
    performer: "p-pavlo" as PersonId,
    approver: "p-olena" as PersonId,
  },
  procurement: {
    performer: "p-yulia" as PersonId,
    approver: "p-olena" as PersonId,
  },
  patterns: {
    performer: "p-pavlo" as PersonId,
    approver: "p-olena" as PersonId,
  },
  sample: {
    performer: "p-marta" as PersonId,
    approver: "p-olena" as PersonId,
  },
  fitting: {
    performer: "p-marta" as PersonId,
    approver: "p-anna" as PersonId,
  },
  grading: {
    performer: "p-pavlo" as PersonId,
    approver: "p-olena" as PersonId,
  },
  production: {
    performer: "p-yuri" as PersonId,
    approver: "p-founder" as PersonId,
  },
};

interface StageOverride {
  performerId?: PersonId | "unassigned";
  approverId?: PersonId | PersonId[] | "unassigned" | "not_required";
  iter?: number;
  deadlineLabel?: string;
  deadlineKind?: "met" | "upcoming" | "at-risk" | "overdue" | "missed";
  deadlineDate?: string;
}

interface BuildStagesArgs {
  currentIndex: number; // 0-based index into FLOW
  currentStatus: StageStatus;
  overrides?: Partial<Record<Stage, StageOverride>>;
  // If set, replaces FLOW[currentIndex] with a parallel branch of these pills.
  // The pills all share the same `parallelGroup` key and are inserted at the
  // current index, pushing subsequent stages down.
  parallelBranches?: {
    parallelGroup: string;
    branches: Array<{
      suffix: string; // "a", "b" — combined with the base n to form "04a"
      status: StageStatus;
      performerId: PersonId | "unassigned";
      approverId?: PersonId | PersonId[] | "unassigned" | "not_required";
    }>;
  };
}

function buildStages({
  currentIndex,
  currentStatus,
  overrides = {},
  parallelBranches,
}: BuildStagesArgs): StageInstance[] {
  const out: StageInstance[] = [];

  FLOW.forEach((entry, idx) => {
    const override = overrides[entry.stage] ?? {};
    const baseRoles = STAGE_ROLES[entry.stage];

    if (idx === currentIndex && parallelBranches) {
      // Expand this stage into parallel pills (e.g., 04a/04b).
      for (const branch of parallelBranches.branches) {
        out.push({
          n: `${entry.n}${branch.suffix}`,
          stage: entry.stage,
          label: entry.label,
          status: branch.status,
          performerId: branch.performerId,
          approverId: branch.approverId ?? baseRoles.approver,
          parallelGroup: parallelBranches.parallelGroup,
        });
      }
      return;
    }

    let status: StageStatus;
    if (idx < currentIndex) status = "passed";
    else if (idx === currentIndex) status = currentStatus;
    else status = "todo";

    const stage: StageInstance = {
      n: entry.n,
      stage: entry.stage,
      label: entry.label,
      status,
      performerId: override.performerId ?? baseRoles.performer,
      approverId: override.approverId ?? baseRoles.approver,
    };
    if (override.iter !== undefined) stage.iter = override.iter;
    if (override.deadlineLabel) {
      stage.deadline = {
        kind: override.deadlineKind ?? "upcoming",
        label: override.deadlineLabel,
        date: override.deadlineDate,
      };
    }
    out.push(stage);
  });

  return out;
}

// ─── Tag presets ──────────────────────────────────────────────────────────────

const TAG_SS26 = { label: "SS26", tone: "teal" } as const;
const TAG_OUTERWEAR = { label: "outerwear", tone: "indigo" } as const;
const TAG_DRESSES = { label: "dresses", tone: "indigo" } as const;
const TAG_BOTTOMS = { label: "bottoms", tone: "indigo" } as const;
const TAG_TOPS = { label: "tops", tone: "indigo" } as const;
const TAG_HERO = { label: "hero piece", tone: "pink" } as const;
const TAG_SAMPLE_READY = { label: "sample-ready", tone: "amber" } as const;
const TAG_APPROVED = { label: "approved", tone: "green" } as const;

const SPRING = "col-spring-2026" as CollectionId;

// ─── Products ─────────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  // Style 252 — Cropped cardigan · fresh draft
  {
    id: "prod-252" as ProductId,
    styleNo: "Style 252",
    name: "Cropped cardigan",
    collectionId: SPRING,
    tags: [],
    customFields: [],
    stages: buildStages({
      currentIndex: 0,
      currentStatus: "todo",
      overrides: {
        idea: { performerId: "unassigned", approverId: "unassigned" },
      },
    }),
    status: "ready",
    iteration: 1,
    performerId: "unassigned",
    approverId: "unassigned",
    updatedAt: "2026-05-22T14:55:00.000Z", // just now
    updatedBy: "p-anna" as PersonId,
    currentStageN: "01",
  },

  // Style 247 — Navy blazer · in-progress at 03
  {
    id: "prod-247" as ProductId,
    styleNo: "Style 247",
    name: "Navy blazer",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s247", tone: "slate" },
      TAG_OUTERWEAR,
      TAG_HERO,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-247-AW25" },
      { key: "Fabric", value: "Wool 240gsm" },
      { key: "MOQ", value: "120" },
      { key: "Cost", value: "€48" },
    ],
    stages: buildStages({
      currentIndex: 2,
      currentStatus: "active",
      overrides: {
        techpack: {
          performerId: "p-marta" as PersonId,
          approverId: "p-olena" as PersonId,
          deadlineLabel: "Nov 12",
          deadlineKind: "upcoming",
          deadlineDate: "2026-11-12T00:00:00.000Z",
        },
      },
    }),
    status: "in_progress",
    iteration: 1,
    performerId: "p-marta" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-05-22T14:00:00.000Z", // 1h ago
    updatedBy: "p-marta" as PersonId,
    currentStageN: "03",
  },

  // Style 248 — Silk midi dress · in-review at 04 (you are approver)
  {
    id: "prod-248" as ProductId,
    styleNo: "Style 248",
    name: "Silk midi dress",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s248", tone: "slate" },
      TAG_DRESSES,
      TAG_HERO,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-248-SS26" },
      { key: "Fabric", value: "Silk crêpe 19mm" },
      { key: "MOQ", value: "80" },
      { key: "Cost", value: "€62" },
    ],
    stages: buildStages({
      currentIndex: 3,
      currentStatus: "in-review",
      overrides: {
        procurement: {
          performerId: "p-olena" as PersonId,
          approverId: "p-anna" as PersonId,
        },
      },
    }),
    status: "in_review",
    iteration: 1,
    performerId: "p-olena" as PersonId,
    approverId: "p-anna" as PersonId,
    dueDate: "2026-05-24T00:00:00.000Z",
    updatedAt: "2026-05-22T13:00:00.000Z", // 2h ago
    updatedBy: "p-olena" as PersonId,
    currentStageN: "04",
  },

  // Style 249 — Linen wrap dress · RETURNED at 03 · iter 2 · overdue
  {
    id: "prod-249" as ProductId,
    styleNo: "Style 249",
    name: "Linen wrap dress",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s249", tone: "slate" },
      TAG_DRESSES,
      TAG_SAMPLE_READY,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-249-SS26" },
      { key: "Fabric", value: "Linen 180gsm" },
      { key: "MOQ", value: "100" },
      { key: "Cost", value: "€38" },
    ],
    stages: buildStages({
      currentIndex: 2,
      currentStatus: "returned",
      overrides: {
        techpack: {
          performerId: "p-marta" as PersonId,
          approverId: "p-olena" as PersonId,
          iter: 2,
          deadlineLabel: "1d overdue",
          deadlineKind: "overdue",
        },
      },
    }),
    status: "returned",
    iteration: 2,
    performerId: "p-marta" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-05-20T00:00:00.000Z",
    updatedAt: "2026-05-21T16:00:00.000Z", // yesterday
    updatedBy: "p-pavlo" as PersonId,
    currentStageN: "03",
  },

  // Style 250 — Wool overcoat · READY at 01 · unassigned
  {
    id: "prod-250" as ProductId,
    styleNo: "Style 250",
    name: "Wool overcoat",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s250", tone: "slate" },
      TAG_OUTERWEAR,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-250-SS26" },
      { key: "Fabric", value: "", unset: true },
    ],
    stages: buildStages({
      currentIndex: 0,
      currentStatus: "ready",
      overrides: {
        idea: { performerId: "unassigned", approverId: "p-olena" as PersonId },
      },
    }),
    status: "ready",
    iteration: 1,
    performerId: "unassigned",
    approverId: "p-olena" as PersonId,
    updatedAt: "2026-05-22T09:00:00.000Z", // today, earlier
    updatedBy: "p-anna" as PersonId,
    currentStageN: "01",
  },

  // Style 246 — Cotton trench · DONE · all stages passed (shipping May 24)
  {
    id: "prod-246" as ProductId,
    styleNo: "Style 246",
    name: "Cotton trench",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s246", tone: "slate" },
      TAG_OUTERWEAR,
      TAG_APPROVED,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-246-SS26" },
      { key: "Fabric", value: "Cotton twill 220gsm" },
      { key: "MOQ", value: "150" },
      { key: "Cost", value: "€42" },
      { key: "Ship", value: "May 24" },
    ],
    // All 9 stages passed — represent by putting "current" past the end and
    // status passed; buildStages handles it via currentIndex = 9 → no current,
    // all idx < 9 are passed.
    stages: FLOW.map((entry) => ({
      n: entry.n,
      stage: entry.stage,
      label: entry.label,
      status: "passed" as StageStatus,
      performerId:
        entry.stage === "production"
          ? ("p-yuri" as PersonId)
          : STAGE_ROLES[entry.stage].performer,
      approverId:
        entry.stage === "production"
          ? ("p-founder" as PersonId)
          : STAGE_ROLES[entry.stage].approver,
    })),
    status: "done",
    iteration: 1,
    performerId: "p-yuri" as PersonId,
    approverId: "p-founder" as PersonId,
    dueDate: "2026-05-24T00:00:00.000Z",
    updatedAt: "2026-05-20T11:00:00.000Z", // 2d ago
    updatedBy: "p-yuri" as PersonId,
    currentStageN: "09",
  },

  // Style 251 — Tweed mini skirt · PARALLEL branch at 04 (fabric + trims)
  {
    id: "prod-251" as ProductId,
    styleNo: "Style 251",
    name: "Tweed mini skirt",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s251", tone: "slate" },
      TAG_BOTTOMS,
      TAG_SAMPLE_READY,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-251-SS26" },
      { key: "Fabric", value: "Tweed bouclé 320gsm" },
      { key: "Trim", value: "Pearl btn ×6" },
      { key: "MOQ", value: "90" },
      { key: "Cost", value: "€51" },
    ],
    stages: buildStages({
      currentIndex: 3, // procurement
      currentStatus: "active",
      parallelBranches: {
        parallelGroup: "procurement-251",
        branches: [
          {
            suffix: "a",
            status: "active",
            performerId: "p-yulia" as PersonId,
            approverId: "p-olena" as PersonId,
          },
          {
            suffix: "b",
            status: "active",
            performerId: "p-roma" as PersonId,
            approverId: "p-olena" as PersonId,
          },
        ],
      },
    }),
    status: "in_progress",
    iteration: 1,
    performerId: "p-yulia" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-06-02T00:00:00.000Z",
    updatedAt: "2026-05-22T11:00:00.000Z", // 4h ago
    updatedBy: "p-yulia" as PersonId,
    currentStageN: "04",
  },

  // Style 253 — Pleated trousers · active at 06 (mid-flow)
  {
    id: "prod-253" as ProductId,
    styleNo: "Style 253",
    name: "Pleated trousers",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s253", tone: "slate" },
      TAG_BOTTOMS,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-253-SS26" },
      { key: "Fabric", value: "Wool gabardine 280gsm" },
      { key: "MOQ", value: "100" },
      { key: "Cost", value: "€44" },
    ],
    stages: buildStages({
      currentIndex: 5, // sample
      currentStatus: "active",
      overrides: {
        sample: {
          performerId: "p-marta" as PersonId,
          approverId: "p-olena" as PersonId,
          deadlineLabel: "May 28",
          deadlineKind: "upcoming",
          deadlineDate: "2026-05-28T00:00:00.000Z",
        },
      },
    }),
    status: "in_progress",
    iteration: 1,
    performerId: "p-marta" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-05-28T00:00:00.000Z",
    updatedAt: "2026-05-22T09:00:00.000Z", // 6h ago
    updatedBy: "p-marta" as PersonId,
    currentStageN: "06",
  },

  // Style 254 — Knit polo · CANCELED at 02
  {
    id: "prod-254" as ProductId,
    styleNo: "Style 254",
    name: "Knit polo",
    collectionId: SPRING,
    tags: [
      { label: "bundle / s254", tone: "slate" },
      TAG_TOPS,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-254-SS26" },
      { key: "Fabric", value: "Cotton piqué 200gsm" },
    ],
    stages: buildStages({
      currentIndex: 1, // sketch
      currentStatus: "canceled",
      overrides: {
        sketch: {
          performerId: "p-lina" as PersonId,
          approverId: "p-anna" as PersonId,
        },
      },
    }),
    status: "canceled",
    iteration: 1,
    performerId: "p-lina" as PersonId,
    approverId: "p-anna" as PersonId,
    updatedAt: "2026-05-19T10:00:00.000Z", // 3d ago
    updatedBy: "p-anna" as PersonId,
    currentStageN: "02",
  },

  // Style 255 — Tailored shirt · REOPENED at 03 · iter 2
  {
    id: "prod-255" as ProductId,
    styleNo: "Style 255",
    name: "Tailored shirt",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s255", tone: "slate" },
      TAG_TOPS,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-255-SS26" },
      { key: "Fabric", value: "Cotton poplin 110gsm" },
      { key: "MOQ", value: "120" },
      { key: "Cost", value: "€28" },
    ],
    stages: buildStages({
      currentIndex: 2, // techpack
      currentStatus: "reopened",
      overrides: {
        techpack: {
          performerId: "p-pavlo" as PersonId,
          approverId: "p-olena" as PersonId,
          iter: 2,
        },
      },
    }),
    status: "in_progress",
    iteration: 2,
    performerId: "p-pavlo" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-05-23T00:00:00.000Z",
    updatedAt: "2026-05-22T07:00:00.000Z", // 8h ago
    updatedBy: "p-pavlo" as PersonId,
    currentStageN: "03",
  },
];

export const productsById = new Map<ProductId, Product>(
  PRODUCTS.map((p) => [p.id, p]),
);
