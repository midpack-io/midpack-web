"use client";

import { useMemo, useState, type ReactNode } from "react";
import { BundleStepper } from "@/components/ds/bundle-stepper";
import type {
  PersonId,
  Stage,
  StageInstance,
  StageStatus,
} from "@/lib/api/types";

type AssignablePersonId = PersonId | "unassigned";

// Stage flow + role table copied from src/mocks/data/products.ts so this
// reference page doesn't reach across the network seam into MSW data.

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
    performer: "p-olena" as PersonId,
    approver: "p-olena" as PersonId,
  },
  sample: {
    performer: "p-marta" as PersonId,
    approver: "p-olena" as PersonId,
  },
  fitting: {
    performer: "p-anna" as PersonId,
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
  currentIndex: number;
  currentStatus: StageStatus;
  overrides?: Partial<Record<Stage, StageOverride>>;
  parallelBranches?: {
    parallelGroup: string;
    branches: Array<{
      suffix: string;
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
  // Spec: locked = false iff all previous stages are done/canceled. Threaded
  // left-to-right so a canceled stage still leaves its successor unlocked.
  let allPrevDoneOrCanceled = true;

  FLOW.forEach((entry, idx) => {
    const override = overrides[entry.stage] ?? {};
    const baseRoles = STAGE_ROLES[entry.stage];

    if (idx === currentIndex && parallelBranches) {
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

    // Locked stages get no performer — matches the mock-data convention in
    // src/mocks/data/products.ts so the showcase reads the same way.
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

// ─── Variations ────────────────────────────────────────────────────────────

const VARIATIONS: { title: string; description: string; stages: StageInstance[] }[] = [
  {
    title: "Fresh draft",
    description: "Brand-new product. First stage to-do, everything after is locked.",
    stages: buildStages({
      currentIndex: 0,
      currentStatus: "to-do",
      overrides: {
        idea: { performerId: "unassigned", approverId: "unassigned" },
      },
    }),
  },
  {
    title: "In progress · mid-flow",
    description: "Techpack (03) is in progress; predecessors done, everything after locked.",
    stages: buildStages({
      currentIndex: 2,
      currentStatus: "in-progress",
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
  },
  {
    title: "In review · orange accent",
    description: "Pattern-review (06) is a review stage and active → orange treatment.",
    stages: buildStages({
      currentIndex: 5,
      currentStatus: "in-progress",
      overrides: {
        "pattern-review": {
          performerId: "p-anna" as PersonId,
          approverId: "p-anna" as PersonId,
        },
      },
    }),
  },
  {
    title: "Patterns awaiting review",
    description:
      "Лекала (05) flagged as a review stage with status To Review — orange border + the quieter 'TO REVIEW' chip.",
    // FLOW marks patterns as a work stage. Force `isReview: true` on stage 05
    // for this demo so we can surface the To Review chip on a Лекала pill.
    stages: buildStages({
      currentIndex: 4, // patterns (Лекала)
      currentStatus: "to-do",
    }).map((s, i) => (i === 4 ? { ...s, isReview: true } : s)),
  },
  {
    title: "Returned · iter 2 · overdue",
    description: "Techpack reopened after a rejection — iteration mark + overdue deadline chip.",
    stages: buildStages({
      currentIndex: 2,
      currentStatus: "in-progress",
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
  },
  {
    title: "Blocked",
    description: "Procurement (04) is blocked — red accent + Blocked status chip.",
    stages: buildStages({
      currentIndex: 3,
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
  },
  {
    title: "Parallel branches",
    description: "Procurement splits into 04a (fabric) and 04b (trims) — both active in parallel.",
    stages: buildStages({
      currentIndex: 3,
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
  },
  {
    title: "Canceled mid-flow",
    description: "Sketch was canceled, killing the rest of the flow.",
    stages: buildStages({
      currentIndex: 1,
      currentStatus: "canceled",
    }),
  },
  {
    title: "Manual unlock · skipped ahead",
    description:
      "Idea (01) in progress, Tech-pak (03) manually unlocked by a manager — both render as active even though Sketch (02) is still locked.",
    stages: buildStages({
      currentIndex: 0,
      currentStatus: "in-progress",
      overrides: {
        idea: {
          performerId: "p-anna" as PersonId,
          approverId: "p-olena" as PersonId,
        },
      },
    }).map((s, i) =>
      i === 2 ? { ...s, locked: false, manuallyUnlocked: true } : s,
    ),
  },
  {
    title: "All done",
    description: "Every stage approved — all pills in resting/done state.",
    stages: FLOW.map((entry) => ({
      n: entry.n,
      stage: entry.stage,
      label: entry.label,
      status: "done" as StageStatus,
      locked: false,
      manuallyUnlocked: false,
      isReview: entry.isReview,
      performerId: STAGE_ROLES[entry.stage].performer,
      approverId: STAGE_ROLES[entry.stage].approver,
    })),
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function StepperPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-[24px] p-[24px]">
      <header>
        <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
          Stepper states
        </h1>
        <p className="text-[12px] leading-[1.4] text-zinc-500">
          BundleStepper rendered across the states it has to handle. Click any pill to
          select it; click a status chip to change the stage's status — each section
          keeps its own selection and its own status edits. Data copied from{" "}
          <code className="font-mono">src/mocks/data/products.ts</code>.
        </p>
      </header>

      {VARIATIONS.map((v) => (
        <Section key={v.title} title={v.title} description={v.description}>
          <SelectableStepper stages={v.stages} />
        </Section>
      ))}

      <Section
        title="Page variant"
        description={`Same selection behavior, rendered with variant="page" chrome.`}
      >
        <SelectableStepper stages={VARIATIONS[1]?.stages ?? []} variant="page" />
      </Section>
    </main>
  );
}

// Each instance owns its own `selectedStageN` AND its own working copy of the
// stage list, so the showcase page can render many of these side by side and
// let the reader poke at each independently — both selection (outline halo)
// and status (chip menu) are scoped to a single section. Initial selection
// is intentionally empty; initial stages come from the seed `stages` prop.
function SelectableStepper({
  stages: initialStages,
  variant,
}: {
  stages: StageInstance[];
  variant?: "inline-row" | "page";
}) {
  const [selectedStageN, setSelectedStageN] = useState<string | undefined>(undefined);
  const [stages, setStages] = useState(initialStages);
  // Memoize the handlers so React doesn't churn the BundleStepper memo on
  // every render. (Not strictly required, but it's a nice citizen.)
  const handleStatusChange = useMemo(
    () => (n: string, next: StageStatus) => {
      setStages((prev) =>
        prev.map((s) => (s.n === n ? { ...s, status: next } : s)),
      );
    },
    [],
  );
  const handlePerformerChange = useMemo(
    () => (n: string, next: AssignablePersonId) => {
      setStages((prev) =>
        prev.map((s) => (s.n === n ? { ...s, performerId: next } : s)),
      );
    },
    [],
  );
  const handleUnlock = useMemo(
    () => (n: string) => {
      setStages((prev) =>
        prev.map((s) =>
          s.n === n ? { ...s, locked: false, manuallyUnlocked: true } : s,
        ),
      );
    },
    [],
  );
  return (
    <BundleStepper
      stages={stages}
      variant={variant ?? "inline-row"}
      mode="tabs"
      selectedStageN={selectedStageN}
      onSelectStage={setSelectedStageN}
      onStatusChange={handleStatusChange}
      onPerformerChange={handlePerformerChange}
      onUnlock={handleUnlock}
    />
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-card-lg border border-border bg-surface shadow-sm">
      <header className="px-[20px] pt-[16px] pb-[12px]">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {title}
        </div>
        <p className="mt-[2px] text-[12px] leading-[1.4] text-zinc-500">{description}</p>
      </header>
      {children}
    </section>
  );
}
