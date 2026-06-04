import type {
  CollectionId,
  PersonId,
  Product,
  ProductId,
  Stage,
  StageInstance,
  StageStatus,
} from "@/lib/api/types";
import {
  TAG_APPROVED,
  TAG_BOTTOMS,
  TAG_DRESSES,
  TAG_HERO,
  TAG_OUTERWEAR,
  TAG_SAMPLE_READY,
  TAG_SS26,
  TAG_TOPS,
} from "./tags";

// ─── Stage flow ───────────────────────────────────────────────────────────────
// `pattern-review` and `fitting` are review stages (isReview = true). Everything
// else is a work stage. See product/specs/stages-and-statuses.md.

interface FlowEntry {
  n: string;
  stage: Stage;
  label: string;
  isReview: boolean;
}

const FLOW: FlowEntry[] = [
  { n: "01", stage: "idea", label: "Ідея", isReview: false },
  { n: "02", stage: "sketch", label: "Ескізи", isReview: false },
  { n: "03", stage: "techpack", label: "Тех-пак", isReview: false },
  { n: "04", stage: "procurement", label: "Закупівля", isReview: false },
  { n: "05", stage: "patterns", label: "Лекала", isReview: false },
  { n: "06", stage: "pattern-review", label: "Перевірка лекал", isReview: true },
  { n: "07", stage: "sample", label: "Перший зразок", isReview: false },
  { n: "08", stage: "fitting", label: "Примірка", isReview: true },
  { n: "09", stage: "grading", label: "Градація", isReview: false },
  { n: "10", stage: "production", label: "Виробництво", isReview: false },
];

