# Handoff: Midpack — Product Longread (опис продукту)

## Overview
A single-page, scroll-based **product longread** (editorial document) that explains the Midpack product in Ukrainian: the problem, what Midpack is, how a season flows through it, stages/performers/files, configurable workflows, file kinds & reuse, role goals, target testimonials, external collaboration, single-source-of-truth, getting started, target metrics, what Midpack is NOT, and a short FAQ.

It reads top-to-bottom like a long article, with a **persistent left navigation rail** that tracks the current section and lets the reader jump between sections. It is **not** a paginated/slide document and is **not** meant to be exported to PDF as the primary format — it is a web page.

## About the Design Files
The files in this bundle are a **design reference created in HTML/CSS/JS** — a working prototype showing the intended look, type, spacing, and behavior. They are **not** prescribed production code to copy verbatim. The task is to **recreate this design in your target environment** (e.g. a marketing site, a Next.js/Astro/Nuxt page, a CMS template, etc.) using that project's established patterns, or — if there is no environment yet — to pick the most appropriate stack and implement it there.

That said: because this is a static content document (no app state, no data fetching), the provided HTML+CSS is very close to production-ready and can be lifted nearly as-is if that suits your setup.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions. Recreate the UI pixel-faithfully using the codebase's libraries/patterns. All values below are the source of truth.

## Files in this bundle
- `Midpack longread.html` — the page markup + inline navigation script. References `assets/longread.css` and four screenshot PNGs in `assets/`.
- `assets/longread.css` — the full stylesheet (design tokens + all component styles + responsive + print rules).
- `assets/shot-product.png`, `shot-collection.png`, `shot-worklist.png`, `shot-collections.png` — product screenshots embedded in figure "browser windows".
- `Midpack longread (single-file).html` — the same page fully self-contained (CSS, JS, fonts and images inlined as base64). Works offline by double-click. Useful for quick preview or drop-in; for real development prefer the multi-file source above.

## Fonts
- **Geist** (sans) — weights 400/500/600/700. UI/body/headings.
- **Geist Mono** — weights 400/500/600. Eyebrows, section numbers, code, meta, file chips.
Loaded from Google Fonts in `<head>`. Substitute with your bundled copies if self-hosting.

## Layout system
- Centered **document column**: `--page-w: 820px`, `margin: 0 auto`, on a warm desk background (`--desk #e7e6e0`) with a large soft drop shadow (`--shadow-lg`).
- Each section is a `<section class="sheet">` with `64px var(--pad-x)` padding (`--pad-x: 76px`) and a 1px hairline bottom border (`--hair`).
- `.bleed` utility: `margin-left/right: calc(var(--pad-x) * -1)` to let a figure span the full column width.
- Section ids drive the nav: `#top` (cover), `#s-context`, `#s-what`, `#s-season`, `#s-stages`, `#s-workflow`, `#s-files`, `#s-roles`, `#s-quotes`, `#s-external`, `#s-truth`, `#s-start`, `#s-metrics`, `#s-not`, `#s-faq`, `#s-closing`.

## Design Tokens

### Color — surfaces (warm neutral paper)
| Token | Hex |
|---|---|
| `--bg` | `#f7f7f5` |
| `--paper` | `#fdfdfc` |
| `--surface` | `#ffffff` |
| `--surface-2` | `#fafaf8` |
| `--surface-3` | `#f1f1ee` |
| `--desk` (page bg) | `#e7e6e0` |

### Color — ink (text)
| Token | Hex | Use |
|---|---|---|
| `--ink-0` | `#0d0d10` | headings |
| `--ink-1` | `#16161a` | body |
| `--ink-2` | `#3d3d44` | secondary body |
| `--ink-3` | `#6b6b73` | muted |
| `--ink-4` | `#9a9aa1` | meta |
| `--ink-5` | `#c8c8cc` | faint |

### Color — borders
`--border #e6e6e1` · `--border-strong #d4d4cf` · `--hair #ddddd6`

