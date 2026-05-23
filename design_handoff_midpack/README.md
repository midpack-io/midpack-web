# Handoff: IG Studio — Collections, Products, and Bundle pages

## Overview

Three desktop screens of an internal product-development tool ("IG Studio") used by a fashion brand to manage collections through a fixed 9-stage workflow (Ідея → Ескізи → Тех-пак → Закупівля → Лекала → Перший зразок → Примірка → Градація → Виробництво). The pages drill down from portfolio to detail:

1. **Collections** — portfolio overview of every active collection
2. **Products (list view)** — every product (style) inside one collection, shown as full-width rows with their stepper
3. **Bundle (style detail)** — the workspace for one product/style — files, tech pack preview, comments, and stage stepper

All three share one design system, three header/stepper/comments components, the same color tokens, and the same 9-stage flow.

## About the Design Files

The files in this bundle are **design references created in HTML/CSS/JS prototypes** — they show intended look and behavior, not production code to copy directly. The task is to **recreate these HTML designs in the target codebase's existing environment** (React, Vue, Svelte, etc.) using its established patterns, component libraries, and routing conventions. If there is no existing app yet, choose the most appropriate framework (we'd suggest React + a CSS-in-JS or CSS-modules system that can hold the token table verbatim) and implement there.

The HTML uses vanilla web components (`<bundle-header>`, `<bundle-stepper>`) and a small amount of vanilla JS for the comments and the products-list stepper renderer. In a framework-based rewrite these should become idiomatic components in that framework — keep the structure, names, and styling, just port the rendering.

Strings on the page are mixed English (UI chrome) and Ukrainian (stage names + a few status strings). Treat both as design content; the production app should put all of these through its i18n layer.

## Fidelity

**High-fidelity (hifi).** Pixel-perfect mocks with final colors, typography, spacing, interactions, and copy. The developer should reproduce the UI pixel-perfect using the codebase's existing libraries and patterns. Where the existing app has a design system that already covers a primitive (button, dropdown, avatar), use the existing primitive but ensure the resulting visual is identical to these mocks — same height, radius, weight, color.

## Files in this bundle

```
prototypes/
├── collections-page/
│   └── 01-default-desktop.html        ← Screen 1
├── products-page/
│   └── 02-list-desktop.html           ← Screen 2
└── bundle-page/
    ├── 01-default-desktop.html        ← Screen 3
    ├── assets/
    │   └── cover.png                  ← Reference cover image
    └── components/                    ← Shared components (used by all 3 screens)
        ├── header.html  header.css  header.js
        ├── stepper.html stepper.css stepper.js
        └── comments.css comments.js
```

- `header.*` — top app bar (workspace pill, breadcrumbs, search, avatar). Registered as `<bundle-header>`.
- `stepper.*` — the 9-stage stepper component including all 12+ pill states (passed, active, in-review, returned, reopened, canceled, ready, todo, plus parallel groups, deadlines, iteration counters, and the expanded "active-detail" bar). Registered as `<bundle-stepper>`. **The `stepper.html` playground page is the canonical spec for stepper states — read it before reimplementing the stepper.**
- `comments.*` — threaded conversation system with inline `@user` and stage references.

Note: `products-page/02-list-desktop.html` imports the bundle-page's stepper.css and header.css via relative path (`../bundle-page/components/`). When porting to a real codebase, the shared components should live in one location and be imported by all three screens.

## Design Tokens

These are declared identically at the top of every screen as CSS custom properties. Lift them verbatim into your token system.

### Surface

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#f7f7f5` | Page background |
| `--surface` | `#ffffff` | Cards, top bar, popovers |
| `--surface-2` | `#fafaf8` | Subtle card insets, search input bg |
| `--surface-3` | `#f1f1ee` | Hover backgrounds, pill counters, progress track |

### Ink (text)

| Token | Hex | Usage |
|---|---|---|
| `--ink-1` | `#16161a` | Primary text, headings, primary button bg |
| `--ink-2` | `#3d3d44` | Secondary text |
| `--ink-3` | `#6b6b73` | Tertiary text, meta, captions |
| `--ink-4` | `#9a9aa1` | Quaternary, placeholder, eyebrow labels |
| `--ink-5` | `#c8c8cc` | Disabled, separators-on-text |

