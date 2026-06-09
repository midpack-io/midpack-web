// Domain types shared by hooks, handlers, and components.
// Mirrors the data model in design_handoff_midpack/README.md §"State & data model".
// All dates are ISO 8601 strings — that's what JSON-over-HTTP returns.

// ─── Branded IDs ──────────────────────────────────────────────────────────────

declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

export type WorkspaceId = Brand<string, "WorkspaceId">;
export type CollectionId = Brand<string, "CollectionId">;
export type ProductId = Brand<string, "ProductId">;
export type PersonId = Brand<string, "PersonId">;
// `User` is the canonical identity record (the midpack-server `users` table). The
// legacy `Person`/`PersonId` naming is the same concept — renaming it is a separate
// cleanup (see handoffs/members-implementation-plan.md §1). New backend-backed
// contracts (Members) reference users by `UserId`.
export type UserId = Brand<string, "UserId">;
export type MemberId = Brand<string, "MemberId">;
export type ActivityId = Brand<string, "ActivityId">;
export type CommentId = Brand<string, "CommentId">;
export type FileId = Brand<string, "FileId">;
export type ViewId = Brand<string, "ViewId">;
export type NotificationId = Brand<string, "NotificationId">;
export type WorkflowTemplateId = Brand<string, "WorkflowTemplateId">;
export type FileComponentId = Brand<string, "FileComponentId">;
export type FileTemplateId = Brand<string, "FileTemplateId">;

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

// Per midpack-product/specs/stages-and-statuses.md — review is no longer a status;
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

// The products-list "view" lenses. System views are these predicates; saved
// views (see SavedView) layer a stored filter config on top. Lives here, not in
// the component layer, because the eventual GET /products?tab=… endpoint and the
// SavedView resource both speak this shape.
export type ProductsTab =
  | "all"
  | "in-progress"
  | "needs-you"
  | "in-review"
  | "returned"
  | "blocked"
  | "done";

export type ProductsSort =
  | "activity-newest"
  | "activity-oldest"
  | "due-soonest"
  | "due-latest"
  | "progress-most"
  | "progress-least"
  | "name-asc"
  | "name-desc";

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
  // Adobe Swatch Exchange — colour-palette components (e.g. SS26 Colour palette).
  | "ase"
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
  | "founder"
  // Added for the Members roster (handoffs/design_handoff_members prototype).
  | "andriy"
  | "sasha"
  | "kostya"
  | "maryna"
  | "tetyana"
  | "igor";

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

export interface Workspace {
  id: WorkspaceId;
  name: string; // Display name shown in the top-bar root crumb and settings.
  handle: string; // URL / MCP slug. Lowercase, no spaces.
  // Invite seat cap shown as "used/total" in the invite dialog; null = unlimited.
  // snake_case because it's the schema.aml workspaces.seats_limit column the
  // stage-2 server will serialize (the older name/handle fields predate it).
  seats_limit: number | null;
}

// ─── Members (workspace seats) ──────────────────────────────────────────────
// A backend-backed contract from day one, so — unlike the legacy camelCase domain
// types above — it follows the FastAPI/Pydantic snake_case wire shape (root
// CLAUDE.md → Naming conventions; handoffs/members-implementation-plan.md §2b).
// A Member is a workspace SEAT with a lifecycle; identity (name/avatar) is the
// joined `user` projection, never duplicated onto the member row.

export type MemberStatus = "active" | "pending" | "deactivated";

// Projection of the joined `users` row. Pending invites have no user yet (`user`
// is null) — the seat's only identity is its email.
export interface MemberUser {
  id: UserId;
  name: string;
  initial: string; // derived display initial
  avatar_key: AvatarKey | null; // gradient fallback (frontend)
  avatar_url: string | null; // real photo when present
}

