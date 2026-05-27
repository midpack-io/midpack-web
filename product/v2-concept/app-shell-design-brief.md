# App Shell — Design Brief

Brief for Claude Design. Covers the persistent chrome that wraps every authenticated page: **left sidebar + top header + globally-available Ask AI modal**. The sidebar has two modes — **Workspace** (default) and **Settings** — that swap contents in place when the URL enters or leaves `/settings/*`. The header and the Ask AI trigger stay constant across both modes.

## What this is

The frame inside which every authenticated page renders. Spans:

- Left rail (≈240–260px), full height, persistent. Two content modes.
- Top bar (≈56px), full width, persistent across both rail modes.
- Ask AI modal — overlay, can be opened from anywhere (header button + keyboard shortcut).

The shell is the spatial-memory anchor of the app: the same things live in the same places day after day. Designs should feel calm — chrome supports the work, never competes with it.

## Sidebar — Workspace mode (default)

Default rail. Visible on all non-settings authenticated routes (`/`, `/collections/*`, `/bundles/*`, `/library`, etc.).

**Order top-to-bottom:**

1. **Workspace identity** — small brand mark + workspace name. Click → workspace switcher menu (if >1 workspace; otherwise inert).
2. **Worklist** — single nav item, label "Worklist", muted "Home" feel. Active state when on `/`.
3. **Collections** — expandable section. **The hero element of the rail.**
4. **Library** — single nav item. Active on `/library/*`.
5. *(flex spacer pushes everything below to the bottom)*
6. **Settings** — single nav item, gear icon, slightly muted. Active on `/settings/*` (entering it triggers the mode swap — see Mode transitions).
7. **User chip** — avatar + name. Click → small popover menu: *Account · Notifications · Sign out*.

### Collections section — the expandable block

This is the visual workhorse of the rail. Two intents must coexist:

- **"Take me to the cross-collection view"** — click the section header → `/collections` (the dashboard grid of all collections).
- **"Take me into a specific collection"** — click a collection row → `/collections/[id]` (the workspace matrix for that collection).

**Layout (expanded):**

- Section header row: caret/chevron, label **"Collections"**, count chip (e.g. `5`), `+` action on hover (new collection).
- Below the header, when expanded: a list of collection rows.
- Each collection row shows:
  - Small **cover image** (~24px square, rounded; first letter of name on a tinted background as fallback).
  - **Collection name** — single line, truncated with ellipsis.
  - **Progress indicator** — a thin horizontal bar under the name (1–2px tall, full row width), filled to the rolled-up % of stages completed across products in the collection. Same data as the progress % on the Collections page card (`collections-page-design-brief.md`).
  - **Mentions dot** — small urgent-colored dot at the right of the row if the viewing user has unread mentions inside any product of the collection. No number, just a presence indicator (full count lives on the Collections page card).
  - Hover state: subtle background fill.
  - Active state (when the URL is inside this collection): stronger background, accent-colored left edge bar.
- Last row in the expansion: **"All collections →"** — explicit link to `/collections`, slightly muted. (The section header also goes there, but the explicit row removes guesswork.)

**Layout (collapsed):**

- Just the header row with caret, label, count chip.
- Caret toggles expansion. State is remembered per user.
- When a collection deep-link is opened (`/collections/[id]`), the section auto-expands so the active collection is visible — overriding the user's collapsed preference for that session.

**Limits / overflow:**

- If the workspace has more than ~8 collections, the list scrolls inside the section (max height ≈40–50% of viewport), with a fade at the bottom. The sidebar itself does not scroll independently of the section.
- A small "Show archived" toggle at the bottom of the expansion reveals archived collections in a muted style.

### Library section

Single nav item for now. If templates land as a real concept later, this becomes its own expandable section with **Components** and **Templates** sub-items — same expand pattern as Collections, no inner thumbnails (just labels + counts). Out of scope for this pass.

## Sidebar — Settings mode

Active when the URL is under `/settings/*`. The rail replaces Workspace content with settings navigation. Header stays unchanged.

**Order top-to-bottom:**

1. **← Back to workspace** — prominent row at the top with a left-chevron and label. Click → returns to the last-visited workspace URL (or `/` if none). This is the only way out of settings mode via the rail.
2. **Settings label** — small section heading, "Settings".
3. **Workspace group** — section heading "Workspace":
   - General
   - Members
   - Billing
   - Workflows
   - Integrations
   - Transit & export