### Borders

| Token | Hex | Usage |
|---|---|---|
| `--border` | `#e6e6e1` | Default 1px borders, dividers |
| `--border-strong` | `#d4d4cf` | Hover-state borders, button outlines |

### Accent — indigo (primary action / "active" lifecycle)

| Token | Hex |
|---|---|
| `--accent` | `#4f46e5` |
| `--accent-soft` | `#eef0ff` |
| `--accent-ring` | `#c7caff` |
| `--accent-ink` | `#312e81` |

### Linked — purple (linked-instance components in the bundle page)

| Token | Value |
|---|---|
| `--linked` | `#7c3aed` |
| `--linked-soft` | `rgba(124, 58, 237, 0.04)` |
| `--linked-tint` | `rgba(124, 58, 237, 0.015)` |
| `--linked-ring` | `rgba(124, 58, 237, 0.28)` |
| `--linked-ink` | `#5b3bb0` |
| `--linked-border` | `rgba(124, 58, 237, 0.18)` |

### Warn — amber (at-risk, in-review)

| Token | Hex |
|---|---|
| `--warn` | `#b45309` |
| `--warn-soft` | `#fef3c7` |
| `--warn-ring` | `#fcd34d` |

### Success — green (passed, on-track)

| Token | Hex |
|---|---|
| `--ok` | `#2f7a4a` |
| `--ok-soft` | `#e6f0e9` |

### Coral — red (returned, canceled, @mention urgency)

| Token | Hex |
|---|---|
| `--coral` | `#b53527` |
| `--coral-soft` | `#fdecea` |
| `--coral-ring` | `#f5b7b0` |

### Stage palette (collections page only — visualises distribution)

| Token | Hex | Stage |
|---|---|---|
| `--st-idea` | `#c1bfb6` | 01 Ідея |
| `--st-sketch` | `#b9c4a8` | 02 Ескізи |
| `--st-techpack` | `#9aacc1` | 03 Тех-пак |
| `--st-procurement` | `#b29ec1` | 04 Закупівля |
| `--st-patterns` | `#c1a78a` | 05 Лекала |
| `--st-sample` | `#d4ab5e` | 06 Перший зразок |
| `--st-fitting` | `#d99a91` | 07 Примірка |
| `--st-grading` | `#7e80df` | 08 Градація |
| `--st-production` | `#5d9e76` | 09 Виробництво |

### Typography

| Token | Value |
|---|---|
| `--font-sans` | `"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif` |
| `--font-mono` | `"Geist Mono", ui-monospace, "SF Mono", Menlo, monospace` |

Geist is loaded from Google Fonts (weights 400, 500, 600, 700). Body uses `font-feature-settings: "ss01", "cv11"` and `-webkit-font-smoothing: antialiased`.

Numeric values, IDs, codes, stage numbers, timestamps, eyebrow labels, and small caps-style labels **all use Geist Mono**. This is intentional and pervasive — it gives the system its engineering/CAD feel. Apply `font-variant-numeric: tabular-nums` to anything containing changing numbers (counts, percentages, prices, dates).

Type scale:
- 28px / 600 / -0.02em — H1 page title
- 18px / 600 / -0.01em — Card name (collections card)
- 13px / 400 — body text (default `font-size` on `<body>`)
- 12.5px / 400-500 — secondary UI text, button labels
- 12px / 400 — meta text, dropdown labels
- 11px / 600 / uppercase / +0.08em — eyebrow labels, section labels (mono)
- 10.5px / 600 / uppercase / +0.07em — small eyebrow (mono)
- 9px / 500 / uppercase / +0.05em — micro labels on stage cells (mono)

### Spacing & geometry

- Card / panel border radius: `12px`
- Button border radius: `7px` (small `6px`)
- Pill border radius: `14px` (mention badge), `7px`/`8px` for stepper pills
- Chip border radius: `4px` (tab count) / `6px` (status chip)
- Page side padding: `32px`
- Card internal padding: `18px` (top sections), `12px 18px 14px 18px` (subsequent sections)
- Grid gap (collections page): `22px`
- Standard small gap: `6px`, `8px`, `10px`
- Top bar height: ~`60px` (sticky)
- Filter bar height: `48px`

