# Stages & Statuses

Spec for how a product's stages behave: what fields a stage has, what statuses exist, how stages lock/unlock, and how rejections flow.

## Statuses

A stage's `status` is one of:

- **To Do** — not started.
- **In Progress** — performer is working on it.
- **Done** — completed successfully. For review stages, this means approved.
- **Canceled** — terminated; no work expected.
- **Blocked** — work is paused on something external. Semantics TBD; reserved for future use.

There is no separate "In Review" status. Review is modeled as a stage, not a status (see below).

## Stage fields

Every stage has:

- `status` — one of the values above.
- `locked: boolean` — when `true`, the stage is waiting for its turn and is hidden from its performer.
- `manuallyUnlocked: boolean` — manager override. When `true`, the stage is unlocked regardless of predecessors.
- `isReview: boolean` — marks the stage as a review/approval step. Rendered with the orange visual treatment. Otherwise identical to a normal stage.
- `performer` — the person who does the work. On a review stage, this is the approver.

## Locking rule

```
locked = false  iff  (all previous stages are Done or Canceled)  OR  manuallyUnlocked = true
```

- Stages auto-unlock when their predecessors finish.
- A manager can manually unlock a stage to bypass the rule (no role system yet — keep the override field anyway).
- `manuallyUnlocked` is the *override*; `locked` is the *current state*. Both are stored so queries like "stages this user can start" don't have to walk dependencies. How they stay in sync on mutations is a later concern — for now we only design the data shape.

## Review stages

A review is just a stage with `isReview: true`. It uses the same statuses as any other stage:

- **Done** on a review = approved.
- **Canceled** on a review = review skipped/abandoned.
- Rejection is not a status — see below.

This lets reviews compose naturally: multiple sequential reviews, optional reviews, etc. all fall out of the existing stage model.

## Rejection flow

When a reviewer rejects:

1. Review stage → `status: To Do`. `manuallyUnlocked` is preserved as-is — if the manager bypassed the rule before, that intent survives the rejection. `locked` follows from the rule: if `manuallyUnlocked` was `true`, the review stays unlocked; otherwise it relocks until the prior stage hits `Done` again.
2. The prior stage (the one whose output was rejected) → `status: In Progress`.

## Accent colors

Active stages render with one of four accent colors on the pill (shell border, status icon, inline status chip). A stage is **active** when it is neither `locked` nor `done` nor `canceled`; locked/done/canceled stages drop the accent and render in a neutral resting style.

| Accent | Applies to                              |
| ------ | --------------------------------------- |
| Orange | Review stages (`isReview === true`)     |
| Blue   | Non-review stages with `in-progress`    |
| Red    | Stages with `blocked`                   |
| Grey   | Non-review stages with `to-do`          |

`isReview` wins over status — a to-do or in-progress review stage is orange, not grey/blue. The inline chip (when shown) carries the same accent and its label is the real status (`To Do`, `In Progress`, `Blocked`).

## Out of scope (for now)

- Mutation logic — who recomputes `locked` and when. Decided later; for stage-1 mocked data we only define the shape.
- Roles & permissions — there's no user-role system yet. The "manager can override" rule is documented but not enforced.
- Rejection history (`reopened_count`, event log) — deferred until something needs it.
- `Blocked` status semantics — field exists, behavior TBD.