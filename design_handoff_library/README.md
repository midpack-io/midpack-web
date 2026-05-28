# Handoff: Library page

A single page where the internal team curates the reusable building blocks every product is assembled from: **workflow templates**, **file components**, and **file templates**. Replaces the previously-split `/settings/workflows` + `/library` pages.

Route: `/library` (workspace-mode page, not a settings sub-page).

---

## About the design files

`library.html` is a **design reference created in HTML** — it shows the intended look, structure, and behavior of the page. It is **not** production code to lift directly.

The task is to recreate this design in the target codebase's existing environment (React, Vue, etc.) using its established components, design tokens, and routing patterns. If no environment exists yet, pick the framework appropriate for the project and implement there.

Treat the HTML as a precise spec for layout, copy, vocabulary, and visual hierarchy — but always defer to the codebase's existing primitives (Button, Input, Tabs, Card, etc.) and tokens.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, badges, and microcopy. Recreate pixel-close using your existing component library; substitute equivalents from the codebase's design system rather than reimplementing.

## Personas

- **Primary:** head of design / admin — owns process setup, curates all three catalogs.
- **Secondary:** tech designer — uploads new versions, renames, checks usage before swapping a file. Read-mostly on workflow structure.
- **Out of scope:** external partners, one-off reviewers.

No enforced role system in v1.

---

## The vocabulary you must preserve

The page exists primarily to make **one distinction** legible:

| Entity | Relationship to a product | Verb in UI |
| --- | --- | --- |
| **Workflow template** | A product *runs* one. Per-stage runtime state is separate; editing the template does **not** retroactively rewrite a running product. | "Used by N active" |
| **File component** | A **live, shared file**. Publishing a new version propagates (or notifies + lets product pin). "Edit once, every bundle sees it." | "Referenced by N" |
| **File template** | A **starter / blueprint**. Copy-on-use when a product enters its stage. Later edits do not flow into products already using it. | "Seeded N" |

A component is a **link to a living file**; a template is a **blueprint that gets copied**. Same `.pdf` could exist as either — the difference is the relationship, not the file kind. The UI shows this through:

- distinct type badges (`Live` purple pulse vs `Blueprint` document icon),
- different usage verbs (`referenced` vs `seeded`),
- different intro cards above each section explaining the distinction,
- different drop-zone copy ("publish a new shared component" vs "seed a starter file").

Never collapse these into one section.

---

## Page structure

