# Stage Component — User Stories & States

Scope: the component on the bundle page that represents a single stage in the workflow.

## User Stories

### As a stage assignee (performer)
- I want to know who is assigned as Approver on my stage.
- I want to know if my stage requires an approver — who they are, or that none is assigned yet.
- I want to know that my stage has been sent back for rework, and see who returned it and why.
- I want to return the work to a previous stage with an explanation.
- I want to send my stage for Approval.
- I want to hand off the work to the next stage.
- I want to control the status of my stage.
- I want to see the status of other stages.
- I want to see when the workflow branches into parallel stages at certain segments.

### As a manager (bundle owner)
- I want to restart work on a completed stage.
- I want to assign or replace the performer on a stage.
- I want to assign one or more approvers on a stage (or replace existing ones).
- I want to add a stage dynamically while work on the bundle is already in progress.
- I want to cancel a stage by setting its status to Canceled.
- I want to manage each stage's deadline (add, change, remove).
- I want to see the iteration history of a stage when it has been returned from a later stage or an approver more than once.
- I want to add custom fields to the bundle for internal needs (e.g. SKU).

---

## Stage States the Component Must Express

### 1. Lifecycle status (mutually exclusive)
- **Not started** — upstream stages not yet complete; stage is queued.
- **Ready** — upstream complete, no performer has started work.
- **In progress** — performer is actively working.
- **In review** — submitted, awaiting approver decision.
- **Returned for rework** — sent back by approver or a later stage; shows who + reason.
- **Approved / Done** — closed successfully, work flows downstream.
- **Canceled** — manually removed from the active path.
- **Reopened** — previously Done, restarted by manager (visually distinct from a fresh "In progress").

### 2. Role assignment states
- Performer: **assigned** / **unassigned** / **multiple** (if supported).
- Approver: **not required** / **required & unassigned** / **assigned (1)** / **assigned (multiple)**.
- "You are the performer" / "You are an approver" / "You are observer" — viewer-relative emphasis.

### 3. Workflow topology states
- **Linear** — single predecessor, single successor.
- **Branch point** — fans out to parallel stages.
- **Merge point** — waits on multiple predecessors.
- **Parallel sibling** — running concurrently with other stages at the same level.

### 4. Iteration state
- **Iteration counter** (e.g. "Iteration 3 of N") visible when > 1.
- **Has returns history** — expandable list of prior return events (who, when, why).

### 5. Deadline states
- **No deadline set.**
- **Upcoming** (within set threshold).
- **At risk** (close to due).
- **Overdue.**
- **Met** (closed before deadline) / **missed** (closed after).

### 6. Action affordances (visibility depends on role + status)
- Performer: Submit for approval · Hand off to next · Return to previous · Change status.
- Approver: Approve · Return with reason.
- Manager: Assign/replace performer · Assign/replace approvers · Set/change/remove deadline · Cancel · Restart · Insert new stage before/after.

### 7. Custom-field surface
- Slot for bundle-level custom fields (SKU and similar) — read-only on the stage card, editable from the bundle header.
