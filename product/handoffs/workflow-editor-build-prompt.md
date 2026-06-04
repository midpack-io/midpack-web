# Build prompt — Workflow-template canvas editor, UI/UX (`/library/workflows/[id]`)

> Run this in a fresh session inside `midpack-web`. **This is a UI/UX build.** The goal is a
> beautiful, polished, interactive canvas page — not a data integration. Do **not** write MSW
> handlers, edit seed files, define API endpoints, or build TanStack Query hooks. Drive the whole
> page from **local component state** whose *shape matches the real types* in `src/lib/api/types.ts`,
> so that wiring it to live data later is a drop-in step. Read the files this prompt names before
> writing code.

## Purpose

Build the **workflow-template editor**: the canvas page where a head of design designs a reusable
pipeline of stages. It's reached from the Library (`/library?tab=workflows` → open a card →
`/library/workflows/[id]`). Make it feel like a focused, refined design tool — the canvas, the stage
nodes, and the one signature "impact preview" moment should carry the identity. Every interaction
should feel immediate and considered.

The page must **reflect the real data structure** (so it reads as a faithful prototype of the eventual
product), but it is **not** wired to real data in this build. All state is local; all "saves",
"publishes" and "rollbacks" mutate in-memory React state.

## What a workflow template is (so the UI expresses the right thing)

- A **blueprint of sequential stages**: output of stage N feeds stage N+1; branches and merges
  (parallel paths that fan out and rejoin) are allowed.
- Each stage carries a **performer** and an **`is_review`** flag — there is **no "named approver"**
  concept; a review is just a stage with `isReview: true`, rendered **orange** (`isReview` wins over
  everything visually). Do not invent approver fields.
- Each stage owns **its own attached files**: **file templates** (expected-deliverable starter slots)
  and **file components** (links to live, shared library files). The UI lets you attach/detach these
  per stage. (Distinction to make legible: a *component* is a link to a living file; a *template* is a
  blueprint that gets copied.)
- A template is a *blueprint*, not a running product. **Publishing never rewrites products already
  running it** — each stays pinned to the revision it started on. This reassurance is the page's
  signature trust moment (the impact preview).
- The base reference flow is the 9-stage collection pipeline in
  `product/processes/typical-collection-flow.md` — use it as the sample graph the page opens with.

## Read first

Product (what the page must express):
- `product/page-structure.md` §4 (this page) and §5 (the Library it lives in)
- `product/specs/stages-and-statuses.md` — `performer + isReview`, statuses, the orange review accent
- `product/specs/library.md` — §5.2 attaching templates/components to a stage; duplicate; "N active" usage
- `product/processes/typical-collection-flow.md` — the 9-stage flow to seed the canvas with

Code (the shapes and visuals to reuse):
- `src/lib/api/types.ts` — `WorkflowGraph`, `WorkflowGraphNode`, `WorkflowGraphEdge`,
  `WorkflowTemplate`, `FileTemplate`, `FileComponent`, `PersonId`. **Shape your local state to these.**
- `src/components/ds/bundle-stepper/stepper-pill.tsx` — **the visual reference for the stage node.**
  Also `stage-theme.ts` (accent tokens), `person-picker.tsx`, `text-editable.tsx`, `status-chip.tsx`.
- `src/app/(app)/library/page.tsx` — the workflows-tab card the page links from (add the link if missing).

(You do **not** need to read or touch `src/mocks/`, `src/hooks/`, or `src/lib/api/` clients for this build.)

## Data: reflect the shape, don't build the layer

- **Use the real types** from `src/lib/api/types.ts` as the type of your local state. The canvas
  state is a `WorkflowGraph`; nodes are `WorkflowGraphNode`; edges are `WorkflowGraphEdge`.
- **Seed from an inline sample**, not from `src/mocks/`. Put a `const SAMPLE_GRAPH: WorkflowGraph`
  (the 9-stage collection flow) in the feature directory — e.g.
  `src/components/workflow-editor/sample-data.ts`. Same for a short list of sample library items to
  populate the attach picker, and a couple of sample published revisions for the rollback menu. These
  are UI fixtures to make the page render — clearly separate from `src/mocks/`, and replaced by hooks
  when the data layer lands (out of scope here).