### Shadows

| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(20, 20, 28, 0.04)` |
| `--shadow-md` | `0 4px 16px -4px rgba(20, 20, 28, 0.08), 0 2px 4px rgba(20, 20, 28, 0.04)` |
| `--shadow-lg` | `0 12px 28px -10px rgba(20, 20, 28, 0.16), 0 4px 10px -4px rgba(20, 20, 28, 0.08)` |

### Transitions

- Hover transitions: `120ms` for color/background, `140-160ms` for transform/shadow, `240ms` for progress bar fill.
- Stage segment hover sync: `140ms cubic-bezier(0.2, 0.8, 0.2, 1)` for transform.

---

## Screen 1 — Collections page

**Path:** `prototypes/collections-page/01-default-desktop.html`
**Purpose:** Portfolio dashboard. The user (a Project Lead) sees every collection in flight, its progress, where its products are stuck in the stage flow, and any unread @mentions or at-risk deadlines.

### Layout

Single column, full-width app shell:

```
┌─────────────────────────────────────────────────────────────┐
│ TOP BAR (sticky, 60px)                                       │
├─────────────────────────────────────────────────────────────┤
│ PAGE HEADER (28px H1, eyebrow, summary stats, actions)       │
├─────────────────────────────────────────────────────────────┤
│ FILTER BAR (sticky, 48px) — tabs + sort + view toggle        │
├─────────────────────────────────────────────────────────────┤
│ GROUP HEADER (eyebrow text)                                  │
│                                                              │
│ 2-column GRID, 22px gap, of COLLECTION CARDS                 │
│  ┌────────────────────┐  ┌────────────────────┐              │
│  │ Card A             │  │ Card B             │              │
│  └────────────────────┘  └────────────────────┘              │
│  ┌────────────────────┐  ┌────────────────────┐              │
│  │ Card C             │  │ Card D             │              │
│  └────────────────────┘  └────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

Grid: `grid-template-columns: 1fr 1fr`. Grid-wrap padding `22px 32px 64px 32px`.

### Top bar (shared)

- Workspace pill `<span class="ws-pill">`: 24×24 dark mark "IG" + workspace name + chevron, on a `--surface-2` background, 7px radius, 1px border.
- Divider, breadcrumbs (`Workspace / Collections`), then a 280×30 search input with magnifier SVG.
- Spacer pushes right side: notification bell icon-button, help icon-button, 26×26 round avatar with the user's gradient.

### Page header

- Eyebrow (mono uppercase, ink-4): "Manager view · Anna Kovalenko" with a 4×4 indigo dot bullet.
- H1: "Collections", 28px / 600.
- Sub: inline "4 in development · 39 products in flight · 4 unread mentions" with `<b>` on numbers (ink-1, tabular-nums) and 3×3 ink-5 dot separators.
- Right side: "Filters" outline button (32px) and a primary CTA "New collection" (36px, ink-1 bg, white text, with plus glyph).

### Filter bar