4. **Account group** — section heading "Account":
   - Profile
   - Notifications
5. *(flex spacer)*
6. **User chip** — same as in Workspace mode.

Group headings are quiet (uppercase micro-label, muted). They don't expand/collapse — settings nav is flat and short.

Permissions: items the current user can't edit still render but are muted with a small lock icon. Performers see workspace-group items as read-only (no lock icon — the page itself handles the read-only treatment); items they have no read access to (Billing) are hidden entirely from the rail.

## Mode transitions

- Entering `/settings/*` from anywhere swaps the rail to Settings mode. The swap is a quick cross-fade (≈150ms) — content changes, the rail's outer shape and the header do not move.
- Clicking **← Back to workspace** restores Workspace mode. The previously-expanded Collections state is restored.
- Direct deep-links into settings render Settings mode on first paint — no flash of the workspace rail.
- The header (search, notifications, Ask AI, avatar) is identical in both modes.

## Header (top bar)

Persistent across both sidebar modes. Left-to-right:

1. **Page title / breadcrumb** — left-aligned, immediately right of the sidebar edge. On most pages this is just the page name (e.g. "Worklist", "Collections", "Settings · Members"). On bundle and collection pages it's a short breadcrumb (e.g. "Collections / SS26 / Style 247"). Acts as a focal point and orientation cue — never a logo here (the workspace mark is in the rail).
2. *(flex spacer)*
3. **Search** — keyboard shortcut `/` opens the search palette. Searches across products (bundles), collections, members, files. Quiet, icon-only collapsed state on narrow widths.
4. **Ask AI** — pill-shaped button with a sparkle/star glyph and the label **"Ask AI"**. Keyboard shortcut `⌘K` / `Ctrl K`. Always visible (no role-gating). See Ask AI modal below.
5. **Notifications** — bell icon with an unread count chip if non-zero. Click → popover with the user's recent notifications (mentions, stage assignments, returns for rework). Full notifications page is reachable from inside the popover ("See all").
6. **Avatar menu** — same content as the user chip in the rail (Account · Notifications · Sign out). Provided in the header too so it's reachable from any window width / scroll position.

Header content does not change between sidebar modes.

## Ask AI modal

A globally-available AI conversation surface. Triggered from the header button or `⌘K` from anywhere in the authenticated app.

### Behavior

- **Overlay, not full-page.** Modal opens centered, ~640px wide, ~70% viewport tall (max ~720px), with a dim background. The page underneath stays loaded and visible at the edges.
- **Closable without losing the conversation.** `Esc` or click-outside closes the modal; reopening it (same session) restores the conversation in place. The conversation is session-scoped for this pass (cleared on full page reload).
- **Context-aware.** When opened from a bundle page, the modal knows which bundle the user is on and offers a small contextual chip at the top of the input (e.g. *"Asking about: Style 247"*) which the user can dismiss to ask a workspace-wide question instead. Same pattern from a collection page.
- **Non-blocking.** The user can dismiss the modal, navigate elsewhere, and reopen to continue.

### Layout

Top-to-bottom inside the modal:

1. **Header strip** — title "Ask AI", contextual chip if applicable, close (×) button on the right.
2. **Conversation area** — scrolling thread. User messages right-aligned in a quiet bubble; AI messages left-aligned, plain prose with the ability to render inline file chips, member mentions, and bundle/collection links (same renderer as the bundle comments feed per `comments-section-design-brief.md`, if compatible).
3. **Suggested prompts** — visible only when the conversation is empty. Two short groups, each with 2–3 example prompts as clickable chips:
   - **Configure the workspace** — e.g. *"Help me set up a workflow for swimwear"*, *"Invite my factory partner"*, *"Wire up Google Drive export"*.
   - **Talk about production** — e.g. *"What's stuck in SS26?"*, *"Summarize fit review feedback for Style 247"*, *"Who's the bottleneck this week?"*.
3. **Input area** — multiline text input pinned to the bottom, with a send button, an attach-file affordance (for image / PDF context), and a small "New conversation" link on the right that clears the thread after confirm.

### Visual direction for the modal