```
┌─ App shell (rail + topbar) — shared with rest of app ──────┐
│                                                            │
│  ┌─ /library page ────────────────────────────────────┐    │
│  │                                                    │    │
│  │  Page header  ········  [Import]  [+ New]          │    │
│  │                                                    │    │
│  │  [ Workflow templates · File components · File templates ] ← tabs
│  │                                                    │    │
│  │  ┌─ active tab content ───────────────────────┐    │    │
│  │  │  intro cards (components / templates only) │    │    │
│  │  │  toolbar: search · active/archived/all · sort │ │    │
│  │  │  drop zone (components / templates only)   │    │    │
│  │  │  cards grid                                │    │    │
│  │  └────────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

Max page width: 1280px. Padding: 28px 40px 64px 40px.

---

## Screens / Views

This handoff is a single view with three tabbed sections. Each section follows the same toolbar pattern; only the cards differ.

### View · Library, tab = Workflow templates (default)

**Purpose:** browse the pipeline catalog; create new workflow by blank/duplicate; click into the canvas editor to edit stages, edges, attached files.

**Layout**
- Page header (`.lib-h`): eyebrow "Workspace · Setup", H1 "Library", description paragraph, right-aligned `Import` + `+ New` buttons.
- Tab strip (`.lib-tabs`): pill-shaped segmented control, 3 tabs each with icon + label + count badge.
- Toolbar (`.lib-toolbar`): 280px search input · segmented `Active / Archived / All` filter with counts · flex spacer · sort dropdown ("Last updated").
- Grid (`.lib-grid.workflows`): `repeat(auto-fill, minmax(360px, 1fr))`, gap 12px.

**Workflow card (`.lib-card.is-workflow`)**
- 110px tall preview area with a 14×14px grid background and a mini node-and-edge graph (SVG):
  - Filled black square = start node
  - Outlined square = regular stage
  - Indigo-tinted outlined square = review stage (`is_review`)
  - Edges are thin grey paths
  - Tiny mono labels under nodes; "+ N more" overflow text if not all stages shown
- Body: workflow name (semibold), metadata row with `Workflow` accent badge, stage count + branch/review summary
- Footer: clickable usage chip `47 active` (mono number + uppercase label) on left, `UPD · 2d` mono timestamp on right
- Hover: border becomes indigo-tint ring; overflow `⋯` icon button fades in

Five workflow cards in the demo + a dashed `+ New workflow template` slot at the end of the grid.

### View · Library, tab = File components

**Purpose:** curate the catalog of live shared files; add new component by drop; publish a new version by dropping onto an existing card.

**Layout additions vs Workflows**
- Above the toolbar: a 2-column intro grid explaining the component-vs-template distinction. Both intro cards persist on both file-section tabs (component side highlighted on components tab; template side highlighted on templates tab) so the user always sees the contrast.
- Drop zone (`.lib-drop`) above the grid: dashed border, file-upload icon, copy "Drop a file here to publish a new shared component, or drop onto an existing card to add a version.", `Paste link` + `Choose file` buttons.
- Grid: `repeat(auto-fill, minmax(280px, 1fr))`, gap 12px.

**Component card (`.lib-card.is-component`)**
- Border is a faint purple (`--linked-border`) by default to signal "live"
- Preview area: 88px tall, soft purple-tinted gradient background, file-thumb illustration centered (paper-document shape with ext tag, or palette swatches for ASE, or Figma logo for Figma)
- Body: name + metadata row showing `Live` badge (purple pulse dot, animated), ext chip, version (`v3`)
- Footer: usage chip `47 referenced` + `UPD · 2d`

**Live badge** (`.lc-typebadge.live`)
- Purple background `rgba(124,58,237,0.08)`, ring `--linked-border`, ink `--linked-ink` (#5b3bb0)
- 6px pulse dot with `lcPulse` keyframe (2.2s ease-in-out infinite ring expansion)

Eight component cards in the demo.

### View · Library, tab = File templates

**Purpose:** curate the catalog of starter files; add new template by drop; new version applies to *future* seeds only (copy-on-use).

**Layout additions vs Components**
- Intro grid flipped: blueprint card on the left explains "copies on use"; live card on the right says "Need it to propagate? Use a Component instead."
- Drop zone copy: "Drop a starter file here to seed new products from it, or drop onto an existing card to add a version."

**Template card (`.lib-card`)** — no `.is-component`, neutral border
- Preview area: 88px tall, neutral surface-2 background
- Body: `Blueprint` badge (neutral chip with a "stack of pages" icon), ext chip, version
- Footer: usage chip `102 seeded` + timestamp

Six template cards in the demo.

---

## Interactions & behavior

### Tab switching
- Click `.lib-tab` → toggles `.active` on the clicked tab and on the matching `.lib-section[data-libsection]`.
- Pane scrolls to top on tab change.
- Persist last-selected tab in URL hash or query (`?tab=components`) so a refresh lands on the same tab. (Demo doesn't persist; please add.)

### Card interactions
- Hover: border darkens, shadow lifts, `⋯` overflow button fades in (opacity 0 → 1, 120ms).
- Click card body: opens a lightweight detail panel (versions list, usage list, rename) — not built in this mock; build as a side drawer or modal.
- Click usage chip: opens a popover or panel listing every active product using the item (name, collection, current stage). See "Open questions" below for counting-rule decisions.
- Click overflow `⋯`: menu with `Rename · Duplicate · Archive · Delete` (Delete disabled when usage > 0, see §Archive vs Delete).
- Workflow card click: navigate to `/library/workflows/[id]` (canvas editor — separate page, out of scope here).

### Drag-and-drop upload
- Each file section accepts OS file drag-in via the section root and the drop zone.
- Dropping a file **onto an existing card row/area** = add new version to that item (highlight the target on `dragover` to make this affordance obvious).
- Dropping a file **into the section drop zone or empty area** = create a new item.
- Show upload progress inline on the target, then the new item/version appears in place.
- Errors (unsupported kind, too large, network) surface inline on the drop target with a Retry — never silent.

### Toolbar
- Search filters cards in real time within the active tab (case-insensitive, name match).
- `Active / Archived / All` segment swaps the filtered set; counts in the segment update live.
- Sort dropdown: at minimum `Last updated`, `Name A→Z`, `Most used`.

### Versioning
- Adding a version never replaces history; the chain (`file_versions`: version, uploaded_at, uploaded_by, optional note) grows.
- Renaming changes display name only — does **not** create a new version event, does **not** break references (references are by id).
- For **components**: new version propagates / notifies per the project's chosen model (see Open questions).
- For **templates**: new version applies to *future* seeds only. Products already using it keep their copy.
- Workflows don't use the file-version chain — versioning there is **duplicate-to-fork**.

### Archive vs Delete
- **Archive** is soft and always allowed. Archived items: hidden from "add / pick" surfaces, excluded from usage math, still resolve for existing references, listed under the Archived filter, restorable.
- **Delete** is hard, only allowed when **active usage = 0**. If usage > 0, the Delete action is disabled and the menu offers Archive instead, with the usage list shown inline so the user sees why.
- Deleting a workflow template that has historical (archived-collection) products attached should be guarded or warned.

### Empty / Loading / Error / Archived states
Build all four per section. Per the spec they are first-class:
- **Loading** — skeletons for the card grid and (in detail panel) version list.
- **Empty** — distinct, instructive per section:
  - Workflows: "No workflow templates yet — create one or duplicate the starter."
  - Components: "No components yet — drag a shared file here."
  - Templates: "No templates yet — drag a starter file here."
  - Empty is the primary onboarding moment (Phase 2 setup) — use it to teach the component-vs-template distinction.
- **Error** — inline, retryable. A failed usage-count fetch should hide the number with a quiet retry, not blank the card.
- **Archived view** — muted styling, Restore as primary action.
- **Delete-blocked** — disabled Delete with visible reason; Archive offered.

---

## State management

Per-page state:
- `activeTab`: `'workflows' | 'components' | 'templates'` (default `'workflows'`, persist to URL).
- `searchQuery`: string (debounced ~150ms).
- `filter`: `'active' | 'archived' | 'all'` (default `'active'`, per-tab).
- `sort`: enum (`'updated_desc' | 'name_asc' | 'usage_desc'`).
- `detailItem`: `{ id, type } | null` — when set, opens the detail panel.
- `dragTarget`: `{ kind: 'section' | 'card', id? }` while a file is being dragged over the page.

Data fetching (all paginated where appropriate):
- `GET /api/library/workflows?filter=active&sort=updated_desc&q=`
- `GET /api/library/components?...`
- `GET /api/library/templates?...`
- `GET /api/library/<kind>/<id>/usage` — list of products using the item (for chip click → panel).
- `POST /api/library/<kind>` (multipart) — create new item.
- `POST /api/library/<kind>/<id>/versions` (multipart) — add new version.
- `PATCH /api/library/<kind>/<id>` — rename, archive, restore.
- `DELETE /api/library/<kind>/<id>` — only when active usage = 0.

Usage counts (per spec §6.1):
- "Active product" = product whose collection is **not** archived (products have no status of their own; archival is via `collections.status = archived`).
- **Workflow usage** = count of active products with `workflow_template_id = this`.
- **Component usage** = count of distinct active products holding a live reference (a `files` row whose `link_source_*` points at this component).
- **Template usage** = count of distinct active products seeded from this template *and/or* whose running workflow has a stage referencing it. **Open question** — confirm rule with data team before implementing.

---

## Design tokens

All borrowed from the existing IG Studio design system used in `settings.html`. Reuse those tokens rather than redefining.

### Colors

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` | `#f7f7f5` | Page background |
| `--surface` | `#ffffff` | Cards |
| `--surface-2` | `#fafaf8` | Card preview, toolbar bg, foot |
| `--surface-3` | `#f1f1ee` | Tab strip bg, neutral badges |
| `--ink-1` | `#16161a` | Primary text, card titles |
| `--ink-2` | `#3d3d44` | Secondary text |
| `--ink-3` | `#6b6b73` | Tertiary / metadata text |
| `--ink-4` | `#9a9aa1` | Quaternary / placeholders |
| `--ink-5` | `#c8c8cc` | Disabled / faintest |
| `--border` | `#e6e6e1` | Default borders |
| `--border-strong` | `#d4d4cf` | Stronger borders, dashed zones |
| `--accent` | `#4f46e5` | Indigo accent, workflow badge ring, primary button |
| `--accent-soft` | `#eef0ff` | Workflow badge bg, review-stage node fill |
| `--accent-ring` | `#c7caff` | Workflow badge ring, focus ring |
| `--accent-ink` | `#312e81` | Workflow badge text |
| `--linked` | `#7c3aed` | **Component "Live" purple pulse dot** |
| `--linked-soft` | `rgba(124,58,237,0.04)` | Component preview tint |
| `--linked-ring` | `rgba(124,58,237,0.28)` | Component focus ring |
| `--linked-ink` | `#5b3bb0` | Component "Live" badge text |
| `--linked-border` | `rgba(124,58,237,0.18)` | Component card border |
| `--coral` | `#b53527` | Mention badges (sidebar — not used in Library) |
| `--ok` | `#2f7a4a` | Success states |
| `--warn` | `#b45309` | Draft badge text |
| `--warn-soft` | `#fef3c7` | Draft badge bg |