- Sticky at `top: 60px`. Background = `--bg` (not surface — it's flush with the page).
- Bottom border `1px solid --border`. Height 48px.
- Tabs ("Active 4", "Archived 12"): underline tabs with mono count chips. Active tab has dark count chip (ink-1 bg, white text), inactive tab has `--surface-3` chip.
- Right side: "Sort: Latest activity" dropdown, "Owner: Anyone" dropdown, then a segmented view-toggle (28px tall, two 30px wide buttons — grid icon and list icon). Active button = ink-1 bg, white icon.

### Group header

Mono eyebrow "In development" (ink-3, 11px / +0.08em uppercase) and meta "4 collections · sorted by latest activity" (ink-4).

### Collection card

The most distinctive component on this page. Each card has four stacked sections separated by 1px `--border` rules:

**1. Card top** (grid: `96px 1fr auto`, padding `18px 18px 14px 18px`):

- **Cover** (96×96, radius 8, 1px border, overflow hidden):
  - `<img class="cover-photo">` filling it as `object-fit: cover`.
  - `::after` overlay: linear-gradient top→bottom from white-10% to transparent to black-28% — gives a fabric-drape soft lighting.
  - Optional `.fabric-tag` top-left: 8.5px mono uppercase pill, white-86% bg, looks like a garment care label. Optional `.cover-caption` bottom-left: 9px mono caption (e.g. fabric code).
- **Title block** (min-width 0, truncates):
  - Eyebrow (mono): season code like "SS-26" + ink-5 dot + drop type like "Spring drop".
  - H2 card-name: 18px / 600 / -0.01em.
  - Meta row (inline flex with 6px row-gap / 10px column-gap, dot separators): "15 products · Due May 30, 2026 · ⚠ At risk · 13 days". Numbers/dates in `<b>` (ink-1, tabular). "At risk" uses `--warn` color with a triangle alert SVG.
- **Top actions** (inline flex):
  - Optional **mentions badge** `.mentions-badge`: pill (`coral-soft` bg, `coral-ring` inset shadow, coral text), shows "@you 3" with mono number. Use whenever the user has unread @mentions in that collection.
  - 28×28 icon button with three-dot menu (kebab), `event.stopPropagation()` so it doesn't trigger card click.

**2. Progress section** (`.card-section`):

- Mono section label "Progress" (uppercase) on left, value text on right (e.g. "7 of 15 stages cleared, rolled up").
- Track row: 6px-tall track on `--surface-3`, fill bar inside (linear-gradient indigo / green / neutral depending on `.low|.mid|.high` modifier), plus a 13px mono percentage on the right (min-width 42px, right-aligned).

**3. Stage distribution section**:

- Section label "Stage distribution" + value like "15 products · balanced flow".
- **Stage strip**: 10px-tall bar, 4px radius, `--surface-3` bg, padding 1px, 2px gap between segments. Nine `.stage-seg` elements with `data-stage="idea|sketch|…|production"` and flex-grow proportional to count. Each segment fills with that stage's palette token (`--st-idea` etc). An empty stage (count=0) renders as `.stage-seg.empty` — transparent with dashed `--ink-5` border, fixed `6px` width.
- **Stage legend grid** below: 3-column grid, 6px gap. Each cell is a small card (`--surface-2` bg, 1px `--border`, 6px radius, padding `6px 8px 7px 8px`):
  - 16px mono count number (big, tabular-nums).
  - Bottom row: mono stage number ("01" in ink-4) + name ("Ідея" in ink-3, 9.5px uppercase +0.05em).
  - 8×8 swatch absolutely positioned top-right (uses the stage token color).
  - `.stage-cell.zero` modifier: transparent bg, dashed border, ~0.6 opacity, count in ink-4.

**Synchronized hover**: hovering a `.stage-seg` adds `.is-peer-hover` to the matching cell in the same `.stage-strip`, and vice versa. The segment scales vertically (`scaleY(1.6)`) and lifts via shadow, the cell takes on an ink-1 inset ring + 4px lift. Wire this through `data-stage` matching. Don't share state across cards.

**4. Latest activity section**:

- Section label "Latest activity".
- 3 rows, each `display: grid; grid-template-columns: 18px 56px 1fr; gap: 10px`:
  - 18×18 icon tile (radius 4) with a colored background depending on activity kind: `.move` = accent-soft/accent-ink, `.approve` = ok-soft/ok, `.return`/`.mention` = coral-soft/coral, `.create` = surface-3/ink-3.
  - 11px mono time tag (`2h ago`, `yesterday`, `today`, `2d ago`), ink-4.
  - Body text 12.5px ink-2, with `<b>` (ink-1) for entity names and `.by` span (ink-4) for "· by Olena Kravchuk" attribution.
- Empty state `.activity-empty`: italic ink-4 placeholder ("No activity yet").

**5. Card foot** (push to bottom with `margin-top: auto`):

- `--surface-2` bg, top border, 11px 18px 13px padding.
- Left: "Updated 2h ago" (mono, ink-3 with `<b>` for time).
- Right: open hint "Open collection →" — visible at 0.6 opacity normally, animates to opacity 1 + translateX(0) on card hover.

### Card hover/focus

- Hover: `--border-strong` border, `--shadow-md`, `translateY(-1px)`. Open hint fades to full opacity.
- Focus-visible: `--accent` border, 3px `--accent-ring` outer ring.

### People avatars

| Class | Gradient |
|---|---|
| `.av-anna` | `linear-gradient(135deg, #c08a9a, #8a4e64)` |
| `.av-olena` | `linear-gradient(135deg, #6a8eb5, #3d5d86)` |
| `.av-lina` | `linear-gradient(135deg, #d1b8a3, #a18062)` |
| `.av-pavlo` | `linear-gradient(135deg, #a37cd1, #6b4ba1)` |
| `.av-yuri` | `linear-gradient(135deg, #c4955a, #87622f)` |

26×26 default, `.av-sm` modifier is 18×18.

### Specific content on this screen

The page shows four cards (Spring 2026 Launch, Summer Capsule 2026, Holiday Gift Box 2025, Brand Refresh) representing different lifecycle states:
- **A — At risk + 3 unread @mentions** — mid-progress (38%), balanced stage distribution, recent activity.
- **B — Brand new (early)** — 8% progress, clustered at "Ідея/Ескізи", just-created.
- **C — Almost done** — 92% progress, downstream-heavy distribution, "wrapping up" green ok-status.
- **D — Brand refresh** — different sample with own data.

---

## Screen 2 — Products list

**Path:** `prototypes/products-page/02-list-desktop.html`
**Purpose:** All products (styles) inside one collection ("Spring 2026 Launch"), rendered as full-width rows. Each row shows the product's stepper inline so you can see at a glance which stages are passed/active/blocked across the whole collection.

### Layout

- Same top bar as Collections (workspace pill, breadcrumbs "Workspace / Collections / Spring 2026 Launch", search, notif + help + avatar). Breadcrumb second segment is a link back to Collections.
- **Page header** — same structure but with a `.ph-cover` 96×96 cover thumbnail on the left, then text block with H1 collection name + sub stats + actions.
- **Filter bar** — same 48px sticky bar with tabs and sort/owner dropdowns and view toggle.
- **List**: vertically stacked `article.product-row` elements separated by gaps. Last item is a `.new-row` button that adds a new style.

### Product row

Each row is a card-like full-width container. Inside each row:

- **Row head** (grid):
  - Optional 64×64 product thumbnail.
  - Title block:
    - H2 row-title with three inline parts: `.style-no` ("Style 247", mono, ink-3, editable-field), `.title-dash` em-dash, `.product-name` ("Navy blazer", editable).
    - Meta row underneath: tags (small pills), custom fields (cf-chip), status chip, last-updated.
  - Right side actions: kebab menu, more affordances.
- **Stepper** below — rendered inline from `data-*` attributes on the row by the bottom-of-file `<script>` (see "Stepper renderer" comment block in source). Each row carries its own set of stage states and the renderer emits the same `<bundle-stepper>` markup used on the bundle page.
- Whole row is clickable to navigate to the bundle page for that style (`../bundle-page/01-default-desktop.html`). Clicks inside interactive children (`button, a, input, select, textarea, [role="button"], .stepper-nav, .stepper-pill, .bundle-stepper`) do NOT trigger navigation — the JS at the bottom of the file uses `closest(INTERACTIVE)` check to decide.

### Products demonstrated

The list covers a representative range of lifecycle states the developer must support:
- Style 252 — fresh draft, no tags or custom fields
- Style 247 — in-progress at Stage 03 (the one the bundle page opens on)
- Style 248 — in-review at Stage 04
- Style 249 — returned, iteration 2
- Style 250 — ready at Stage 01, unassigned performer
- Style 246 — fully done, all stages passed
- Style 251 — parallel branch at Stage 04 (parallel topology)
- "+ New style" tile at the bottom

### Editable fields

Elements with `.editable-field` are click-to-edit text spans (style number, product name, tag values, etc.). In the prototype they're presentational; in production they should bind to a controlled input that saves on blur/Enter.

---

## Screen 3 — Bundle page

**Path:** `prototypes/bundle-page/01-default-desktop.html`
**Purpose:** The workspace for one product/style. Files (linked components + own files), tech-pack PDF preview, the stage stepper at the top, threaded comments on the right.

### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ <bundle-header>  (shared top bar)                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ <bundle-stepper>  (9-stage horizontal stepper with active-detail bar)    │
├──────────────────────────────────┬──────────────────────────────────────┤
│                                  │                                       │
│ FILES (default) or PREVIEW       │ SIDE PANEL                            │
│  - linked-section                │  - comments thread                    │
│  - own files                     │  - inline @user / @stage refs         │
│  - or: pdf-frame preview         │                                       │
│ ←  resizer                       │                                       │
└──────────────────────────────────┴──────────────────────────────────────┘
```

- Two-column main below the stepper. A `.side-resize` 1px vertical grab handle lets the user drag to resize.
- Left column is `.files` by default; clicking a row in the file list swaps it for `.preview` showing a tech-pack PDF mock (`#pdfSubtitle`, `<h2>Tech Pack — Style 247</h2>`).
- Right column is `.side` — comments thread.

### Stepper (shared component — read `components/stepper.html` for full state catalogue)

Horizontal scrollable row of nine **pills**, one per stage. The pill API:

- `.pill` — base class.
- Status modifiers: `.passed`, `.active`, `.in-review`, `.returned`, `.reopened`, `.canceled`, `.ready`, `.todo`.
- `.is-selected` — pill that owns the active-detail bar below the row.
- Pill content: status icon, stage label, role stack (1-2 avatars), optional `.you-tag`, optional iteration mark, optional deadline chip.

**Parallel topology**: A `.stage-group.parallel` contains multiple pills inside the row, marked with a "parallel · 04" topo label. Connectors before/after split and merge with `.pill-connector.split` and `.pill-connector.merge` modifiers.

**Active-detail bar**: Below the selected pill, a full-width bar with status chip, performer chip, approver chip, due date, in-stage time, and contextual CTAs. The bar has tone modifiers matching the pill's status (`.tone-accent`, `.tone-neutral`, `.tone-ok`, `.tone-warn`, `.tone-coral`, `.tone-muted`). A 1px connector line is drawn from the selected pill down into the bar via a CSS custom property `--active-x` set in JS during scroll (`updateConnector` function in stepper.js / stepper.html).

**Iteration history**: When a stage has been returned, an `.iter-history` expandable region renders below the active-detail bar listing each return event (who, when, from where, reason quote).

**Reason note**: For `.returned` pills, an inline `.reason-note` (coral border, warning glyph, head + body + meta + Reply button) sits at the top of the active-detail bar inside a `.detail-reason-row` wrapper.

**Custom fields**: A `.cf-chip` grid for stage-bound custom fields.

The full set of 12+ documented states (A through N) is in `components/stepper.html`. The developer should treat that file as the spec for the stepper component and reproduce each state.

### Files area

- `.linked-section` — components shared across multiple styles, badged in `--linked` (purple). Hovering shows source style. Edits propagate.
- `.own-files` — files owned by this product alone.
- File rows: thumbnail + name + metadata + actions.

### Preview area

When a file row is opened the left column swaps to `.preview` with `#pdfSubtitle` and a `.pdf-frame` containing a tech-pack mock (header, body, drawings, BOM table).

### Side panel (comments)

Threaded comment system with:
- Per-comment author avatar (matches `.av-*` gradients in main token table).
- Inline `@user` mentions (linked, surface-soft pill).
- Inline `@stage 03 · Тех-пак` references (similar pill, neutral color).
- Quote-reply / threading.
- "New comment" composer at the bottom.

See `components/comments.css` and `components/comments.js` for the full implementation.

---

## Interactions & Behavior

### Cross-page navigation

- Collections card click → Products page for that collection.
- Breadcrumb in Products page links to Collections page (`../collections-page/01-default-desktop.html`).
- Products row click → Bundle page for that style (`../bundle-page/01-default-desktop.html`). The JS at the bottom of `02-list-desktop.html` checks `closest(INTERACTIVE)` to avoid hijacking clicks on interactive children.

### Collections card

- Card hover: border darkens, shadow lifts, translateY(-1px), open-hint fades in.
- Card focus-visible: indigo 3px ring outside an indigo border.
- Kebab menu: `event.stopPropagation()` so it doesn't bubble to the card-level click.
- Stage segment ↔ stage legend cell sync hover (see synchronized hover spec above).
- Activity rows: hover state not specified — leave as static text rows.

### Filter bar

- Tabs: clicking switches active tab + reloads the list (in production, route param `?tab=active|archived`).
- Sort dropdown: opens menu with `Latest activity`, `Created`, `Due date`, `Name`, `Progress %`.
- Owner dropdown: opens menu of workspace members + "Anyone".
- View toggle: card vs list views (list view not in this bundle — future page).

### Stepper

- Stepper pills horizontally scroll inside `.stepper`. The `.stepper-nav.prev/.next` arrow buttons scroll by ~60% of the visible width with `behavior: 'smooth'`.
- `.stepper-nav` arrows disabled at scroll boundaries; data attributes `data-at-start`, `data-at-end`, `data-no-overflow` reflect scroll state.
- Active-detail bar connector recalculated on scroll and resize via `ResizeObserver`. Hidden when active pill scrolls off-screen.
- Clicking a non-active pill makes it the `.is-selected` pill and replaces the active-detail bar contents.

### Comments

- New comment composer expands on focus.
- @-typing pops a member-picker; selecting inserts an inline `@user` pill.
- @stage references autocomplete to "Stage NN · {label}".
- Reply nests one level deep visually; deeper replies stay at one level with quoted parent.
- Time is shown as relative ("2h ago") with absolute time in `title` attribute.

### Hover states (universal)

- `.btn` outline buttons: hover → `--surface-3` bg, `--ink-4` border.
- `.btn.primary` (ink-1): hover → `#000` bg.
- `.btn.ghost`: hover → `--surface-3` bg, ink-1 text.
- Icon buttons: hover → `--surface-3` bg, ink-1 color.
- `.ws-back` and dropdown buttons: hover → `--surface-2`/`--surface-3` bg.

---

## State & data model (suggested)

### Collection

```ts
type Collection = {
  id: string;
  code: string;            // "SS-26"
  name: string;            // "Spring 2026 Launch"
  dropType: string;        // "Spring drop", "Capsule", "Gifting"
  status: 'active' | 'archived' | 'wrapping_up';
  dueDate: Date;
  productCount: number;
  cover: { url: string; fabricTag?: string; caption?: string };
  progressPct: number;     // 0-100
  progressTone: 'low' | 'mid' | 'high';
  stageDistribution: Record<Stage, number>;   // counts per stage
  activity: ActivityItem[];                    // chronological
  unreadMentions: number;
  updatedAt: Date;
  riskLevel: 'on_track' | 'at_risk' | 'overdue';
  daysToDue: number;
};
```

### Stage

```ts
type Stage =
  | 'idea' | 'sketch' | 'techpack' | 'procurement'
  | 'patterns' | 'sample' | 'fitting' | 'grading' | 'production';
```

### Product (Style)

```ts
type Product = {
  id: string;
  styleNo: string;          // "Style 247"
  name: string;             // "Navy blazer"
  collectionId: string;
  thumbnail?: string;
  tags: Tag[];
  customFields: CustomField[];
  stages: StageInstance[];  // 9 (or 9 + parallel branches)
  status: 'in_progress' | 'in_review' | 'returned' | 'ready' | 'done' | 'canceled';
  iteration: number;
  updatedAt: Date;
};

type StageInstance = {
  n: string;                // "01", "04a" for parallel branches
  label: string;            // "Ідея", "Тех-пак", …
  status: 'todo' | 'ready' | 'active' | 'in-review' | 'returned' | 'reopened' | 'passed' | 'canceled';
  performer?: Person | 'unassigned';
  approver?: Person | Person[] | 'unassigned' | 'not_required';
  deadline?: { kind: 'met' | 'upcoming' | 'at-risk' | 'overdue' | 'missed'; date?: Date; label: string };
  iter?: number;            // 1, 2, 3…
  parallelGroup?: string;   // if part of a parallel branch
};
```

### Person

```ts
type Person = {
  id: string;
  name: string;
  initial: string;         // "AK"
  avatarKey: 'anna' | 'olena' | 'lina' | 'pavlo' | 'yuri' | string;  // maps to .av-* gradient
  role: 'manager' | 'performer' | 'approver' | 'viewer';
};
```

### ActivityItem

```ts
type ActivityItem = {
  kind: 'move' | 'approve' | 'return' | 'mention' | 'create';
  time: Date;
  actor: Person;
  entityName: string;       // "Hero Landing Page", "OOH Poster A"
  fromStage?: Stage;
  toStage?: Stage;
};
```

---

## i18n notes

Stage names and a few inline strings are in Ukrainian (the brand is Ukrainian). These should be locale-resourced, not hardcoded. The English UI shell strings ("Collections", "Active", "Due", "Updated", "Open collection", etc.) should also be locale-resourced. The stage palette tokens reference the Ukrainian stage names in their comments — that's just for documentation.

Date formatting: dates in mocks read as "May 30, 2026" and "today" / "yesterday" / "2h ago" / "2d ago". Use the codebase's existing date library (date-fns, Intl.RelativeTimeFormat, etc.) and stick to short locale-friendly formats.

Number formatting: counts and percentages use `font-variant-numeric: tabular-nums` for visual alignment.

---

## Assets

- **Geist** + **Geist Mono** from Google Fonts (weights 400, 500, 600, 700 sans / 400, 500, 600 mono).
- `prototypes/bundle-page/assets/cover.png` — reference cover image, can be replaced with real product photo.
- Cover photos on collection cards are Unsplash URLs (Spring floral, summer linen, gift box, etc.) used purely as design placeholders — in production replace with brand-uploaded photography.
- All icons are inline SVGs (no icon library). The set is small (~25 glyphs). Either keep them as inline SVGs in your component code, or port them to your existing icon set if it covers the same shapes:
  - chevron, plus, kebab (three-dot), search, bell, help, arrow-right/left, check, clock, play, return-arrow, cancel-x, reopen (round-trip), ready-dot, warn-triangle, flag, calendar, user, trash, insert-before, insert-after, swap, grid-view, list-view, mention-at, filter.

---

## Acceptance criteria

A correct implementation in the target codebase should:

1. **Visually match the mocks pixel-for-pixel** at 1440px wide on desktop (within sub-pixel rendering differences). Use the design tokens above verbatim.
2. **Use Geist + Geist Mono** with mono applied to all numbers, codes, eyebrow labels, and small caps-style labels.
3. **Implement the 12+ stepper states** (passed / active / in-review / returned / reopened / canceled / ready / todo, plus parallel groups, multiple approvers, unassigned, deadlines, iteration counters). The `stepper.html` playground in the bundle is the spec.
4. **Implement synchronized hover** between stage segments and stage legend cells inside the same card on the Collections page.
5. **Implement cross-page navigation** Collections → Products → Bundle with breadcrumb back-navigation. Row-level navigation respects interactive children (no hijack on button/input clicks).
6. **Handle empty states** for activity ("No activity yet" italic placeholder) and unassigned roles ("?" avatar with "Assign…" affordance).
7. **Respect i18n** — no hardcoded user-visible strings outside the i18n system, including stage names.
8. **Be accessible**: `aria-label` on icon-only buttons, `role="group"` on segmented controls, focus-visible rings using `--accent-ring`, semantic headings (h1 per page, h2 per card/row title).

---

## Open questions for the developer

1. **Routing**: are these three screens routes in an existing SPA, or do they need new routes? Suggested paths: `/collections`, `/collections/:id/products`, `/collections/:id/products/:styleId/bundle`.
2. **Real-time updates**: when another user moves a stage or @-mentions someone, do these screens update live (WebSocket / SSE / polling)? Mocks show timestamps like "2h ago" — pick a refresh strategy.
3. **Permissions**: the mocks show a "Manager view · Anna Kovalenko" eyebrow. Different roles (manager / performer / approver / viewer) see different action buttons in the stepper. Confirm the role matrix matches your existing RBAC.
4. **Search**: the top-bar search input is present on every screen. Is it a global workspace search, or scoped to the current screen?
5. **Print / export**: there is a print-version file `01-default-desktop-print.html` in the bundle-page folder (not included in this handoff). If print/export is required for the bundle page, ask for that file.
