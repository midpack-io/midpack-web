# Handoff: Settings — sidebar redesign + General & Billing pages

## Overview

This handoff covers the **new application shell sidebar** plus two settings sub-pages — **General** and **Billing & plan** — for the CHER'17 workspace.

The redesigned sidebar:

- Spans the **full viewport height** (top to bottom). The top bar sits inside a right column, so it starts where the rail ends — it does not cross the rail.
- Has **two modes** that swap in place: **Workspace** (default authenticated state) and **Settings** (active when the URL is under `/settings/*`). This handoff ships the rail in **Settings mode** because that's the relevant state for the included pages.
- Is **drag-resizable** — the user grabs the right edge of the rail to expand/collapse between 220px and 420px, with the chosen width persisted to `localStorage`. Double-clicking the handle resets to the 256px default.

The Settings rail shows **all settings nav entries** (General, Members, Billing & plan, Workflows, Integrations, Transit & export, Profile, Notifications) so routing/active-state can be wired against the real menu — but only **General** and **Billing & plan** have fleshed-out page content. The other items render an intentional empty-state card.

## About the design files

The files in this bundle are **design references created in HTML** — prototypes that show the intended look, layout, and behaviour. They are **not production code to copy-paste**. The task is to **recreate these designs in your target codebase's existing environment** (React, Vue, SwiftUI, native, etc.) using its established patterns, component libraries, and design tokens. If no environment exists yet, pick the most appropriate framework for the project and implement the designs there.

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, hover states, animations, and copy are all in the mock. Recreate pixel-perfectly using your codebase's existing libraries and patterns.

---

## Layout — App Shell

Outer structure is a CSS grid:

```
.shell {
  display: grid;
  grid-template-columns: var(--rail-width, 256px) 1fr;
  min-height: 100vh;
}
```

- **Left column** — the rail. Sticky to top, full viewport height. Renders one of the two modes at a time.
- **Right column** — a flex column with the sticky top bar followed by the scrolling page content.

### CSS variable

`--rail-width` on `:root`, defaults to `256px`. Updated by the drag-resize handler and read back on load from `localStorage['rail-width']`. Min 220px, max 420px.

---

## Sidebar — structure

The rail is a single `<aside>` with two child `<div class="rail-mode">` blocks (one per mode). Toggle the `active` class on whichever should be visible; the other gets `display: none`. The structure inside each mode:

```
.rail
├── .rail-resize           (right-edge drag handle — full height, 6px hit area)
├── .rail-mode[data-mode="workspace"]
│   ├── .rail-ws            (workspace selector card)
│   ├── .rail-ws-divider
│   ├── .rail-scroll        (scrollable middle: Worklist + Collections section + Library)
│   ├── (Settings entry, sits above the user chip)
│   └── .rail-userchip      (user chip + name + role)
└── .rail-mode[data-mode="settings"]   ← shipped in this handoff
    ├── .rail-back          (← Back to workspace)
    ├── .settings-title     ("Settings")
    ├── .rail-scroll        (Workspace group + Account group)
    └── .rail-userchip      (same user chip as workspace mode)
```

### Spacing system

**All interactive rows** (workspace selector, nav items, section headers, collection rows, back button, user chip, "All collections" link) use the same paddings and gaps:

| Property        | Value     |
|-----------------|-----------|
| `padding`       | `8px`     |
| internal `gap`  | `8px`     |
| `border-radius` | `6px`–`7px` (items vs. card-like elements) |
| outer `.rail-mode` padding | `8px` |

Left edges of every row align cleanly down the rail.

### Visual mode

- Rail background: `var(--surface)` (`#ffffff`).
- Right border: `1px solid var(--border)` (`#e6e6e1`).
- Hover state for any clickable row: `background: rgba(0,0,0,0.05)`.
- Active state: `background: var(--surface-3)` (`#f1f1ee`), `color: var(--ink-1)`, `font-weight: 500`. No accent left-bar.

---

## Workspace selector (`.rail-ws`)

Quiet card at the top — visually parallels the user chip at the bottom (no background, no border, hover bg only).

