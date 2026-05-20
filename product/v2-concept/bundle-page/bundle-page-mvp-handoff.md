# Bundle Page — Design Handoff (MVP: 2 states)

> **Target reader: AI designer (claude-design).** This is a **complete self-contained brief** — read only this file. Don't look for other sources; all entities, specs, data, and user stories are below.
>
> **What to build:** 2 hi-fi static HTML/CSS mockups of the bundle page (`/bundles/{id}`). No React. No build step. No JS — interactivity is CSS-only. Use your own design system (colors, typography, spacing, radii — yours). Tailwind via CDN is fine.
>
> **How to iterate:** generate both in one pass. After review, the user will give targeted commands like "polish active stage pill" / "tighten comments density".
>
> **A note on language:** the product targets Ukrainian SMB fashion brands. UI chrome is English; workflow stage names and user-generated content (some comments) are Ukrainian. Render the Ukrainian strings verbatim where they appear in fixture data — that mix is the real product.

---

## 1. The moment we're designing

Marta (a tech designer at a small Ukrainian fashion brand) opens a Slack link to a bundle at 9:14am on a Tuesday. **Within 5 seconds** she must understand without scrolling and without reading:

- _Which style this is_ (cover image + title)
- _What stage we're on_ (highlighted pill in the stepper)
- _Who's moving it_ (assignee), _who has to approve_ (approver)
- _How long we've been in the stage_ ("3 days")
- _Which files belong to the current stage_

If she answers "is this mine right now?" at a glance — the mockup wins.

