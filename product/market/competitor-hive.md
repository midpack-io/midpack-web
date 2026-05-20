# Hive.com — Product Analyst Feature Teardown

## Completion Coverage

| Plan Item | Status |
|---|---|
| 1. Object model | Covered |
| 2. Workflow & stage mechanics | Covered |
| 3. Versioning & file handling | Covered |
| 4. Approval mechanics + Hive Proofing | Covered |
| 5. Comments | Covered |
| 6. Permissions & collaboration | Covered |
| 7. API & integrations | Covered |
| 8. UX patterns / views | Covered |
| 9. Pricing & add-ons | Covered |
| 10. User complaints 2024-2026 | Covered (~35 quotes) |
| 11. Strategic implications | Covered |

---

## Executive Summary

**What Hive fundamentally is.** Hive is a horizontal, general-purpose project-and-collaboration platform organized around a flat task primitive ("action cards") nested inside "projects." It is sold as a unified workspace for marketing, ops, and creative teams, packaged with native chat, email-in-app, AI assistant ("Buzz"), 1,000+ integrations, six-plus project views (Kanban/Gantt/Table/Calendar/Status/Team/Label/List/Portfolio/Summary), and an unbundled "Apps" model in which features like Proofing & Approvals, Resourcing, Timesheets, Analytics, Automation, External Users, and SSO are sold as paid add-ons on top of a $12/user/month "Teams" plan.

**What they get right.** Hive Proofing & Approvals is genuinely sophisticated: multi-stage sequential approval routes, internal vs. external version visibility (V1.1, V1.2 hidden from external reviewers), side-by-side comparison of up to three versions, automatic stage advancement when all approvers in a stage sign off, external approver invitations by email without seat consumption, locking of proofs and rounds, routing templates, and a unified proofing canvas that supports PDFs, images, and video in the same tool. Action cards are flexible (custom fields, custom statuses, infinite subactions, label/phase/priority taxonomies). Forms can auto-create action cards. A documented REST API plus a v2 GraphQL endpoint and signed webhooks exist.

**Where they're weakest.** The bundle-of-files-as-the-deliverable mental model is **not** native. Files attach to action cards as proofs, but the action card itself remains the unit of work; there is no first-class "deliverable" entity that owns a heterogeneous file set across stages with handoff semantics. Stage transitions in Proofing are linear and approver-gated, but stages are owned by an approval *round* attached to a single proof, not a project-level state machine that gates the whole work item. Mobile is widely reported as weak; UI is described as cluttered and inconsistent; weekly releases reportedly introduce bugs; and the add-on pricing structure stacks up quickly. Granular per-stage permissions for external vendors do not exist outside the "external approver" mailto pattern.

**Direct match assessment.** **No.** Hive is a partial-shape neighbor, not an exact match. It has bundle-shaped *workflow* (multi-stage approval with external reviewers + versioning) bolted onto a task-shaped *object model*. A bundle-stage-approver-native competitor with first-class deliverables, granular per-stage vendor permissions, and transit-storage semantics has substantial room to differentiate.

---

## Part 1 — Object Model

Hive's hierarchy, per its own help docs (help.hive.com), is **Workspace → Project (parent) → Project (child) → Action → Subaction (infinitely nestable) → Proof (file, optional)**. The primary unit of work is the **action card**, sometimes called a "task." Action cards carry: title, description, owner/assignees (multiple), followers, due date, start date, status, priority, labels, phase, section, custom fields, attachments, subactions, comments, and (with the Proofing add-on enabled) proofs and approval routes. Custom statuses are first-class, managed in a workspace-level "Status Library" with cross-project reuse (canny.io changelog, help.hive.com). Custom fields support Selection, Text, Users, Date, Project, Formula, and Number types but, per The Digital Project Manager's hands-on review, "live within action cards, not as table columns" — a meaningful expressivity ceiling.

**Bundle of files as first-class object: no.** A "deliverable" in Hive is not modeled separately; users approximate it by creating an action card and attaching one or more proofs. Each action card can carry multiple proofs simultaneously, and proofs can be versioned beneath one another, but the *bundle as a coherent object that survives stages and moves between specialists* is not a Hive primitive. The closest approximation is: action card = deliverable container, with proofs as members and an approval round as the workflow.