### Typography

```
--font-sans: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif
--font-mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace
font-feature-settings: "ss01", "cv11";
```

| Element | Size / weight / spacing |
| --- | --- |
| Page H1 | 26px / 600 / -0.015em |
| Page description | 13px / 400 / `--ink-3` |
| Section eyebrow (mono) | 10.5px / 600 / uppercase / 0.08em / `--ink-4` |
| Tab label | 12.5px / 500 |
| Tab count (mono) | 10.5px / 600 / tabular-nums |
| Card title | 13px / 600 / -0.005em |
| Card metadata | 11.5px / 400 / `--ink-3` |
| Type badge (mono) | 10px / 600 / uppercase / 0.06em |
| Usage number (mono) | 11px / 600 / tabular-nums |
| Usage label | 10.5px / 500 / uppercase / 0.04em / `--ink-3` |
| Timestamp (mono) | 10.5px / 400 / `--ink-4` |
| Ext chip (mono) | 10px / 600 / uppercase / 0.05em |

### Spacing & radius

| Token | Value |
| --- | --- |
| Page padding | 28px 40px 64px 40px |
| Grid gap (file cards) | 12px |
| Grid gap (workflow cards) | 12px |
| Card padding (body) | 12px 14px |
| Card padding (foot) | 10px 14px |
| Card radius | 11px |
| Card preview height (workflows) | 110px |
| Card preview height (files) | 88px |
| Tab strip radius | 9px |
| Tab inner radius | 7px |
| Button height | 32px (sm: 26px, xs: 22px) |
| Button radius | 7px (sm: 6px, xs: 5px) |
| Input height | 32px |
| Input radius | 7px |

