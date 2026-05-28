# Library — Workflows, File Components & File Templates

A single configuration surface where an internal team curates the reusable building blocks every product is assembled from: **workflow templates** (the pipelines), **file components** (live shared files), and **file templates** (starter files). This is a setup/admin surface, not a daily-work surface.

This spec is the brief for design. It defines vocabulary, the three catalogs, user stories, behavioral requirements, screen states, and open questions. Data shapes referenced here live in [`schema.aml`](./schema.aml) (`workflow_templates`, `workflow_stages`, `workflow_stage_template_files`, `workflow_stage_components`, `files`, `file_versions`).

---

## 1. Context & relationship to existing pages

[`page-structure.md`](../page-structure.md) currently splits this into two pages and is missing the third concept:

- **№4 Workflow-шаблони** (`/settings/workflows`) — the stage editor.
- **№5 Бібліотека спільних компонентів** (`/library`) — shared components.
- **File templates** — not yet a page.

This spec proposes **consolidating all three into one `/library` page with three sections**, because they're the same job-to-be-done ("set up the reusable pieces") done by the same person (head of design / admin) at the same time (Phase 2 — setup). The deep workflow *canvas editor* still lives on its own route (`/library/workflows/[id]`); the library page is the catalog and the entry point into it.

> **Drift to confirm:** `page-structure.md` keeps workflows under `/settings/workflows`. If we consolidate, that doc needs updating. Flagging per CLAUDE.md — the docs are source of truth and shouldn't silently disagree.

---

## 2. Vocabulary — the three things being configured

| Entity | What it is | Lifecycle relationship to a product |
| --- | --- | --- |
| **Workflow template** | The full pipeline: an ordered graph of stages (canvas with nodes + edges), each stage carrying config and its own lists of file templates and file components. | A product *runs* one workflow template. Its per-stage runtime state (status, performer, deadline) is a separate instance — editing the template later does **not** retroactively rewrite a running product's stages. |
| **File component** | A **live, shared** file maintained centrally (e.g. season colour palette, brand care label, size-grading rules). Has its own version chain at the source. | A product **references** it. Publishing a new version at the source propagates (or notifies + lets the product pin) to every active product that references it. "Edit once, every bundle sees it." |
| **File template** | A **starter / expected-deliverable** file attached to a stage (e.g. tech-pack template, BOM template, mood-board skeleton). | **Copy-on-use.** When a product enters the stage, the template seeds an expected file slot or a starting copy. The product's copy is independent thereafter; later edits to the template do not flow into products already using it. |

