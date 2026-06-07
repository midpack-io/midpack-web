import type {
  CollectionId,
  PersonId,
  Product,
  ProductId,
  Stage,
  StageInstance,
  StageStatus,
} from "../lib/types";

// Static products for the marketing hero. Faithful to the app's data model
// (10-stage flow, review stages, locked predecessors) so the shared product
// row renders exactly as it does in the app — just from local data, no fetch.

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

const STAGE_ROLES: Record<Stage, { performer: PersonId; approver: PersonId }> = {
  idea: { performer: "p-anna" as PersonId, approver: "p-olena" as PersonId },
  sketch: { performer: "p-lina" as PersonId, approver: "p-anna" as PersonId },
  techpack: { performer: "p-pavlo" as PersonId, approver: "p-olena" as PersonId },
  procurement: { performer: "p-yulia" as PersonId, approver: "p-olena" as PersonId },
  patterns: { performer: "p-pavlo" as PersonId, approver: "p-olena" as PersonId },
  "pattern-review": { performer: "p-olena" as PersonId, approver: "p-olena" as PersonId },
  sample: { performer: "p-marta" as PersonId, approver: "p-olena" as PersonId },
  fitting: { performer: "p-anna" as PersonId, approver: "p-anna" as PersonId },
  grading: { performer: "p-pavlo" as PersonId, approver: "p-olena" as PersonId },
  production: { performer: "p-yuri" as PersonId, approver: "p-founder" as PersonId },
};

interface StageOverride {
  performerId?: PersonId | "unassigned";
  deadlineLabel?: string;
  deadlineKind?: "met" | "upcoming" | "at-risk" | "overdue" | "missed";
  deadlineDate?: string;
}

// Stages 0..currentIndex-1 are done; currentIndex carries currentStatus; the
// rest are to-do. A stage is locked until every predecessor is done/canceled.
function buildStages(
  currentIndex: number,
  currentStatus: StageStatus,
  overrides: Partial<Record<Stage, StageOverride>> = {},
): StageInstance[] {
  const out: StageInstance[] = [];
  let allPrevDoneOrCanceled = true;

  FLOW.forEach((entry, idx) => {
    const override = overrides[entry.stage] ?? {};
    const roles = STAGE_ROLES[entry.stage];

    let status: StageStatus;
    if (idx < currentIndex) status = "done";
    else if (idx === currentIndex) status = currentStatus;
    else status = "to-do";

    const locked = !allPrevDoneOrCanceled;
    if (status !== "done" && status !== "canceled") allPrevDoneOrCanceled = false;

    const stage: StageInstance = {
      n: entry.n,
      stage: entry.stage,
      label: entry.label,
      status,
      locked,
      manuallyUnlocked: false,
      isReview: entry.isReview,
      performerId: locked ? "unassigned" : (override.performerId ?? roles.performer),
      approverId: roles.approver,
    };
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

const SPRING = "col-spring-2026" as CollectionId;

export const SAMPLE_PRODUCTS: Product[] = [
  // Navy blazer — in-progress at patterns (blue active pill), tags + fields + deadline.
  {
    id: "prod-247" as ProductId,
    styleNo: "Style 247",
    name: "Navy blazer",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "outerwear", tone: "slate" },
      { label: "hero", tone: "indigo" },
      { label: "SS-26", tone: "teal" },
    ],
    customFields: [
      { key: "Fabric", value: "Wool 240gsm" },
      { key: "MOQ", value: "120" },
    ],
    stages: buildStages(4, "in-progress", {
      patterns: {
        performerId: "p-pavlo" as PersonId,
        deadlineLabel: "Jun 10",
        deadlineKind: "upcoming",
        deadlineDate: "2026-06-10T00:00:00.000Z",
      },
    }),
    status: "in_progress",
    iteration: 1,
    performerId: "p-pavlo" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-05-22T14:00:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
    currentStageN: "05",
  },

  // Silk midi dress — pattern-review in progress (orange review active pill).
  {
    id: "prod-248" as ProductId,
    styleNo: "Style 248",
    name: "Silk midi dress",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "dresses", tone: "pink" },
      { label: "SS-26", tone: "teal" },
    ],
    customFields: [{ key: "Fabric", value: "Silk twill" }],
    stages: buildStages(5, "in-progress", {
      "pattern-review": {
        performerId: "p-olena" as PersonId,
        deadlineLabel: "Jun 6",
        deadlineKind: "at-risk",
        deadlineDate: "2026-06-06T00:00:00.000Z",
      },
    }),
    status: "in_review",
    iteration: 2,
    performerId: "p-olena" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-06-12T00:00:00.000Z",
    updatedAt: "2026-05-22T13:30:00.000Z",
    updatedBy: "p-olena" as PersonId,
    currentStageN: "06",
  },

  // Wool overcoat — in-progress at tech-pack (early, lots still locked).
  {
    id: "prod-251" as ProductId,
    styleNo: "Style 251",
    name: "Wool overcoat",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=320&q=80",
    tags: [
      { label: "outerwear", tone: "slate" },
      { label: "carryover", tone: "amber" },
    ],
    customFields: [],
    stages: buildStages(2, "in-progress", {
      techpack: { performerId: "p-pavlo" as PersonId },
    }),
    status: "in_progress",
    iteration: 1,
    performerId: "p-pavlo" as PersonId,
    approverId: "p-olena" as PersonId,
    dueDate: "2026-06-28T00:00:00.000Z",
    updatedAt: "2026-05-22T11:00:00.000Z",
    updatedBy: "p-pavlo" as PersonId,
    currentStageN: "03",
  },

  // Cropped cardigan — fresh draft (first stage, to-do, unassigned).
  {
    id: "prod-252" as ProductId,
    styleNo: "Style 252",
    name: "Cropped cardigan",
    collectionId: SPRING,
    thumbnail:
      "https://images.unsplash.com/photo-1579206464424-7e43a81cadc1?auto=format&fit=crop&w=320&q=80",
    tags: [{ label: "knitwear", tone: "green" }],
    customFields: [],
    stages: buildStages(0, "to-do", {
      idea: { performerId: "unassigned" },
    }),
    status: "ready",
    iteration: 1,
    performerId: "unassigned",
    approverId: "unassigned",
    updatedAt: "2026-05-22T14:55:00.000Z",
    updatedBy: "p-anna" as PersonId,
    currentStageN: "01",
  },
];
