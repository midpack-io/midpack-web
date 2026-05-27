// Domain types shared by hooks, handlers, and components.
// Mirrors the data model in design_handoff_midpack/README.md §"State & data model".
// All dates are ISO 8601 strings — that's what JSON-over-HTTP returns.

// ─── Branded IDs ──────────────────────────────────────────────────────────────

declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

export type CollectionId = Brand<string, "CollectionId">;
export type ProductId = Brand<string, "ProductId">;
export type PersonId = Brand<string, "PersonId">;
export type ActivityId = Brand<string, "ActivityId">;
export type CommentId = Brand<string, "CommentId">;
export type FileId = Brand<string, "FileId">;

// ─── Unions ───────────────────────────────────────────────────────────────────

export type Stage =
  | "idea"
  | "sketch"
  | "techpack"
  | "procurement"
  | "patterns"
  | "pattern-review"
  | "sample"
  | "fitting"
  | "grading"
  | "production";

// Per product/specs/stages-and-statuses.md — review is no longer a status;
// it's modeled by `isReview` on StageInstance.
export type StageStatus =
  | "to-do"
  | "in-progress"
  | "done"
  | "canceled"
  | "blocked";

export type ProductStatus =
  | "in_progress"
  | "in_review"
  | "returned"
  | "ready"
  | "done"
  | "canceled";

export type CollectionStatus = "active" | "archived" | "wrapping_up";

export type RiskLevel = "on_track" | "at_risk" | "overdue";

export type ProgressTone = "low" | "mid" | "high";

export type ActivityKind = "move" | "approve" | "return" | "mention" | "create";

export type CommentStatus =
  | "open"
  | "resolved"
  // Carried over from a previous file version — the file moved on (v1 → v2)
  // but the comment hasn't been resolved yet.
  | "still_open_from_prev_version";

export type CommentAnchorKind = "bundle" | "file" | "stage";

// Feed row kind. "msg" = a human-written comment; "sys" = a system-emitted
// event surfaced inline in the same feed (e.g., linked-file bumped at source,
// stage transition).
export type CommentKind = "msg" | "sys";

// Subkind for `kind === "sys"` rows, picks the icon + tint.
export type CommentSysFlavor = "linked" | "stage";

export type FileKind =
  | "pdf"
  | "xlsx"
  | "docx"
  | "psd"
  | "svg"
  | "jpg"
  | "png"
  | "figma"
  | "link";

export type DeadlineKind = "met" | "upcoming" | "at-risk" | "overdue" | "missed";

export type AvatarKey =
  | "anna"
  | "olena"
  | "lina"
  | "pavlo"
  | "yuri"
  | "marta"
  | "roma"
  | "yulia"
  | "founder";

export type PersonRole = "manager" | "performer" | "approver" | "viewer";

export type TagTone =
  | "slate"
  | "indigo"
  | "pink"
  | "teal"
  | "amber"
  | "green"
  | "coral";

// ─── Sub-records ──────────────────────────────────────────────────────────────

export interface Cover {
  url: string;
  fabricTag?: string;
  caption?: string;
}

export interface Tag {
  label: string;
  tone: TagTone;
}

export interface CustomField {
  key: string;
  value: string;
  // null value means the field exists on the schema but no value set yet
  // (e.g., Style 250 "Fabric: — set fabric"). Renderer displays a placeholder.
  unset?: boolean;
}

// Schema-level definition of a custom field for a collection: which keys exist
// and what values can fill them. Drives the per-field filter dropdowns in the
// products workspace. Stage-2 backend should return this from
// GET /collections/:id/custom-fields.
export interface CustomFieldDef {
  key: string;
  label: string;
  values: string[];
}

export interface Deadline {
  kind: DeadlineKind;
  date?: string; // ISO
  label: string; // human-readable e.g. "Nov 12", "1d overdue"
}

export interface StageInstance {
  n: string; // "01"…"10", or "04a"/"04b" for parallel branches
  stage: Stage;
  label: string; // Ukrainian label, e.g. "Тех-пак"
  status: StageStatus;
  // Waiting for its turn — hidden from the performer until a predecessor finishes
  // or a manager unlocks manually. Eager value seeded in mock data.
  locked: boolean;
  // Manager override: when true the stage is unlocked regardless of predecessors.
  manuallyUnlocked: boolean;
  // Marks the stage as a review/approval step (orange visual treatment).
  // On a review stage `performerId` is the approver.
  isReview: boolean;
  performerId?: PersonId | "unassigned";
  approverId?: PersonId | PersonId[] | "unassigned" | "not_required";
  deadline?: Deadline;
  iter?: number; // 1, 2, 3…
  parallelGroup?: string; // shared key across pills in the same parallel topology
}

// ─── Top-level entities ───────────────────────────────────────────────────────

export interface Person {
  id: PersonId;
  name: string;
  initial: string;
  avatarKey: AvatarKey;
  role: PersonRole;
}

