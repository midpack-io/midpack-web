import type {
  CollectionId,
  LibraryUsageRef,
  ProductId,
  WorkflowGraph,
  WorkflowTemplate,
  WorkflowTemplateId,
} from "@/lib/api/types";

// Workflow templates curated on /library. A product *runs* one template; the
// "versioning" model is duplicate-to-fork (no file-version chain). Mutated in
// place by the handlers; state resets on full page reload.

const SPRING = "col-spring-2026" as CollectionId;

// A few active Spring products to populate usage popovers. High card counts
// (e.g. 47) are summarised — the endpoint returns a representative page.
function ref(id: string, name: string, stage: string): LibraryUsageRef {
  return {
    productId: id as ProductId,
    productName: name,
    collectionId: SPRING,
    collectionName: "Spring 2026 Launch",
    stage,
  };
}

const SPRING_REFS: LibraryUsageRef[] = [
  ref("prod-247", "Style 247 · Navy blazer", "Tech-pack"),
  ref("prod-248", "Style 248 · Silk midi dress", "Sample"),
  ref("prod-249", "Style 249 · Linen wrap dress", "Fitting"),
  ref("prod-250", "Style 250 · Wool overcoat", "Grading"),
  ref("prod-246", "Style 246 · Cotton trench", "Review"),
  ref("prod-251", "Style 251 · Tweed mini skirt", "Production"),
  ref("prod-252", "Style 252 · Cropped cardigan", "Sample"),
  ref("prod-253", "Style 253 · Pleated trousers", "Tech-pack"),
];

const SS26_GRAPH: WorkflowGraph = {
  nodes: [
    { id: "s", x: 12, y: 32, kind: "start", label: "brief" },
    { id: "a", x: 60, y: 32, kind: "stage", label: "tech-pack" },
    { id: "b", x: 108, y: 32, kind: "stage" },
    { id: "f", x: 156, y: 20, kind: "stage", label: "fabric" },
    { id: "t", x: 156, y: 44, kind: "stage", label: "trims" },
    { id: "r", x: 204, y: 32, kind: "review", label: "review" },
    { id: "e", x: 252, y: 32, kind: "stage" },
  ],
  edges: [
    ["s", "a"],
    ["a", "b"],
    ["b", "f"],
    ["b", "t"],
    ["f", "r"],
    ["t", "r"],
    ["r", "e"],
  ],
  moreLabel: "+ 5 more",
};

const CAPSULE_GRAPH: WorkflowGraph = {
  nodes: [
    { id: "s", x: 12, y: 32, kind: "start", label: "brief" },
    { id: "a", x: 60, y: 32, kind: "stage", label: "spec" },
    { id: "b", x: 108, y: 32, kind: "stage", label: "sample" },
    { id: "c", x: 156, y: 32, kind: "stage", label: "prod" },
    { id: "r", x: 204, y: 32, kind: "review", label: "review" },
    { id: "e", x: 252, y: 32, kind: "stage" },
  ],
  edges: [
    ["s", "a"],
    ["a", "b"],
    ["b", "c"],
    ["c", "r"],
    ["r", "e"],
  ],
  moreLabel: "+ 2",
};

const FW26_GRAPH: WorkflowGraph = {
  nodes: [
    { id: "s", x: 12, y: 32, kind: "start", label: "brief" },
    { id: "u1", x: 60, y: 20, kind: "stage" },
    { id: "d1", x: 60, y: 44, kind: "stage" },
    { id: "m", x: 108, y: 32, kind: "stage", label: "merge" },
    { id: "r", x: 156, y: 32, kind: "review", label: "review" },
    { id: "u2", x: 204, y: 20, kind: "stage" },
    { id: "d2", x: 204, y: 44, kind: "stage" },
    { id: "e", x: 252, y: 32, kind: "stage" },
  ],
  edges: [
    ["s", "u1"],
    ["s", "d1"],
    ["u1", "m"],
    ["d1", "m"],
    ["m", "r"],
    ["r", "u2"],
    ["r", "d2"],
    ["u2", "e"],
    ["d2", "e"],
  ],
};

const RESORT_GRAPH: WorkflowGraph = {
  nodes: [
    { id: "s", x: 12, y: 32, kind: "start" },
    { id: "a", x: 60, y: 32, kind: "stage" },
    { id: "u1", x: 108, y: 20, kind: "stage" },
    { id: "d1", x: 108, y: 44, kind: "stage" },
    { id: "u2", x: 156, y: 20, kind: "stage" },
    { id: "d2", x: 156, y: 44, kind: "stage" },
    { id: "r", x: 204, y: 32, kind: "review" },
    { id: "e", x: 252, y: 32, kind: "stage" },
  ],
  edges: [
    ["s", "a"],
    ["a", "u1"],
    ["a", "d1"],
    ["u1", "u2"],
    ["d1", "d2"],
    ["u2", "r"],
    ["d2", "r"],
    ["r", "e"],
  ],
  moreLabel: "14 stages · WIP",
};