- **All interactions mutate local React state.** Add/rename/delete/connect a node, attach/detach a
  file, toggle review, save, publish, roll back — every one updates in-memory state. No `fetch`, no
  hooks, no persistence. A page reload resets to the sample — that's expected for this build.
- **Where the type lacks a UI field, extend the shape honestly.** `WorkflowGraphNode` has no file
  attachments or performer yet, and `WorkflowTemplate` has no revision history. Add the fields you
  need as plain TypeScript (in `types.ts` or a local UI type), naming the real model they mirror in a
  comment (`workflow_stages.is_review`, `workflow_stage_template_files`, `workflow_stage_components`,
  a future `workflow_template_revisions` table). The point is shape-honesty, not a data contract.

Suggested local shape (adjust as the UI needs):
- node: `{ id, label, x, y, kind: "start"|"stage"|"review", performerId?, description?, isFilesExpected?, templateFiles?: {id,name,kind?,required?}[], components?: {id,sourceLabel,name,kind?}[] }`
- editor state: `{ graph: WorkflowGraph, revisions: { version, graph, publishedAt, note? }[], dirty, hasUnpublishedChanges }`

## What to build (UI)

### Route
`src/app/(app)/library/workflows/[id]/page.tsx`. All feature components live in
`src/components/workflow-editor/`.

### Canvas — React Flow, hybrid
- `pnpm add @xyflow/react`. Import its stylesheet once (`@xyflow/react/dist/style.css`) — required
  third-party CSS, an accepted exception to the Tailwind-only rule. All *your* styling stays Tailwind.
- Pan/zoom canvas of draggable nodes connected by edges, with the sequential spine **auto-laid-out**
  by default: a hand-rolled (~30 lines) layered left→right layout — BFS layering from the `start`
  node, one column per layer, siblings spread on the y-axis. Add a **"Re-layout"** control. Do **not**
  add a graph-layout dependency.
- Free drag updates node `x/y` in state; `<Controls>` for pan/zoom; dotted `<Background>`; optional
  `<MiniMap>`. Keep canvas chrome minimal and quiet — the nodes are the focus.
- Style the **edges** to match the DS (thin, soft, restrained); the insert-between `+` affordance
  (below) should feel like part of the edge, not a floating button.

### Stage node (`stageNode`) — make it read like the stepper pill, and make it fancy
- **Visual sibling of `StepperPill`** (`src/components/ds/bundle-stepper/stepper-pill.tsx`): a
  `rounded-md` bordered pill with a small status-icon circle on the left, the stage label, and the
  performer avatar slot on the right. Reuse the accent tokens from that file / `stage-theme.ts` so a
  canvas node and a runtime stepper pill are visibly the same family — this node is the design-time
  twin of the runtime pill.
- Kinds: `start` | `stage` | `review`. Inline-editable **name** (reuse `text-editable.tsx`).
- **Performer chip** — reuse `person-picker.tsx`. Unassigned state allowed (dashed empty slot, like
  the pill's).
- **Review toggle** — flips `kind:"review"` and applies the **orange** accent.
- **Attachment hint** — when a node has attached templates/components, show a small count marker (e.g.
  paperclip + N) so the canvas hints which stages carry files without opening the inspector.
- **Connection handles** (source/target) for drag-to-connect. Polished hover/selection states; the
  selected node gets the same hairline halo language the pill uses.

### Interactions
- **Add node** — a `+` affordance on the canvas, and **insert-between**: a `+` on an edge `[a,b]`
  creates node `n` and rewrites the edge to `[a,n]` + `[n,b]`. This is the "add a lab-dip stage in 2
  minutes" story — make it fast and satisfying (the new node animates in; the layout eases).
- **Connect** by dragging from a handle; **delete** node/edge (keyboard + a context affordance);
  **rename**, **set performer**, **toggle review**, **attach/detach files** inline or via the inspector.

### Selected-node inspector — a slide-in side panel
All edits mirror the node and update local state:
- **Name** (`text-editable`), **performer** (`person-picker`), **review** flag, optional **description**.
- **`is_files_expected` toggle** — gates whether attached templates seed a slot when a product enters
  the stage (purely a UI toggle here).
- **Expected files (templates)** — list of attached file templates with an "Add from library" picker
  (fed by the inline sample list); each row removable; show kind + optional "required". When
  `is_files_expected` is off, keep attached templates but mark them "won't seed" — never silently drop.
- **Linked components** — list of attached file components; "Add from library" picker; each row
  removable; annotate "live · referenced" so the component-vs-template distinction is obvious.
- Deleting a node detaches its files; it never deletes the underlying library item.

### Header
- Editable template **name** (`text-editable`).
- **Impact preview — the signature moment.** Show "N active products run this template — publishing
  won't change them; each stays pinned to the revision it started on," with a popover listing the
  referenced products (use a sample count/list). Make this the most considered, trust-building detail
  on the page.
- **Save** — persists the working draft to local state; enabled only when dirty.
- **Publish** (primary) — snapshots the current graph as a new revision in local state; enabled only
  when there are unpublished changes; a brief confirmation/affordance ties it to the impact preview.
- **Revision menu / Rollback** — a dropdown of published revisions (version, date); selecting one
  restores it into the working draft (the user reviews, then re-publishes). Disabled with <2 revisions.
- **Duplicate** — clone-to-fork affordance (UI only: produce a copied draft in state / a toast).

### States — first-class design moments
- **Loading:** a canvas skeleton (`<Skeleton>`) — design it, don't skip it (you can simulate a brief
  loading flash from local state on mount).