**Heterogeneous file types.** PDFs, images (PNG/JPG), Microsoft Office and Google Docs files, and video are all first-class within the Proofing canvas (hive.com/features/proofing). Video and PDFs share the same comment toolbar. There is no privileged file type; however, Adobe-native files (AI/PSD) require flattening to PDF/PNG for proofing, per the Adobe Creative Cloud integration help doc.

---

## Part 2 — Workflow & Stage Mechanics

Two distinct workflow systems coexist:

1. **Action card status.** Each project has a default `Unstarted → In Progress → Completed` set; admins/full-access members can add arbitrary statuses (help.hive.com/articles/511650). Examples in Hive's own docs include "Blog publishing: unstarted → ideas → writing → editing → add images → published → social → completed." Status changes are manual drag-and-drop on the Status (Kanban) view, button-click on the action card, or automation-driven via "Automation workflows" (a paid add-on) which expose conditional buttons on cards that mutate status + labels + assignees in one click (medium.com/hive-blog, help.hive.com).

2. **Approval rounds (within Proofing add-on).** A *route* is an ordered list of stages; each stage names approvers (users, teams, or email-only externals); "when everyone in a stage has fed back and marked the document approved, the process moves automatically to the next stage" (hive.com/blog/how-to-use-the-proofing-approvals-in-hive). The approver toggles `Approve` (green) or `Request changes` (orange); rejection does not auto-advance.

**Audit log.** Hovering over a proof shows the uploader name and timestamp; the Comments Panel captures user + timestamp for every comment; the Approvals view shows route status across active projects. There is no public-facing immutable audit log endpoint documented; observability is UI-side.

**Branching/parallel.** Within one stage, multiple approvers can be required *in parallel* (all must approve before advancement). Across stages, routes are sequential — no documented conditional branching ("if marketing rejects → branch to legal"). A `Change status after approval` automation can move the parent action card to a chosen status on round completion, which is the closest Hive comes to coupling approval to a project-level state machine.

**Notifications.** Stage entry sends an email + in-app notification to the next stage's approvers; the action card surfaces an "Awaiting your approval" banner on the My Actions view.

---

## Part 3 — Versioning & File Handling

Per help.hive.com/articles/5485620 and 5489138:
- Upload a new proof while a round is in progress and the previous version is pushed into "Show previous file versions"; the new file becomes the current version.
- **Internal version proofs**: hidden from external approvers and labeled `V1.1, V1.2` etc. Regular users see all versions in a dropdown; externals only see what's been shared.
- **Side-by-side comparison** of up to three files; comparison opens in one window (no separate-screen mode).
- "No file upload limit, although your bandwidth may limit upload speed."
- **Annotation toolbar** supports shapes, text comments, search-within-document, comment position/time filtering, panes, zoom, and page navigation.
- For **video**, Hive's marketing copy explicitly highlights "videos into the same proofing portal as image, PDFs."
- **Locking**: admins and the uploader can lock a proof; admins/project owners can lock entire rounds once complete, freezing the comments panel.

Comments **persist across versions** within the same proof thread; users can also copy/paste annotation elements from one version to the next.

---

## Part 4 — Approval & Approver Mechanics

Approvers are assigned **per stage** within a route; assignment can be by Hive user, Team, or external email (no Hive account required). External approvers receive a link, can annotate/comment, and see only versions that have been shared with them. Routing can be saved as a template at the workspace level. Per help.hive.com/articles/3658407: "adding an email as an external approver will not grant them access to the action card or any of your projects."

Multi-approver semantics:
- **Within a stage:** all named approvers must approve (parallel).
- **Across stages:** sequential, automatic advancement.
- **Rejection ("Request changes"):** does not auto-advance; the round remains at the stage until a new proof is uploaded or the request is resolved.

Approval as a technical event is a button click ("Approve" / "Request changes"), captured with author + timestamp in the comments panel. Hive does **not** advertise digital signature / e-sign compliance (SOC, 21 CFR Part 11) — anyone evaluating for regulated workflows should treat this as undocumented and verify via trial.