**The one distinction design must make legible:** a **component** is a *link to a living file* (changes propagate); a **template** is a *blueprint that gets copied* (changes don't propagate). The same `.pdf` could exist as either — the difference is the relationship, not the file. The UI for the two sections should make that relationship obvious at a glance (e.g. components show "referenced by N · live", templates show "used to seed N").

---

## 3. Access & personas

- **Primary:** Олена — head of design / admin. Owns process setup. Curates all three catalogs.
- **Secondary:** Марта — tech designer. Drags in a new component/template, uploads a new version, renames, checks usage before swapping a file. Read-mostly on workflow structure.
- **Out:** external scoped partners and one-off reviewers never see this page.

(No enforced role system yet per [`stages-and-statuses.md`](./stages-and-statuses.md); design for an internal-member audience, keep destructive actions guarded.)

> **Note on "approver":** older docs say each stage has a *named approver*. Per the current model (`schema.aml`) stages have a **performer only**; approval is modelled as a **review stage** (`is_review = true`), where the performer is the reviewer. Use "performer" / "review stage" language throughout.

---

## 4. Information architecture

One page, three sections (tabs or segmented sections — design's call):

1. **Workflow templates**
2. **File components**
3. **File templates**

Each section is a **list/grid of cards**, where each card shows: name, a type/format hint (file kind, or stage count for workflows), **usage count** ("used by N active products"), last-updated, and an overflow menu (rename, archive, delete, duplicate). The page has one global search and a per-section filter (at minimum: active / archived).

Workflow template cards open the **canvas editor** (`/library/workflows/[id]`). Component/template cards open a lightweight **detail panel** (versions, usage list, rename) — they don't need a full page.

---

## 5. User stories

### 5.1 Cross-cutting (apply to all three sections)

- As a head of design, I want all my reusable pieces — workflows, components, templates — reachable from one page, so that setting up a season doesn't mean hunting across three places.
- As a head of design, I want to search across everything in the library by name, so that I can find `care_label` without remembering whether it's a component or a template.
- As a head of design, I want each item to show **how many active (non-archived) products currently use it**, so that I can judge the blast radius of changing or removing it before I touch it.
- As a tech designer, I want to click a usage count and see the list of products using the item, so that I can warn the right people before I swap a file — never break downstream work silently (vision pillar 1).
- As a head of design, I want to **archive** an item I no longer want offered for new work, so that it disappears from pickers but every existing reference keeps working.
- As a head of design, I want to **delete** an item only when nothing active uses it, and otherwise be steered to archive instead, so that I can't orphan a file a live product depends on.
- As a head of design, I want to **rename** any item in place, so that I can fix `palette_FINAL_v2` to `SS26 Colour Palette` without re-uploading.
- As a tech designer, I want to **add a new version** of a component or template by dropping a newer file onto it, so that the version chain is one continuous history, not a pile of `_v2` duplicates.

### 5.2 Workflow templates

- As a head of design, I want to **create a new workflow template** from scratch or by **duplicating** an existing one, so that I can stand up SS26 by cloning last season and changing one stage instead of rebuilding.
- As a head of design, I want to open a template into a **canvas editor** where stages are nodes I can place (x/y) and connect with edges, so that parallel branches (e.g. fabric + trims sourcing) are expressible, not just linear lists.
- As a head of design, I want each stage to expose its config — **is_files_expected**, **is_review** (To Review / In Review instead of To Do / In Progress), **is_locked** (default-locked, for edge cases) — so that the pipeline encodes how the stage actually behaves.
- As a head of design, I want to attach **file templates** and **file components** to a specific stage from the library, so that a product entering that stage starts with the right starter files and links.
- As a head of design, I want to add a stage (e.g. "lab dip" between tech-pack and first sample) in ~2 minutes without a ticket, so that process changes don't route through an admin.
- As a head of design, I want to see **how many active products run this workflow** before I save a structural change, so that I understand who I'm affecting.
- As a head of design, I want to **archive** an old season's workflow so it's not offered to new products, while products still running it finish on it unchanged.

### 5.3 File components

- As a head of design, I want to **create a file component by dragging a file into the File Components section**, so that publishing a shared file is one motion, not a multi-step form.
- As a head of design, I want to **publish a new version** of a component and have every active product that references it pick it up (or be notified to bump if it's pinned), so that I update the palette once and 47 styles reflect it.
- As a tech designer, I want to see **which products reference `care_label v3`** before I publish v4, so that I don't change something out from under a style mid-review.
- As a tech designer, I want a per-product "new version available" signal when a component it pins has moved on, so that bumping is a decision, not an accident (mirrors the `linked` system messages in the comments feed).
- As a head of design, I want to rename and archive components, with archive preserving existing references and removing the component from the "add to bundle" picker.

### 5.4 File templates

- As a head of design, I want to **create a file template by dragging a file into the File Templates section**, so that turning a good tech-pack into the standard starting point is one motion.
- As a head of design, I want a template I attach to a stage to **seed a starting file (or expected slot) when a product enters that stage**, so that performers begin from the standard, not a blank page.
- As a head of design, I want template edits to **not** rewrite files in products already using them (copy-on-use), so that improving the template never disturbs in-flight work.
- As a tech designer, I want to upload a new version of a template, so that future products get the improved starting point while existing ones keep theirs.
- As a head of design, I want to rename, archive, and (when unused) delete templates with the same safety rules as components.

---

## 6. Functional requirements

### 6.1 Usage count — definition

"Active product" = a product whose **collection is not archived** (products have no status of their own; archival is via `collections.status = archived`).

- **Workflow template usage** = count of active products with `workflow_template_id = this`.
- **File component usage** = count of distinct active products that hold a live reference to this component (a `files` row whose `link_source_*` points at it).
- **File template usage** = count of distinct active products seeded from this template (a file in the product traceable to this template) **and/or** whose running workflow has a stage referencing it.

Show the number on the card; clicking reveals the product list (name, collection, current stage). Exact counting rule for templates (seeded-files vs stage-reference) is an **open question** for the data team — see §9. Counts must reflect *active* products only; archived-collection products are excluded.

### 6.2 Archive vs. delete

- **Archive** is soft and reversible. Archived items: hidden from all "add / pick" surfaces, excluded from usage math, still resolve for any existing reference, listed under an "Archived" filter, restorable. Archiving is always allowed regardless of usage.
- **Delete** is hard and guarded. Allowed **only when active usage = 0**. If usage > 0, the action is disabled and the UI offers Archive instead, with the usage list shown so the user sees why. Deleting a workflow template with historical (archived-collection) products attached should also be guarded or warned — deletion must never dangle a reference a product can still resolve.

### 6.3 Versioning

- Components and templates are files with a **version chain** (`file_versions`: `version`, `uploaded_at`, `uploaded_by`, optional `note`). Adding a version never replaces history; the chain grows.
- **Drag-and-drop semantics:** dropping a file **onto an existing item** = add a new version to that item. Dropping a file **into the section's empty drop zone / "+ new" area** = create a new item. Design needs to disambiguate these two targets clearly (e.g. a row highlights as a version target on hover; the section header is the new-item target).
- Components: new version triggers propagation/notification per §5.3. Templates: new version is copy-on-use for future seeds only (§5.4).
- Workflow templates don't use this file-version chain. Their "versioning" is **duplicate-to-fork** plus edit history; a running product is pinned to the template state it started with. (Whether structural edits to a live template offer "apply to running products" is out of scope for v1 — default is no retroactive rewrite.)

### 6.4 Drag-and-drop upload

- Each file section (Components, Templates) accepts OS file drag-in.
- Supported kinds align with `file_kind` (pdf, xlsx, docx, psd, svg, jpg, png) plus external links (figma/link) where a URL is pasted rather than a file dropped.
- Show upload progress, then the new item/version appears in place. Errors (unsupported kind, too large, network) surface inline on the drop target with a retry — never a silent failure.

### 6.5 Rename

- In-place rename on cards and in the detail panel. Renaming changes the display name only; it doesn't fork the version chain or break references (references are by id, not name). Renaming a component does **not** create a "new version" event.

---

## 7. Screen states (first-class, per CLAUDE.md)

For each section and the detail panel, design must cover:

- **Loading** — skeletons for the card grid and the version list.
- **Empty** — distinct, instructive empty states per section: "No workflow templates yet — create one or duplicate the starter," "No components yet — drag a shared file here," "No templates yet — drag a starter file here." Empty state is the primary onboarding moment (Phase 2 setup), so it should teach the component-vs-template distinction.
- **Error** — inline, retryable; failed usage-count fetch shouldn't blank the card, just hide the number with a quiet retry.
- **Archived view** — clearly differentiated (muted styling), with Restore as the primary action.
- **Delete-blocked** — the guarded state when usage > 0: disabled Delete, visible reason, Archive offered.

---

## 8. Edge cases

- Same filename dropped twice into a section → treat as **two items** (ids differ); don't auto-merge by name. Renaming is how the user reconciles.
- A component referenced by a product in an **archived** collection → excluded from active usage count, but the reference must still resolve (archived collections can be re-opened / exported).
- Deleting a stage in a workflow that has file templates/components attached → confirm and detach; don't cascade-delete the library items themselves.
- Duplicating a workflow → deep-copies stage structure and their attachment *references* (it points at the same library components/templates, it does not clone the files).
- A template attached to a stage that's later set `is_files_expected = false` → template stays attached but won't seed; surface this rather than silently dropping it.
- Very high usage counts (e.g. 47+) → the product list behind the count needs pagination / virtualization.

---

## 9. Open questions for design & data

1. **One page vs. keep workflows separate.** Consolidate into `/library` (this spec's proposal) or keep `/settings/workflows`? Resolving this updates `page-structure.md`.
2. **Component propagation model:** auto-propagate new versions to all referencing products, or always pin-per-product and notify? The mock comments imply *pin + notify* ("Bundle still pinned to v2 — review whether to bump"). Confirm the default.
3. **File-template usage definition:** count by seeded-files-present, by workflow-stage-reference, or both (§6.1)? Affects what the number means.
4. **Tabs vs. single scroll** for the three sections; and whether components + templates should visually share a layout (they're both file-cards) while workflows differ (pipeline-cards).
5. **Where attachment happens:** confirm attaching components/templates to stages is done in the workflow canvas editor (not on the library cards). Library = catalog; editor = composition.
6. **Workflow template versioning depth:** is duplicate-to-fork enough for v1, or do we need named versions / "apply changes to running products"? (Currently scoped out.)

---

## 10. Out of scope (v1)

- Permissions / who-can-edit-the-library (no role system yet).
- Retroactively pushing workflow structural edits into already-running products.
- Generating/authoring file content (we accept what's produced — vision §Out of scope).
- Folders/nesting within a section beyond flat list + search + filter.
- Import/export of the library itself (separate from collection transit-export).