- **Error:** an inline message + retry treatment (design the state even if it's never triggered here).
- **Empty:** a fresh draft is the 2-node `start → end` seed rendered ready to edit, not a blank screen.

## Conventions you must obey

- **Components:** the canvas, node, and inspector are feature composites — put them in
  `src/components/workflow-editor/`, not `ds/`. When you need an accessible primitive (popover,
  dropdown, tooltip, dialog), install it via `pnpm dlx shadcn@latest add <name>` into `ui/` and
  compose. The stage node must **reuse the visual language of** `bundle-stepper/stepper-pill.tsx`.
- **Design tokens:** prefer default Tailwind/shadcn tokens. **Do not add new `@theme` tokens** — use
  the closest existing token, or the inline-arbitrary pattern the current DS components already use.
- **No emojis** in code. **Loading / error / empty** are mandatory, not optional.
- URL stays exactly `/library/workflows/[id]`; the route noun is `workflows` (the product noun is
  "workflow template").
- **Do not start or kill the dev server** — it's the user's. Verify with typecheck and hand the user a
  click-through.

## Aesthetic direction

Refined and restrained, matching the existing Midpack DS — this is a focused tool surface, not a
marketing page. "Fancy" here means **polish, not decoration**: smooth eased auto-layout, a satisfying
insert-between animation, a slide-in inspector, crisp hover/selection states on nodes that echo the
stepper pill, quiet edges, minimal canvas chrome. Let the orange review accent and the stage nodes
carry the identity. Commit to the **impact preview** as the one memorable moment — the editor's calm
answer to "will publishing break what's already running?"

## Verification

1. `pnpm typecheck` — must pass clean.
2. Hand the user this click-through (on *their* running dev server — do not start it yourself):
   - Open `/library?tab=workflows`, click a template → lands on the canvas with the 9-stage spine laid
     out; nodes read like the stepper pills.
   - Insert a stage between two existing stages → edge splits, new node animates in, layout eases.
   - Set its performer; toggle review → node turns orange.
   - Open the inspector → attach a file template and a file component; remove one → the node's
     attachment marker updates.
   - Drag a node → position holds; pan/zoom and Re-layout work.
   - Save → button disables. Publish → unpublished-changes clears; impact preview reassures.
   - Make another change, publish again, then roll back to the prior revision → the canvas restores it.
   - Duplicate → produces a fresh editable draft.

## Out of scope (explicitly)

- **The entire data layer:** MSW handlers, `src/mocks/` seed edits, REST endpoints, TanStack Query
  hooks, query keys, cache invalidation, `fetch`, persistence. None of it. State is local; reload resets.
- Authoring/uploading actual file *content* or new file versions (the inspector only attaches sample
  library items by reference).
- Runtime stage status/locking (the *product instance* model, not the template).
- "Apply structural edits to already-running products" (default stays: no retroactive rewrite).
- Real backend + auth (a later stage). The Library list page itself (built — only add the link here).
