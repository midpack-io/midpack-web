# Handoff: IG Studio Design System

## Overview

This bundle is the **IG Studio design system** — tokens, type, components, and a click-through UI kit for a desktop fashion-workflow tool (Collections → Bundles of styles → per-style production pipeline).

The package contains:

- **`colors_and_type.css`** — single source of truth for color + type CSS custom properties.
- **`ui_kits/ig_studio/`** — clickable HTML/JSX recreation of the four canonical screens.
- **`preview/`** — 24 small HTML cards covering every token + component (palette swatches, type specimens, button states, status chips, stepper pills, etc.). These ARE the design system documentation; treat each card as a spec.
- **`reference/`** — the original handoff prototypes the system was distilled from. Keep these as the visual ground-truth when the recreated kit disagrees with them.
- **`assets/`** — logo mark, wordmark, sample cover image.
- **`SKILL.md`** — agent-skill descriptor (portable to Claude Code as `.claude/skills/ig-studio-design/`).

## About the design files

The files in this bundle are **design references**, not production code. They are static HTML/CSS/JSX prototypes built to communicate intended look, behaviour, and structure.

The task of the receiving project is to **recreate these designs inside that project's environment** — React, Vue, Svelte, SwiftUI, whatever fits — using the established component patterns and design-system tokens of the target codebase. If no environment exists yet, pick the framework that best fits and rebuild the screens there.

**Do not copy the HTML/CSS verbatim.** Lift the *design decisions* — tokens, type ramp, density, status vocabulary, component anatomy, interaction patterns — and re-express them as native components in the target stack. The CSS in this bundle is intentionally hand-rolled with vanilla CSS custom properties so the values are easy to read, but a real implementation should rebuild them inside the target system's token / theme layer.

## Fidelity

**High-fidelity.** Hex colors, px sizes, font weights, border radii, and shadow values should be treated as canonical. The design system has gone through ~10 review rounds. Imagery uses placeholder Unsplash URLs; the only real bundled image is `assets/cover.png`. Fonts (Geist + Geist Mono) load from Google Fonts — substitute equivalent locally-hosted files if needed.

The app is laid out at a fixed `1440 × 900` desktop canvas. Responsive breakpoints are out of scope.

---

## Screens (in `ui_kits/ig_studio/`)

Open `ui_kits/ig_studio/index.html` to navigate between them. Each screen is a JSX component loaded via Babel-in-the-browser; production should rebuild them as native components in the target framework.

### 1 · Collections (`Collections.jsx`)

**Purpose:** workspace landing — the brand owner sees all active collections as cards with stage distribution.

**Layout:**
- Sticky top bar (60px tall): workspace pill (24px square mark + "Maison Roma") · breadcrumbs · global search (280×30) · spacer · bell · help · user avatar
- Page header (28px padding top, 32px side): eyebrow "Workspace" + ph-title "Collections" + sub-meta + right-aligned actions ("Filter" ghost · "New collection" CTA-primary 36px)
- Filter bar sticky at 60px (48px tall): tabs (Active / All / Archive) · spacer · sort dropdown · owner dropdown · view toggle (grid/list/board)
- Grid: `grid-template-columns: 1fr 1fr`, gap 22px, padding 22px 32px 64px

**Component — `CollectionCard`:**
- 12px border-radius, 1px `--border`, `--shadow-sm` at rest → `--shadow-md` + `translateY(-1px)` on hover
- Top section (96px cover · title block · owner avatar) in a 3-column grid
- Bottom section separated by `border-top: 1px var(--border)`: progress bar (6px tall, 3px radius, gradient fill keyed by % into low/mid/high) + 10px stage-distribution bar (six segments using `--st-brief/-design/-copy/-review/-approval/-production`) + 6-cell stage legend

### 2 · Products (`Products.jsx`)

**Purpose:** list of styles inside a collection. Each row demonstrates the full IG Studio composition.

**Layout:**
- Same top bar + page header as Collections (page header now shows the collection cover at 56×56, eyebrow = season, title = collection name)
- Filter bar (48px): tabs (All / Needs you / In review / Returned / In production / Done with counts)
- Vertical list of `product-row`s with `gap: 12px`, padding 20px 32px 64px
- Terminating dashed "+ Add a style" tile