### Shadows

```
--shadow-sm: 0 1px 2px rgba(20,20,28,0.04);
--shadow-md: 0 4px 16px -4px rgba(20,20,28,0.08), 0 2px 4px rgba(20,20,28,0.04);
--shadow-lg: 0 12px 28px -10px rgba(20,20,28,0.16), 0 4px 10px -4px rgba(20,20,28,0.08);
```

Card default: `--shadow-sm`. Card hover: `--shadow-md`.

### Animations

```
@keyframes lcPulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(124,58,237,0.15); }
  50%      { box-shadow: 0 0 0 4px rgba(124,58,237,0.05); }
}
```
Apply to component "Live" badge pulse dot, 2.2s ease-in-out infinite.

All hover transitions: 120ms `background, border, box-shadow, color`. Card transform: 140ms.

---

## Assets

No external image assets in this page. All visuals are CSS / inline SVG:

- **Workflow card mini-graphs** — inline SVG, viewBox `0 0 280 80`, drawn programmatically per template from its stage list.
- **File thumbnails** — pure CSS: a "sheet" rectangle with folded corner pseudo-element, four faint horizontal lines, a colored ext tag (`PDF / XLSX / DOCX / SVG / PSD / FIGMA / ASE` each has its own tag color).
- **Palette thumbnail** (SS26 Colour palette card) — flex row of six colored swatches inside the sheet.
- **Figma frame thumbnail** — diagonal stripe pattern with the inline 5-circle Figma logo SVG. The Figma logo SVG is the canonical brand mark; keep `fill` colors `#F24E1E #A259FF #1ABCFE #0ACF83 #FF7262`.
- **All icons** — inline SVG, 1.3 stroke width, currentColor.

