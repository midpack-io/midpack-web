# Notifications — the per-user inbox

A single place where everything that happened *and is addressed to me* lives: mentions, review requests, approvals and returns, stage moves on products I follow, deadline warnings, shared-file bumps, handoff-packet activity. Time-ordered, per-recipient, with read/unread state. The in-app destination behind the top-bar bell.

This spec is the brief for design. It defines vocabulary, the trigger catalog, user stories, behavioral requirements, screen states, and open questions. It is a sibling to [`library.md`](./library.md). Data shapes referenced live in [`schema.aml`](./schema.aml) (`activity`, `comments`, `comment_mentions`, `product_stages`, `files`) plus a proposed per-recipient `notifications` table (§9).

---

## 1. Context & relationship to existing surfaces

There are four surfaces in this neighbourhood. They are **not** the same and must not collapse into each other:

| Surface | Route | What it is | Read/unread? |
| --- | --- | --- | --- |
| **Notifications inbox** *(this spec)* | `/notifications` (+ bell panel) | The event stream addressed to me, across all collections. Discrete things that happened. | Yes — per recipient. |
| **Worklist** | `/worklist` (placeholder) | The current *state* of my obligations — "stages waiting on you" right now. Derived; recomputes as work moves. | No — it's a live cut, not a log. |
| **Notification preferences** | `/settings/notifications` (placeholder) | What I want to be notified about and on which channels (in-app / email / digest). | n/a |
| **Activity feed** | per-collection / per-product | The objective log of everything that happened to an entity, for everyone. Not personalised. | n/a |

