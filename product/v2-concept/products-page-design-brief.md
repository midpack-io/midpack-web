# Products Page — Design Brief

Short brief for Claude Design.

## What this page is

The manager's working surface for one collection's worth of products (bundles). Lists every product in the active collection, lets the manager scan progress, dig into a single product's comments without leaving the page, and slice/sort the list to find what needs attention.

## User stories

As a manager:

- I want to see every product (bundle) in the active collection, sorted by progress.
- For each product I want to see:
  - product **name**
  - product **photo / thumbnail**
  - product **tags**
  - product **custom fields** (e.g. SKU)
  - product **deadline**
  - **number of files** in the product
  - **current stage** + its **status**
  - **stages completed** count
  - **stages remaining** count
  - **comment count**
- I want to open a product's comments **inline on this page**, without navigating away.
- I want to **filter** products by:
  - active stage (multi-select)
  - tags (multi-select)
  - custom fields
  - keyword search on name
- I want to **sort** products by:
  - readiness (completed-stage count)
  - name
- I want to **move a product from one collection into another**.
- I want to **switch collections** so I can see products from a different collection on the same page.

## What each product row/card must show

A row/card is the unit. It must surface, at a scannable density:

- Thumbnail
- Product name + tags (small pills)
- Current stage + stage status (e.g. *Review · In progress*, *Approval · Returned for rework*)
- Stage progress (e.g. `4 of 6` or a 6-segment progress bar)
- Files count · Comments count
- Deadline + at-risk indicator
- Custom-field values (1–2 most relevant — e.g. SKU)
- Quick actions: **Open comments** (inline), **Move to collection…**, **Open product**

## Inline comments behavior

- Clicking **Open comments** on a row expands a panel **next to** (or under) the row — or opens a side drawer pinned to the page — without navigating away.
- The panel shows the same comments feed as the bundle page (threads, mentions, file chips, stage tags) but scoped to this product.
- The manager can post a comment from here.
- Closing the panel returns to the full list without losing scroll position or filters.

## Top-level affordances

- **Collection switcher** at the top — dropdown — shows the active collection and lets the manager pick another.
- **Filter bar:** stage (multi), tags (multi), custom fields, keyword search.
- **Sort control:** Progress (default) · Name.
- **+ New product** action.
- **Move to collection** action — per row, or batch via row selection.

## Visual direction

- Information-dense but not a spreadsheet — readable items with the thumbnail anchoring each.
- Stage progress (a small 6-segment bar) is the second-most-scannable element after the name.
- Tags and custom-field values are quiet — they support filtering, they don't shout (use the same tags design as in header of the bundle).
- The inline comments panel should feel like it belongs to the row it opened from — not a generic modal floating on top.

## Out of scope for this pass

- Bulk edit of tags / custom fields beyond move-collection.
- Calendar / Gantt view.
- Resource allocation across products (assignee load).
- Cross-product dependencies UI.