| Element | Details |
|---|---|
| `.rail-ws-cover` | 28×28, rounded 6px, gradient `linear-gradient(135deg, #d4a3a3, #8a3d3d)`, repeating diagonal-stripe placeholder texture overlay at 6% white, monospace `C'17` mark centered, 9.5px/700 weight. |
| `.rail-ws-name` | "CHER'17", 12.5px / 500 / `--ink-1`. |
| `.rail-ws-sub` | "Founder plan", 11px / 400 / `--ink-3`. |
| `.rail-ws-switch` | Double-chevron glyph (`up + down`), 12×12, `--ink-4` → `--ink-2` on parent hover. |

Click target: the whole row. Behavior: opens a workspace switcher popover (out of scope for this handoff — leave as a no-op or hook to your existing popover primitive).

A 1px horizontal divider (`.rail-ws-divider`) sits directly below the selector, bleeding to the rail edges (`margin: 8px -8px`). It uses `var(--border)` and mirrors the divider above the user chip — quiet bookends.

---

## Settings nav

### Group: Workspace

| Item             | Icon            | Badge | Notes                              |
|------------------|-----------------|-------|------------------------------------|
| General          | shield          | —     | Active by default                  |
| Members          | two figures     | `12`  | Lock icon if user can't manage     |
| Billing & plan   | card            | —     |                                    |
| Workflows        | linked squares  | `4`   | Number of saved workflow templates |
| Integrations     | grid            | —     |                                    |
| Transit & export | arrow + line    | —     |                                    |

### Group: Account

| Item          | Icon       |
|---------------|------------|
| Profile       | person     |
| Notifications | bell       |

Group headings (`.rail-group`): 10px / 600 / mono / uppercase, 0.08em tracking, `--ink-4`, `14px 8px 6px 8px` padding (extra top spacing separates groups).

Nav items use 16×16 Lucide-style icons in the muted foreground color (`--ink-3`), turning `--ink-1` on active.

Badges: tiny mono pills, `10px / 600`, `--ink-4` on `rgba(0,0,0,0.05)`, `padding: 1px 5px`, `border-radius: 3px`.

---

## Top bar (`.topbar`)

Sticky at top of the right column, 60px tall, `1px solid var(--border)` bottom edge, `var(--surface)` background.

| Slot                | Content |
|---------------------|---------|
| Left                | Crumb. For this handoff it reads `Settings · General` and updates live to match the selected settings sub-page. |
| Middle (search)     | 280px sticky-corner-rounded input, `var(--surface-2)` bg, magnifier glyph at left, placeholder "Search products, collections, members…". |
| Right – Ask AI pill | `.ask-ai-btn` — 30px tall, white→cream gradient, sparkle glyph in `--accent`, label "Ask AI", `⌘K` kbd hint. Stub keyboard shortcut to open your Ask AI surface. |
| Right – Bell        | Icon button + coral `notif-count` chip (currently `3`). |
| Right – Avatar      | 22px round, gradient initials "AK". |

---

## Pages included

### Settings · General (`<section class="page active" data-page="general">`)

Page header:
- Eyebrow: `WORKSPACE` (mono / 10.5px / 0.08em tracking / `--ink-4`).
- H1: "General" (22px / 600 / -0.01em).
- Sub: "Identity, defaults, and ownership for the CHER'17 workspace." (13px / `--ink-3`).
- Right actions: `Discard` (ghost) + `Save changes` (primary, ink-1 bg).

Page sections (each is a `.card` with header + body):

1. **Onboarding checklist** (`.onboard`) — a soft gradient warm card showing setup progress. Numbered marker (38px square, `--ink-1` bg, mono), title, sub, progress count ("2 of 4 done"), and a 5px height progress bar at 50%. Body is a 2-column grid of `.ob-item`s with a circular check pill (filled green when done, hollow `--border-strong` otherwise), a label, and a tiny mono `go` pill ("Open →" or count).

