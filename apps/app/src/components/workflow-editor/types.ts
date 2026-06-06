import type {
  FileKind,
  PersonId,
  WorkflowGraphEdge,
  WorkflowGraphNode,
} from "@/lib/api/types";

// Local UI state for the workflow-template canvas editor.
//
// These types EXTEND the real API shapes (src/lib/api/types.ts) rather than
// replace them, so wiring this page to live data later is a drop-in step.
// Each added field names the real model column it mirrors in a comment — the
// point is shape-honesty, not a data contract (the data layer is out of scope
// for this build).

// A file template attached to a stage. Mirrors a future
// `workflow_stage_template_files` row (copy-on-use blueprint — seeds a slot
// when a product enters the stage; edits never flow back).
export interface AttachedTemplate {
  id: string; // → file_template_id
  name: string;
  kind?: FileKind;
  required?: boolean;
}

// A file component linked to a stage. Mirrors a future
// `workflow_stage_components` row (a live, shared reference — edits at the
// source propagate; it is a link, not a copy).
export interface AttachedComponent {
  id: string; // → file_component_id
  name: string;
  sourceLabel: string; // e.g. "SS26 Colour Palette · v3"
  kind?: FileKind;
}

// The base `WorkflowGraphNode` (id/label/x/y/kind) plus the per-stage config
// the runtime `workflow_stages` table will carry but the API node shape does
// not yet expose:
//   performerId       → workflow_stages.performer_id
//   isReview          → workflow_stages.is_review  (kind:"review" is the same
//                       fact; `kind` stays authoritative for layout + paint)
//   isFilesExpected   → workflow_stages.is_files_expected
//   templateFiles     → workflow_stage_template_files[]
//   components        → workflow_stage_components[]
export interface EditorNode extends WorkflowGraphNode {
  performerId?: PersonId | "unassigned";
  description?: string;
  isFilesExpected?: boolean;
  templateFiles?: AttachedTemplate[];
  components?: AttachedComponent[];
}

// A `WorkflowGraph` whose nodes carry the editor's extra fields. Edges are the
// real `WorkflowGraphEdge` tuple unchanged.
export interface EditorGraph {
  nodes: EditorNode[];
  edges: WorkflowGraphEdge[];
}

// One published snapshot. Mirrors a future `workflow_template_revisions` table:
// a running product is pinned to the revision it started on, so the history is
// what makes the "publishing won't change running products" promise true.
export interface Revision {
  version: number;
  name: string;
  graph: EditorGraph;
  publishedAt: string; // ISO
  note?: string;
}

// The full editor working state.
export interface EditorState {
  name: string;
  graph: EditorGraph;
  revisions: Revision[];
  // Working draft differs from the last *saved* snapshot.
  dirty: boolean;
  // Working draft differs from the last *published* revision.
  hasUnpublishedChanges: boolean;
  // The node currently open in the inspector (null = nothing selected).
  selectedId: string | null;
  // Transient: the just-inserted node, so the canvas can play an entrance.
  enteringId: string | null;
}

// ─── Sample library fixtures (UI only) ──────────────────────────────────────
// Feed the "Add from library" pickers. Replaced by the library hooks when the
// data layer lands; clearly NOT part of src/mocks/.

export interface SampleLibraryTemplate {
  id: string;
  name: string;
  kind: FileKind;
  required?: boolean;
}

export interface SampleLibraryComponent {
  id: string;
  name: string;
  sourceLabel: string;
  kind: FileKind;
}

// One active product running this template — drives the impact preview.
// Mirrors LibraryUsageRef from the API types.
export interface SampleUsageRef {
  productId: string;
  productName: string;
  collectionName: string;
  stage: string;
  pinnedRevision: number;
}
