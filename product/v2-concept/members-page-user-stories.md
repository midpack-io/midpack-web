# Members Page — User Stories

Stories for the people/users management surface at `/settings/members` (see `product/page-structure.md` §3).

## What this page is

The manager's surface for inviting, watching, and removing the people who collaborate inside the workspace. Covers internal seats only; persistent external partners (scoped reviewers) and one-off handoff-packet recipients live in separate flows (`page-structure.md` §10–12).

## Permission types

Two roles cover everyone with a workspace seat:

- **Manager** — invites people, configures workflows, approves stage transitions, sees the brand-wide audit log.
- **Performer** — works inside bundles assigned to them: uploads files, comments, advances stages they're authorized for. Cannot manage members or edit workflow templates.

A person has exactly one role at a time. A manager can change anyone's role; a performer can only see the member list (read-only).

## Lifecycle states

Every member is in exactly one state:

- **Invitation pending** — invited, hasn't signed in yet.
- **Active** — accepted the invitation, can sign in and work.
- **Deactivated** — can no longer sign in or be assigned, but authored comments, files, and audit-log entries stay intact and attributed.

## User stories

### Inviting people

As a manager:

- I want to invite someone by email, pick their role (manager or performer), and send the invitation in under 30 seconds — without IT involvement.
- I want to invite multiple people at once by pasting a list of emails — so I can onboard the new season's freelancers in one pass.
- I want the invited person to appear in the list immediately with an **Invitation pending** status — so I can see who I've invited and what's outstanding without checking my sent folder.
- I want to see when the invitation was sent and when it expires — so I know whether to nudge or resend.
- I want to resend an unaccepted invitation — in case the email got lost.
- I want to revoke an unaccepted invitation — in case I picked the wrong address or the person isn't joining after all.

### Watching status

As a manager:

- I want to see, for every member: avatar/name, email, role, status, last activity, and how many bundles they're currently the approver or assignee on — so the page answers "who's actually doing what" without drilling in.
- I want to filter by status (pending · active · deactivated) and by role (manager · performer) — so I can answer "who hasn't accepted yet?" or "how many managers do we have?" in one click.
- I want to search by name or email — so I can find a specific person in a 40-seat workspace.
- I want to sort by last activity — so I can spot dormant accounts before billing renewal.
- I want a separate view (or toggle) for **Deactivated** members — so the long-term archive doesn't clutter the working list, but I can still find a past collaborator when I need to.

As a performer:

- I want to see the same member list (read-only) — so I know who to @mention and what role they hold, without bothering a manager.

### Assigning permission type

As a manager:

- I want to change a person's role from performer to manager (or vice versa) inline from the list — so promotions or scope changes don't require deactivating and re-inviting.
- I want a confirm step before promoting someone to manager — because the role grants destructive permissions (workflow edits, member deactivation).
- I want to set the role at invitation time — so new joiners land in the right scope on first sign-in.

### Deactivating

As a manager:

- I want to deactivate a person who left the team — so they can no longer sign in or be assigned to new stages.
- I want their authored comments, file uploads, and audit-log entries to stay intact and attributed after deactivation — so historical context survives turnover.
- I want to see, before I confirm deactivation, the count of bundles where they're the current approver or assignee — and be required to reassign those before the deactivation goes through — so in-flight work isn't silently blocked.
- I want to reactivate a previously deactivated person — in case they return next season — without re-inviting from scratch.

### Self-protection

As a manager:

- I want to see myself in the list with a "you" marker — so I don't accidentally act on my own row.
- I want to be blocked from deactivating or demoting myself if I'm the last remaining manager — so the workspace can't be locked out by a single action.

## What each member row must show

- Avatar + name (or email if name not yet set, for pending invitations).
- Email.
- **Role chip** — Manager · Performer.
- **Status chip** — Invitation pending · Active · Deactivated. Pending is the only urgent-colored chip; deactivated is muted.
- **Last activity** — relative time ("2 hours ago"); "Never" for pending invitations.
- **Open assignments** — count of bundles where they're the current stage's named approver or assignee. Clickable → filtered bundle list.
- **Row menu actions** (conditional on state):
  - Pending: **Resend invitation**, **Revoke invitation**, **Change role…**
  - Active: **Change role…**, **Deactivate**
  - Deactivated: **Reactivate**

## Top-level affordances

- **+ Invite people** — primary action; opens a dialog with email field(s) + role selector.
- **Filter bar:** status (multi-select), role (multi-select).
- **Search:** name or email.
- **Sort:** Name · Role · Last activity · Status.
- **View toggle:** Active / Deactivated.

## Out of scope for this pass

- Inviting persistent external partners (scoped reviewers) — separate flow per `page-structure.md` §12.
- One-off handoff-packet recipients — separate flow under bundle pages (`page-structure.md` §10).
- Per-stage permissions and approver assignment — lives in workflow templates (`page-structure.md` §4).
- Teams / groups — flat membership list only.
- SSO / SCIM provisioning — Google OAuth only at this stage (`page-structure.md` §2).
- Granular audit log of admin actions on members — covered by the brand-wide audit page (`page-structure.md` §13).
- Bulk role changes or bulk deactivation.
- Custom roles beyond Manager / Performer.