// Typical performer per stage. For review stages the performer IS the approver
// (per the new spec — no separate approverId in the source of truth).
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
  "pattern-review": {
    performer: "p-olena" as PersonId, // reviewer of patterns
    approver: "p-olena" as PersonId,
  },
  sample: {
    performer: "p-marta" as PersonId,
    approver: "p-olena" as PersonId,
  },
  fitting: {
    performer: "p-anna" as PersonId, // reviewer of the first sample
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
  // Spec: locked = false iff all previous stages are done/canceled (or
  // manuallyUnlocked, which we don't seed). Threaded left-to-right so a
  // canceled current stage still leaves its immediate successor unlocked.
  let allPrevDoneOrCanceled = true;

  FLOW.forEach((entry, idx) => {
    const override = overrides[entry.stage] ?? {};
    const baseRoles = STAGE_ROLES[entry.stage];

    if (idx === currentIndex && parallelBranches) {
      // Expand this stage into parallel pills (e.g., 04a/04b). Parallel pills
      // are at the current index, so all predecessors are done → unlocked.
      for (const branch of parallelBranches.branches) {
        out.push({
          n: `${entry.n}${branch.suffix}`,
          stage: entry.stage,
          label: entry.label,
          status: branch.status,
          locked: false,
          manuallyUnlocked: false,
          isReview: entry.isReview,
          performerId: branch.performerId,
          approverId: branch.approverId ?? baseRoles.approver,
          parallelGroup: parallelBranches.parallelGroup,
        });
        if (branch.status !== "done" && branch.status !== "canceled") {
          allPrevDoneOrCanceled = false;
        }
      }
      return;
    }

    let status: StageStatus;
    if (idx < currentIndex) status = "done";
    else if (idx === currentIndex) status = currentStatus;
    else status = "to-do";

    const locked = !allPrevDoneOrCanceled;
    if (status !== "done" && status !== "canceled") {
      allPrevDoneOrCanceled = false;
    }

    // Locked stages get no performer — nobody's been assigned because the
    // stage isn't actionable yet. Overrides are only honored on unlocked
    // stages; assigning someone to a locked stage in seed data would be a
    // bug (the UI wouldn't even show the avatar slot to change it).
    const performerId = locked
      ? "unassigned"
      : (override.performerId ?? baseRoles.performer);
    const stage: StageInstance = {
      n: entry.n,
      stage: entry.stage,
      label: entry.label,
      status,
      locked,
      manuallyUnlocked: false,
      isReview: entry.isReview,
      performerId,
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

// ─── Collection key ───────────────────────────────────────────────────────────
// Tag catalog lives in ./tags and is imported at the top of the file.

const SPRING = "col-spring-2026" as CollectionId;
// A few products live outside Spring so the Worklist (cross-collection list)
// and its Collection filter have something to span.
const SUMMER = "col-summer-2026" as CollectionId;
const BRAND = "col-brand-refresh" as CollectionId;

// ─── Products ─────────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  // Style 252 — Cropped cardigan · fresh draft
  {
    id: "prod-252" as ProductId,
    styleNo: "Style 252",
    name: "Cropped cardigan",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1579206464424-7e43a81cadc1?auto=format&fit=crop&w=320&q=80",
    tags: [],
    customFields: [],
    stages: buildStages({
      currentIndex: 0,
      currentStatus: "to-do",
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

  // Style 247 — Navy blazer · in-progress at 05 (patterns / Лекала)
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
      currentIndex: 4, // patterns / Лекала
      currentStatus: "in-progress",
      overrides: {
        patterns: {
          performerId: "p-pavlo" as PersonId,
          approverId: "p-olena" as PersonId,
          deadlineLabel: "Jun 10",
          deadlineKind: "upcoming",
          deadlineDate: "2026-06-10T00:00:00.000Z",
        },
      },
    }),
    status: "in_progress",
    iteration: 1,
    performerId: "p-pavlo" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-05-22T14:00:00.000Z", // 1h ago
    updatedBy: "p-pavlo" as PersonId,
    currentStageN: "05",
  },

  // Style 248 — Silk midi dress · pattern-review in progress (you are the reviewer)
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
      currentIndex: 5, // pattern-review
      currentStatus: "in-progress",
      overrides: {
        "pattern-review": {
          performerId: "p-anna" as PersonId,
          approverId: "p-anna" as PersonId,
        },
      },
    }),
    status: "in_review",
    iteration: 1,
    performerId: "p-anna" as PersonId,
    approverId: "p-anna" as PersonId,
    dueDate: "2026-05-24T00:00:00.000Z",
    updatedAt: "2026-05-22T13:00:00.000Z", // 2h ago
    updatedBy: "p-olena" as PersonId,
    currentStageN: "06",
  },

  // Style 249 — Linen wrap dress · returned to techpack · iter 2 · overdue
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
      currentStatus: "in-progress", // returned-from-review collapses to in-progress
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

  // Style 250 — Wool overcoat · fresh at 01 · unassigned
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
      currentStatus: "to-do",
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

  // Style 246 — Cotton trench · all stages done (shipping May 24)
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
    // Every stage done — all predecessors satisfied so locked=false everywhere.
    stages: FLOW.map((entry) => ({
      n: entry.n,
      stage: entry.stage,
      label: entry.label,
      status: "done" as StageStatus,
      locked: false,
      manuallyUnlocked: false,
      isReview: entry.isReview,
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
    currentStageN: "10",
  },

  // Style 251 — Tweed mini skirt · parallel branch at 04 (fabric + trims)
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
      currentStatus: "in-progress",
      parallelBranches: {
        parallelGroup: "procurement-251",
        branches: [
          {
            suffix: "a",
            status: "in-progress",
            performerId: "p-yulia" as PersonId,
            approverId: "p-olena" as PersonId,
          },
          {
            suffix: "b",
            status: "in-progress",
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

  // Style 253 — Pleated trousers · in-progress at sample (07)
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
      currentIndex: 6, // sample (07 after inserting pattern-review)
      currentStatus: "in-progress",
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
    currentStageN: "07",
  },

  // Style 254 — Knit polo · canceled at sketch (02)
  {
    id: "prod-254" as ProductId,
    styleNo: "Style 254",
    name: "Knit polo",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1671438118097-479e63198629?auto=format&fit=crop&w=320&q=80",
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

  // Style 255 — Tailored shirt · techpack reopened · iter 2
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
      currentStatus: "in-progress", // reopened collapses to in-progress under the new vocab
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

  // Style 256 — Cashmere V-neck · BLOCKED at 04 (procurement)
  // Yarn supplier missed the lot — procurement waiting on confirmation before
  // the next round of swatches can be ordered.
  {
    id: "prod-256" as ProductId,
    styleNo: "Style 256",
    name: "Cashmere V-neck",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s256", tone: "slate" },
      TAG_TOPS,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-256-SS26" },
      { key: "Fabric", value: "Cashmere 12gg" },
      { key: "MOQ", value: "60" },
      { key: "Cost", value: "€78" },
    ],
    stages: buildStages({
      currentIndex: 3, // procurement
      currentStatus: "blocked",
      overrides: {
        procurement: {
          performerId: "p-yulia" as PersonId,
          approverId: "p-olena" as PersonId,
          deadlineLabel: "Blocked · supplier",
          deadlineKind: "at-risk",
          deadlineDate: "2026-06-08T00:00:00.000Z",
        },
      },
    }),
    status: "in_progress",
    iteration: 1,
    performerId: "p-yulia" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-05-22T08:30:00.000Z", // 6.5h ago
    updatedBy: "p-yulia" as PersonId,
    currentStageN: "04",
  },

  // Style 257 — Pleated midi skirt · IN REVIEW at 08 (Примірка / fitting)
  // First sample landed; the fit reviewer is checking it against the patterns
  // before grading can begin.
  {
    id: "prod-257" as ProductId,
    styleNo: "Style 257",
    name: "Pleated midi skirt",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "bundle / s257", tone: "slate" },
      TAG_BOTTOMS,
      TAG_SAMPLE_READY,
      TAG_SS26,
    ],
    customFields: [
      { key: "SKU", value: "DR-257-SS26" },
      { key: "Fabric", value: "Viscose twill 140gsm" },
      { key: "MOQ", value: "110" },
      { key: "Cost", value: "€39" },
    ],
    stages: buildStages({
      currentIndex: 7, // fitting (Примірка)
      currentStatus: "in-progress",
      overrides: {
        fitting: {
          performerId: "p-anna" as PersonId,
          approverId: "p-anna" as PersonId,
          deadlineLabel: "May 27",
          deadlineKind: "upcoming",
          deadlineDate: "2026-05-27T00:00:00.000Z",
        },
      },
    }),
    status: "in_review",
    iteration: 1,
    performerId: "p-anna" as PersonId,
    approverId: "p-anna" as PersonId,
    dueDate: "2026-06-10T00:00:00.000Z",
    updatedAt: "2026-05-22T12:10:00.000Z", // 2.5h ago
    updatedBy: "p-anna" as PersonId,
    currentStageN: "08",
  },

  // ── Cross-collection products (Summer Capsule, Brand Refresh) ──────────────
  // Seeded so the Worklist spans more than one collection. They reuse Spring's
  // tag/custom-field values so the aggregate catalogs and filters apply.

  // Summer · Linen suit jacket · in-progress at techpack
  {
    id: "prod-301" as ProductId,
    styleNo: "Style 301",
    name: "Linen suit jacket",
    collectionId: SUMMER,
    thumbnail:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=320&q=80",
    tags: [TAG_OUTERWEAR, TAG_SS26],
    customFields: [
      { key: "Fabric", value: "Linen 180gsm" },
      { key: "MOQ", value: "100" },
      { key: "Cost", value: "€44" },
    ],
    stages: buildStages({
      currentIndex: 2,
      currentStatus: "in-progress",
      overrides: {
        techpack: { performerId: "p-marta" as PersonId, approverId: "p-olena" as PersonId },
      },
    }),
    status: "in_progress",
    iteration: 1,
    performerId: "p-marta" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-05-21T16:00:00.000Z",
    updatedBy: "p-marta" as PersonId,
    currentStageN: "03",
  },

  // Summer · Cotton beach dress · in review at pattern-review
  {
    id: "prod-302" as ProductId,
    styleNo: "Style 302",
    name: "Cotton beach dress",
    collectionId: SUMMER,
    thumbnail:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=320&q=80",
    tags: [TAG_DRESSES, TAG_SS26],
    customFields: [
      { key: "Fabric", value: "Cotton poplin 110gsm" },
      { key: "MOQ", value: "150" },
      { key: "Cost", value: "€38" },
    ],
    stages: buildStages({
      currentIndex: 5,
      currentStatus: "in-progress",
      overrides: {
        "pattern-review": { performerId: "p-lina" as PersonId, approverId: "p-olena" as PersonId },
      },
    }),
    status: "in_review",
    iteration: 1,
    performerId: "p-lina" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-07-05T00:00:00.000Z",
    updatedAt: "2026-05-20T11:00:00.000Z",
    updatedBy: "p-lina" as PersonId,
    currentStageN: "06",
  },

  // Brand Refresh · Logo tote bag · returned for rework at procurement
  {
    id: "prod-303" as ProductId,
    styleNo: "Style 303",
    name: "Logo tote bag",
    collectionId: BRAND,
    thumbnail:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=320&q=80",
    tags: [TAG_TOPS, TAG_SS26],
    customFields: [
      { key: "Fabric", value: "Cotton twill 220gsm" },
      { key: "MOQ", value: "120" },
      { key: "Cost", value: "€28" },
    ],
    stages: buildStages({
      currentIndex: 3,
      currentStatus: "in-progress",
      overrides: {
        procurement: { performerId: "p-pavlo" as PersonId, approverId: "p-olena" as PersonId },
      },
    }),
    status: "returned",
    iteration: 2,
    performerId: "p-pavlo" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-05-19T09:30:00.000Z",
    updatedBy: "p-olena" as PersonId,
    currentStageN: "04",
  },

  // Brand Refresh · Packaging sleeve · blocked at patterns
  {
    id: "prod-304" as ProductId,
    styleNo: "Style 304",
    name: "Packaging sleeve",
    collectionId: BRAND,
    thumbnail:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=320&q=80",
    tags: [TAG_BOTTOMS],
    customFields: [
      { key: "MOQ", value: "90" },
      { key: "Cost", value: "€42" },
    ],
    stages: buildStages({
      currentIndex: 4,
      currentStatus: "blocked",
      overrides: {
        patterns: { performerId: "p-yuri" as PersonId, approverId: "p-olena" as PersonId },
      },
    }),
    status: "in_progress",
    iteration: 1,
    performerId: "p-yuri" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-05-18T14:00:00.000Z",
    updatedBy: "p-yuri" as PersonId,
    currentStageN: "05",
  },
];

export const productsById = new Map<ProductId, Product>(
  PRODUCTS.map((p) => [p.id, p]),
);