**Component — `ProductRow`:**
- 12px border-radius, 1px `--border`, `--shadow-sm` → `--shadow-md` on hover; `row-hover-actions` cluster fades in on hover (`opacity 0 → 1`)
- Head: 4-col grid (64px cover · title block · status cluster · hover actions, 16px gap, 14px×16px padding)
- Title block contains: row-title (`Style 247 — Camel cardigan`, 17px/600/-0.01em with grey "Style 247" + ink-5 em-dash), row-meta (PillInline tags + dot + activity), row-cf (cf-chip strip)
- Status cluster: role-stack (performer + approver-marked avatar at 22px) + StatusChip
- Returned variant: between row-head and stepper, a coral `row-reason` banner (alert icon + "RETURNED BY OLENA · 2H AGO" eyebrow + reason body + Reply ghost-button on the right)
- Bottom: compact in-row stepper (26px pills, `--surface-2` background, supports parallel branches `04a` / `04b` with the bracket-style group connectors)

### 3 · Bundle (`Bundle.jsx`)

**Purpose:** detail page for a single style.

**Layout:**
- Top bar with three-level breadcrumbs (Collections / Collection name / Style 247)
- `BundleHeader` (~120px tall): back-link (28px square button) · 88px cover (rounded 10px) · title-block (h1 "Style 247 — Name" + meta + cf-chip row) · spacer · role-stack + Share + primary "Mark approved"
- Sticky bundle stepper (60px tall) — full-width version of the in-row stepper, with `active-detail` bar underneath (linear-gradient `#f4f5fb → #fbfbfd` background, 1px accent-ring border-top): "Active stage · Performer · Approver · Due Jun 12 · 2d left" with "Submit for review" CTA
- Two-column main: 1fr files+comments | 440px purple-tinted side panel (purple = "linked / lives somewhere else")
- Side panel sections: Activity log · Linked styles (purple-tinted cards) · Key dates

### 4 · Bundle · Preview Open (route `?preview=1`)

Same screen, but `FilesArea` is replaced by `PreviewPane` — dark `#2a2a2e` chrome, version-tab pills, and a centered 320×420 "PDF" surface. Open via clicking the top file row.

---

## Component catalog

Every component below has a small preview HTML card in `preview/` — open them in order to see each component in isolation with all its states.

### Primitives

| Component | Preview card | Notes |
|---|---|---|
| Button | `preview/components-buttons.html` | **Three primary directions still side-by-side — Asphalt #474C55 / Indigo / GitHub-Green. Pick one.** Variants: primary, accent, ghost, cta-primary, secondary, danger. Sizes: default 32 / sm 26 / cta 36. |
| Icon | (in `atoms.jsx`) | Inline SVG on 14×14 viewBox, stroke 1.4, round caps/joins, `currentColor`. Curated set in `ICONS`. |
| Avatar | `preview/components-avatars.html` | 24px solo + `person-chip` capsule (assigned + dashed unassigned). Hover lifts entire chip with the accent-ring halo recipe. |
| PillInline (tag) | `preview/components-pill-inline.html` | 11px mono uppercase, 6 hue variants + dashed "+ TAG". |
| CfChip (key·value) | `preview/components-cf-chip.html` | KEY = mono ink-4 uppercase; VAL = mono ink-1. |
| StatusChip | `preview/components-status-chip.html` | 6 statuses: TO DO / IN PROGRESS / IN REVIEW / DONE / CANCELED / REOPENED. Each has a Lucide-style inline-SVG icon. |
| Tabs | `preview/components-tabs.html` | Filter-bar tabs with count chips; active tab gets `--ink-1` 2px underline + ink-1 count-chip background. |
| Inputs / search / dropdown | `preview/components-inputs.html` | Search field embeds an SVG icon as a `background-image: url("data:…")`. |

### Composite

| Component | Preview card | Notes |
|---|---|---|
| Product row | `preview/components-product-row.html` | Full composite — cover + title + meta + cf-strip + status. |
| Stepper pill | `preview/components-stepper-pills.html` | **Default = quiet (no bg fill, status hue in icon only). Selected = soft bg + 3px halo + embedded status-chip on the left.** 6 status variants. No stage numbers. |
| Deadline + iteration | `preview/components-deadline.html` | 5 deadline chip states + `↻N` iteration mark. |
| Workspace logo + pill | `preview/brand-logo.html` | 24×24 rounded square, ink-1 → #2a2a30 gradient. |
| Cover treatment | `preview/brand-cover.html` | Photo (1px inset ring) vs. fresh-draft hand-sketch. |