> **The distinction design must hold:** a **notification** is an *event* ("Olena returned Style 249 to you", read/unread, timestamped); a **worklist item** is a *state* ("Style 249 techpack is in progress and assigned to you"). One returned-review event can produce **both** — a notification (it just happened) and a worklist entry (now there's work). The inbox is the log; it should link *into* the worklist/product, not re-implement it. Don't build a second worklist.

> **Drift to confirm:** there is no notifications inbox in [`page-structure.md`](../page-structure.md) — the 13 listed pages skip it, and the bell in `top-bar.tsx` has no destination. Adding `/notifications` updates that doc.

---

## 2. Vocabulary

- **Notification** — a per-recipient record that an event relevant to me occurred. Has an actor, a verb, a target (product / collection / comment / file / stage / handoff packet), a timestamp, and a read state.
- **Recipient** — the user the notification is delivered to. The same underlying event fans out to several recipients (a mention notifies the mentioned person; a stage move notifies followers).
- **Actionable vs informational** — some notifications imply work I must do (review requested, work returned to me, I was assigned a stage); the rest are FYI (a stage moved, a product was created, a packet was opened). This split drives grouping (§6) and the worklist relationship.
- **Following** — I receive FYI notifications for products I own, performed work on, commented on, or explicitly follow. (Exact "follow" rule is an open question — §9.)
- **Coalescing** — multiple same-kind events on the same target collapse into one row ("3 new comments on Style 247") so a busy thread doesn't flood the inbox.

---

## 3. Trigger catalog

Each row is an event that produces a notification. "Kind" = Action (implies work) or FYI. "Lands on" = where clicking deep-links.

| Event | Recipient(s) | Kind | Lands on | Source |
| --- | --- | --- | --- | --- |
| You were **@mentioned** in a comment | mentioned person | Action | the exact comment (even if the file moved to a new version) | `comment_mentions` |
| **Reply** in a thread you're in / reply to your comment | thread participants | FYI | the reply | `comments.parent_id` |
| A comment thread you're in was **resolved** | participants | FYI | the thread | `comments.status` |
| You were **assigned** as performer of a stage | new performer | Action | the stage on the product | `product_stages.performer_id` |
| A **review stage you perform** became active (review requested) | reviewer (performer of review stage) | Action | the review stage | `product_stages` + `workflow_stages.is_review` |
| Your work was **approved** (review → Done) | performer of the prior stage | FYI | the product | rejection/approval flow, [`stages-and-statuses.md`](./stages-and-statuses.md) |
| Your work was **returned / rejected** (review returns; prior stage → In Progress) | performer of the returned stage | Action (high signal) | the stage to redo | stages-and-statuses §Rejection flow |
| A stage **moved** on a product you follow | followers | FYI | the product at that stage | `activity` kind=move |
| A stage became **blocked** | performer + followers | FYI* | the blocked stage | `product_stages.status=blocked` |
| A **deadline** went upcoming / at-risk / overdue / missed | stage performer + product owner | Action when overdue/missed | the stage | `product_stages.deadline_kind` |
| A **linked file component** you depend on got a new version at source | owners/followers of bundles pinned to the old version | FYI | the file in the bundle, with "bump to vN?" | `files.link_source_*`, mirrors the `linked` system comments |
| A **handoff packet you sent** was opened, or an external comment came back to the bundle | the sender | FYI | the packet / the returned comment on the bundle | vision pillar 4 |
| A **new product** was created in a collection you follow | collection followers | FYI | the new product | `activity` kind=create |

\* `blocked` semantics are TBD (`stages-and-statuses.md` §Out of scope) — treat as low-priority FYI until defined.

**Scoped external partners** (persistent, account-less) receive a tiny scoped subset — e.g. "a stage you're cleared for opened" (page-structure №12) — never internal-only events. **One-off pin-code reviewers** get no inbox (no account).

---

## 4. Access & personas

- **Primary:** every internal member — Марта (tech designer, lives in mentions + assignments + returns), Олена (head of design, watches approvals owed and downstream blocks), founder / production lead (a thin slice: "4 things waiting on me", "styles that just hit ready-to-production").
- **Secondary:** scoped external partners — minimal, stage-scoped subset only.
- **Out:** one-off pin-code reviewers.

Personalisation is the whole point: the founder's inbox is 4 rows a week; Марта's is the busiest. The same page must read well at both volumes.

---

## 5. Information architecture

Two entry points, one model:

1. **Bell panel** (top bar) — a dropdown showing the most recent N, an unread count badge, "mark all read", and a link to the full page. Fast triage without leaving the current screen.
2. **`/notifications` full page** — the complete, filterable, grouped history.

On the full page:

- **Grouping by time:** Today / This week / Earlier. (Alternative: group by Needs-action vs FYI at the top — see §9.)
- **Filters:** unread only; by kind (Mentions / Assigned to me / Reviews / Status changes / FYI); by collection.
- **Row anatomy:** actor avatar, one-line summary (actor + verb + target), the collection/product context, relative timestamp, unread dot, optional inline action (e.g. "Open review", "Bump to v3", "Mark read"), and an overflow (mark unread, mute this thread/product).
- **Coalesced rows** expand to show the constituent events.

---

## 6. User stories

### 6.1 Cross-cutting

- As an internal member, I want one place that shows everything addressed to me across all collections, so that I'm not scanning each collection's activity feed to find what concerns me.
- As an internal member, I want a clear unread count on the bell, so that I know at a glance whether anything needs me without opening anything.
- As an internal member, I want to triage from the bell panel without navigating away, so that I can clear noise between tasks.
- As an internal member, I want each notification to deep-link to exactly where the event happened — the specific comment, the specific stage — so that acting on it is one click, not a hunt (mirrors the worklist "open the blocked item and land inside the stage" story).
- As an internal member, I want to mark items read/unread and "mark all read", so that the inbox reflects what I've actually dealt with.
- As an internal member, I want to mute a noisy thread or product, so that a chatty bundle stops dominating my inbox while I still get mentions.
- As an internal member, I want busy threads coalesced ("3 new comments on Style 247"), so that one active conversation doesn't bury everything else.
- As an internal member, I want a link to notification preferences from here, so that I can turn down a category that's too loud without leaving the inbox.

### 6.2 Mentions & comments

- As a tech designer, I want an immediate, prominent notification when I'm @mentioned, so that a question directed at me doesn't sit unseen in a thread for a day.
- As a reviewer, I want the mention to land on the comment with full context even after the file rolled to a new version, so that "still open from v2" feedback is one click away (vision pillar 3).
- As a participant, I want to know when someone replied in a thread I'm in, so that I don't have to keep re-opening the bundle to check.

### 6.3 Assignments, reviews, approvals & returns

- As a performer, I want to be notified the moment a stage is assigned to me or unlocks for me, so that I start without waiting for someone to ping me in Slack.
- As a reviewer, I want a clear "review requested" notification when a review stage I own goes active, so that approvals don't stall because I didn't know it was my turn — directly attacks the "is Style 247 approved?" delay.
- As a performer, I want a high-signal notification when my work is **returned**, landing on the stage I need to redo, so that a rejection doesn't lose two days between Thursday and Monday.
- As a performer, I want a quieter "approved" notification when my work passes, so that I get the confirmation without it competing with action items.

### 6.4 Status, deadlines & shared files

- As a head of design, I want to be notified when a stage on a product I follow moves, so that I can keep a season on calendar without opening every bundle.
- As a performer, I want escalating deadline notifications (upcoming → at-risk → overdue), so that I can intervene before a stage misses, not after.
- As a tech designer, I want to know when a linked component I depend on got a new version at source, with a one-click "bump", so that I decide whether to take v4 instead of finding out a sample shipped on v2.

### 6.5 External collaboration

- As a tech designer, I want to be notified when the factory opened the handoff packet I sent, so that I know they saw the update without asking on WhatsApp (vision pillar 4).
- As a head of design, I want external reviewer comments that come back to a bundle to surface in my notifications, so that off-platform feedback still reaches me in one place.

### 6.6 Managing volume

- As a founder, I want my inbox to show only the few things that genuinely need me, so that I'm not wading through every team event to find the 4 approvals I owe.
- As an internal member, I want to filter to "just mentions" or "just assigned to me", so that I can clear the action items first and skim FYI later.

---

## 7. Functional requirements

### 7.1 Read/unread model

- Read state is **per recipient**, not per event — it can't live on the shared `activity` row. Each delivered notification carries its own `read_at` (§9).
- Marking read in the bell panel and on the full page stay in sync. "Mark all read" clears the unread count immediately (optimistic), reconciling with the server.
- Opening the target via a notification marks that notification read.

### 7.2 Unread counts

- The bell shows a total unread count. Per-collection unread (the existing `collections.unread_mentions` aggregate) should be derivable from the same data so the rail and the inbox never disagree.
- Counts reflect *active* context only — events on products in archived collections don't accrue unread weight (consistent with the library spec's "active = non-archived collection" rule).