### Color — accent & status
| Token | Hex | Meaning |
|---|---|---|
| `--accent` | `#4f46e5` | indigo, primary accent |
| `--accent-soft` | `#eef0ff` | accent pill bg / active nav bg |
| `--accent-ring` | `#c7caff` | accent border |
| `--accent-ink` | `#312e81` | accent text on soft bg |
| `--linked` | `#7c3aed` | purple — linked file component |
| `--ok` | `#2f7a4a` (soft `#e6f0e9`, ring `#b8d8c2`) | passed/done |
| `--warn` | `#b45309` (soft `#fef3c7`, ring `#fcd34d`) | open/flag |
| `--coral` | `#b53527` (soft `#fdf0f4`) | risk |
| `--teal` | `#1f74c4` (soft `#eff6fc`, ring `#aacef0`) | external links |

### Typography scale
| Style | Size / line-height | Weight | Tracking |
|---|---|---|---|
| `h1` | 62px / 1.02 | 600 | -0.035em |
| `h2` | 33px / 1.1 | 600 | -0.02em |
| `h3` | 19px / 1.3 | 600 | -0.012em |
| `h4` | 14.5px / 1.35 | 600 | -0.005em |
| body | 15px / 1.62 | 400 | — |
| `.lead` | 18px / 1.6 | 400 | -0.006em |
| `.small` | 13px / 1.55 | 400 | — |
| `.eyebrow` / section number | 11px mono | 500 | — |
| `.metric .mv` (big stat) | 34px / 1 | 600 | -0.03em |

Body uses `font-feature-settings: "ss01","cv11"`.

### Radius / shadow
- Cards/figures: `border-radius: 12px` (chips/pills 6–8px; avatars 50%).
- `--shadow-sm 0 1px 2px rgba(20,20,28,.05)`
- `--shadow-md 0 4px 16px -4px rgba(20,20,28,.10), 0 2px 4px rgba(20,20,28,.05)`
- `--shadow-lg 0 24px 60px -22px rgba(20,20,28,.30), 0 8px 20px -10px rgba(20,20,28,.12)`

### Spacing
Margin utilities used in markup: `.mt24 / .mt40` etc. The base rhythm is multiples of ~4px; section padding 64px vertical, 76px horizontal.

## Screens / Sections
There is one continuous page. Each numbered section shares the same anatomy: an **eyebrow** (`.sec-head` → mono kicker `NN` + a thin rule), an `h2` title, an optional `.dek` deck paragraph, then content.

1. **Cover** (`#top`) — wordmark + doc meta (right), giant `h1`, `.essence` intro paragraph, then the **signature visual**: a vertical stage timeline (`.vrib`) for a sample product (Style 247) showing stages (Idea → Materials → Tech pack → … Production), each with status pip, performer avatar, file chips (`.fitem`, with `.fx` extension + `.vv` version badge; linked files get a purple link glyph), and pinned comments (`.pin`, flagged variant `.pin.flagged`). Below the cover is an in-page contents grid (`<nav class="toc">`, a 2-column list — **note: distinct from the left rail**, see Interactions).
2. **01 Проблема** (`#s-context`) — problem framing.
3. **02 Що таке Midpack** (`#s-what`).
4. **03 Сезон з Midpack** (`#s-season`).
5. **04 Етапи, виконавці і файли** (`#s-stages`) — includes a figure "browser window" with `assets/shot-product.png`, and a second with `shot-collection.png`.
6. **05 Створюй workflows** (`#s-workflow`).
7. **06 Файли: види і повторне використання** (`#s-files`) — file-kind cards (`.fkind`) describing upload / link / template; chips show accepted formats.
8. **07 Чого хочуть учасники процесу?** (`#s-roles`) — role cards; figure with `shot-worklist.png`.
9. **08 Відгуки до яких прагне Midpack** (`#s-quotes`) — testimonial cards (`.quote`: serif quote-mark, `.qt` body, `.qf` author row with avatar + mono role).
10. **09 Робота з підрядниками** (`#s-external`).
11. **10 Єдине джерело правди** (`#s-truth`).
12. **11 Початок роботи** (`#s-start`).
13. **12 Цільові показники** (`#s-metrics`) — metric cards (`.metric`: 34px value `.mv`, label `.mt`); figure with `shot-collections.png`.
14. **13 Чим Midpack НЕ є** (`#s-not`) — boundary/anti-scope list.
15. **14 Коротке FAQ** (`#s-faq`) — `.faq` Q/A list, `break-inside: avoid` per item.
16. **Closing** (`#s-closing`) — centered logo, closing line, running footer.