---

## Interactions & behaviour

- **Card hover** — border `--border → --border-strong`, shadow `sm → md`, `translateY(-1px)`. 140–160ms.
- **Button hover** — bg `--surface → --surface-3`, border `--border → --ink-4`. 120ms.
- **Primary (TBD) hover** — bg darkens to hover-shade defined by chosen variant (see Buttons card).
- **Press** — `transform: translateY(0.5px)` on `:active`.
- **Focus** — 1px `--accent` border + 3px `--accent-ring` halo via `:focus-visible`.
- **Pills + person-chips** — transparent at rest; on hover the chip materializes with hairline border + `--shadow-sm` + lift.
- **Returned-state banner** — coral band between row-head and stepper (severity icon + uppercase mono eyebrow + body + Reply ghost-button).
- **Preview-pane** — opens in place of the files area; dark `#2a2a2e` chrome. Version pills act as a tablist.
- **Stepper scroll** — horizontally scrollable, edge-fade gradients, prev/next nav buttons scroll by 60% of visible width. `scroll-behavior: smooth`. No bounce.
- **No backdrop-filter blur anywhere.** Sticky bars are opaque.
- **No animation entrances on page load.** Pages render fully.

---

## State management (minimum)

The data model the UI implies:

```ts
type Collection = {
  id: string;
  name: string;
  season: string;
  cover: string;
  dueDate: string;
  ownerId: string;
  counts: { inDesign: number; inReview: number; returned: number; inProd: number; done: number };
  stages: Record<Stage, number>;  // for the distribution bar
  atRisk: boolean;
  styles: Style[];
};

type Style = {
  id: number;          // "Style 247"
  name: string;
  cover: string;
  tags: Tag[];
  customFields: Record<string, string>;  // SKU, FABRIC, MOQ, COST, …
  performerId: string;
  approverId: string;
  status: "todo" | "in-progress" | "in-review" | "returned" | "done" | "canceled" | "reopened";
  states: Record<StageNum, StageStatus>;  // per-stage status
  files: File[];
  commentsThread: Comment[];
  lastActivity: string;
  deadline: { kind: "upcoming" | "at-risk" | "overdue" | "met"; label: string };
};

type Stage = "brief" | "design" | "copy" | "review" | "approval" | "production";
type StageNum = "01" | "02" | "03" | "04a" | "04b" | "05" | "06" | "07" | "08" | "09";
type StageStatus = "todo" | "active" | "in-review" | "returned" | "passed" | "canceled" | "reopened";
```

---

## Design tokens

All values are CSS custom properties on `:root` of `colors_and_type.css`. Lift these directly.

### Surfaces (warm off-white, never cool gray)
| Token | Hex |
|---|---|
| `--bg` | `#f7f7f5` |
| `--surface` | `#ffffff` |
| `--surface-2` | `#fafaf8` |
| `--surface-3` | `#f1f1ee` |
| `--border` | `#e6e6e1` |
| `--border-strong` | `#d4d4cf` |

### Ink (5-stop text + iconography ramp)
| Token | Hex |
|---|---|
| `--ink-1` | `#16161a` |
| `--ink-2` | `#3d3d44` |
| `--ink-3` | `#6b6b73` |
| `--ink-4` | `#9a9aa1` |
| `--ink-5` | `#c8c8cc` |

### Accent — Indigo
| Token | Hex |
|---|---|
| `--accent` | `#4f46e5` |
| `--accent-soft` | `#eef0ff` |
| `--accent-ring` | `#c7caff` |
| `--accent-ink` | `#312e81` |

### Linked — Purple (side panel, linked items)
| Token | Value |
|---|---|
| `--linked` | `#7c3aed` |
| `--linked-soft` | `rgba(124, 58, 237, 0.04)` |
| `--linked-tint` | `rgba(124, 58, 237, 0.015)` |
| `--linked-ring` | `rgba(124, 58, 237, 0.28)` |
| `--linked-ink` | `#5b3bb0` |
| `--linked-border` | `rgba(124, 58, 237, 0.18)` |

