# Collections Page — Design Brief

Short brief for Claude Design.

## What this page is

A manager-facing overview of every collection currently in development. The job is to make the state of the whole portfolio scannable in a single glance — progress, momentum, and "is anything waiting on me?" — without drilling in.

A **collection** groups multiple products (bundles). A **product** is one deliverable moving through a multi-stage workflow.

## User stories

As a manager:

- I want to review the state of all collections currently in development.
- I want to see a progress percentage for each collection.
- I want to see the latest key events inside each collection (most recent activity surfaced on the card).
- I want to see whether I've been mentioned/tagged inside each collection (and how many unread mentions).
- I want to see how many products are sitting in which stage inside each collection (stage distribution).
- I want to open any collection to see its details.
- I want to create a new collection.
- I want to archive a collection.

## What each collection card must show

- Collection name + optional cover image.
- Overall **progress %** (rolled up from the products inside).
- **Total product count** + a **stage distribution strip** (e.g. small segmented bar: Brief · Design · Copy · Review · Approval · Production with counts).
- **Latest key events** — last 1–3 lines of activity (stage transitions, approvals, returns, comment bursts).
- **Mentions badge** — "@you (3)" if the viewing manager was tagged inside any product of the collection.
- **Deadline** for the collection (if set) + at-risk indicator.
- Click anywhere on the card → opens the collection's Products page filtered to that collection.

## Top-level affordances

- **+ New collection** primary action.
- **Archive** action on each card (in a menu, not the primary surface — destructive-ish).
- Optional toggle: **Active / Archived** view.

## Visual direction

- Card grid, not a dense table — this is a portfolio dashboard, not a backlog.
- Stage distribution strip is the workhorse element on each card; it must read in under a second.
- Mentions badge is the only urgent-colored element on the card; everything else stays calm.

## Out of scope for this pass

- Multi-manager collaboration / role assignment on collections.
- Collection-level approvals.
- Cross-collection reporting / analytics.
- Templates / duplicate-from-collection.