2. **Brand identity** — 3 rows: Workspace name input ("IG Studio"), Workspace handle (`ig-studio` mono input with the `app.igstudio.so/ig-studio` resolved URL below), and Logo uploader (64px gradient tile with "IG" + Upload/Remove buttons).

3. **Defaults** — 3 rows: Default timezone select (Europe/Kyiv · UTC+2 selected), Default workflow template select (with a helper "Currently used by 3 of 4 active collections."), Week starts on (radio: Monday / Sunday).

4. **Danger zone** (`.card.danger`) — coral border tinge, salmon gradient background, coral dot indicator before the heading. Row: "Delete workspace" with the "Type \"IG Studio\" to confirm" input + coral-bordered "Delete workspace permanently" button. Helper copy explicitly enumerates what will be lost.

Each `.row` is `grid-template-columns: 220px 1fr; gap: 18px; padding: 16px 18px` with a `1px solid var(--border)` bottom border that's removed on the last row.

### Settings · Billing & plan (`<section class="page" data-page="billing">`)

Page header same pattern (eyebrow `WORKSPACE`, H1 "Billing & plan", sub copy, right actions).

Sections:

1. **Overview** (`.card` containing `.bill-overview`) — 3 stat tiles separated by 1px borders, each with:
   - Mono uppercase label
   - Big tabular-num value (22px / 600)
   - Optional `unit` span (12px / 500 / `--ink-3`)
   - Helper `sub` text below
   - Tiles: Members used (with `.seats-bar` showing used + free portion as repeating diagonal stripes), Active collections, Storage.

2. **Plan** (`.plan-card`) — 50px indigo gradient `plan-mark` square with "PRO" text, plan name, plan meta (status chip + renewal date), action buttons on the right (`Change plan`, `Cancel`).

3. **Payment method** (`.pay-row`) — credit-card mark (`pay-mark`, 36×24 navy gradient with "VISA"), card number `•••• 4242` + sub "Expires 04/27", action buttons (Update / Remove).

4. **Invoices** (`table.tbl`) — invoice rows: number (mono), date, amount (mono tabular num, right-aligned), status pill (`Paid` green / `Refunded` ink / `Failed` coral), download link. Header cells: mono uppercase 10.5px / 600 / 0.07em tracking / `--ink-4`.

### Empty-state pages

For Members, Workflows, Integrations, Transit & export, Profile, Notifications: a `.placeholder-card` with a dashed border, a circular monogram mark, and the copy *"Not part of this delivery — this Settings page is intentionally empty. The page chrome, sidebar nav entry, active state, and routing should all work — implement the actual page contents in a follow-up."*

These exist so the developer wires up the routing + active-state + crumb behavior end-to-end without scoping the content yet.

---

## Interactions & behavior

### Mode swap
- Entering `/settings/*` → activate `data-mode="settings"`. The host should cross-fade ~150ms. This handoff uses a simple `display: none/flex` swap; if you want the fade, animate `opacity` with the help of an extra wrapper or render-stage flag.
- "← Back to workspace" → restore `data-mode="workspace"`. The previously expanded Collections state should be remembered (localStorage key `rail-collections-collapsed`).

### Settings nav
- Clicking any nav item:
  - Updates `active` class on the clicked button.
  - Reveals the matching `<section class="page">`, hides others.
  - Updates the topbar crumb to `Settings · <Page name>`.
  - Updates the URL hash (`#general`, `#billing`, …) — in your app, swap for proper router routes.
  - Scrolls the pane to the top.

### Drag resize
- Mouse down on `.rail-resize` → record startX and current width.
- Mouse move → update `--rail-width` clamped to `[220, 420]`.
- Mouse up → persist to `localStorage['rail-width']`.
- Double-click → reset to default (clears `--rail-width` and the localStorage entry).
- While dragging: `body.rail-resizing` adds `cursor: col-resize !important` and disables text selection.

### Ask AI button
- Click or `⌘K` / `Ctrl K` triggers the stub (scale-tap animation). Wire to your actual Ask AI modal/overlay.

### Top bar buttons
- Bell, avatar — popover hooks. Leave as no-ops or use existing primitives.

---

## Design tokens