### Status palette
| Token | Hex | Used for |
|---|---|---|
| `--todo` / `-soft` / `-ring` | `#475569` / `#eef2f7` / `#cbd5e1` | TO DO — slate |
| `--info` / `-soft` / `-ring` / `-ink` | `#2563eb` / `#e0ecff` / `#b4cdfa` / `#1e40af` | IN PROGRESS — friendly blue (distinct from `--accent`) |
| `--warn` / `-soft` / `-ring` | `#b45309` / `#fef3c7` / `#fcd34d` | IN REVIEW — warm amber |
| `--ok` / `-soft` | `#2f7a4a` / `#e6f0e9` | DONE — green |
| `--coral` / `-soft` / `-ring` | `#b53527` / `#fdecea` / `#f5b7b0` | REOPENED — coral; also used for overdue + @you mentions |
| `--muted` / `-soft` | `#6b6b73` / `#ececea` | CANCELED |

### Stage palette (6 calm hues for the collection-card distribution bar)
`--st-brief #c1bfb6 · --st-design #9aacc1 · --st-copy #b29ec1 · --st-review #d4ab5e · --st-approval #7e80df · --st-production #5d9e76`

### Typography
- **Sans (UI)** — Geist, weights 400/500/600/700
- **Mono (status, SKUs, file paths, eyebrows)** — Geist Mono, weights 400/500/600
- Base body **13px / 1.45 / `--ink-1`** with `font-feature-settings: "ss01", "cv11"`
- Scale: 28 / 18 / 17 / 15 / 13 / 12 / 11 / 10.5 px
- Headings: negative tracking `-0.01em` to `-0.02em`
- Mono labels: positive tracking `+0.04em` to `+0.08em`, ALL CAPS

### Spacing scale
Cluster around **4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 / 32**. Cards: 12–18 internal pad. Page gutters: 24–32.

### Border-radius ladder
- 4–5px inline pills + chips
- 6–7px buttons + dropdowns + inputs
- 8–10px covers + thumbnails + sheets
- 12px full-width product rows

### Shadows (low-tone, slightly blueish-black — `rgba(20,20,28, …)`, not pure black)
| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(20,20,28,.04)` |
| `--shadow-md` | `0 4px 16px -4px rgba(20,20,28,.08), 0 2px 4px rgba(20,20,28,.04)` |
| `--shadow-lg` | `0 12px 28px -10px rgba(20,20,28,.16), 0 4px 10px -4px rgba(20,20,28,.08)` |
| `--shadow-cta` | `0 1px 2px rgba(20,20,28,.12), 0 4px 12px -4px rgba(20,20,28,.18)` |

### Avatar palette
Per-person 135° linear gradients between two muted tones. See `--av-anna … --av-founder` in `colors_and_type.css`.

---

## Cardinal rules — do not break

1. **Warm surfaces, never cool.** Mixing in cool grays (`#e5e7eb`, `#9ca3af`) will read as wrong.
2. **Sentence case everywhere**, except mono eyebrows + status chips, which are ALL CAPS with positive tracking.
3. **Mono is the voice of status.** Geist Mono with `+0.04em` for status chips, cf-keys, stage numbers, SKUs, file paths.
4. **No emoji.** Ever.
5. **Status vocabulary is closed:** `to-do / in-progress / in-review / done / canceled / reopened`. Don't invent new states.
6. **Coral is reserved for the user's attention** — Reopened (the most recent return), overdue, @mentions of the viewer. Never decorative.
7. **Indigo is for "live right now"** — active stepper pill border, focus rings, the iteration mark `↻N`. Most CTAs are not indigo.
8. **No backdrop-filter blur, no bouncy easing, no entrance animations.**

---

## Open decisions — please resolve before implementing

| Decision | Where | Options |
|---|---|---|
| **Primary button color** | `preview/components-buttons.html`, `ui_kits/ig_studio/app.css` | A · Asphalt #474C55  ·  B · Indigo (promote `--accent`)  ·  C · GitHub Green #2da44e |