If your codebase has an existing icon library (Lucide, Tabler, etc.), substitute. The icons used are: hamburger-graph (workflows), link (components), document-with-corner (templates), upload-arrow (drop), three-dots-horizontal (overflow), chevron-down (sort, switch), plus (new), arrow-down-right (import).

---

## Open questions (carry through to implementation)

These are flagged in the source spec — confirm with PM / data team before shipping:

1. **Component propagation model.** Auto-propagate new versions to all referencing products, or always pin-per-product and notify? The mock leans pin + notify ("Bundle still pinned to v2 — review whether to bump"). Confirm default.
2. **File-template usage definition.** Count by seeded-files-present, by workflow-stage-reference, or both? Affects what the number on the card means and what the usage panel shows.
3. **Where attachment happens.** This page is the *catalog*; attaching a component/template to a stage happens in the **workflow canvas editor** (`/library/workflows/[id]`). The library cards themselves don't offer "attach to stage" — confirm that's the right separation.
4. **Workflow template versioning depth.** Duplicate-to-fork is the v1 default. No retroactive "apply changes to running products" — confirm scope.

---

## Out of scope (v1)

Per the source spec — do **not** build these in this pass:

- Permissions / who-can-edit-the-library (no role system yet).
- Retroactively pushing workflow structural edits into already-running products.
- Generating / authoring file content (we accept what's produced).
- Folders / nesting within a section beyond flat list + search + filter.
- Import / export of the library itself.

---

## Files in this bundle

- `library.html` — full hi-fi prototype of the page including app shell (rail + topbar), all three tabs, and demo content. Open in a browser to inspect; right-click any element → Inspect to read computed styles. Tab switching is wired up; drag-drop, search, filter, sort, and detail panel are static.

## Related references (in the source project, not bundled)

- `settings.html` — shares the app shell (left rail, topbar, design tokens). Use as the canonical reference for the rail/topbar primitives and tokens.
- `schema.aml` — data shapes: `workflow_templates`, `workflow_stages`, `workflow_stage_template_files`, `workflow_stage_components`, `files`, `file_versions`.
- `page-structure.md` — current routing source-of-truth (needs updating to reflect this consolidation onto `/library`).
- `stages-and-statuses.md` — performer / review-stage vocabulary. Note: older docs say each stage has a *named approver*; current model has a **performer only**, with approval modelled as a `is_review = true` review stage where the performer is the reviewer. Use "performer" / "review stage" language throughout, never "approver".