const REISSUE_GRAPH: WorkflowGraph = {
  nodes: [
    { id: "s", x: 12, y: 32, kind: "start", label: "brief" },
    { id: "a", x: 60, y: 32, kind: "stage", label: "remap" },
    { id: "b", x: 108, y: 32, kind: "stage", label: "cost" },
    { id: "c", x: 156, y: 32, kind: "stage", label: "tech" },
    { id: "r", x: 204, y: 32, kind: "review", label: "review" },
  ],
  edges: [
    ["s", "a"],
    ["a", "b"],
    ["b", "c"],
    ["c", "r"],
  ],
};

// Minimal linear graph for archived stubs (hidden behind the Archived filter).
function linearGraph(n: number): WorkflowGraph {
  const nodes = Array.from({ length: n }, (_, i) => ({
    id: `n${i}`,
    x: 12 + i * 48,
    y: 32,
    kind: (i === 0 ? "start" : i === n - 1 ? "review" : "stage") as
      | "start"
      | "stage"
      | "review",
  }));
  const edges = nodes
    .slice(0, -1)
    .map((node, i) => [node.id, nodes[i + 1]!.id] as [string, string]);
  return { nodes, edges };
}

const ACTIVE: WorkflowTemplate[] = [
  {
    id: "wf-ss26-standard" as WorkflowTemplateId,
    name: "SS26 Standard pipeline",
    status: "active",
    stageCount: 12,
    reviewCount: 1,
    summary: "12 stages · 1 review",
    graph: SS26_GRAPH,
    usageActive: 47,
    updatedAt: "2026-05-26T10:00:00.000Z",
  },
  {
    id: "wf-capsule-fast" as WorkflowTemplateId,
    name: "Capsule fast-track",
    status: "active",
    stageCount: 8,
    reviewCount: 1,
    summary: "8 stages · linear",
    graph: CAPSULE_GRAPH,
    usageActive: 12,
    updatedAt: "2026-05-23T09:00:00.000Z",
  },
  {
    id: "wf-fw26-pre" as WorkflowTemplateId,
    name: "FW26 Pre-collection",
    status: "active",
    stageCount: 11,
    reviewCount: 1,
    summary: "11 stages · 2 branches",
    graph: FW26_GRAPH,
    usageActive: 6,
    updatedAt: "2026-05-21T12:00:00.000Z",
  },
  {
    id: "wf-resort26-test" as WorkflowTemplateId,
    name: "Resort 26 (test run)",
    status: "active",
    isDraft: true,
    stageCount: 14,
    reviewCount: 1,
    summary: "Draft",
    graph: RESORT_GRAPH,
    usageActive: 0,
    updatedAt: "2026-05-27T16:30:00.000Z",
  },
  {
    id: "wf-reissue" as WorkflowTemplateId,
    name: "Re-issue / carryover",
    status: "active",
    stageCount: 6,
    reviewCount: 1,
    summary: "6 stages · linear",
    graph: REISSUE_GRAPH,
    usageActive: 4,
    updatedAt: "2026-05-07T11:00:00.000Z",
  },
];

const ARCHIVED_NAMES = [
  "SS25 Standard pipeline",
  "FW25 Pre-collection",
  "Capsule v1",
  "Resort 25",
  "Holiday 25 gifting",
  "Pre-fall 25",
  "Legacy linear flow",
];

const ARCHIVED: WorkflowTemplate[] = ARCHIVED_NAMES.map((name, i) => ({
  id: `wf-archived-${i}` as WorkflowTemplateId,
  name,
  status: "archived",
  stageCount: 6 + (i % 4),
  reviewCount: 1,
  summary: `${6 + (i % 4)} stages · linear`,
  graph: linearGraph(5 + (i % 3)),
  usageActive: 0,
  updatedAt: `2025-1${i % 2}-0${(i % 8) + 1}T09:00:00.000Z`,
}));

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [...ACTIVE, ...ARCHIVED];

export const workflowTemplatesById = new Map<WorkflowTemplateId, WorkflowTemplate>(
  WORKFLOW_TEMPLATES.map((w) => [w.id, w]),
);

export const workflowUsage = new Map<WorkflowTemplateId, LibraryUsageRef[]>([
  ["wf-ss26-standard" as WorkflowTemplateId, SPRING_REFS],
  ["wf-capsule-fast" as WorkflowTemplateId, SPRING_REFS.slice(0, 5)],
  ["wf-fw26-pre" as WorkflowTemplateId, SPRING_REFS.slice(0, 3)],
  ["wf-reissue" as WorkflowTemplateId, SPRING_REFS.slice(0, 2)],
]);

export function newWorkflowTemplateId(): WorkflowTemplateId {
  return `wf-${crypto.randomUUID()}` as WorkflowTemplateId;
}