export interface Member {
  id: MemberId;
  status: MemberStatus;
  // Role is flags-only: `is_owner` is DERIVED server-side from
  // workspaces.owner_user_id (no stored column); `is_admin` is the workspace-admin
  // flag (distinct from the platform users.is_saas_admin). The role chip label is
  // derived: owner → Owner, else admin → Admin, else Member.
  is_owner: boolean;
  is_admin: boolean;
  email: string; // seat / invite email; the only identity a pending row has
  user: MemberUser | null; // null while pending — joined server-side

  last_activity_at: string | null; // ISO; null = never signed in
  open_work_count: number; // derived from in-flight assignments

  // pending-only
  invited_by_id?: UserId;
  invited_at?: string; // ISO
  expires_at?: string; // ISO; 7-day invite window

  // deactivated-only
  deactivated_by_id?: UserId;
  deactivated_at?: string; // ISO
}

// One in-flight assignment that must be reassigned before a member can be
// deactivated (the State-C gate). Fully simulated in stage-1 MSW; the server
// returns [] until products/assignments exist (plan §6.3).
export interface ReassignTarget {
  product_id: ProductId;
  product_name: string; // "Style 248 — Linen suit"
  stage_n: string; // "04"
  stage_label: string; // "Закупівля"
  kind: "performer" | "approver";
  replacement_id?: UserId; // who takes it over (request side)
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

// The serializable filter configuration for the products list. This is exactly
// what a SavedView stores and what a stage-2 GET /products query string would
// encode — keep it free of transient UI-only fields.
export interface ProductsQuery {
  tab: ProductsTab;
  sort: ProductsSort;
  // Empty array == "all stages". Membership test against the current stage.
  stages: Stage[];
  // Selected tag labels. Empty == "any". AND across selected tags.
  tags: string[];
  // Selected performer ids. Empty == "anyone". OR across selected people.
  assignee: PersonId[];
  // Per-key selected values for custom fields. Missing/empty == unfiltered.
  fieldValues: Record<string, string[]>;
  // Cross-collection scoping (Worklist only). Missing/empty == all collections.
  // The single-collection Products page never sets this.
  collections?: CollectionId[];
}

// A user-named, collection-scoped filter preset. Stage-2 backend owns this via
// GET/POST/PATCH/DELETE /collections/:id/views. Counts and the "modified" flag
// are derived at render time, never persisted.
export interface SavedView {
  id: ViewId;
  // Present for collection-scoped (Products) views; omitted for global
  // (Worklist) views, which live in their own resource.
  collectionId?: CollectionId;
  name: string;
  query: ProductsQuery;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// ─── Library ────────────────────────────────────────────────────────────────
// The three reusable building blocks curated on /library. A *component* is a
// link to a living file (edits propagate); a *template* is a blueprint copied
// on use (edits don't). A *workflow template* is a pipeline a product runs.
// Backed by the /api/library/:kind endpoints. See midpack-product/specs/library.md.

export type LibraryKind = "workflows" | "components" | "templates";

export type LibraryItemStatus = "active" | "archived";

export type LibrarySort = "updated_desc" | "name_asc" | "usage_desc";

// One product using a library item — surfaced in the usage popover/panel so the
// user can judge blast radius before changing or removing the item. "Active"
// means the product's collection is not archived (per spec §6.1).
export interface LibraryUsageRef {
  productId: ProductId;
  productName: string;
  collectionId: CollectionId;
  collectionName: string;
  stage: string; // human-readable current stage, e.g. "Tech-pack"
}

// A node in a workflow card's mini-graph. Coordinates live in the same
// 0..280 × 0..80 space the card SVG renders into; maps to
// workflow_stages.position_x/position_y/is_review in schema.aml.
export interface WorkflowGraphNode {
  id: string;
  label?: string;
  x: number;
  y: number;
  kind: "start" | "stage" | "review";
}

export type WorkflowGraphEdge = [from: string, to: string];

export interface WorkflowGraph {
  nodes: WorkflowGraphNode[];
  edges: WorkflowGraphEdge[];
  // Overflow caption when not all stages are drawn, e.g. "+ 5 more".
  moreLabel?: string;
}

export interface WorkflowTemplate {
  id: WorkflowTemplateId;
  name: string;
  status: LibraryItemStatus;
  isDraft?: boolean;
  stageCount: number;
  reviewCount: number;
  // Short meta line, e.g. "12 stages · 1 review" / "8 stages · linear".
  summary: string;
  graph: WorkflowGraph;
  // Count of active products running this template (usage verb: "active").
  usageActive: number;
  updatedAt: string; // ISO
}

export interface FileComponent {
  id: FileComponentId;
  name: string;
  kind: FileKind;
  version: string; // current version, e.g. "v3"
  status: LibraryItemStatus;
  // Count of active products holding a live reference (usage verb: "referenced").
  usageReferenced: number;
  versions: FileVersion[];
  updatedAt: string; // ISO
}

export interface FileTemplate {
  id: FileTemplateId;
  name: string;
  kind: FileKind;
  version: string;
  status: LibraryItemStatus;
  // Count of active products seeded from this template (usage verb: "seeded").
  usageSeeded: number;
  versions: FileVersion[];
  updatedAt: string; // ISO
}

// Discriminated union of any library item, keyed by kind — convenient for the
// shared card menu / detail drawer that operate generically across the three.
export type LibraryItem =
  | ({ kind: "workflows" } & WorkflowTemplate)
  | ({ kind: "components" } & FileComponent)
  | ({ kind: "templates" } & FileTemplate);

// ─── Notifications ────────────────────────────────────────────────────────────
// The per-recipient inbox behind the top-bar bell. See midpack-product/specs/notifications.md.
// Read state is per recipient (the nullable `readAt`), so it can't live on the
// shared `activity` row — this is its own fanned-out resource (spec §9).

// Drives the corner badge color + glyph on the row avatar.
export type NotificationKind =
  | "mention"
  | "review"
  | "approve"
  | "stage"
  | "deadline"
  | "system";

export type NotificationPillTone = "linked" | "amber" | "coral" | "green" | "indigo";

export interface NotificationPill {
  tone: NotificationPillTone;
  label: string;
}

// One inline run of the composed notification sentence. The stage-2 backend
// composes these from the notification's type + actor + target FKs (spec §9
// stores no body text); stage 1 stores them directly. Rendered as real
// elements — never via dangerouslySetInnerHTML. Mirrors the handoff's
// .actor / .ref / .ref.linkedref / <b> spans.
export type NotificationSegment =
  | { t: "text"; s: string }
  | { t: "actor"; s: string }
  | { t: "ref"; s: string }
  | { t: "linkedref"; s: string }
  | { t: "strong"; s: string };

export interface Notification {
  id: NotificationId;
  kind: NotificationKind;
  // null = system-generated event (rendered with a gear-glyph avatar).
  actorId: PersonId | null;
  body: NotificationSegment[];
  // Optional single-line comment preview shown under the body.
  quote?: string;
  pill?: NotificationPill;
  // CTA label, e.g. "Відповісти". Hover-revealed on the row.
  action?: string;
  // Coral dot + red row tint instead of indigo (escalated deadlines).
  urgent?: boolean;
  // null = unread. The per-recipient read marker (spec §9 `read_at`).
  readAt: string | null;
  createdAt: string; // ISO — derives both the relative "ago" and the time bucket.
  // Deep-link targets. Seeded for stage-2 readiness; the panel doesn't yet
  // navigate to them.
  collectionId?: CollectionId;
  productId?: ProductId;
  commentId?: CommentId;
}

// Filter lens for the bell panel tabs and the list endpoint.
export type NotificationFilter = "all" | "unread" | "mentions";

// Cursor-paginated list response. `nextCursor` is null on the last page.
export interface NotificationPage {
  items: Notification[];
  nextCursor: string | null;
}
