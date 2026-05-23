# IG Studio · Design System

A workflow tool for small fashion brands. Brand owners group seasonal **Collections** of styles, drill into a **Bundle** (one style) and shepherd it through a numbered production pipeline (01 Brief → 09 Production) with stage-by-stage performer + approver assignment, returns, parallel branches, file versions, and threaded comments.

The product is desktop-first, designed at a fixed `1440 × 900` canvas. Visual language is **warm-light**, dense, and quietly editorial — closer to Linear, Height, and Notion than to consumer SaaS. Indigo is the only accent and is used sparingly.

---

## Sources

This design system was distilled from:

| Source | Type | Local path |
|---|---|---|
| IG Studio design handoff bundle (4 prototype screens + token spec) | Local codebase, read-only | `design_handoff_ig_studio/` |
| shadcn UI Kit for Figma + Pro Blocks (June 2025) | Read-only Figma VFS | *attached at mount, not used directly — IG Studio has its own kit* |

The receiving design system (this folder) **recreates** the IG Studio handoff in canonical form — tokens lifted into `colors_and_type.css`, components factored into a JSX UI kit, screens reproduced as interactive prototypes. The original handoff lives under `reference/` for cross-checking.

The shadcn Figma file was attached but the IG Studio product has its own bespoke component vocabulary (bundle-stepper, product-row, status-chip, cf-chip, pill-inline, role-stack, deadline-chip) which does not map 1:1 to shadcn. Where IG Studio uses shadcn-style primitives (buttons, inputs, dropdowns, dialogs) the values match — same border-radius ladder, same focus-ring pattern, same hairline tone. Use shadcn as a fallback **primitive** library when this kit doesn't cover a need (e.g. command palette, sheet, calendar) — match it to these tokens.

---

## Index — what's in this folder

```
.
├── README.md                ← you are here
├── SKILL.md                 ← agent-skill front matter for portability
├── colors_and_type.css      ← single source of truth for tokens
├── assets/                  ← logos, sample cover, brand imagery
│   ├── logo-mark.svg        ← 24×24 square mark (workspace pill)
│   ├── logo-wordmark.svg    ← mark + "IG Studio"
│   └── cover.png            ← sample garment cover
├── ui_kits/
│   └── ig_studio/           ← interactive recreation of all 4 screens
│       ├── README.md
│       ├── index.html       ← clickable prototype (router across screens)
│       ├── *.jsx            ← screens + atoms
│       └── components/      ← stepper / header / comments web components
├── reference/               ← original handoff HTML, read-only
└── preview/                 ← design-system tab cards
```

---

## CONTENT FUNDAMENTALS

**Voice.** Operative, terse, second-person when addressing the user (`Needs you`, `Reply`, `Add a style`). Status verbs are bare — `Returned by Olena`, `In review with Marta` — never marketing-y.

**Casing.** Sentence case everywhere except:
- Mono **eyebrows** + **status chips**: ALL CAPS with `letter-spacing: 0.04–0.06em` (e.g. `SKU`, `IN REVIEW`, `RETURNED`).
- Custom-field keys (`cf-key`): ALL CAPS mono (`FABRIC`, `MOQ`, `COST`).
- Stage numbers: 2-digit zero-padded (`01`, `02`, … `09`).

**I vs you.** Always second-person. `Needs you` (tab), `You returned this` (banner). Never `I` or `we`.

**Numbers + units.** Tabular nums on. SKUs, prices, dates, counts use `font-variant-numeric: tabular-nums` and Geist Mono where they're labels. Dates are short (`Jun 12`, `2 days ago`, `Overdue 3d`).

**Density.** Pages are dense. Top bar is 60px, filter bar 48px, body type 13px. We say more in less space, but text always has `--ink-3 / ink-4` hierarchy to relieve pressure.

**Emoji.** Never. Use inline SVG icons.

**Examples (lifted from the prototypes):**

| Surface | Copy |
|---|---|
| Page H1 | `Collections` |
| Page sub-meta | `**4** active · **2** wrapping up · all on track` |
| Primary CTA | `New collection` · `New style` · `Mark approved` |
| Empty tile | `+ Add a style` |
| Returned banner | `Returned by Olena · 2h ago — Buttons too small, needs the larger horn variant.` |
| Status chip | `IN REVIEW` · `RETURNED` · `IN PRODUCTION` |
| Filter tab | `Needs you  3` · `In review  12` · `Returned  1` |
| Stage label | `01 Brief` · `04a Fabric` · `04b Trims` · `09 Production` |
| Iteration mark | `↻2` |
| Comment ref | `@TP_001_dress.pdf v3` |

**What we don't do.** No exclamations, no "Welcome back", no emoji, no marketing copy, no helper microcopy ("This is where you…"). When in doubt, delete a word.

---

## VISUAL FOUNDATIONS