---

## Part 5 — Comment & Discussion Mechanics

Comments are first-class objects, attached at: action card body, proof (canvas annotation pinned to coordinates/page), version-level (kept in the same thread when a new version is uploaded), and chat-group (separate messaging system). Threaded replies are supported in proof comments; the broader card comment field is flatter with @-mention support. Comments persist across version uploads. Resolved/unresolved states exist in the proofing comments panel.

External approvers can see and add comments via the share link but cannot see the underlying action card or project. Internal users get email + in-app notifications on @-mention. There is no documented "private internal comment" toggle that hides specific comments from externals on a shared proof — internal versions hide entire versions, not individual annotations.

---

## Part 6 — Permissions & Collaboration

Roles (help.hive.com/articles/4790052 and 4123714):
- **Admin** — workspace-wide; can manage apps, billing, security, custom fields, statuses, labels.
- **Full Access project member** — can edit all actions in the project.
- **Read-Only project member** — can view, comment, be assigned, but cannot edit cards (except to change action assignee).
- **External User** — single-project access; paid via the "External Users" add-on (each license bundles 5 external user seats per the pricing page).
- **External Approver** — email-only, no workspace access, no seat; only sees the proof and shared versions.

Granularity is at the **project** level for membership and the **proof** level for external approval. There is no per-stage permission model ("design vendor can only see design-stage files; pattern maker can only see pattern-stage files"). Enterprise Security (an add-on or Enterprise-only) adds SSO, granular per-project/per-action access toggles, and admin restrictions on who can create labels/statuses/priorities. The TrustRadius review thread explicitly flags "no universal Admin role — makes data governance and integrity hard to maintain" and "no visibility at an Executive Level — platform tailored to one user versus an organization" as structural weaknesses.

---

## Part 7 — Integrations & API

