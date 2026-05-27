# Worklist Page (Kanban) — User Stories

Stories and spec for the worklist surface at `/` (see `product/page-structure.md` §6). This page is the first screen an authenticated user sees every day. This document covers the **Kanban view** specifically — a board view that groups every stage the user owns by its current status across all active collections.

## What this page is

A daily "what's mine right now" board, sliced across every collection, grouped by the status the system is asking of me. Replaces the morning Slack scroll: "did anyone @ me?" → "is anything stuck waiting for me to approve?" → "what's blocking downstream?".

The Kanban view sits next to a list view (out of scope for this doc). Both share the same filter state, the same definition of "my items", and the same card content — only the layout differs.

## Core data model recap

Read [`product/specs/stages-and-statuses.md`](../specs/stages-and-statuses.md) for the source of truth. Two facts that drive the column model on this page:

- A stage has one of five statuses: **To Do · In Progress · Blocked · Done · Canceled**.
- A **review** is a stage with `isReview: true` — it is *not* a separate status. A review stage uses the same five statuses as any other stage. **Done** on a review = approved.

The Kanban column model below maps directly to those five statuses; the "/ Review" suffix on two columns is a *visual* distinction (orange treatment per the stage spec), not a separate underlying status.

## What lives on the board (unit)

**One card = one stage assignment**, not one product. A product (bundle) moving through a six-stage workflow can produce multiple cards over its lifetime — one per stage the user is the named performer/approver on. Practically:

- Most users see one active card per product at a time, because only one of their stages is in flight.
- A user who owned an earlier stage (now Done) and also owns a later stage (still To Do) sees two cards for the same product — one in **Done**, one in **To Do / To Review**.
- The product's identity (image, name, tags, fields) shows on each card as context; the stage's identity (stage name, deadline, who returned it) is what the card *is*.

This split matters because moving a card between columns changes the stage's status, not the product's. The product itself doesn't have a status.

## Columns

Five columns, left to right:

1. **To Do / To Review** — stages with status `To Do`. Review stages (`isReview: true`) carry the orange accent inside this column; non-review stages render neutral.
2. **In Progress / In Review** — stages with status `In Progress`. Same orange-vs-neutral split as above.
3. **Blocked** — stages with status `Blocked`. Red accent.
4. **Done** — stages with status `Done`. Neutral resting style; for a review stage, this means "approved".
5. **Canceled** — stages with status `Canceled`. Muted; collapsed by default if it gets long.

Locked stages (`locked: true` and not `manuallyUnlocked`) **do not appear on the board for their performer** — the spec hides them until their predecessors finish. They surface the moment they auto-unlock and land in **To Do / To Review**.

## Default view: "My items"

When a user opens `/` with no filter overrides, the board shows only **items where they are the named performer on the stage** — across every active collection. "Assigned to me on any stage" is the literal rule from the user request; in data terms: `stage.performer === currentUser` for any stage on the product.

A toggle near the filter bar flips between **My items** (default) and **All items** (everything the user has visibility into). Managers (Olena) need **All items** to see what's blocking downstream; performers (Marta) almost never leave **My items**.

## User stories

### Default daily use

As a performer (Marta, tech designer):

- I want to land on the worklist and see only the stages assigned to me, grouped by what the system is waiting for — so my first morning click is on a card, not on a filter.
- I want **To Do / To Review** pinned leftmost so the work the system is asking me to start sits where I look first.
- I want a card in **To Do / To Review** that was returned from a later stage to be marked with a **Returned** icon — so I can tell "this is rework" apart from "this is a fresh stage I haven't started".
- I want unread @mentions on a product to surface as a badge on its card — so I notice "Olena tagged me in costing 247" without opening the bundle.
- I want to drag a card from **To Do / To Review** into **In Progress / In Review** to mark that I've picked it up — without opening the bundle page first.

As a manager / approver (Olena, head of design):

- I want to switch to **All items** and filter by collection to see what's stuck in **Blocked** across SS26 — so I can intervene before Monday's product meeting.
- I want the cards in **In Progress / In Review** that are review stages assigned to me to read as orange — so "things I need to approve" jump out of the column without me reading every card.
- I want to drag a review card from **In Progress / In Review** to **Done** to approve it — with a confirm step that names what I'm approving (the prior stage's output) — so I don't approve from the board by accident.

As a production lead:

- I want to filter to stages with name "Production" in status To Do — so I can pick up newly-released styles without checking Slack.

As a founder:

- I want to land on the worklist and immediately see the count of items waiting on me — without scanning every collection.

### Filtering

As any user:

- I want to filter by **collection** (multi-select) — so I can narrow to "show me only FW26" when my head's already in that collection.
- I want to filter by **tags** (multi-select) — so I can look at "all the knits" or "everything tagged outerwear".
- I want to filter by **custom field value** — so I can answer "what's outstanding in the Premium line?" or "which items are SKU XYZ-*?".
- I want filters to **persist in the URL** — so I can paste a filtered worklist URL into Slack and the recipient sees the same slice.
- I want filters to apply consistently across all five columns — not just the column I happen to be looking at.
- I want a visible chip per active filter at the top of the board, with one-click clear per chip and a "Clear all" — so I always know why a column is empty.

### Drag and drop

As any user:

- I want to drag a card from **To Do / To Review** → **In Progress / In Review** to start work — no confirm; this is the cheapest transition and the most common one.
- I want to drag a card from **In Progress / In Review** → **Blocked**, and be prompted for a short reason — so the block has context without me opening the bundle.
- I want to drag a card from **Blocked** → **In Progress / In Review** to unblock myself — no confirm.
- I want to drag a card from **In Progress / In Review** → **Done** to complete a non-review stage — with an inline confirm.
- I want to drag a review card from **In Progress / In Review** → **Done** (approving the prior stage) to require an explicit confirm dialog that names what I'm approving and gives me a chance to leave a comment — because approving by drag-and-drop without that step is too easy to do by accident.
- I want destination columns to be visibly disabled / dimmed while I drag if the transition isn't allowed for this card — so I get the rejection before I drop, not after.
- I want a stage I am not the performer on to be **non-draggable** — read-only on the board — so I can't accidentally advance someone else's work. (Managers may have an override; out of scope for first pass.)
- I want a card moved by accident to be undoable from a transient toast for a few seconds — so a mistaken drag isn't a five-click recovery.

### Returned / rework signaling

As a performer:

- I want a card whose current stage has a `reopened` history (i.e. it was Done, got reopened by a later-stage rejection) to render a distinct **Returned** icon on the card — so "this is rework, second time around" reads at a glance.
- I want hovering / tapping the Returned icon to surface "returned by *Olena* on *May 12* — *'rise still too high'*" — so I know who and why without opening the bundle.
- I want the Returned icon to persist on the card through subsequent column moves until the stage hits Done again — so the "this is the rework pass" context survives me starting the work.

### Comments and mentions

As any user:

- I want each card to show the comment count for its product — same number as the bundle page surfaces.
- I want a separate **Unread mentions** badge on the card when there are comments mentioning me that I haven't read — quiet by default, urgent-colored when count ≥ 1.
- I want clicking the comments count to open comments inline (drawer / panel) without navigating away from the board — consistent with the products page brief.
- I want unread-mentions count to reset when I open the comments panel and view the relevant comment — so the badge mirrors my actual inbox state.

### Empty and edge states

As any user:

- I want each column to show an empty-state message that reflects the filter — "Nothing for you in *To Do* right now" beats a blank column.
- I want a long **Done** or **Canceled** column to collapse with a "Show all (N)" affordance — so completed work doesn't push active work off-screen.
- I want a card with a deadline in the past to render its date in the at-risk color — same treatment as the products page.
- I want a card I can't drag (because I'm not its performer, or the destination is invalid) to make that obvious before I try — cursor change on hover, dim on drag-start.

### Scoped external partners

As a freelance pattern reviewer (scoped external partner — see §12 of `page-structure.md`):

- I want my worklist Kanban to only show stages I have clearance for — so I can't see costing or lab dips on the board.
- I want the same column model as internal users — so the page works the same way regardless of role.

## What each card must show

A card is the scannable unit. It must surface, at a density that lets ~6–10 cards fit per column on a 1440px screen without scrolling:

- **Product thumbnail** (small; left of the card)
- **Product name** (one line, truncated with ellipsis on overflow)
- **Tags** (small pills; truncate to first 2–3 with `+N` overflow chip)
- **Custom fields** (1–2 most relevant values, e.g. SKU; quiet styling — they support filtering, they don't shout)
- **Stage name** (e.g. *Costing*, *Fit Review*, *Approval*) — this is what the card represents
- **Deadline** (date) + at-risk indicator when overdue
- **Comments count** (icon + number; clickable → opens inline comments panel)
- **Unread mentions badge** — only renders when count ≥ 1; urgent-colored
- **Returned icon** — only renders when the stage was reopened by a downstream rejection; hover shows who + when + reason

The stage's accent (orange for review, blue for in-progress non-review, red for blocked, grey for to-do, neutral for done/canceled — per `stages-and-statuses.md`) drives the card's left-edge color or a small status pill.

## Top-level affordances

- **View toggle:** Kanban (this doc) · List. Default Kanban.
- **Scope toggle:** My items (default) · All items.
- **Filter bar:** Collection (multi), Tags (multi), Custom field value(s), Stage name (multi).
- **Search:** product name / SKU keyword — narrows the board live.
- **Active-filter chip strip** with per-chip clear and "Clear all".
- **Column header counts** — every column header shows the count of cards currently visible in it under the active filters.

## Visual direction

- This page is a *triage* surface, not a portfolio dashboard. Density beats prettiness — Marta should be able to see 30+ cards across five columns without scrolling sideways.
- Status accent (orange / blue / red / grey / neutral) is the workhorse visual cue. The column placement is redundant with status on purpose; the accent makes the board scannable on a half-width window too.
- Only **two** elements on a card are urgent-colored: the **Unread mentions** badge and the **at-risk deadline**. Everything else stays calm. If three things shout, nothing does.
- The **Returned** icon is a marker, not an alarm — distinct shape (e.g. a small return-arrow icon) rather than urgent color. Rework is signal, not emergency.
- Drag affordances should be visible on hover, not always on — a static board shouldn't feel like everything is jiggling.

## Out of scope for this pass

- **Mobile drag-and-drop.** The Kanban is desktop-first. Mobile users get the list view; that's where fit-review-room data capture lives.
- **Swimlanes** (grouping rows within columns by collection or by deadline week). Surface as a follow-up if managers ask.
- **Bulk operations** (multi-select cards, drag a group). One-card-at-a-time only in the first pass.
- **Saved views** beyond URL-encoded filters — no named filter presets yet.
- **Reordering within a column** (manual sort). Sort order inside a column is automatic (e.g. by deadline ascending); the user can't drag cards vertically to prioritize.
- **Manager override to drag stages they don't own.** Hinted at above; deliberately deferred. First pass enforces "you can only drag your own cards".
- **Cross-collection dependency visualization** (e.g. "this card unblocks 3 downstream stages elsewhere"). Implied by stage locking but not surfaced here.
- **Notification-fed Returned reasons in real time.** First pass reads the latest reopen event from the audit log; no live updates.
- **Done/Canceled history beyond the active collection set.** A card for a long-completed stage on an archived collection shouldn't clutter Done — filter to active collections by default; "show archived" is a follow-up.