export interface Collection {
  id: CollectionId;
  code: string; // "SS-26"
  name: string; // "Spring 2026 Launch"
  description: string; // One-line summary shown on the card under the count row.
  dropType: string; // "Spring drop" | "Capsule" | "Gifting" | "Refresh"
  status: CollectionStatus;
  dueDate: string; // ISO
  productCount: number;
  cover: Cover;
  progressPct: number; // 0–100
  progressTone: ProgressTone;
  stageDistribution: Record<Stage, number>;
  unreadMentions: number;
  updatedAt: string; // ISO
  riskLevel: RiskLevel;
  daysToDue: number; // can be negative when overdue
  // Top-3 most-recent activity items, denormalized onto the list response so the
  // Collections page renders cards in one query instead of N+1.
  recentActivity: ActivityItem[];
}

export interface Product {
  id: ProductId;
  styleNo: string; // "Style 247"
  name: string; // "Navy blazer"
  collectionId: CollectionId;
  thumbnail?: string;
  tags: Tag[];
  customFields: CustomField[];
  stages: StageInstance[];
  status: ProductStatus;
  iteration: number; // 1 = first pass, 2 = second, etc.
  performerId?: PersonId | "unassigned";
  approverId?: PersonId | "unassigned";
  // Product-level deadline. Optional — some products don't have one set.
  dueDate?: string; // ISO
  updatedAt: string; // ISO
  updatedBy?: PersonId; // who last touched it
  // The single "currently focused" stage — the one the row meta and status chip describe.
  // Distinct from "the active stage" because returned/in-review/ready also surface here.
  currentStageN: string;
}

export interface ActivityItem {
  id: ActivityId;
  kind: ActivityKind;
  time: string; // ISO
  actorId: PersonId;
  collectionId: CollectionId;
  productId?: ProductId;
  entityName: string; // free-form ("Hero Landing Page", "Style 247 · Navy blazer")
  fromStage?: Stage;
  toStage?: Stage;
}

export type CommentAnchor =
  | { kind: "bundle" }
  | { kind: "file"; fileName: string; version?: string }
  | { kind: "stage"; stage: Stage };

export interface Comment {
  id: CommentId;
  productId: ProductId;
  // "msg" rows have a real `authorId`; "sys" rows don't (the system is the
  // implicit actor, with a person mentioned inside the body instead).
  kind: CommentKind;
  sysFlavor?: CommentSysFlavor;
  authorId: PersonId;
  // Plain text. Renderer parses inline tokens: `@<personId>` for user mentions,
  // `#stage:<n>` for stage references, `[file:<name>@<version>]` for file refs,
  // `[img:<label>@<variant>]` for inline image placeholders, and `**…**` for bold runs.
  // This matches the eventual REST shape — backend stores as text, frontend renders.
  body: string;
  createdAt: string; // ISO
  anchor: CommentAnchor;
  status: CommentStatus;
  // Display tag — "Brief" | "Design" | "Copy" | "Review" | "Approval" |
  // "Production" | "Bundle" | "Component". Drives the "Current stage" filter
  // chip and the per-message stage badge.
  stage?: string;
  parentId?: CommentId; // threaded reply
  // Quote-reply pointer: this comment quotes the referenced one inline as a
  // preview header. Backend stage 2 will likely compute this from a quote
  // token in the body; in stage 1 we set it explicitly on the fixture.
  quoteOfId?: CommentId;
  // Denormalized mention list — populated from the body string at write-time.
  // Cheap to keep in stage 1; in stage 2 backend computes from a parse step.
  mentions: PersonId[];
}

export interface FileVersion {
  version: string; // "v1", "v2", …
  uploadedAt: string; // ISO
  uploadedBy: PersonId;
  sizeBytes?: number;
  note?: string; // optional changelog line
}

export type FileLinkSource =
  | { kind: "collection"; collectionId: CollectionId; label: string }
  | { kind: "workflow"; workflowKey: string; label: string };

// Named `ProductFile` to avoid colliding with the DOM `File` global.
export interface ProductFile {
  id: FileId;
  productId: ProductId;
  name: string; // "TP_001_dress" (no extension)
  ext: string; // ".pdf"
  kind: FileKind;
  stage: Stage; // which stage section it sits under
  // Files sharing the same (productId, stage, folderPath) group visually
  // under one folder heading. Empty folders don't exist.
  folderPath?: string;
  position: number; // sort order within (stage, folderPath)
  // Linked-component annotation. When set, render with the purple badge and
  // "edited at source" affordance instead of the version-pill UI.
  linkedFrom?: FileLinkSource;
  // External link (Figma, etc.). When set, `versions` is empty and the row
  // renders as an outbound link.
  externalUrl?: string;
  externalDomain?: string; // "figma.com/file/AB12"
  versions: FileVersion[]; // empty for external links
  updatedAt: string; // ISO, denormalized for sort/display
  updatedBy: PersonId;
}