Defined as CSS custom properties on `:root`. Use these exact values unless your design system already maps to equivalents.

### Color

| Token              | Value      | Use |
|--------------------|------------|-----|
| `--bg`             | `#f7f7f5`  | Page bg (right of the rail) |
| `--surface`        | `#ffffff`  | Cards, rail, topbar |
| `--surface-2`      | `#fafaf8`  | Subtle inset / search input bg / table head bg |
| `--surface-3`      | `#f1f1ee`  | Hovers, active nav items, secondary chips |
| `--ink-1`          | `#16161a`  | Primary text |
| `--ink-2`          | `#3d3d44`  | Body text |
| `--ink-3`          | `#6b6b73`  | Secondary text / icons |
| `--ink-4`          | `#9a9aa1`  | Tertiary / muted labels |
| `--ink-5`          | `#c8c8cc`  | Separators on color (rare) |
| `--border`         | `#e6e6e1`  | Standard 1px lines |
| `--border-strong`  | `#d4d4cf`  | Button outlines, hover borders, dashed dropzones |
| `--accent`         | `#4f46e5`  | Indigo accent (focus rings, sparkles) |
| `--accent-soft`    | `#eef0ff`  | Accent chip bg |
| `--accent-ring`    | `#c7caff`  | Focus ring shadow |
| `--accent-ink`     | `#312e81`  | Accent chip text |
| `--linked`         | `#7c3aed`  | Linked-record outlines (used elsewhere) |
| `--warn`           | `#b45309`  | Amber text |
| `--warn-soft`      | `#fef3c7`  | Amber chip bg |
| `--warn-ring`      | `#fcd34d`  | Amber border |
| `--ok`             | `#2f7a4a`  | Green/success text |
| `--ok-soft`        | `#e6f0e9`  | Green chip bg |
| `--coral`          | `#b53527`  | Destructive / urgent / notification count chip |
| `--coral-soft`     | `#fdecea`  | Coral chip bg |
| `--coral-ring`     | `#f5b7b0`  | Coral border |

### Typography

- Sans: **Geist** with weights 400/500/600/700. Fallback stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`.
- Mono: **Geist Mono** with weights 400/500/600. Fallback: `ui-monospace, "SF Mono", Menlo, monospace`.
- Body size: 13px / line-height 1.45.
- Font feature settings: `"ss01", "cv11"`.
- Anti-aliasing: `-webkit-font-smoothing: antialiased`.

### Shadows

| Token        | Value |
|--------------|-------|
| `--shadow-sm` | `0 1px 2px rgba(20, 20, 28, 0.04)` |
| `--shadow-md` | `0 4px 16px -4px rgba(20, 20, 28, 0.08), 0 2px 4px rgba(20, 20, 28, 0.04)` |
| `--shadow-lg` | `0 12px 28px -10px rgba(20, 20, 28, 0.16), 0 4px 10px -4px rgba(20, 20, 28, 0.08)` |

### Spacing

The rail uses an **8px-only** spacing inside rows (padding 8, gap 8). Page content uses 14/16/18/22/28px scale.

### Border radius

| Use         | Value |
|-------------|-------|
| Buttons     | 7px   |
| Inputs      | 6px   |
| Nav rows    | 6px–7px |
| Cards       | 12px  |
| Pills/chips | 3px–8px |

---

## Assets

- **Fonts**: Geist + Geist Mono loaded from Google Fonts (`https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap`).
- **Icons**: hand-rolled inline SVGs styled after Lucide — 16×16 single-stroke, `currentColor` stroke at `stroke-width: 1.3`. Swap for your icon library (Lucide React / Material Symbols / SF Symbols) at parity sizes.
- **Workspace cover**: gradient + diagonal-stripe placeholder mark with "C'17". Replace with the brand's real workspace cover image when available.

There is no bundled imagery beyond what is inline in the HTML.

---

## Files

- `settings.html` — the full prototype with the redesigned sidebar (Settings mode), General page, Billing & plan page, and empty-state placeholders for the rest of the settings nav.
- `README.md` — this file.