- **Public REST API** documented at developers.hive.com/reference (v1 and v2). Authentication is API key per user; user-scoped. The help doc "Getting Started with the Hive API" explains key generation.
- **GraphQL** endpoint exists (developers.hive.com/graphql, v1 and v2 documented).
- **Webhooks**: documented for outbound events with HMAC-SHA256 signing using an `x-hive-signature` header (sample on Hive's developer docs). Configurable from the workspace.
- **Hive Automate**: an embedded automation builder using "Actions and Triggers in Recipes."
- **Native integrations** (hive.com/integrations, help.hive.com/collections/3033940): Slack (bidirectional, slash commands to create actions), Microsoft Teams, Zoom (create meetings from chat), Google Drive, Dropbox, OneDrive, Box, Gmail/Outlook (native email-in-Hive), Google Calendar/Outlook Calendar (one-way sync), Salesforce (native, used as marketing differentiator), Jira (bidirectional issue link), GitHub (branch linking), QuickBooks (invoice creation), Adobe Creative Cloud (asset linking), Mailchimp, HubSpot, WordPress.
- **Zapier**: yes, plus 1,000+ apps reachable via Zapier per hive.com marketing.
- **Make / n8n**: not natively branded; reachable via Zapier or generic webhook.
- **Fashion-relevant gaps**: no native Shopify integration documented; no native Figma integration (workaround via Adobe CC or generic link custom field); no native WhatsApp Business integration. Adobe CC integration exists but is asset-linking, not file-format-native proofing of `.ai`/`.psd`.

Rate limits are not publicly documented; this is undeterminable without a trial.

---

## Part 8 — UX Patterns

**Views.** Status (Kanban), Gantt, Calendar, Table, Team, Label, List, Portfolio, Summary, plus Approvals view. All views share the same underlying action data; switch is one-click. Gantt supports auto-scheduling, dependencies, phases, milestones, and exports to PDF/PNG/MS Project/Excel.

**Navigation.** Left-rail Project Navigator with nested parent/child projects; top "+New" button for action creation; right-side action card detail pane. The "Apps" panel toggles features (Proofing, Automation, Goals, Forms, Timesheets, Resourcing, Portfolio, Custom Dashboards) on/off — distinctive and frequently praised for letting teams hide complexity.

**Mobile.** iOS and Android native apps exist but are widely cited as a weakness — see Part 10. Hive's own Capterra "Helpful Insights" panel notes "mobile usability is notably weaker" and "inconsistent mobile performance and frequent bugs are common drawbacks."

**Onboarding.** Hive University free training; Enterprise plan includes unlimited onboarding sessions and a Customer Success Manager. External reviewer onboarding is friction-free — they click an email link, land on the proof, no signup.

**Search.** Workspace-wide global search; in-proof text search; comment search by position/time inside proofs.

---

## Part 9 — Pricing & Packaging (as of May 2026, hive.com/pricing)

| Plan | Price | Seat cap | Storage | Key inclusions |
|---|---|---|---|---|
| Free | $0 | Up to 10 | 200MB | Unlimited tasks, notes, all views, in-app chat, email-in-Hive |
| Starter | $5/user/mo annual ($7 monthly) | Up to 10 | Unlimited | + Gantt, cloud storage integrations, calendar, AI Assistant, up to 10 projects |
| Teams | $12/user/mo annual ($18 monthly) | Unlimited members | Unlimited | + portfolios, time tracking, forms, custom fields/labels/statuses, team sharing |
| Enterprise | Contact sales | Unlimited | Unlimited | All add-ons bundled, SSO, advanced permissions, unlimited onboarding, CSM |

**Add-ons (each ~$4–$6/user/month on top of Teams; bundled in Enterprise):** Proofing & Approvals, Timesheets, Team Resourcing, Custom Dashboards, Automations (500 tasks/mo included), External Users (each license = 5 external user seats), SSO/Enterprise Security, Buzz AI (+$12/user/mo per the pricing page).

**Free trial:** 14 days, no credit card. **Nonprofit discount** on Teams. **Guest reviewers** (external approvers via email link) are free; **external users** with project access are paid via the add-on.

**Effective cost** of the "complete" creative-team configuration (Teams + Proofing + Automations + External Users + Resourcing) approaches $30–$36/user/month before any annual discount — directly relevant to a $49 vertical-priced competitor.

---

## Part 10 — User Complaint Dataset (May 2024 – May 2026)

| # | Quote / Paraphrase | Source | Date | Theme | Structural / Fixable |
|---|---|---|---|---|---|
| 1 | "If the dates for a project shift back a week, you have to manually change the date for every single action and subaction… Unless you pay for an add-on… And it probably won't work anyway." | Software Advice | 2024-2025 | Data model / pricing | Fixable |
| 2 | "Hive's weekly upgrades resulted in constant bugs, which incurred 2-5 wasted hours of each user's time weekly spent documenting and finding work-arounds." | Software Advice | 2024-2025 | Reliability | Structural (release cadence) |
| 3 | "They expect end users to beta test their unfinished software but also that they expect those end users to pay for the privilege." | Capterra (verified user, biotech) | 2024-05-22 | Reliability / pricing | Structural |
| 4 | "I frequently encounter problems and it is difficult to work out whether each problem is due to a Hive glitch or a user error because of the poor UI." | Capterra (Design, 11-50) | 2024-06-29 | UX | Structural |
| 5 | "The UI is unbelievably poorly designed with lots of inconsistencies and everything takes more clicks and time than it should. It is incredibly inaccessible for the neurodiverse." | Capterra (Head of Strategic Visualisation) | 2024-2025 | UX accessibility | Structural |
| 6 | "An unmitigated horror story of misery and despair. Completely unsuitable for managing multiple complex jobs with many moving parts." | Capterra (same reviewer) | 2024-2025 | Scalability | Structural |
| 7 | "The proofing and approvals add-on could be better than it is now if it allows for accurate frame-to-frame feedback." | G2 | 2025 | Proofing — video | Fixable (feature gap) |
| 8 | "When working on big projects, the platform can sometimes feel a little slow." | Capterra (Data Scientist, 501-1000) | 2026-02-11 | Performance | Fixable |
| 9 | "I think it is lacking some core functionality that the website/desk app has, including email and calendar connections." (about mobile) | Capterra (Legal project analyst) | 2025-09-15 | Mobile parity | Fixable |
| 10 | "The mobile app experience could use some improvement. The app is functional, but it lacks some of the features available in the desktop version." | Capterra | 2024-2025 | Mobile parity | Fixable |
| 11 | "Sometimes the notifications can get overwhelming, especially with larger teams." | Info-Tech Software Reviews | 2024-10 | Notifications | Fixable |
| 12 | "Customization could be slightly deeper too — things like automations or recurring task templates take a few extra steps to set up compared to tools like ClickUp." | G2 | 2025-2026 | Automation depth | Fixable |
| 13 | "When managing multiple large projects, the interface can feel a little heavy — it takes a few extra seconds to load dashboards with many active tasks." | G2 | 2025-2026 | Performance | Fixable |
| 14 | "Custom fields only live within action cards, not as table columns." | The Digital Project Manager review | 2024-2026 | Data model | Structural |
| 15 | "Two out of the five core features are add-ons that you'll have to pay extra for." | The Digital Project Manager | 2024-2026 | Pricing | Structural |
| 16 | "Hidden fees can arise from add-ons like proofing, goals, timesheets, team resourcing, analytics, automation, and external users, each costing an additional $5 per user per month." | ITQlick pricing analysis | 2024-2026 | Pricing | Structural |
| 17 | "No universal Admin role — makes data governance and integrity hard to maintain." | TrustRadius | 2024-2025 | Permissions / governance | Structural |
| 18 | "No visibility at an Executive Level — platform tailored to one user versus an organization." | TrustRadius | 2024-2025 | Reporting | Structural |
| 19 | "Not consistent within the product — one app might have a feature, but you cannot use that feature outside the app space." | TrustRadius | 2024-2025 | Architecture | Structural |
| 20 | "Data export option is missing. Needed file export for local backup." | TrustRadius | 2024-2025 | Data ownership | Structural |
| 21 | "Task dependencies feature is not available or not working properly. Users cannot create dependent tasks or link tasks to each other." | Capterra | 2024-2025 | Dependencies | Fixable |
| 22 | "The licensing can also grow costly for larger deployments." | Technology Evaluation Centers | 2024-2026 | Pricing | Structural |
| 23 | "Third-party integrations — Hive supports some key third-party app integrations, but lacks native integration with certain specialized tools that some teams rely on." | TEC | 2024-2026 | Integrations | Fixable |
| 24 | "The file manager does not display thumbnails, making it harder to find attachments." | The Digital Project Manager | 2024-2026 | File UX | Fixable |
| 25 | "Inconsistent mobile performance and frequent bugs are common drawbacks." | Capterra Helpful Insights summary | 2025-2026 | Mobile | Structural |
| 26 | "Some users note that it can experience lag during heavy usage." | G2 summary | 2025-2026 | Performance | Fixable |
| 27 | "Too many notifications by default." | softwareforpm.com review | 2024-2025 | Notifications | Fixable |
| 28 | "Steep learning curve for newcomers." | softwareforpm.com | 2024-2025 | Onboarding | Structural |
| 29 | "Limited project scalability on basic plan." | softwareforpm.com | 2024-2025 | Pricing tiers | Structural |
| 30 | "The mobile app could be improved for smoother access on the go." | Info-Tech Software Reviews | 2024-10 | Mobile | Fixable |
| 31 | "Hive can be a bit clunkier than other project management tools." | Gartner Peer Insights | 2024-2026 | UX | Structural |
| 32 | "While Hive offers agile planning and support, it is not robust in terms of complete project management aspect." | Gartner Peer Insights | 2024-2026 | Depth | Structural |
| 33 | "Integration difficulties." (4-star review from Product Manager, Enterprise) | G2 | 2024-10-13 | Integrations | Fixable |
| 34 | "Needed a lot of reading the manual before using the platform." | G2 | 2024-2025 | Onboarding | Fixable |
| 35 | "The most advanced and unlimited tools are included in the Teams plan… some advanced features are locked behind team plans." | thebusinessdive.com | 2025-2026 | Pricing | Structural |

**Theme frequency.** Pricing/add-ons (8), UX/UI inconsistency (7), Mobile parity (6), Reliability/bugs from weekly releases (5), Data model gaps — dependencies, custom fields in tables, data export (5), Permissions/governance (3), Performance under load (3), Proofing depth especially video (1, but echoed in Capterra's "Approval Workflow" feature ratings).

**Volunteered comparisons.** ClickUp (deeper customization), Asana/Monday (more "specialist-built" feel per softwareforpm.com), Wrike (similar proofing, cheaper), Podio (full custom build), Notion (not surfaced in 2024-26 reviews).

**Workarounds users describe.** Manual date-shifting of every subaction; using Zapier ($19.99/mo extra) for missing native integrations; opening Hive in multiple browser tabs to simulate multi-screen proof comparison; using internal version V1.x naming to hide WIP from clients; saving Approval Routes as templates because rebuild is tedious.

---

## Part 11 — Strategic Implications

### A. Mirror list

1. **Multi-stage sequential approval routes with named approvers per stage** — Hive's automatic stage advancement when all in-stage approvers sign off is exactly the bundle-stage-approver contract.
2. **External approver as a non-seat, email-only role** — preserves $49/seat economics by not charging for vendor reviewers; copy the email-link UX and the "approver doesn't see anything but the proof."
3. **Side-by-side version compare + version dropdown** scoped to a single deliverable — proven mental model creatives understand.
4. **Internal-vs-external version visibility** (V1.1, V1.2 hidden) — directly maps to fashion's "internal merch review before sending to factory" pattern.
5. **Approval routes saved as templates** at workspace level — for fashion, "T-shirt development route" or "Knit dev route" is recurring.
6. **Lock-on-completion** semantics for audit defensibility — pair with transit-export at lock.
7. **App-toggle architecture** for hiding/showing capabilities — for indie fashion, default-on the right ones and avoid Hive's "where is this setting" UX debt.
8. **Public REST API + signed webhooks (HMAC-SHA256)** — Hive's webhook signing pattern is the right baseline for an API-first product.

### B. Differentiate list

| Dimension | Hive | Competing product |
|---|---|---|
| Object model | Action card with attached proofs | **Bundle as first-class deliverable** with heterogeneous file slots per stage |
| Stage engine | Approval round attached to a proof | Project-level state machine where stage owns required artifacts + approver + permissions |
| Permission granularity | Project membership + external approver | **Per-stage role**: pattern maker sees only pattern stage; factory sees only tech-pack stage |
| File versioning | Permanent, in-app | **Transit-bound**: live during active workflow, exported to customer storage (S3/Drive/Dropbox) on close |
| API surface | REST + GraphQL exist but webhook event catalog is limited; rate limits undocumented | Documented event catalog, documented rate limits, idempotency keys, OpenAPI spec, official SDKs |
| Pricing | $12 + ~$24 in add-ons stacking; guest seats sold as 5-pack add-on | **$49 flat** with proofing/automations/externals bundled; vendor seats free; predictable for finance |
| Comment model | Coordinate-pinned on proofs; flat on cards; thread on proofs | First-class comment object attached to bundle/file/version/stage with persistent thread across iterations |
| Audit log | Implicit in UI; no public endpoint | Append-only event log, queryable via API |

### C. Gap list (features users want that Hive lacks)

- Frame-accurate video review feedback (user-volunteered as wishlist on G2).
- True task dependencies that auto-shift dates without paid Automations add-on.
- Custom fields exposed as table columns and bulk-editable inline.
- Native data export / scheduled backup.
- Executive-level cross-workspace reporting / portfolio rollups outside the Portfolio add-on.
- Mobile parity for editing, calendar, email.
- Native Shopify, Figma, WhatsApp Business connectors.
- Granular per-stage permissions for external vendors (not just per-proof-link).

### D. Trap list (resist these)

- **Bundling chat, email, calendar, notes, video, AI, and CRM into one app.** This is Hive's "tool sprawl replacement" pitch and is the root of the "UI inconsistency / too many clicks / steep learning curve" complaint cluster. An API-first transit product should integrate, not absorb.
- **Selling core workflow features as add-ons.** Drives the "hidden cost" perception; a $49/seat vertical can avoid this entirely.
- **Weekly visible releases that introduce bugs.** Users explicitly cite this. Prefer staged rollouts + feature flags.
- **Infinite subaction nesting.** Users praise it once, then complain about cluttered Calendar/Gantt. Cap depth.
- **Custom statuses without a state-machine grammar.** Hive treats statuses as labels; the resulting workflows lack guardrails. A bundle-stage product should enforce stage transitions.

### E. Direct match assessment — **NO.**

Hive is **not** an exact match to the bundle-stage-approver shape. The match breaks down on three structural dimensions:

1. **No first-class bundle.** A "deliverable" in Hive is an action card with attached proofs. Heterogeneous file types (tech pack PDF + Illustrator print artwork + production sample video + cost sheet Excel) attached to one action card are not modeled as a coherent bundle that traverses stages with handoff semantics; they are co-attached files at one point in time.
2. **Stages live on the proof, not the work item.** Hive's Approval Route gates a single proof. To approximate a true stage workflow ("design → pattern → sampling → production"), users must either chain action cards (with manual handoff and no enforced file-input requirement) or run multiple approval rounds on the same card (no enforced sequence between rounds).
3. **No per-stage external permission scoping.** "External approver" is per-proof-share, not per-stage-of-bundle. A pattern-maker vendor who should see only the pattern stage's files but contribute back a graded pattern PDF cannot be modeled cleanly.

Hive is therefore a **partial-shape neighbor**: it has approval-route DNA (good) and version-tracking DNA (good), grafted onto a generalist task tree (wrong shape).

### F. Threat assessment

| Capability | Quarters for Hive to ship | Likelihood given ICP |
|---|---|---|
| Bundle-as-first-class-object | 4–6 quarters (requires re-architecting action card → bundle, migrating schemas, retraining 1000+ integrations on a new primitive) | **Low.** Their ICP is generalist project management; user-voted roadmap (per softwareforpm.com) prioritizes incremental Buzz AI, mobile fixes, and add-on polish. |
| Transit-storage model (files leave on project close) | 2–3 quarters (technically tractable; storage is already cloud-backed) | **Very low.** Cuts against their value prop ("centralized everything in Hive forever"). |
| Vertical positioning for indie fashion | 1–2 quarters for a templated "fashion" landing page + sample workspace; 4+ quarters for fashion-specific objects | **Very low.** No public signal of vertical strategy; Salesforce + email differentiation suggests horizontal upmarket motion. |
| Frame-accurate video review + native Figma | 2–4 quarters; both are user-requested | **Medium.** This is incremental, fits their roadmap. |
| Per-stage permission granularity | 3–4 quarters (touches the core permission model) | **Low-medium.** Enterprise customers may ask for it, so possible — but expect it as an Enterprise-only feature, not democratized. |

**Bottom line.** The window in which a bundle-stage-approver-shaped, fashion-vertical, $49/seat, API-first, transit-storage competitor can establish category leadership against Hive's gravitational pull is at least **18–24 months**. Hive's threat is not that it copies the shape; it is that it competes on adjacency — a fashion brand already using Hive's Teams plan plus Proofing add-on may be unwilling to switch even to a structurally better fit. Mitigation: aggressive Hive-import tooling, side-by-side workflow comparisons in marketing, and explicit positioning ("Hive treats your tech pack like a file attachment; we treat your style as the work itself").

---

## Items Requiring Hands-On Trial to Verify

- API rate limits and pagination semantics (undocumented publicly).
- Whether GraphQL v2 mutations cover Approval Round creation (suggested by docs structure but not confirmed).
- Whether webhook event catalog includes per-stage `approval.stage.advanced` and `proof.version.uploaded` events.
- Actual video frame-comment precision (users say it's not frame-accurate; Hive's marketing says video is supported — contradiction).
- Whether internal V1.x versions are actually hidden from externals in edge cases (e.g., comparison mode).
- Mobile app feature parity gap measured against desktop.
- True external-user-add-on math: whether the "5 externals per license" applies to internal full-access licenses or only to a dedicated external-user license sold separately.

These are the dimensions where public documentation and review-volunteered facts disagree or are silent, and where a competing product team should validate before finalizing positioning claims.