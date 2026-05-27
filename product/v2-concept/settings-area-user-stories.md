# Settings Area — User Stories

Stories for the workspace settings area at `/settings/*` (see `product/page-structure.md` §3–4). Covers the shell + each sub-page. Member-management stories live separately in [`members-page-user-stories.md`](./members-page-user-stories.md) and are linked from here, not duplicated.

## What this area is

The workspace's admin and configuration surface. Two scopes share one area:

- **Workspace scope** — affects everyone in the brand (members, billing, workflows, integrations, transit destination, brand identity). Manager-only for edits; performers see read-only summaries where useful.
- **Personal scope** — affects only the signed-in user (their profile, notification preferences). Every user can edit their own.

This is not a daily-work surface. It's where you go on first setup (per `page-structure.md` Phase 2) and a few times a season after that.

## Permissions

- **Manager** — full read/write across workspace and personal scope.
- **Performer** — read-only on workspace scope (member list, current plan, workflow templates); full read/write on their own personal scope.

A performer who opens a workspace-scope page sees the same content as a manager but with edit affordances hidden and a quiet "Only managers can change this" line.

## Navigation / shell

As a user:

- I want a left-rail nav inside settings grouped into **Workspace** (general, members, billing, workflows, integrations, transit & export) and **Account** (profile, notifications) — so I know which scope I'm in before I change anything.
- I want the current section highlighted and the page title to match the nav label — so I never wonder where I am.
- I want a back-to-app link at the top of the rail — so leaving settings is one click, not a browser-back guess.

As a manager landing on `/settings` for the first time:

- I want to land on **General** with a checklist of "things to finish setting up" (invite team, set transit destination, attach billing, create or pick a workflow template) — so the Phase-2 setup arc from `page-structure.md` is visible, not folklore I have to remember.

## Sub-pages

### General — `/settings/general` (new)

Workspace identity. Not in `page-structure.md` yet; flagged as a gap.

As a manager:

- I want to set the **workspace (brand) name** and **logo** — so the app's top-left chrome and any exported handoff packets show the brand, not a placeholder.
- I want to set the **default timezone** for the workspace — so deadlines and "stuck > 7 days" calculations use one shared clock, not each viewer's local time.
- I want to set the **default workflow template** for new collections — so creating a collection doesn't always ask "which workflow?".
- I want to delete the workspace (with a typed-name confirm) — so trial cleanup or brand shutdown is possible without a support ticket.

### Members — `/settings/members`

See [`members-page-user-stories.md`](./members-page-user-stories.md) — invite, watch, change role, deactivate, reactivate.

### Billing & plan — `/settings/billing`

Self-serve per `vision.md` ($49/seat on the homepage, no sales call).

As a manager:

- I want to see the **current plan, seat count, and next invoice amount** above the fold — so the "what am I paying?" question is a 5-second glance.
- I want to attach or update a payment method — so trial → paid is one form, not an email handoff.
- I want to download past invoices as PDF — so finance has what they need without me forwarding emails.
- I want to see seats used vs. seats paid — so I know whether my next invite will trigger a charge.
- I want to cancel the subscription with a typed confirm — without scheduling a call.
- I want to see when the trial ends and how many seats are included — so I'm not surprised when billing kicks in.

As a performer:

- I want to see the workspace's current plan name and seat usage (read-only) — so I know whether asking for more invitations is a free or paid decision.

### Workflow templates — `/settings/workflows` and `/settings/workflows/[id]`

High-level stories only. Detailed brief is `page-structure.md` §4.

As a manager:

- I want to see all workflow templates in the workspace with **how many active products use each** — so I know the blast radius of any edit.
- I want to clone a template and edit the clone — so I can iterate without breaking active collections.
- I want to delete a template only if no active product uses it — so I can't silently break in-flight work.

### Integrations — `/settings/integrations`

MCP server endpoint, webhooks, Zapier (per `page-structure.md` §3).

As a manager:

- I want to copy the **MCP endpoint URL and auth token** with a one-click copy button — so wiring it into Claude Desktop or Cursor is paste-once, not multi-step.
- I want to regenerate the MCP token — so a leaked or shared token can be rotated without losing the endpoint.
- I want to add a **webhook URL** for stage-transition events with a payload preview and a "send test event" button — so I can integration-test before pointing it at production.
- I want to see the last delivery status and timestamp for each webhook — so failures are visible without checking the receiving system.

As a founder:

- I want the MCP setup to fit in one screenshot — so I can paste the endpoint into Claude Desktop in the same minute I copied it.

### Transit & export — `/settings/transit-export`

Where bundles land when a collection ships. Pillar 5 from `vision.md` ("transit storage").

As a manager:

- I want to connect the brand's **own Google Drive / Dropbox / SharePoint** once — so when a collection ships, files leave us and become the brand's archive, not ours.
- I want to set the folder structure (e.g. `/{Season}/{Style}/`) — so the brand's existing archive convention is respected.
- I want a "dry-run" preview — what would be exported if I shipped collection X right now — so I can verify the destination before it matters.
- I want to see when the destination was last successfully reached — so a broken token doesn't surprise me at ship time.
- I want to be notified (in-app and email) if the destination starts failing — so I fix it before the next ship.

### Account — `/settings/account` (new, personal scope)

As any user:

- I want to set my **display name and avatar** — so mentions and assignee chips show me, not "M.H.".
- I want to see which Google account I signed in with — so I know which to use if I sign out and back in.
- I want to sign out from this device — without browser cookie hunting.
- I want to see all active sessions (device, last seen, IP city) and revoke any of them — so a forgotten sign-in on a borrowed laptop is fixable from my phone.

### Notifications — `/settings/notifications` (new, personal scope)

As any user:

- I want to choose which events trigger an email: @mention · stage transition I'm the approver on · returned-for-rework on a bundle I authored · weekly digest. Default sensible (mentions + my approvals on).
- I want a **quiet hours** window (e.g. 19:00–08:00 local) — so the app doesn't send me email at night during fit-review week.
- I want a one-click "mute all email for 7 days" — so vacation mode is a single click, not 12 toggles.
- I want a preview of "what would I have received yesterday under these settings?" — so the toggles aren't abstract.

## Out of scope for this pass

- **SSO / SAML / SCIM** — Google OAuth only at this stage (`page-structure.md` §2).
- **Custom roles** beyond Manager / Performer.
- **Teams / groups / sub-brands.**
- **API keys / personal access tokens** for the REST API — MCP token only at this stage.
- **2FA / security policies** — relies on the Google account's own 2FA.
- **Per-workspace data residency** choices.
- **Workspace transfer** between owners (handled out-of-band for the prototype).
- **Brand-wide audit log** — lives at top-level `/audit` (`page-structure.md` §13), not inside settings, deliberately.
- **Library of shared components** — top-level `/library` (`page-structure.md` §5), not inside settings — it's daily-work surface, not config.