The current `ui_kits/ig_studio/` still uses ink-1 near-black for primary buttons. Once a choice is locked, update `.btn.primary` in `ui_kits/ig_studio/app.css` and the JSX `<Button variant="primary">` consumers.

---

## Assets

- `assets/logo-mark.svg` — 24×24 rounded square workspace mark (`IG` in Geist Mono Bold on a `--ink-1 → #2a2a30` gradient)
- `assets/logo-wordmark.svg` — mark + "IG Studio"
- `assets/cover.png` — sample garment cover photo (sole real bundled image)

**No icon library is bundled.** Icons in the reference screens are inline SVG drawn at 14×14 / stroke 1.4 / round caps/joins / fill: none / `currentColor`. Recommended icon library: **Lucide** (`lucide-react` or static SVGs from `cdn.jsdelivr.net/npm/lucide-static`). Phosphor Light is a secondary fallback.

**Fonts** — Geist + Geist Mono via Google Fonts (`@import` already in `colors_and_type.css`). If you need offline: download from <https://vercel.com/font>.

---

## Files in this bundle

```
design_handoff_ig_studio_ds/
├── README.md                       ← you are here
├── SKILL.md                        ← agent-skill front matter (portable to .claude/skills/)
├── colors_and_type.css             ← source of truth for tokens
├── assets/
│   ├── logo-mark.svg
│   ├── logo-wordmark.svg
│   └── cover.png
├── ui_kits/ig_studio/
│   ├── README.md                   ← UI-kit-specific guide
│   ├── index.html                  ← entry point — open this in a browser
│   ├── app.css                     ← chrome (top bar, page header, filter bar, button, avatar, chip)
│   ├── screens.css                 ← collection-card, product-row, bundle-page, preview-pane
│   ├── atoms.jsx                   ← Icon, Button, Avatar, Pill, CfChip, StatusChip, Dropdown, ViewToggle
│   ├── shell.jsx                   ← TopBar, WorkspacePill, Crumbs, PageHeader, FilterBar
│   ├── Collections.jsx             ← screen 1
│   ├── Products.jsx                ← screen 2 (with returned-state banner + parallel stages)
│   ├── Bundle.jsx                  ← screens 3 + 4 (preview pane toggles inline)
│   ├── App.jsx                     ← hash-based router
│   └── components/                 ← canonical web-component versions from the original handoff
│       ├── header.{css,html,js}    ← <bundle-header>
│       ├── stepper.{css,html,js}   ← <bundle-stepper>
│       └── comments.{css,js}       ← threaded comments
├── preview/                        ← 24 small spec cards (token swatches + component states)
│   ├── _base.css                   ← shared base for cards
│   ├── type-display.html
│   ├── type-body-mono.html
│   ├── colors-surface.html
│   ├── colors-ink.html
│   ├── colors-accent.html
│   ├── colors-linked.html
│   ├── colors-status.html
│   ├── colors-stage-palette.html
│   ├── spacing.html
│   ├── radius.html
│   ├── shadows.html
│   ├── components-buttons.html        ← 3 primary directions — DECISION PENDING
│   ├── components-pill-inline.html
│   ├── components-cf-chip.html
│   ├── components-status-chip.html    ← 6 statuses w/ Lucide icons
│   ├── components-avatars.html        ← solo + person-chip
│   ├── components-stepper-pills.html  ← default vs. selected
│   ├── components-deadline.html
│   ├── components-inputs.html
│   ├── components-tabs.html
│   ├── components-product-row.html
│   ├── brand-logo.html
│   └── brand-cover.html
└── reference/                      ← original handoff prototypes (read-only ground-truth)
    ├── collections.html            ← Screen 1
    ├── products.html               ← Screen 2
    ├── bundle.html                 ← Screen 3
    └── bundle-preview.html         ← Screen 4
```

## How to view

Open any HTML file in a modern browser. `ui_kits/ig_studio/index.html` is the click-through prototype (Collections → Products → Bundle → Bundle-preview). The `preview/*.html` files are the spec cards; open them individually.

The pages are self-contained except for:
- Google Fonts (Geist + Geist Mono) — loaded over the internet
- Unsplash placeholder images — loaded over the internet
- React + Babel CDN scripts — loaded over the internet for the UI kit

Relative paths between files are preserved; the layout above is the directory the bundle expects.