- Calm. The dim overlay and the centered card are conventional; nothing about the modal should read as a "chatbot widget."
- Suggested-prompt chips are the only place inside the modal that gets a subtle accent treatment — they're the empty-state CTA.
- Streaming responses: token-by-token render, with a soft caret/cursor while generating; no loading spinners.

### Out of scope for this modal (this pass)

- Durable cross-session conversations.
- Voice input.
- Branching / regenerating responses.
- Inline approve / advance-stage actions (the modal *talks about* the workflow; the MCP loop in `vision.md` §pillar 6 handles "do" via Claude Desktop). If/when in-app AI gains write actions, that's a separate brief.

## Role-conditional rendering

Same shell across roles; items conditionally shown.

- **Performer**: Worklist + Collections (expansion shows only collections they have product assignments inside) + Library + Settings (rail entry visible; entering it shows only Account group items — Workspace group is hidden, not greyed).
- **Manager**: full Workspace rail + full Settings nav (Workspace + Account groups), with destructive Billing actions still gated.
- **Admin** = Manager + write access on every Settings page that's read-only for plain managers (none in the current set, but future-proof).
- **Owner** = Admin + a "Transfer ownership" affordance inside `/settings/general` (not a rail item).

Ask AI is available to all roles. Search is available to all roles. Notifications are available to all roles.

## Visual direction

- **Density.** Workspace rail is denser than the page content, but not cramped. Settings rail is even quieter — flat list, no thumbnails, no badges.
- **Color.** The rail is on a muted surface (one step darker / cooler than the page). Active item gets a stronger background and an accent-colored left edge bar (2–3px wide). Mentions dots and unread notification counts are the only urgent-colored elements in the chrome.
- **Iconography.** Lucide icons. Icons are 16px, single-stroke, in the muted foreground color. The Ask AI button is the only place that uses a filled / accented glyph.
- **Typography.** Rail labels at `text-sm`; section headings at `text-xs` uppercase tracked. Collection names at `text-sm`, single line, truncated. Counts and chips at `text-xs`.
- **Spacing.** Rail items have generous vertical padding (≈8–10px). Collection rows in the expansion are tighter (≈6–8px) because the thumbnail anchors the row.
- **Motion.** Mode swap: cross-fade ≈150ms. Section expand/collapse: height transition ≈180ms with easing. Modal open: fade + ≈8px slide-up, ≈180ms. No bouncing, no large movement.
- **Mobile / narrow.** Below ≈900px wide, the rail collapses to icons only; the Collections expansion becomes a popover on the icon. Below ≈640px the rail becomes a slide-over drawer triggered from a hamburger in the header. (Mobile-first treatment is not the priority for this pass — managers and performers are on desktop — but the design should not actively break.)

## Keyboard shortcuts

- `⌘K` / `Ctrl K` — open Ask AI.
- `/` — open Search.
- `g` then `h` — go to Worklist (Home).
- `g` then `c` — go to Collections (`/collections`).
- `g` then `l` — go to Library.
- `g` then `s` — go to Settings.
- `Esc` — close any modal / popover.

These are aspirational for this pass — the design should leave room for them (e.g. shortcut hints next to nav items in hover tooltips) but they don't need to be wired up to ship.

## Out of scope for this pass

- Multi-workspace switching UI (assume one workspace per user for the prototype).
- Notifications drawer / page design (covered separately).
- Search palette design (covered separately).
- Customizable rail (pinning collections, reordering items).
- Workspace-level theming (light/dark beyond the system default, brand-colored chrome).
- Persistent AI conversations across sessions.
- AI actions that write to the workspace from inside the modal.

---

**Related documents:**

- [`collections-page-design-brief.md`](./collections-page-design-brief.md) — the `/collections` grid the section header links to.
- [`products-page-design-brief.md`](./products-page-design-brief.md) — the collection-scoped product list reached via a collection row.
- [`settings-area-user-stories.md`](./settings-area-user-stories.md) — what each Settings sub-page does.
- [`members-page-user-stories.md`](./members-page-user-stories.md) — the Members settings sub-page in detail.
- `product/page-structure.md` §3, §6, §7 — Settings, Worklist, Collection workspace.
- `product/vision.md` §pillar 6 — Conversational MCP loop (external Claude Desktop counterpart to the in-app Ask AI modal).