### Color
- **Backgrounds are warm.** `--bg #f7f7f5` cream-white page, `--surface #ffffff` cards, `--surface-2 #fafaf8` for inset (search inputs, stepper background), `--surface-3 #f1f1ee` for hover.
- **Ink ramp is 5 stops.** `--ink-1` → `--ink-5`. Body text is ink-1; meta is ink-3; tertiary mono labels are ink-4; hairlines and disabled marks are ink-5. Don't introduce a 6th gray.
- **One accent — indigo `#4f46e5`.** Reserved for: active stage pill border, focus rings (`--accent-ring #c7caff` 3px halo + 1px border), the iteration mark `↻N` badge, and the rare `cta-accent` button. Most CTAs are `--ink-1` near-black on white.
- **Linked = purple `#7c3aed`** — only on the bundle-page side panel and linked-item rows. Always at very low saturation (`--linked-soft 0.04` alpha). Purple says "this lives in another place".
- **Status palette is closed:** amber `--warn` (in review), green `--ok` (passed / production / done), coral `--coral` (returned / overdue / @you), neutral muted (canceled). Each has a `-soft` background and a `-ring` border.
- **Stage palette** (collection-card stacked progress bars) is six muted hues — brief / design / copy / review / approval / production — picked to all look at home together, not to label-encode meaning.

### Typography
- **Geist** (sans, weights 400/500/600/700) for everything UI.
- **Geist Mono** (400/500/600) for: status chips, custom-field keys, stage numbers, SKUs, file paths, eyebrows, deadline chips, time-in-stage indicators.
- Base body **13px / 1.45 / ink-1** with stylistic sets `ss01, cv11` on.
- Scale (in order of use): 28 / 18 / 17 / 15 / 13 / 12 / 11 / 10.5px.
- Headings use **negative tracking** (`-0.01em` to `-0.02em`); mono labels use **positive tracking** (`+0.04em` to `+0.08em`).
- Tabular nums everywhere a number is a value (counts, prices, dates).

### Spacing
Pixel-based, not a strict scale, clustered around `4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 / 32`. Cards: 12–18 internal pad. Page gutters: 24–32. Row gap: 12. Card grid gap: 22.

### Border-radius ladder
- 4–5px inline pills + chips
- 6–7px buttons + dropdowns + inputs
- 8–10px covers + thumbnails + sheets
- 12px full-width product rows

### Shadow
Three stops, low-tone, *slightly* blueish-black (`rgba(20,20,28, …)`) — not pure black. `--shadow-sm` is the resting state for cards and inputs; `--shadow-md` raises on hover; `--shadow-lg` is for floating menus / dropdowns / sheets. CTAs get a custom `--shadow-cta` with a stronger lower-half lift.

### Imagery
- Garment **covers** (PNG/JPG) — full-bleed inside a 8–10px radius cover frame, with an `inset 0 0 0 1px rgba(0,0,0,0.08)` ring to handle bright photos.
- "Fresh draft" covers (no photo yet) — a **hand-sketched SVG** on a `#f3ecdc` cream paper, line color `#2a2620`, plus an `feTurbulence` grain. This is the only place we use a hand-drawn / illustrative treatment, and it's intentional contrast against the rest of the system.
- No stock-photo collages, no full-bleed hero photography, no gradient meshes. Imagery only exists where the user has uploaded it.

### Backgrounds
- Page bg is flat `--bg`.
- No textures, no gradients on surfaces. The only gradient anywhere is on **avatars** (135° linear, two related muted tones), the workspace mark (`--ink-1` to `#2a2a30`), and **tone-* active-detail bars** which use a very subtle 0–100% vertical wash (e.g. `linear-gradient(180deg, #fffbeb 0%, #fffdf6 100%)` for amber tone).

### Borders + hairlines
- 1px hairlines everywhere, color `--border #e6e6e1`. Hover or active strengthens to `--border-strong #d4d4cf` or `--accent`.
- Inputs and chips use **inset box-shadow** for borders (`box-shadow: inset 0 0 0 1px …`) so radii stay clean — this is a deliberate pattern.
- Focus state is always **1px accent border + 3px `--accent-ring` halo**. Same recipe for buttons, fields, pills, person-chip.

### Animation
- **Subtle and short.** `120ms` for hover/color transitions, `140–160ms` for shadow/transform on cards (`transform: translateY(-1px)` on card hover). No bounce, no spring, no overshoot.
- No fade-in entrances. Pages render fully on load.
- The only "motion" pattern of note is `scroll-behavior: smooth` on the stepper when prev/next arrows scroll it by ~60% of visible width.

### Hover + press states
- **Cards** → border strengthens, shadow grows `sm → md`, `translateY(-1px)`.
- **Buttons** → background `surface → surface-3`, border `border → ink-4`.
- **Primary (ink-1) buttons** → background `ink-1 → #000`.
- **Pills + person-chips** → background appears (`surface` on a `transparent` resting state), 1px border appears, `--shadow-sm` appears.
- **Press / `:active`** → `transform: translateY(0.5px)`. No darker color.
- **Hover-actions on rows** → `.row-hover-actions` is `opacity: 0` at rest, fades in on row hover. No layout shift.

### Transparency + blur
- No backdrop-filter blur. Top bar and filter bar are **opaque** `--surface` / `--bg` with a hairline; they stick but don't blur.
- The only transparent surfaces are `--linked-soft`, `--linked-tint`, and the `--linked-ring` halo on the purple side panel.