The bundle page is the most important surface in the product. Every outbound link (Slack, email, the factory's WhatsApp) leads here. The URL is the product. The page is **not a file manager and not a chat** — it's an instrument for coordinating one style.

---

## 2. What to draw — 2 states

### State 1: `01-default-desktop.html` — Marta orients

Viewport: **1440×900**. Marta has just opened the URL. She sees the header (cover + title), a stage stepper with "Тех-пак" highlighted as active, a file tree grouped by stage, and a side panel with the Comments tab open showing 2-3 open comments.

### State 2: `02-preview-open.html` — Marta opens a file

Viewport: **1440×900**. Marta clicked `TP_001_dress.pdf` in the tree → a preview pane opens over the Files area, rendering PDF v3 (use a PDF placeholder rectangle with the caption "PDF v3 preview"). In the preview pane header — version pills (v3 active, v2, v1) plus "Upload new version" and "Open in tab" buttons. The side panel **auto-switches** to the Comments tab with a **scope chip** "Comments on TP_001_dress.pdf" and a version-pill row `[all] v3 v2 v1`. In the list — Olena's v2 comment "the cuff width needs to be 6.5cm" with status **"still open from v2"** (warm/amber badge). A composer at the bottom of the side panel shows anchor preview "Commenting on TP_001_dress.pdf v3".

**The header and stage stepper stay visible** (sticky). Only the Files area is replaced by the preview.

---

## 3. Layout (exact proportions)

### State 1 (default desktop)

```
┌──────────────────────────────────────────────────────────────┐
│ Header (cover thumb 64×64 + title + Copy link + back link)   │
├──────────────────────────────────────────────────────────────┤
│ Stage stepper (sticky):                                      │
│ [✓ Ідея] → [✓ Ескізи] → [► Тех-пак] → [Лекала] → [Зразок]→ │
│              Assignee: Marta · Approver: Olena · 3 days      │
├──────────────────────────────────┬───────────────────────────┤
│ Files area (65-70% width)        │ Side panel (30-35% width) │
│                                  │ Tabs: ►Comments · Decisions│
│ [stage sections with items]      │      · Action Log · Members│
│                                  │                           │
│                                  │ [Comment cards]           │
│                                  │ [Sticky composer at bottom]│
└──────────────────────────────────┴───────────────────────────┘
```

### State 2 (preview open)

```
┌──────────────────────────────────────────────────────────────┐
│ Header (sticky — same as State 1)                            │
├──────────────────────────────────────────────────────────────┤
│ Stage stepper (sticky — same as State 1)                     │
├──────────────────────────────────┬───────────────────────────┤
│ Preview pane                     │ Side panel                │
│ [× Close] TP_001_dress.pdf       │ ►Comments · Decisions ·   │
│ v3 (active) · v2 · v1            │  Action Log · Members     │
│ [Open in tab] [Upload new version]│ ──────────────────────── │
│ ─────────────────────────────────│ Scope: TP_001_dress.pdf  │
│                                  │ [all] v3 v2 v1            │
│   [PDF v3 placeholder rendering] │ ──────────────────────── │
│                                  │ Olena on v2:              │
│                                  │ "the cuff width needs    │
│                                  │  to be 6.5cm, not 6cm"   │
│                                  │ [still open from v2]      │
│                                  │                           │
│                                  │ Composer:                 │
│                                  │ "Commenting on            │
│                                  │  TP_001_dress.pdf v3"     │
└──────────────────────────────────┴───────────────────────────┘
```

**Layout rules:**

- Files area / Preview pane take **65-70% of the width** on desktop. Side panel — **30-35%**.
- Header and stage stepper — **sticky top** while the Files area scrolls and while the preview is open.
- Preview pane — overlay **only over the Files area**, not over the header / stepper / side panel.
- Files area / preview scroll independently; stepper and side panel do not scroll with them.

---

## 4. Entities in scope (use these fields, don't invent new ones)

### Bundle
`id`, `title`, `collectionId`, `currentStageId`, `coverImageId` (FK on Item, nullable; must be an image File).

### Stage
`id`, `bundleId`, `name`, `position`, `status` (`pending` / `active` / `passed` / `blocked`), `enteredAt`, `passedAt`, `assigneeId` (FK on User — moves the stage), `approverIds[]` (FK on User array — signs off completion).

### Member
`userId`, `bundleId`, `accessLevel` (`owner` / `editor` / `viewer`), `addedAt`. **Member = access.** Specific people on stages live on `Stage.assigneeId / approverIds`.

### Item (polymorphic — single table with a discriminator)
Shared fields: `id`, `type` (`folder` / `file` / `externalLink`), `bundleId`, `stageId`, `parentId` (null = stage root; Folder ID = inside that folder), `name`, `position`, `addedById`, `addedAt`.

Subtypes:
- **Folder** — container only.
- **File** — adds `currentVersionId` (FK → Version), `mimeType`.
- **ExternalLink** — adds `url`, `linkType` (`techpacker` / `figma` / `loom` / `gdoc` / `other`). No versions.

### Version
`id`, `fileId` (FK on Item type=file), `sequence` (1, 2, 3… renders as v1, v2, v3), `uploadedById`, `uploadedAt`, `blobPath`, `size`, `note?`.

### Comment
`id`, `authorId`, `body` (markdown), `createdAt`, `resolvedAt?`, `parentCommentId?`, `anchor` (`{ kind, refId }` — kind is one of: `bundle` / `item` / `version` / `stage` / `decision`), `crossVersionState` (`open` / `resolved` / `still-open-from-v_n`).

If a comment is anchored to v2 of a file, and the file is now at v3 — the comment stays visible with state `still-open-from-v2` until resolved.

**Out of scope (so we don't design their bodies):** Decision (Decisions tab), ActionLogEntry (Action Log tab). But **the tab labels** in the side panel ("Decisions", "Action Log", "Members") **are visible as inactive tab labels** — design the tab strip with 4 tabs, only Comments active.

---

## 5. Per-surface specs

### 5.1 Header

- **Back link** `← Back to Workspace` — secondary, small.
- **Cover image thumbnail** — 64×64 px, soft border-radius. Click → opens the cover in preview (like State 2 but with image content).
- **Bundle title** — H1, prominent.
- **Collection label** — `Collection: SS26`, secondary muted.
- **Copy link button** — right side, secondary CTA with a 📋 icon + the text "Copy link".

### 5.2 Stage stepper

Each stage pill shows:

- Status icon: **✓** (passed) / **►** (active) / **○** (pending) / **⊘** (blocked).
- Name (from `Stage.name` — in Ukrainian).
- A small assignee avatar.
- If active — also a time indicator like "3 days".

**Active stage** (status = active):

- Visually stronger — fill / bold border.
- Expands an inline block below with: `Assignee: Marta` (avatar) · `Approver: Olena` (avatar) · `3 days in stage` · CTAs `Approve` / `Request changes` (these are primary visual elements but they are NOT functional in State 1 — Marta is not an approver).

**Sticky top** while the Files area scrolls and while the preview is open.

### 5.3 Files area (State 1)

Default view — grouped by `Stage` in `position` order.

At the top — a sticky toggle row with 3 dropdowns: **Group by: Stage** / **Sort: Position** / **Filter: All** (for State 1 show default values, not an open dropdown).

**Stage section:**
- Stage name as a collapsible header with a chevron.
- Active stage — expanded by default; passed and pending — collapsed, except those with data in §6.
- A `[+ Add file / link / folder]` button under the items at the stage root (visible in the expanded section).

**File row:**
- Type icon (PDF / XLSX / image / DXF).
- Name (truncate with ellipsis if long).
- Version chip — `v3` (badge style).
- Relative time — "1h ago".
- Hover-actions on the right (show on one row in State 1 so the pattern is visible): `Upload new version` icon + `•••` overflow.

**Folder row:** chevron + folder icon + name + item count.

**ExternalLink row:** type icon (Figma / Techpacker / etc.) + name + relative time. No version chip.

### 5.4 Side panel — Comments tab

Tab strip at the top of the panel: **Comments** (active) · **Decisions** · **Action Log** · **Members**.

**Each Comment card:**
- Avatar + author name + relative timestamp.
- Body (plain text — markdown is not rendered in static).
- **Anchor chip** — "on TP_001_dress.pdf v2" / "on front.pdf v1" / "on this bundle". Thin chip-style element.
- **Status badge:** `Open` (neutral) / `Still open from v2` (warm/amber — should catch the eye) / `Resolved` (muted, grey).
- Actions `Reply` / `Resolve` as a subtle row at the bottom of the card or hover-only.

**Sticky composer at the bottom:**
- Textarea with placeholder "Add a comment…"
- Above the textarea — anchor preview: "Commenting on this bundle" (because preview is not open).
- Submit button on the right.

### 5.5 File preview pane (State 2)

**Layout:** overlay over the Files area; header and stepper remain visible.

**Preview pane header:**
- `× Close` on the left.
- File name "TP_001_dress.pdf".
- **Version pills** — `v3` (active, highlighted) · `v2` · `v1`. Clear clickable elements.
- On the right — actions: `Upload new version` (primary CTA) and `Open in tab` (secondary).

**Preview pane body:** for State 2 — PDF placeholder. A large rectangle with a thin border and a centered caption "PDF v3 · TP_001_dress.pdf · Preview rendered via auth-gated proxy". Show that this is the canvas for rendered content.

**Scope chip in the Comments tab** (this is part of the side panel, not the preview pane):
- Above the comment list a chip appears: "Comments on TP_001_dress.pdf" + a row of version pills `[all] v3 v2 v1` (active = `[all]`).
- Composer auto-anchor flips: "Commenting on TP_001_dress.pdf v3".

---

## 6. Fixture data (use verbatim — do not invent)

### Bundle
- Title: **Style 247**
- Collection: **SS26**
- Cover image: `front_navy_blazer.jpg` (render a gradient placeholder in navy / off-white tones, or a gradient + first letter "S" if your system has a brand-image generator)

### Members
- **Marta K.** (Марта) — tech designer, `editor`
- **Olena P.** (Олена) — head of design, `editor` (approver on key stages)
- **Brand owner** — `owner`

### Stages (9, in order — use this for the stepper in both states)

Stage names are Ukrainian — that's the real product. Render verbatim.

1. Ідея колекції — **passed ✓**
2. Ескізи й вибір тканин — **passed ✓**
3. Тех-пак — **active ►** (assignee: Marta, approver: Olena, 3 days in stage)
4. Закупівля матеріалів — pending
5. Лекала — pending
6. Перший зразок — pending
7. Примірка — pending
8. Градація розмірів — pending
9. Підготовка до виробництва — pending

### Items for State 1 (Files area)

**Stage 1 (Ідея)** — collapsed, but you can expand 1-2 earlier stages where it adds visual sense:
- `moodboard.pdf` — file, v1, "2d ago"
- `collection_plan.xlsx` — file, v2, "1d ago"

**Stage 2 (Ескізи)** — partially expanded so the folder pattern is shown:
- 📁 `sketches/` (expanded)
  - `front.pdf` — file, v1, "3d ago"
  - `back.pdf` — file, v1, "3d ago"
- `fabric_swatches.xlsx` — file, v3, "1d ago"
- 🔗 `trims_inspiration` — externalLink, `figma` type, "2d ago"

**Stage 3 (Тех-пак, active)** — fully expanded:
- `TP_001_dress.pdf` — file, **v3**, "1h ago"
- `BOM_001.xlsx` — file, v2, "4h ago"
- `[+ Add file / link / folder]` button

### Comments

User-generated content stays in its original language (mix of Ukrainian and English — that's realistic).

**State 1** — default view, Comments tab active:
- **Olena** on `TP_001_dress.pdf v2`: "the cuff width needs to be 6.5cm, not 6cm" — **Still open from v2**
- **Marta** on `front.pdf v1`: "тканина — supplier №2, артикул 4501" — Open
- **Founder** on bundle: "коли запускаємо?" — Open

**State 2** — Comments tab scoped to TP_001_dress.pdf, version filter `[all]`:
- The same Olena's v2 comment — **Still open from v2** (the only one in scope)
- Composer at the bottom with anchor "Commenting on TP_001_dress.pdf v3"

---

## 7. The 7 stories in scope

These are BDD acceptance criteria for design coverage. Each story below is a beat that must be readable in the mockup.

### US-001 — Land on bundle and see current state at a glance

**Persona:** Marta.
**Want:** opened the URL → immediately sees active stage, assignee, approver, time in stage.
**Visual coverage:** Stage stepper in State 1 with the expanded active-stage card.

**Acceptance visually:**
- The active pill (Тех-пак) is visually stronger than passed / pending.
- The expanded card below shows "Assignee: Marta" with avatar, "Approver: Olena" with avatar, "3 days in stage".
- If Marta isn't an approver — Approve / Request changes are absent (in our fixture she's the assignee, not the approver, so the buttons are **either visible as disabled or absent** — pick whichever is design-clearer).

### US-002 — Browse file tree grouped by stage

**Persona:** Marta.
**Want:** sees all bundle files grouped by stage, folders expand, external links inline.
**Visual coverage:** Files area in State 1.

**Acceptance visually:**
- 9 collapsible stage sections in position order.
- Active stage (Stage 3) — expanded by default.
- The `sketches/` folder has a chevron + folder icon + item count.
- The `trims_inspiration` ExternalLink renders with a Figma icon (NOT a raw URL).
- Stage 6 (Перший зразок) — if shown expanded — empty state "No files yet · [+ Add file / link / folder]".

### US-003 — Open file in inline preview with comments alongside

**Persona:** Marta.
**Want:** click on a file → an inline preview pane opens over the Files area, Comments tab auto-switches with a scoped filter.
**Visual coverage:** State 2 in full.

**Acceptance visually:**
- Preview pane occupies the same area as the Files area (Stepper + Side panel stay sticky).
- PDF placeholder in the preview body.
- Side panel: Comments tab active, scope chip "Comments on TP_001_dress.pdf" visible.
- Version pills `[all] v3 v2 v1` in a single row in the scope chip area; active = `[all]`.

### US-004 — Upload new version (affordance only)

**Persona:** Marta.
**Want:** a visible "Upload new version" button in the preview header so she can click it.
**Visual coverage:** State 2 — `Upload new version` button in the preview pane header as **primary CTA**.

**Acceptance visually:**
- `Upload new version` button on the right of the preview pane header.
- UI affordance only — no in-flight state modeled.

### US-005 — Comment that persists across versions

**Persona:** Olena (author of the v2 comment).
**Want:** her v2 comment stays open with "still open from v2" status after Marta uploaded v3.
**Visual coverage:** Comments tab in both states.

**Acceptance visually:**
- The card with Olena's comment has a status badge **"Still open from v2"** (warm/amber — eye-catching).
- Anchor chip "on TP_001_dress.pdf v2" visible.
- In State 2, where preview is on v3, this comment is still shown (because scope = all versions).

### US-008 — Copy bundle URL (affordance only)

**Persona:** Marta.
**Want:** a visible "Copy link" button in the header that she'll tap to copy the URL.
**Visual coverage:** Header in both states — a `📋 Copy link` button on the right.

**Acceptance visually:**
- Secondary CTA with clipboard icon + the text "Copy link".
- UI affordance only — no toast modeled.

### US-009 — Cover image in header

**Persona:** Marta.
**Want:** instantly recognizes "Style 247 — navy blazer" by the cover thumbnail in the header.
**Visual coverage:** Header in both states.

**Acceptance visually:**
- Cover thumbnail 64×64 to the left of the title block.
- Soft border-radius.
- Placeholder gradient acceptable (use your system's if available; if not — a neutral fashion-relevant gradient in dark navy / off-white tones for the "navy blazer" mood).

---

## 8. Design-quality criteria (success looks like this)

These are **design goals**, not code rules. Check each mockup against them:

1. **5-second test.** Screenshot → someone who has never seen the product answers "this is a page of one style on stage 'Тех-пак', Marta is assignee, Olena is approver, there's an open comment on the tech-pack". If the answer gets lost in visual noise — tighten.
2. **The active stage is obvious without reading text.** The eye should catch the active pill within 1 second.
3. **The "Still open from v2" badge catches the eye first** among comments. This is the most load-bearing status — it means "someone is waiting on you".
4. **The primary CTA in preview is `Upload new version`** (top-right of the preview pane header, not in the side panel, not in the Files area). This is Marta's most important next action in State 2.
5. **The cover image is readable at 64×64.** If it's a placeholder — a gradient with character, not a grey square.
6. **File row hierarchy:** name is primary, version chip + time are secondary. Hover-actions should not distract in default state.
7. **Version navigation** (v3/v2/v1 pills in preview) should read as chronology, not as tabs of equal visual weight.
8. **The Comments composer at the bottom of the side panel** doesn't compete for attention with the comments above. Subtle border, primary focus state, neutral default state.
9. **The tab strip in the side panel** doesn't overwhelm the data. 4 tabs, one active — should read as secondary navigation, not as the main thing.
10. **Tone:** tool, not toy. SMB fashion professionals. Not big-corp PLM, not consumer-app candy. Designerly utility. Tone-only inspiration (not for copying): **Linear** (density), **Notion comments** (cross-version anchoring), **Figma** (stepper logic).

---

## 9. What NOT to do (minimal list)

1. **Don't invent microcopy.** If exact copy isn't in §6 — use the closest match and add an HTML comment `<!-- TODO: confirm copy -->`.
2. **Don't break the layout proportions:** 65-70% files / 30-35% side panel. Header and stepper sticky.
3. **Don't add JS.** Interactivity — CSS hover/focus only.
4. **Don't design the Decisions / Action Log / Members tabs.** Only the tab strip labels in the side panel — the bodies of those tabs are out of scope.

---

## 10. Delivery

2 files. Location — your call (`prototypes/bundle-page/` or anywhere). File structure is not prescriptive — the main thing is that it opens and renders in Chrome.

Each file — `<!-- State: 01-default-desktop · Covers: US-001, US-002, US-008, US-009 -->` (or analogous for preview) as the first line in `<body>`.

After generation — the user opens both, takes screenshots, gives feedback like "polish active stage pill" / "tighten comment density" / "cover gradient — try warmer tones". Don't start polish yourself — wait for commands.