### Recurring components
- **Browser-window figure** (`.window`): top `.bar` with three dots + `.addr` URL chip, then a full-width screenshot `<img>`; `<figcaption class="cap">` below with a `.tag` label.
- **File chip** (`.fitem`): filename + `.fx` extension (muted) + optional `.vv` version pill; `.fitem.linked` adds a purple link glyph for linked components.
- **Pin/comment** (`.pin`): avatar + name header (`.ph`) and body (`.pb`); `.pin.flagged` = amber-bordered open comment.
- **Avatars** (`.av`): 50% circle, initial; tinted per person (e.g. `.av-olena`, `.av-tech`, `.av-founder`, `.av-marta`).
- **Chips** (`.chip`, variants `.accent`, `.warn`): mono, small, status dots.

## Interactions & Behavior
### Left navigation rail (`.sidenav`) — the feature most recently added
- **Markup**: a `<button class="sidenav-toggle">`, a `<div class="sidenav-scrim">`, and `<nav class="sidenav">` containing `.sidenav-brand`, a `.sidenav-list` of `.sidenav-link` anchors (each = mono `.n` number + label), and a `.sidenav-foot`.
- **Wide screens (≥1400px)**: rendered as a **persistent fixed rail**, `position: fixed; left: 0; width: 250px; height: 100vh`, transparent background, sitting in the left gutter beside the centered column. Toggle button hidden.
- **Narrow screens (≤1399px)**: rail is hidden off-canvas (`translateX(-100%)`, width 264px, with bg + right border + shadow); a fixed **"Зміст" toggle button** (top-left) slides it in (`.open`), with a dimming `.sidenav-scrim`. Clicking any link or the scrim closes it.
- **Active tracking** (vanilla JS, no deps): a throttled (`requestAnimationFrame`) scroll handler finds the last section whose top has crossed an activation line 130px from the viewport top and sets `.active` on the matching link (`--accent-soft` bg, `--accent-ink` text). Near page bottom it forces the last section active. The active link is kept in view inside the rail via manual `scrollTop` math (deliberately **not** `scrollIntoView`).
- **Smooth scroll**: `html { scroll-behavior: smooth }` + `section.sheet { scroll-margin-top: 18px }`; links are plain `#id` anchors.
- ⚠️ **Naming caution**: the cover's in-page contents grid uses `class="toc"`; the rail uses `class="sidenav"`. Keep these names distinct — an earlier bug came from both sharing `.toc` and the fixed-position rules hijacking the cover grid. If you re-implement, namespace components clearly.

### Print / PDF
`@media print` exists (A4 portrait, `@page margin 14mm 15mm`), hides `.no-print` (incl. the rail), forces `print-color-adjust: exact` so dark blocks/chips keep their fills, sets `--pad-x: 0` so `.bleed` figures don't overflow the page, and applies `break-inside: avoid` to cards + `break-before: page` on `.page-break`/cover. Print is a secondary output; the page is primarily a web document.

## State Management
None. Fully static content. The only runtime state is the nav's current-section highlight + drawer open/closed, both derived from scroll position / a click — no data fetching, no persistence, no forms.

## Responsive behavior
- The document column is a fixed 820px and is **not** fluid below that width today; on small screens it will scroll horizontally unless you adapt it. If mobile support is required, make `.doc` `max-width: 820px; width: 100%`, reduce `--pad-x` at small breakpoints, and let the existing ≤1399px drawer nav handle navigation. Confirm target breakpoints with the designer.
- The nav already has the two-mode (rail / drawer) behavior described above.

## Assets
The four `shot-*.png` files are product UI screenshots used inside figure windows. They are project-authored placeholders/renders of the Midpack app; replace with final exported screenshots at the same aspect if available. No icon font is used — the few inline glyphs (link icon, hamburger) are inline SVG.

## Implementation notes
- This is content-first; prioritize semantic structure (`<section>`, headings, `<nav>`, `<figure>/<figcaption>`) and the type/spacing tokens above. 
- Everything is plain HTML/CSS + ~60 lines of vanilla JS for the nav. No framework is required, but it ports cleanly to any component model (one component per recurring block: SectionHead, BrowserWindow, FileChip, Pin, Quote, Metric, SideNav).