### Layout rules (fixed elements)
- App canvas is a fixed `width: 1440px; margin: 0 auto` block. Pages don't go edge-to-edge on wide monitors — they sit centered with `--bg` to either side.
- Top bar is `position: sticky; top: 0; z-index: 30`. Filter bar (when present) is `sticky; top: 60px; z-index: 25`. Bundle stepper is `sticky; top: 121px; z-index: 25`.
- Bundle page main column / side panel split is **resizable** via a 1px vertical handle that thickens + turns indigo on hover.
- Stepper is **horizontally scrollable** with edge-fade overlays and prev/next nav buttons (60% of viewport width per click).

### Cards (anatomy)
| Card | Radius | Border | Shadow at rest | Cover radius |
|---|---|---|---|---|
| `.collection-card` (grid) | 12px | `--border` 1px | `--shadow-sm` | 8px |
| `.product-row` (full-width) | 12px | `--border` 1px | `--shadow-sm` → `md` on hover | 8px |
| `.cf-chip` / inline pill | 4–5px | `--border` 1px | inset 1px (no outer shadow) | — |
| Stepper `.pill` | 7px | `--border` 1px (becomes `--accent` when active) | conditional, accent-tinted | — |
| Side panel `.linked-card` | 8px | `--linked-border` (purple at 18% alpha) | none | — |

### Protection gradients vs capsules
- Top bar and filter bar use **hairlines**, not capsules — they sit on the page background.
- Image cards use a 1px inset ring (`box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08)`) to protect bright photos from the surrounding white, **not** an outer overlay gradient.
- Stepper edge-fade is a 32px-wide `linear-gradient(to right, var(--surface) 40%, transparent 100%)` — used only where pills are cut off near the nav arrows.

---

## ICONOGRAPHY

The codebase ships **no icon set**. All icons in the reference prototypes are **inline SVG**, hand-drawn at 12 / 14 / 16-px grid sizes with:
- `stroke-width: 1.2–1.6px`
- `stroke-linecap: round`
- `stroke-linejoin: round`
- `fill: none` (outline-only)
- color comes from `currentColor` so they inherit ink ramp

**No emoji.** No unicode glyphs as icons. No icon font.

**Recommended icon library for new work: Lucide.** It matches the weight, grid, and round-end vocabulary. Pull individual icons from `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/<name>.svg` or use `lucide-react`. If a Lucide icon doesn't match the system, fall back to an inline hand-drawn SVG using the rules above. **Phosphor Light** is a secondary fallback; Heroicons Outline is too heavy.

**Special icons in the kit:**

- **Status icons** inside `.pill` (16×16 circle): `✓` (passed), `↻` (reopened / iteration), `⌛` (in review), `↩` (returned), `•` (active), `—` (canceled).
- **Workspace mark** (logo) — see `assets/logo-mark.svg`. A 24×24 rounded square (`--ink-1` to `#2a2a30` gradient) with `IG` in Geist Mono Bold 11px white. The wordmark (`assets/logo-wordmark.svg`) places it next to "IG Studio" in Geist 15/600.
- **Search icon** — inline 14×14 SVG, embedded as a data-URL background-image inside the search input. See `colors_and_type.css` host pages for the recipe.
- **Approver mark** — a 9×9 green check-shield in the bottom-right corner of an avatar (`.avatar-mini.approver::after`). Indicates "this person is the approver, not the performer".
- **Unassigned avatar** — 1px dashed circle around a centered `?` glyph (`.avatar.av-none`).

When a new icon is needed and there's no Lucide match, draw it by hand at the target px size on a square viewBox (`0 0 14 14` for a 14px icon, etc.), stroke 1.4, round caps/joins, no fill.

---

## Caveats + substitutions

- **Fonts:** Geist + Geist Mono are not bundled — they are loaded from Google Fonts via `@import`. The brand uses them directly (no substitution). If you need offline assets, download from <https://vercel.com/font> and place under `fonts/`.
- **Imagery:** the reference screens use Unsplash placeholder URLs for garment covers and one hand-sketched SVG for a "fresh draft" Style 252. The sample cover at `assets/cover.png` is the only real bundled image.
- **shadcn UI Kit (Figma):** attached at mount, **not directly used.** IG Studio has its own component vocabulary; shadcn would only be a fallback for primitives we don't have (command palette, large dialogs, calendars). When you reach for one, retheme it to these tokens.

---

## How to use

1. **Drop tokens** — `<link rel="stylesheet" href="colors_and_type.css">` on any new page. Use the CSS custom properties; do not hard-code colors.
2. **Lift components** — copy the JSX modules from `ui_kits/ig_studio/` and the three web components from `ui_kits/ig_studio/components/` (`<bundle-header>`, `<bundle-stepper>`, `comments.css/js`).
3. **Match the voice** — read `CONTENT FUNDAMENTALS` above before writing copy. Sentence case, mono uppercase for status, no emoji, terse.
4. **Stay inside the status vocabulary** — `todo / ready / active / in-review / returned / passed / canceled / reopened`. Don't invent new states.
