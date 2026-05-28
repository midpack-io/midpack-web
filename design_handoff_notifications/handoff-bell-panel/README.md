# Handoff: Notifications — bell dropdown panel

## Overview

The **notifications bell panel** for the IG Studio app shell (CHER'17 workspace). It is the quick-glance popover that opens from the bell icon in the top bar — a tabbed, infinitely-scrolling activity feed of mentions, review requests, stage changes, approvals, deadlines, exports, and member events across the studio's products / collections / bundles / worklist.

This was selected (over a full-page inbox and a two-pane reading view) as the direction to ship. Two changes were made versus the first concept:

- **Infinite scroll** — the feed pages in older notifications as the user scrolls toward the bottom, terminating in an end-of-feed cap.
- **The "Open inbox" button was removed** — the footer now carries only the **Notification preferences** link.

## About the design files

The files in this bundle are **design references created in HTML** — a working prototype that shows the intended look, layout, and behaviour. They are **not production code to copy-paste**. The task is to **recreate this design in your target codebase's existing environment** (React, Vue, Svelte, SwiftUI, native, etc.) using its established component library, design tokens, and data-fetching patterns. If no environment exists yet, pick the most appropriate framework and implement it there.

The prototype is built with React 18 via in-browser Babel purely so it runs from a single folder with no build step — treat that as scaffolding, not a recommendation. The **markup structure, CSS, tokens, copy, and interaction logic are the real spec.**

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, hover/active states, transitions, copy, and the full infinite-scroll / filter / mark-read behaviour are all in the prototype. Recreate pixel-perfectly using your codebase's primitives.

---

## Screen / view

### Notifications panel (bell popover)

- **Name:** Notifications panel
- **Trigger:** Top-bar bell icon button (`.tb-iconbtn`). Clicking toggles the panel. The unread-count chip on the bell hides while the panel is open.
- **Purpose:** Let a user triage recent workspace activity without leaving their current page — read items, jump to the referenced record via an action button, filter by All / Unread / Mentions, mark everything read, or open notification preferences.
- **Dismissal:** Clicking the dimmed scrim behind the panel closes it. (In production also close on `Esc` and on outside-click.)

#### Layout

- The panel is **absolutely positioned** under the bell: `top: 8px; right: 52px; width: 392px`. It floats over a **scrim** (`rgba(20,20,28,.18)`) that covers the page beneath.
- A small **caret** (12×12, rotated 45° square with top+left border) points up toward the bell at `right: 28px`.
- Panel container: `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 12px`, `box-shadow: var(--shadow-lg)`, `overflow: hidden`. Transform-origin `top right`; open/close animates `opacity` + `scale(.97) translateY(-4px)` over 150ms.
- Vertical structure (top → bottom):
  1. **Header** (`.panel-head`, padding `13px 14px 0`) — title row + tab row.
  2. **List** (`.list`) — the scroll region. Fixed `min-height: 432px; max-height: 432px; overflow-y: auto; overscroll-behavior: contain`.
  3. **Footer** (`.panel-foot`) — preferences link, right-aligned.

#### Components

**Header — title row** (`.panel-title-row`, flex, `gap: 8px`, `align-items: center`)
- Title "Notifications" — 13.5px / 600 / `--ink-1`.
- **NEW count pill** — coral pill (`.pill.coral`), mono 9.5px / 600, text `"<n> NEW"`. Hidden when unread total is 0.
- Spacer pushes the next control right.
- **Mark all read** — ghost button (`.btn.ghost.xs`), 11.5px, check glyph + label. Sets every loaded row to read and zeroes the unread total.

**Header — tabs** (`.tabs`, flex, `gap: 2px`, `border-bottom: 1px solid var(--border)`)
- Three tabs: **All**, **Unread**, **Mentions** (`.tab`; active = `.tab.active`).
- Tab: 12px, padding `6px 9px 9px`, `color: var(--ink-3)`; hover → `--ink-1`.
- Active tab: 600 weight, `--ink-1`, `border-bottom: 2px solid var(--ink-1)` (sits on the row's bottom border via `margin-bottom: -1px`).
- The **Unread** tab shows a count chip (`.cnt`) when unread > 0 — mono 9.5px, active state uses `--accent-soft` / `--accent-ink`, otherwise `--surface-3` / `--ink-4`.
- Switching tabs **refetches from page 0** with the new filter and resets scroll to top.

**List rows** (`.row`) — CSS grid, `grid-template-columns: auto 1fr auto`, `gap: 10px`, padding `11px 14px`, `align-items: start`, `border-bottom: 1px solid var(--border)`, `cursor: pointer`.
- **Unread rows** get a tinted background: `.row.unread` = `rgba(79,70,229,.03)`; urgent unread (`.row.unread.urgent`) = `rgba(181,53,39,.035)`.
- Hover: `background: var(--surface-2)`.
- Clicking a row marks it read.

  *Column 1 — Avatar* (`.av-wrap`): 30px round gradient avatar with the actor's initials (or a system glyph for system events), plus a **kind badge** in the bottom-right corner (15px round, 2px surface ring) colored by event kind:
  | Kind | Badge class | Color token | Glyph |
  |---|---|---|---|
  | Mention / assignment / reply | `b-mention` | `--accent` (#4f46e5) | @ |
  | Review request / bump | `b-review` | `--warn` (#b45309) | checklist |
  | Approval | `b-approve` | `--ok` (#2f7a4a) | check |
  | Stage change | `b-stage` | `--linked` (#7c3aed) | arrow-in-flow |
  | Deadline | `b-deadline` | `--coral` (#b53527) | clock |
  | System / export / member / library | `b-system` | `--ink-2` (#3d3d44) | gear |

  *Column 2 — Body* (`.row-body`, `min-width: 0`):
  - **Copy** (`.row-copy`) — 12.5px / 1.45 / `--ink-2`. Actor names are `.actor` (600 / `--ink-1`); record references are `.ref` (500 / `--ink-1`, 1px bottom border) or `.ref.linkedref` for collection/linked records (`--linked-ink`, violet underline). Numbers/quantities are bold.
  - **Quote** (`.row-quote`, optional) — single-line truncated italic comment preview, 11.5px / `--ink-3`, wrapped in curly quotes.
  - **Meta row** (`.row-meta`, flex, `gap: 7px`, `min-height: 21px`): relative timestamp `"<ago> ago"` (11px / `--ink-4`), an optional context **pill** (e.g. `RESORT '25` linked, `DUE TODAY` amber, `AT RISK` coral, `APPROVED`/`DONE` green, `WAITING` amber), and a contextual **action button** (`.btn.xs`) — e.g. Reply, Review, Open, View queue, Download. The action is `opacity: 0` by default and fades in on row hover (`.row:hover .row-action`).

  *Column 3 — Unread dot* (`.dot`): 7px circle, `--accent` (or `--coral` if urgent), transparent when read.

**Group headers** (`.grp`) — consecutive rows sharing a time bucket are grouped under a **sticky** mono label: 9.5px / 600 / 0.07em / uppercase / `--ink-4`, `background: var(--surface-2)`, bottom border, `position: sticky; top: 0`. Buckets in order: **Today → Yesterday → Earlier this week → Last week**.

**Loader** (`.loader`) — shown while a page is fetching: a 14px spinner (`.spin`, 0.7s linear rotation) + "Loading earlier…" (12px / `--ink-4`).

**End cap** (`.end-cap`) — shown once all pages are exhausted: centered 11.5px / `--ink-4`, "That's everything from the last 30 days".

**Empty state** (`.empty`) — shown when a filter yields no rows: centered check glyph + "You're all caught up" + a sub line ("No mentions right now." / "No unread notifications right now.").

**Footer** (`.panel-foot`) — `border-top`, `background: var(--surface-2)`, padding `9px 14px`, content right-aligned. Single **Notification preferences** link (`.foot-link`, 12px / `--ink-3`, gear glyph; hover → `--ink-1`). **No "Open inbox" button.**

---

## Interactions & behavior

### Infinite scroll
- The list element fires an **`onScroll`** handler. When `scrollTop + clientHeight >= scrollHeight - 140`, the next page is requested.
- A guard prevents overlapping/duplicate fetches (`loading` flag) and stops once the cursor is exhausted (`done` flag).
- Each fetch appends its items to the existing list; new rows fold into existing or new time-bucket groups.
- The prototype simulates ~550ms of latency so the loader is visible. **Replace the paginator with your real API** (see State Management). An `IntersectionObserver` sentinel is a valid alternative, but a scroll-threshold handler proved more reliable across scroll containers here.

### Tabs / filtering
- All / Unread / Mentions. Changing tab clears the list, refetches page 0 with the new filter, and resets `scrollTop` to 0.
- Filtering in this prototype is client-side over the mocked pages; in production pass the filter to the API (`?filter=unread|mentions`).

### Mark read
- **Per row:** clicking anywhere on a row (or its action button) marks that row read — its tint and unread dot clear, and the unread total decrements (floored at 0).
- **Mark all read:** sets every currently-loaded row to read and zeroes the unread total (hides the NEW pill and the Unread tab count). In production this should also POST to the server and clear the bell badge.

### Open / close
- Bell toggles `open`. While open, the bell's count chip is hidden (`opacity: 0`).
- Scrim click closes. Add `Esc`-to-close and outside-click-to-close in production.

### Transitions
- Panel: `opacity` + `transform` 150ms ease (open/close).
- Scrim: `opacity` 180ms.
- Row action button: `opacity` 120ms on hover.
- Row background / dot / tab color: 100–120ms.
- Spinner: 0.7s linear infinite.

---

## State management

State held by the panel component:

| State | Type | Purpose |
|---|---|---|
| `open` | boolean | Panel visibility (lives in the shell/top bar in production). |
| `tab` | `"all" \| "unread" \| "mentions"` | Active filter. |
| `items` | Notification[] | Loaded rows (accumulated across pages). |
| `cursor` | cursor \| null | Next-page cursor; `null` = no more pages. |
| `loading` | boolean | A page fetch is in flight (guards the scroll handler). |
| `done` | boolean | All pages exhausted → render the end cap. |
| `unreadTotal` | number | Drives the NEW pill + Unread tab count + bell badge. |

**Data fetching.** The prototype's `window.makePage(cursor, filter)` returns `{ items, nextCursor }` deterministically. Swap it for a real cursor-paginated endpoint:

```
GET /api/notifications?cursor=<cursor>&filter=<all|unread|mentions>&limit=12
→ { items: Notification[], nextCursor: string | null }

POST /api/notifications/read         body: { id }            // mark one read
POST /api/notifications/read-all     body: { filter? }       // mark all read
```

**Notification shape** (as used by the row renderer):
```ts
type Notification = {
  id: string;
  kind: "mention" | "review" | "approve" | "stage" | "deadline" | "system";
  badge: same as kind;            // drives the corner badge color/glyph
  actor: { name: string; initials?: string; av: string; system?: boolean };
  body: string;                   // rich copy — actor/ref spans (sanitize server-side!)
  quote?: string;                 // optional comment preview
  pill?: { cls: "linked"|"amber"|"coral"|"green"|"indigo"|""; label: string };
  action?: string;                // CTA label; map to a route/handler per kind
  read: boolean;
  urgent?: boolean;               // red accent instead of indigo
  ago: string;                    // e.g. "18m", "2h", "3d" (compute from a timestamp)
  group: string;                  // time bucket label
};
```
> The prototype renders `body` via `dangerouslySetInnerHTML` because the copy is trusted static HTML. **In production, render structured segments** (actor / text / reference tokens) as real elements, or strictly sanitize — do not inject raw server HTML. The `.actor` / `.ref` / `.ref.linkedref` classes define how each token should look.

---

## Design tokens

### Color
| Token | Value | Use |
|---|---|---|
| `--bg` | `#f7f7f5` | App page background |
| `--surface` | `#ffffff` | Panel, top bar, cards |
| `--surface-2` | `#fafaf8` | Group headers, footer, search input, row hover |
| `--surface-3` | `#f1f1ee` | Chips, hovers, tab-inactive count |
| `--ink-1` | `#16161a` | Primary text |
| `--ink-2` | `#3d3d44` | Body copy / system badge |
| `--ink-3` | `#6b6b73` | Secondary text / icons |
| `--ink-4` | `#9a9aa1` | Tertiary / timestamps / muted labels |
| `--ink-5` | `#c8c8cc` | Crumb separators |
| `--border` | `#e6e6e1` | 1px lines |
| `--border-strong` | `#d4d4cf` | Button outlines, scrollbar thumb |
| `--accent` | `#4f46e5` | Mention badge, unread dot/tint, focus |
| `--accent-soft` | `#eef0ff` | Active Unread-count chip bg, mention callout |
| `--accent-ink` | `#312e81` | Accent chip text |
| `--linked` / `--linked-ink` | `#7c3aed` / `#5b3bb0` | Collection/linked references + stage badge |
| `--warn` / `--warn-soft` | `#b45309` / `#fef3c7` | Review badge, amber pills |
| `--ok` / `--ok-soft` | `#2f7a4a` / `#e6f0e9` | Approve badge, green pills |
| `--coral` / `--coral-soft` / `--coral-ring` | `#b53527` / `#fdecea` / `#f5b7b0` | Deadline badge, NEW pill, urgent accent, bell count |

### Typography
- Sans: **Geist** (400/500/600/700). Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`.
- Mono: **Geist Mono** (400/500/600) — used for pills, counts, group labels. Fallback: `ui-monospace, "SF Mono", Menlo, monospace`.
- Base: 13px / 1.45. Font features `"ss01","cv11"`, antialiased.

### Spacing / radius / shadow
- Panel padding `13px 14px`; rows `11px 14px`; grid/flex gaps 7–10px.
- Radius: panel 12px, buttons 6–7px, pills 4px, avatars 50%.
- `--shadow-sm: 0 1px 2px rgba(20,20,28,.04)`
- `--shadow-lg: 0 12px 28px -10px rgba(20,20,28,.16), 0 4px 10px -4px rgba(20,20,28,.08)`

### Sizes
- Panel width 392px; list viewport 432px tall.
- Avatars 30px (rows), 26px (top-bar); kind badge 15px; unread dot 7px.

---

## Assets

- **Fonts:** Geist + Geist Mono from Google Fonts.
- **Icons:** hand-rolled inline SVGs in Lucide style — 14px viewBox, `currentColor`, `stroke-width` ~1.2–1.5. Defined in `window.ICONS` (`mention`, `review`, `approve`, `stage`, `deadline`, `system`, `bell`, `check`, `settings`). Swap for your icon library at parity sizes.
- **Avatars:** CSS gradient placeholders keyed per person (`.av-anna`, `.av-olena`, …). Replace with real user images; keep the gradient as the fallback.
- No bundled raster imagery.

---

## Files

- `index.html` — the panel shell: design tokens, all component CSS, app-shell chrome (top bar + dimmed page ghost), and script includes.
- `bell-panel.jsx` — the interactive React component: `Panel` (state, infinite scroll, tabs, mark-read), `Row`, `Avatar`, `App` (top bar + scrim + toggle).
- `notif-feed-data.js` — `window.ICONS`, the canonical `BASE` notification set, time-bucket tables, and `window.makePage(cursor, filter)` paginator stub (replace with your API).

> Sibling reference (not required): the original three-option exploration lives at `../notifications.html` (full-page inbox + this panel + a two-pane reading view, side-by-side on a canvas).