### 7.3 Coalescing

- Same-kind events on the same target within a window collapse into one row with a count and the latest timestamp; expanding shows constituents. Mentions are **never** silently coalesced away — each mention is individually visible (it's directed at the person).

### 7.4 Deep-linking

- Every notification has a precise target. Comment targets resolve to the comment even across file versions. Stage targets open the product focused on that stage. Packet targets open the packet view.

### 7.5 Delivery channels (boundary)

- This page is the **in-app** inbox only. Email / digest / push delivery and per-category opt-outs are configured in `/settings/notifications` and are out of scope for this page's UI beyond a link to that page.

### 7.6 Muting

- Muting a thread or product suppresses FYI notifications from it but **not** direct mentions or direct assignments/returns to me. Muting is reversible and listed somewhere discoverable.

---

## 8. Screen states (first-class, per CLAUDE.md)

- **Loading** — skeleton rows in both the bell panel and the page.
- **Empty (all-time)** — "Nothing yet" with a one-line explanation of what shows up here.
- **Empty (all caught up)** — distinct from all-time empty: "You're all caught up" after everything's read.
- **Error** — inline, retryable; a failed fetch must not blank the bell badge into a wrong "0".
- **End of list** — clear bottom; paginate/virtualise long histories.
- **High-volume** — Марта's inbox with coalescing and filters working; the founder's 4-row inbox reading calm. Design both extremes.

---

## 9. Data note & open questions

**Data note — proposed `notifications` table.** Read/unread is per-recipient, so it can't sit on the shared `activity` row. Propose materialising a fan-out table (add to `schema.aml`):

```
notifications
  id uuid pk
  recipient_id uuid -> people(id)
  type notification_type            # mention, reply, assigned, review_requested, approved, returned, stage_moved, blocked, deadline, component_bumped, packet_opened, product_created, ...
  actor_id uuid nullable -> people(id)
  collection_id uuid nullable -> collections(id)
  product_id uuid nullable -> products(id)
  comment_id uuid nullable -> comments(id)
  file_id uuid nullable -> files(id)
  workflow_stage_id uuid nullable -> workflow_stages(id)
  created_at timestamp
  read_at timestamp nullable        # null = unread
```

Open questions:

1. **Needs-action vs FYI as the top-level split** (instead of, or in addition to, time grouping)? It would tighten the worklist relationship but risks duplicating it.
2. **"Following" rule** — auto-follow products I own / performed on / commented on, plus an explicit follow toggle? What's the default that keeps the founder's inbox at 4 rows and Марта's complete?
3. **How much overlap with the worklist is acceptable** before it feels redundant — do action-implying notifications dismiss when the underlying worklist item is done?
4. **Bell panel vs full page split** — what lives in the panel (recent + mark-all-read only?) vs the page (filters, history, mute management).
5. **Coalescing window** length and which types are eligible (definitely comments; probably stage moves; never mentions).
6. **Scoped external partner inbox** — do persistent partners get a real `/notifications` page (scoped) or just email? (Ties to vision pillar 4.)

---

## 10. Out of scope (v1)

- Channel delivery and per-category preferences (those live in `/settings/notifications`).
- Reimplementing the worklist or the per-entity activity feed here.
- Notification analytics / "who read what".
- One-off pin-code reviewer notifications (no account).
- Cross-brand / cross-workspace aggregation.
