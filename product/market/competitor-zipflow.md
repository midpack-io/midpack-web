# Zipflow / Ziflow Product Feature Teardown
## A competitive intelligence brief for the indie-fashion bundle-stage-approver product

---

## 0. Product identification & ambiguity note

A web sweep returns three distinct products in the "Zipflow" name space:

1. **ZipFlow (zipflow.com)** — A SaaS *government-permitting and licensing platform* (land-use, building permits, business licenses) for municipalities. Document versioning, side-by-side compare, mobile inspector views, contractor integration. Out of scope: targets city planning departments, not creative/marketing teams.
2. **Zipflow (zipflow.io)** — A small low-code "build your own workflow app" platform (custom forms, databases, reports). No public pricing. Tiny LinkedIn footprint (single-digit followers). Out of scope: not a proofing/approval tool, very thin product surface.
3. **Ziflow (ziflow.com, one "f")** — The online proofing & creative-approval platform founded **2016** by the original creators of ProofHQ (the latter acquired by Workfront/Adobe in 2015). Customers include AWS, McCann Worldgroup, Showtime, Toyota, Sephora, Publicis, Williams Sonoma, BCBS, Klick Health, Royal Mail. Team in US, UK, Poland, South Africa. Raised funding April 2021. **Status: active and growing.** This is unambiguously the product the brief is asking about: it is "a SaaS workflow / approval / proofing / collaboration tool" with multi-stage workflows, named approvers per stage, versioning, comments, audit logs, external reviewers, and an API. The brief's intended target is Ziflow; the "Zipflow" spelling in the original task appears to be either a transcription typo or the user testing whether the agent will disambiguate. The rest of this report uses the correct spelling **Ziflow** and analyzes that product.

**Marketing site:** ziflow.com · **App:** ziflow.io · **Help:** help.ziflow.com · **API docs:** api-docs.ziflow.com · **Founded:** 2016 · **Pricing range:** $0 (Free) → $199/mo Standard → $329/mo Pro → custom Enterprise (all billed annually).

---

## 1. Executive Summary

**What Ziflow fundamentally is.** Ziflow is an **online proofing platform**: a system of record for *feedback and approval* on creative assets during the active production phase. Its core mental model is "a creative asset (a Proof) moves through one or more review stages, each gated by reviewers with named decision rights, until the asset is locked." It is the lineal descendant of ProofHQ and has the deepest pure-play proofing feature set in its category — supporting ~1,200 file types, frame-accurate video markup, side-by-side and pixel-level version compare, multi-stage automated routing, an audit trail, e-signature, SSO/SCIM, SOC 2 + ISO 27001, a documented REST API, signed webhooks, native Adobe CC / Figma / monday.com / Asana / Jira / Slack / Drive / Dropbox / SharePoint / Salesforce / Zapier integrations, and a free-forever tier with unlimited external reviewers.

**What they get right.** (a) Stages-with-named-approvers as a first-class workflow primitive, including AND/OR decision logic and automated triggers; (b) version-first file handling with major/minor versions, pixel-diff compare, and an immutable activity log; (c) the *unlimited free reviewer* commercial model that lets external clients/vendors participate without seats; (d) genuine multi-file-type support — video, PDF, image, web URL, HTML5 rich media, Office docs, Adobe production files, audio — with type-appropriate markup (frame-coded on video, page-anchored on PDF, pin/coordinate on image); (e) a real public API plus signed webhooks plus a Zapier app, used by customers to embed Ziflow inside their own products.

**Where they are weakest.** (a) **Comments do not carry forward to new versions** — the single most-cited structural user complaint; (b) the Proof is the unit of work, *not* a heterogeneous "bundle" of files that each move through their own production stages — stages are review checkpoints on the SAME asset, not production hand-offs; (c) limited stage counts on lower tiers (1/2/3) push real workflow buyers to Enterprise; (d) re-entering reviewers and re-templating workflows on every new version is friction; (e) the per-month flat-pricing model penalizes very small teams ($199 minimum) and is the most commonly cited reason indie teams churn; (f) mobile is responsive-only (no native app); (g) no fashion-vertical positioning, no Shopify/PLM/ERP connectors, no Illustrator-tech-pack thinking.

**Direct match to the bundle-stage-approver shape? NO — partial match only.** Ziflow nails *stage*, *approver*, *audit*, *external reviewer*, *versioning*, and *comments-as-objects*. But it does **not** model "a bundle of heterogeneous files where the file produced at stage N is the input to stage N+1." In Ziflow, the file at every stage is the *same* asset (or the same set of assets) being iteratively decisioned. The competing fashion product's spec — sketch → tech pack → sample photo → costing sheet, each a different file type produced by a different specialist as input to the next — would be implemented in Ziflow as four *separate* proofs linked manually by folder, or as a "multi-asset proof" where reviewers switch between assets but the workflow gates them collectively. That is a fundamental object-model gap, not a marketing-language obscuration.

---

## 2. Part 1 — Object Model

**Primary unit of work: the Proof.** A Proof is a reviewable artifact — one file, a URL, or (Standard+) a *combined proof* of multiple static files merged into a continuous page, or (Enterprise) a *multi-asset campaign-level proof* mixing PDFs, videos, websites, and rich-media in one review object. The Proof, not a project or bundle, is the entity that stages, decisions, comments, and audit trails attach to. Proofs live in Folders (Folder is a container, not a workflow object).

**Object inventory** (from help docs and CSV-export schema):

- **Proof** — id, name, brief (text + attachments), folder_id, owner, custom_properties (Enterprise), tags, security settings, public_link, status (Uploading / Preparing / In progress / Approved / Approved with changes / Changes required / Not relevant / Failed), minor-version flag, lock state. The Proof is the unit of versioning.
- **Version** — ordered children of a Proof. Major versions (v1, v2, v3) are the default; "minor versions" (v0.1, v1.2) are a Pro/Enterprise-only feature for WIP internal cycles that can be hidden from later reviewers. Each version is treated as a frozen snapshot once locked. No branching.
- **Stage** — ordered children of a Proof. Each stage has a name, trigger (Manual / When prior stage = Approved / Approved-with-changes / Calendar deadline / Connect-flow Zibot), reviewers list, decision rules (all-required vs single-decision-advances), deadline, skip-on-new-version flag, checklists (Enterprise). Stage count is hard-capped per tier: Free 1, Standard 2, Pro 3, Enterprise unlimited.
- **Reviewer assignment** — a record joining a Stage to a User/Guest with permissions {view, comment, decision, manage, share} and notification preferences. The same person can appear in multiple stages with *different* permissions per stage.
- **Decision** — submitted by a reviewer-with-decision-rights against a Stage of a Version. Standard labels: Approved / Approved with changes / Changes required / Not relevant / Pending. Custom decision labels and "decision reasons" on Pro/Enterprise. Decisions roll up to a Stage status by a fixed precedence rule (any "Changes required" wins; otherwise any "Approved with changes" wins; otherwise Approved). A reviewer can revoke/change a decision while the proof is unlocked.
- **Comment** — attached to {Proof, Version, Asset-within-proof, page or frame or pixel coordinate}. Supports threaded replies, file attachments up to 500 MB, like-reactions, custom labels (e.g., "To do" — 1 label Standard, unlimited Pro+), and resolve/unresolve. Each comment is tagged with the Version and Stage where it was made.
- **Activity log / Audit trail** — append-only event stream per Proof; CSV-exportable. Retention is tiered: 90 days Standard, 1 year Pro, lifetime Enterprise.
- **Workflow Template** — a reusable stages-and-reviewers configuration. Standard/Pro allow unlimited templates but only 1 *active* at a time (a notable artificial gate); Enterprise removes the cap.
- **Folder** — container for proofs; share-link permissions on Pro+; folder-level access permissions on Pro+.
- **Custom Property / Tag** — admin-defined metadata fields on a Proof; Enterprise-only.
- **Intake Form** — a public-facing form that creates a Proof (or new Version) on submission; can embed via iframe.
- **Flow / Zibot** — Ziflow's internal automation language. Flows are event-triggered scripts (Webhook Zibot, Send Email Zibot, Change Workflow Template Zibot, Add Reviewer Zibot, Path/conditional Zibot, Check Multiple Stages Status Zibot). Pro/Enterprise only. Use JSONata expressions to reference payload data.

**Critical answers**:

1. **Primary unit of work** — the **Proof**. Not project, not deliverable, not bundle.
2. **Is a "bundle of files representing one deliverable" first-class?** Partially. Ziflow has a "**combined proof**" / "**multi-asset proof**": static-only on Standard/Pro, cross-media (video + PDF + website + rich media) only on Enterprise. Reviewers switch between assets in a widget. But each comment is tied to one asset, decisions are at the Proof level, and stages gate the *whole* combined object — they don't gate per-file. So files in a combined proof are siblings, not a pipeline.
3. **Heterogeneous file types in one workflow?** Yes, but Enterprise-tier only for cross-media combinations; on Standard/Pro you can only combine static images/PDFs in one proof. Each file type has its own first-class viewer (frame-coded video, page-anchored PDF, pin-on-image, live-website-with-iframe-proxy, audio waveform). No file type is privileged in viewer fidelity — but the workflow object itself is type-agnostic.

**User customizability:** Custom decision labels (Pro+), custom comment labels (Pro+), custom proof properties/metadata (Enterprise), custom workflow templates (all paid tiers, with template-count gates), custom email templates (Enterprise), custom domains and white-label viewer (Enterprise).

---

## 3. Part 2 — Workflow & Stage Mechanics

**Stages** are ordered children of a Proof. Out of the box, every new proof creates "Stage 1" with the proof creator as default reviewer. Users add stages up to the tier cap. Stages can be **renamed** to match a process ("Internal Review," "Client Review," "Legal," "Compliance Sign-off"). Stages are configurable per-proof or templatized at the workspace level via Workflow Templates.

**Transitions.** Each stage has a **Trigger** field. Options:
- **Manually** — someone clicks Start (or the prior stage doesn't auto-progress).
- **When [prior stage] = [decision status]** — e.g., "Starts when Internal Review is Approved." Multiple statuses can be selected.
- **Deadline-based** — calendar-driven, business-day-aware (excludes weekends).
- **Connect Flow / Zibot trigger** — for compound conditions like "start Client Review when BOTH Internal Design AND Internal Legal are Approved-or-Approved-with-changes." This requires building a Flow with the *Check Multiple Stages Status* Zibot and is Pro/Enterprise only.

Stages can be **sequential or parallel** within a workflow (multiple stages can be configured to start simultaneously when a triggering event fires). Branching is achievable only via Flows/Paths, not natively in the Stage UI.

**Gating.** A stage's decision rule is either "all decision-makers must decide" or "only one decision required" (Pro+). The stage rolls up to a single stage-decision by the precedence rule cited above. Stages can be configured to **skip on new version** (so you don't re-trigger internal QA when you just patched a typo). Stages can be **reverted** if the proof is unlocked: a reviewer can revoke their decision and the stage status recalculates.

**Rejection/loops.** There is no native "send back to stage 2" branch. The typical pattern: a "Changes required" decision means a new version must be uploaded; the workflow restarts from the configured stage (often Stage 1) on the new version. Comments do not auto-carry forward (see Part 10).

**Parallel tracks.** Yes — set multiple stages' triggers to fire on the same event, and they run in parallel. The Proof status only flips to Approved when all parallel branches resolve.

**State machine?** It is a constrained finite state machine where state is (Proof, Version, Stage) → status, but it does not expose a general state-machine editor. Users perceive it as "status labels driven by trigger rules."

**Logging.** Yes — every stage transition, decision, comment, version upload, reviewer add/remove, and stage-lock event is recorded in the Activity Log with timestamp and actor. Exportable to CSV. Retention varies by tier.

**Notifications.** Yes — each stage transition fires email notifications to that stage's reviewers (with per-reviewer notification preferences). Decision notifications are sent only to reviewers in the *currently active* stage of that version, which has caused at least one documented complaint that proof owners miss notifications if they're only in a skipped stage. @-mentions notify regardless of preference. Slack/Teams notifications via integrations.

---

## 4. Part 3 — Versioning & File Handling

**Versioning is first-class.** Adding a new version is a deliberate action ("Add new version" on the Proof). Versions are immutable once locked. Pro/Enterprise expose **minor versions** (v0.1, v1.2) hidden from external reviewers — designed for internal WIP cycles. There is no automatic version detection from filename or file hash; the user explicitly says "this is v2 of that proof."

**Per-stage version reference.** Stages all reference the *current* version of the proof. There is no way to say "Stage 2 reviews v1 while Stage 3 reviews v2." A single Proof has one live version at a time per workflow, with prior versions accessible via the version picker and Compare Mode.

**File types — first-class viewers.**
- **Image (JPG/PNG/BMP/TIFF/PSD/AI):** pin-anchored markup with rectangle/circle/arrow/line/freehand/text-annotation tools.
- **PDF / Office docs (DOC/X, XLS/X, PPT/X, KEY, RTF/TXT):** page-anchored markup. Excel uses your print-settings; Office files are converted to PDF previews. **PowerPoint Speaker Notes / "Talking Points" are NOT exposed** (a recurring complaint).
- **Video / Audio (MP4, MOV, MP3, AAC, Dolby AC3/EAC3 up to 5.1):** frame-accurate / second-accurate time-coded comments, Safe Zones overlay for aspect-ratio cutoffs, audio waveform.
- **Web (URL):** Snapshot (static screenshot at 1920px) or Live (proxied through Ziflow servers; requires browser extension for some interactivity; doesn't always work with Shopify preview links per user reports).
- **Rich Media (HTML5 banners):** ZIP-based upload; multi-resolution side-by-side review.
- **InDesign INDD:** *not* directly supported — Ziflow advises export-to-PDF (low-fidelity previews otherwise). Friction point.

**Compare.** "Compare Mode" with side-by-side, overlay, difference, and auto-detect (pixel-level) modes. G2 rates "Smart Compare" 9.8/10.

**Large files & storage.** Per-tier storage caps: 2 GB Free, 1 TB Standard, 2 TB Pro, 4+ TB Enterprise. Comment attachments capped at 500 MB. Max static-file canvas: 199–200 inches in either dimension.

**Annotations across versions.** Annotations and comments are bound to the version they were made on. They appear historically in the Activity Log and version-history view, but do **not** auto-replicate onto a newer version (top user complaint, see Part 10). PDF-imported markups (Enterprise public preview) are now supported.

---

## 5. Part 4 — Approval & Approver Mechanics

**Assignment.** Approvers are added per-stage in the Reviewers panel of proof creation, or pre-baked into a Workflow Template. Each reviewer assignment is "this email + this stage + these permissions." Reviewers can be drawn from People (the workspace directory) or invited ad-hoc by email; the latter are *guest reviewers* and consume no licensed seat.

**Permissions per reviewer per stage** (composable booleans): `view`, `comment`, `decision` (a.k.a. "Approve" rights), `manage`, `share`. Only `decision` reviewers see the "Make decision / Submit decision" button; others see "Complete review." `manage` requires a licensed user account — guests cannot have manage.

**Multiple approvers per stage.** Yes. Modes:
- **All required** (default): the stage advances only when every decision-maker decides. Final stage status = precedence rule (any Changes-required > any Approved-with-changes > Approved > all Not-relevant).
- **One decision required** (Pro+): the first decision advances the stage.

**Approval = button click + audit record.** Technically: a Decision row in the Activity Log with author, timestamp, decision label, optional decision reason (custom on Pro+), and stage/version pointers. Enterprise has formal electronic signatures.

**External approvers.** First-class. Guests get a one-time URL (or required email-verified login), do not consume a seat, can be granted decision rights, and Enterprise can force MFA on guests. Access is scoped to that single proof (or folder share-link on Pro+).

**Rejection.** "Changes required" locks the stage at that status. The standard pattern is: proof owner uploads a new version, the workflow restarts from Stage 1 (or only the non-skipped stages). There is no native "loop back to stage 2 only" without a Flow/Zibot.

**Audit.** Every decision is logged with timestamp, author, decision label, decision-reason, stage, version. Lifetime audit on Enterprise; 90 days / 1 year on lower tiers.

---

## 6. Part 5 — Comment & Discussion Mechanics

Comments are **first-class objects** with their own report in CSV export (comment ID, reviewer, timestamp, content, version, stage, asset, coordinates).

**Anchoring.** Comments attach to: a Proof + Version + Asset (for multi-asset proofs) + Stage + spatial anchor (page, x/y pixel, time code, or HTML element via the Live Website proxy). The viewer "jumps to" the anchored location when a comment is clicked.

**Threading.** Threaded replies under each parent comment. Like-reactions and emoji reactions. Custom labels (1 label Standard, unlimited Pro+) such as "To do" / "Bug" / "Copy edit."

**Resolved / unresolved.** Yes. A green check icon. Email notification fires when resolved. Resolved comments can be re-opened.

**Persistence across versions — KEY GAP.** Comments are bound to the version they were created on. They are **not** automatically displayed or carried over onto a new version. Users complain: *"comments stay on the old version, not updating to the new one, which can be confusing"* (Alejandro M., G2); *"sometimes you need to carry some incomplete comments forward into the next round of feedback to continue the discussion"* (Capterra). This is treated as a structural/architectural limitation, not a fixable bug. PDF-comment import (Enterprise preview) is a workaround at the asset-ingestion side, not a version-stitching feature.

**Notifications & @-mentions.** @-mentions notify the mentioned user regardless of their notification preferences. Per-comment email notifications can be configured.

**Comments visible to externals.** Yes by default. Pro/Enterprise expose **private/internal comments** that are hidden from guest reviewers — important for client/vendor-facing flows.

**Deletion & restoration.** Comments are deletable while the proof is unlocked; deleted comments leave a restorable placeholder. Manage-permission users can delete others' comments; Comment-permission users can only delete their own.

---

## 7. Part 6 — Permissions & Collaboration

**Role taxonomy** at workspace level: Account Admin, User (licensed), Reviewer (guest, unlimited free). Permissions are then *re-scoped per proof per stage* via the reviewer-permissions matrix (view/comment/decision/manage/share). There is no traditional "Editor / Viewer / Admin" role taxonomy at the workspace level beyond Admin and licensed User.

**Capability matrix** (high-level):
- **Account Admin:** workspace settings, billing, templates, properties, decision labels, custom domains (Ent), SSO/SCIM (Ent), API keys.
- **Licensed User (Manager):** create proofs, manage workflows, add/remove reviewers, lock/unlock proofs, manage permissions. Counts against per-tier seat cap (5/15/20/25+ depending on tier).
- **Guest Reviewer:** scoped per proof; never sees the dashboard; never sees other proofs. Free, unlimited on every tier — including the Free tier.

**Granularity.** Workspace-level (admin); folder-level (Pro+ — folder access permissions); proof-level (per reviewer); stage-level (per reviewer per stage); comment-level (private vs public on Pro+). No per-file granularity *inside* a combined proof — reviewers see all assets in the proof or none.

**External collaborators.** Best-in-class for guests: unlimited, free, scoped per-link, MFA-able on Enterprise, with a frictionless review experience (open a link, no install). This is one of Ziflow's clearest commercial differentiators.

**IP-sensitive content (the "freelance designer sees only their style, not the whole collection" question).** Possible only by structural separation: put each style in its own proof (or its own folder, scoped via folder permissions on Pro+). There is no row-level or attribute-level filter that says "freelancer X sees only proofs tagged Style-Y." This is a fashion-vertical gap.

---

## 8. Part 7 — Integrations & API

**Public REST API** at `https://api.ziflow.io/v1`, with a public developer portal at `api-docs.ziflow.com`. Resources include `/folders`, `/proofs`, `/proofs/{id}/stages`, `/proofs/{id}/stages/{id}/reviewers`, `/proofs/search`. Auth via API key (managed at Settings > API Settings > General). Available to **administrators on Free, Standard, Pro, and Enterprise** — i.e., the API is open from the free tier upward. Embed-Ziflow-in-your-product is an officially documented use case with `<iframe>` viewers and one-time reviewer URLs.

**Webhooks.** Configurable per endpoint with: events (new proof, new version, decision made, comment created/replied/resolved/labeled/reacted-to, stage updated [reviewer added/removed, locked, deadline changed]), SHA-256 signature header `x-ziflow-signature`, filter-by-event, multiple endpoints. Available on **all tiers including Free**, admin-only.

**Zibots / Flows.** Ziflow's internal automation builder (Pro/Enterprise). Trigger Zibots, Webhook Zibots, internal mutation Zibots (set property, change workflow template, add reviewer, send email), Path Zibots for conditionals. JSONata expression language for payload-data manipulation. Effectively a low-code workflow layer atop the API.

**Zapier.** Yes, public Zapier app (launched in beta Dec 2022, GA since). Make.com / n8n: not documented as native connectors but reachable via webhooks + REST.

**Native integrations** (from ziflow.com/integrations, confirmed in docs):
- **Adobe Creative Cloud plugins:** Photoshop, Illustrator, InDesign, Premiere Pro, After Effects — view comments and push new versions from inside the app.
- **Figma:** plugin that creates static review-ready proofs from frames/artboards; bi-directional version + comment sync.
- **Final Cut Pro X:** frame-accurate video review from inside FCP.
- **Project management:** monday.com (two-way; create proofs from boards), Asana (two-way: status, links, comments), Jira, ClickUp, Trello, Smartsheet, Wrike, Salesforce.
- **Cloud storage:** Google Drive (auto-create proofs on file add), Dropbox (auto-proof + deposit approved assets back), SharePoint (auto-manage folders).
- **Messaging:** Slack, Microsoft Teams.

**Fashion-critical integrations — gap analysis.** Shopify: NOT a native integration; reachable only via webhooks/Zapier, and at least one Capterra user reports the Live Website proofing "doesn't work perfectly with the Shopify preview link." WhatsApp Business: NO connector. Tech-pack tools (Backbone, Fashion Cloud, Tukatech), PLM systems (Centric, PTC FlexPLM), and ERP/MRP (NetSuite Fashion, Apparel Magic): NO native connectors.

**Rate limits & auth model.** Not publicly enumerated in help docs — would require an API key + hands-on trial to enumerate exactly. Embedding guidance recommends using webhooks rather than polling, and using separate accounts per customer to prevent data-mingling — implying meaningful rate-limit pressure for high-volume integrations.

---

## 9. Part 8 — UX Patterns

**Navigation.** A left-rail Folder/Proof tree, a top dashboard listing Proofs by status, and a per-Proof detail page with version picker, stages panel, reviewers panel, comments/activity, and "Open in Viewer." A separate top-nav for Connect (Flows / Intake Forms) and Settings. A dedicated Proof Viewer is the modal/full-screen where reviewers actually do the work.

**Proof page layout.** Proof Viewer has: file canvas in the center; markup tools floating; comment panel on the right with arrow-key navigation through comments; top bar with version picker, Compare Mode, Make Decision / Complete Review buttons; "all markups" toggle (Dec 2022 release) showing every annotation at once.

**Mobile.** **Responsive web, no native app.** Marketing explicitly highlights that comments and decisions can be made from a device's native browser. Multiple user complaints about mobile feature parity: *"I'd like to tag people from mobile too"* (G2 discussion); *"My biggest issue with the software currently is the lack of options on the mobile view vs the desktop view"* (Capterra). For a fashion product where buyers / merchandisers / vendors review on phones, this is a meaningful gap.

**Onboarding.** Self-serve signup (no credit card for Free or trial). Enterprise gets "custom onboarding and training" and Success Start training is praised in reviews. Mid-tier teams typically describe a 1–2 week ramp for content creators and a quick "intuitive" pickup for reviewers. The free tier is marketed as a freelancer/duo plan.

**External-reviewer onboarding.** Email link → opens proof in browser → optional email verification → markup. Zero install (Live Website proofs and Rich Media need a browser extension for full interactivity, which generates user friction with some clients per reviews).

**Speed/reliability.** Generally praised; multiple Capterra reviewers complain of "sometimes opening proofs can take far too long to load" and free-tier upload slowness. Status page at status.ziflow.com is public. Renders are processed asynchronously server-side, so users wait for "processed" before review links are usable.

**Search & filter.** Folder tree + dashboard filter by status, owner, date, custom properties (Enterprise). Multiple users complain that "Backend search is not the greatest. Very hard to search for certain proofs" (G2) and "trying to find older documents I've already downloaded is an absolute nightmare" (Capterra).

---

## 10. Part 9 — Pricing & Packaging

Exact pricing as published on ziflow.com/pricing (May 2026):

| Tier | Price | Users | Storage | Stages | Templates | Audit retention | Notable inclusions |
|---|---|---|---|---|---|---|---|
| **Free** | $0 forever | 2 | 2 GB | 1 | 0 (configure per-proof) | 60-day review history | 1,200+ file types, unlimited reviewers, unlimited proofs, pixel-compare, public links, 2FA, Adobe plugins, API & webhooks |
| **Standard** | **$199/mo** billed annually (20% yearly discount vs monthly) | 15 (add in packs of 5) | 1 TB | 2 (seq/parallel) | unlimited created, 1 active | 90 days | Multi-static-asset proofs, bulk creation, folders, deadlines, manual reminders, briefs, basic intake forms, standard MSA, email+chat support |
| **Pro** | **$329/mo** billed annually (17.5% yearly discount) | 20 | 2 TB | 3 | unlimited created, 1 active | 1 year | Multi-rich-media proofs, folder share links, folder permissions, color separation, custom labels, resolve comments, minor versions, branded intake forms, single-decision-advances, decision reasons, monday/Asana/Slack/Drive/Dropbox/SharePoint integrations, 24/7 support |
| **Enterprise** | Custom | 25+ | 4+ TB | Unlimited | Unlimited active | Lifetime | Multi-asset cross-media campaign-level proofs, ReviewAI, auto deadline reminders, custom fields/properties, e-signatures, custom domain, white-label viewer, SSO (SAML 2.0), SCIM, IP allowlisting, MFA for guests, satellite/trusted accounts, detailed activity logs, custom onboarding, negotiated SLA |

**Structural notes.** Pricing is **per-workspace flat-rate**, not per-seat — Standard is $199/mo for *up to 15 users*, not $13.27/user. Add-on users come in **packs of 5**. *Reviewers (guests) are unlimited and free at every tier* — a strong commercial differentiator. Trial is 14 days on paid tiers, no credit card. Educational discounts available. Subscription is monthly-or-annual, cancelable any time.

**Per-user comparison vs the competing $49/seat model.** Ziflow Standard at $199/mo / 15 users ≈ $13.27/user/mo *floor*, climbing toward the $49 mark only if a customer is on Pro with very few licensed users. The competing product's $49/user/mo therefore competes on **per-seat cost only if Ziflow's seat utilization is low**; the comparison flips when the fashion team has 30–80 licensed users, in which case Ziflow becomes cheaper (Standard $199 + 13×5 packs at ~$50/pack… the customer would in practice negotiate Pro or Enterprise). This means the competing product's price point is *not* below Ziflow's for typical fashion-team sizes (20–100 people); it must win on vertical fit and architecture, not headline cost.

---

## 11. Part 10 — User Feedback Synthesis

Sources: G2 (937 reviews, 4.5 stars), Capterra (417 reviews, 4.8 stars), TrustRadius, Software Advice, Capterra UK, GetApp, AlternativeTo, Filestage comparison blog. Reddit threads on Ziflow specifically are sparse — most discussion sits on r/marketing and r/agency mentioning Ziflow as one of several proofing tools (Filestage / Frame.io / ReviewStudio / PageProof / GoVisually); no substantive Hacker News thread on Ziflow was found. **Flagging explicitly: post-2023 Reddit-specific Ziflow discussion is scarce; the bulk of qualitative data comes from G2/Capterra verified reviews and vendor-aggregator comparison posts.** Many G2 reviews carry "Vendor Referred — Incentive Offered" disclosures, which biases positive sentiment — the *negative* quotes inside those same reviews are therefore the most reliable signal.

Quotes are surfaced as compiled by aggregators (G2 review snippet pages, Capterra "Cons" sections, comparison-page review extracts). Where a quote is paraphrased rather than direct in the source, it is marked "P". Where a quote was visible verbatim, it is marked "Q".

### Complaint dataset (35 quotes)

| # | Quote | Source | Approx date | Theme | Structural / Fixable |
|---|---|---|---|---|---|
| 1 | "comments stay on the old version, not updating to the new one, which can be confusing" (Q, Alejandro M.) | g2.com/products/ziflow/reviews | 2024 | Data model — comment persistence | **Structural** |
| 2 | "sometimes you need to carry some incomplete comments forward into the next round of feedback to continue the discussion" (Q) | capterra.com/p/178111/Ziflow/pricing | 2024 | Data model — comment persistence | **Structural** |
| 3 | "There should be an easier way of simply creating another version without having to input all of the reviewer's emails again" (Q) | g2.com/products/ziflow/discuss | 2023–24 | UX — reviewer re-entry | Fixable |
| 4 | "Backend search is not the greatest. Very hard to search for certain proofs." (Q) | picflow.com / G2 extract | 2024 | UX — search | Fixable |
| 5 | "trying to find older documents I've already downloaded is an absolute nightmare" (Q) | capterra.com/p/178111/Ziflow/reviews | 2024 | UX — search/archive | Fixable |
| 6 | "occasionally the interface freezes up and I'll need to refresh 2-3 times before I can see the file preview" (Q) | capterra.com/p/178111/Ziflow/reviews | 2024 | Performance | Fixable |
| 7 | "opening proofs can take far too long to load" (Q) | capterra.com/.../GoProof-vs-Ziflow | 2022 | Performance | Fixable |
| 8 | "Honestly the price is too high for what it does" (Q) | softwareadvice.com / Capterra | 2024 | Pricing | Structural (flat per-mo) |
| 9 | "the price is too high… can probably have someone build this for me for $500 overseas" (Q, Gabe D., Apparel & Fashion) | capterra.com/p/178111/Ziflow/reviews | 2023 | Pricing — fashion ICP signal | Structural |
| 10 | "We do the same with PowerPoint files because Ziflow does not allow one to comment on Talking Points" (Q) | capterra.com/p/178111/Ziflow/reviews | 2023 | Missing feature — speaker notes | **Structural** (file conversion model) |
| 11 | "we still add proofing comments directly to Word documents because of the ability to track changes" (Q) | capterra.com/p/178111/Ziflow/reviews | 2023 | Missing feature — track changes | Structural |
| 12 | "The way it integrates with Microsoft Word for copywriting and with some of the web features seem a bit clunky" (Q) | capterra.co.uk/software/178111/ziflow | 2024 | Integrations | Fixable |
| 13 | "We have been asking for a while now to bring the option to edit our clients comments, it has been almost a year now" (Q) | capterra.co.uk | 2024 | Missing feature — admin edit of comments | Fixable |
| 14 | "you can't add a group of reviewers but have to add them individually each time" (Q) | capterra.com comparison page | 2023 | Missing feature — reviewer groups | Fixable |
| 15 | "you cannot add a note to a proof" (Q) | capterra.com comparison page | 2023 | Missing feature — proof-level notes | Fixable |
| 16 | "When proofs are uploaded to Ziflow, the color code changes from RGB to CMYK, causing issues with clients" (Q) | capterra.com comparison page | 2024 | Bug — color profile handling | Fixable |
| 17 | "It doesn't work perfectly with the Shopify preview link and we've also had some trouble with having to turn off redirects" (Q) | capterra.com comparison page | 2024 | Integrations — fashion-relevant | Fixable |
| 18 | "Sometimes comment can be hindered when stage permissions wouldn't allow a user to address something that was actionable after their stage" (Q) | capterra.com comparison | 2024 | Permissions — stage rigidity | **Structural** |
| 19 | "Some users were frustrated by being locked out of proofs they wanted to review when another gatekeeper had already signed a job off" (Q) | capterra.com Ziflow vs GoProof | 2022 | Workflow — premature lock | Structural |
| 20 | "I do wish there was better options for workflow editing when a user is out of office. That is currently very manual and requires removing the user from workflows temporarily" (Q) | capterra.com/p/178111/Ziflow/reviews?page=11 | 2024 | Missing feature — OOO handling | Fixable |
| 21 | "the lack of options on the mobile view vs the desktop view" (Q) | capterra.com comparison | 2024 | UX — mobile | **Structural** (no native app) |
| 22 | "I'd like to tag people from mobile too" (Q) | g2.com/products/ziflow/discuss | 2024 | UX — mobile @-mention | Fixable |
| 23 | "Filtering the database of content for specific countries / brands or jobs is harder than I anticipated" (Q) | capterra.com comparison | 2024 | UX — filter/search by metadata | Fixable |
| 24 | "Cannot print or save out all individually loaded files to have a comprehensive review or proof package" (Q) | capterra.com comparison | 2024 | Missing feature — bundle export | **Structural** |
| 25 | "it's also difficult to review more than one file at a time (something that is often necessary when working on multiple formats of the same asset)" (Q) | capterra.com comparison | 2024 | Data model — bundle review | **Structural** |
| 26 | "as far as users are concerned, they've submitted their materials and I am then forced to manually download and re-upload the unzipped/supported" (Q) | capterra.com comparison | 2024 | UX — file-format mediation | Fixable |
| 27 | "if a proof has multiple pages you have to make it a PDF before, otherwise it will make every page a proof" (Q) | capterra.com comparison | 2023 | UX — multi-page handling | Fixable |
| 28 | "We're disappointed that powerpoint files can't display the Notes / talking points under slides — for us that is a critical part of client and reviewer feedback" (Q) | capterra.com comparison | 2023 | Missing feature — PPT notes | Structural |
| 29 | "At first, we received complaints from the proofers that they were receiving far too many emails from the system" (Q) | capterra.com Ziflow vs GoProof | 2022 | UX — notifications | Fixable |
| 30 | "For the client there is no platform with a clear overview of all the renders that they have ordered" (Q) | capterra.com comparison | 2024 | Missing feature — client portal | **Structural** |
| 31 | "Would love to be able to share public links, export comments directly into a PDF as if it was marked up in a PDF originally" (Q) | capterra.com comparison | 2024 | Missing feature — PDF-flatten export | Fixable |
| 32 | "I think if reports can be extracted from Ziflow, that would have been an added advantage" (Q) | capterra.com/p/178111/Ziflow/reviews?page=11 | 2023 | Missing feature — reporting | Fixable (CSV exists; richer analytics doesn't) |
| 33 | "The free version of Ziflow limits the number of files that can be uploaded which is terrible for when I am testing new things" (Q) | capterra.com/p/178111/Ziflow/reviews | 2024 | Pricing — free-tier limits | Structural (intentional) |
| 34 | "It can be slow to load with all the tools. We found that sometimes notes were confused with previous versions when they weren't loading quick enough" (Q) | capterra.com/p/178111/Ziflow/reviews?page=7 | 2023 | Performance + version display | Fixable |
| 35 | "There was a bit of a learning curve for content creators (because we set up a fairly strict workflow with custom data fields)" (Q) | capterra.com/p/178111/Ziflow/reviews?page=7 | 2023 | Onboarding | Fixable |

### Complaint frequency by theme

| Theme | Count | Representative items |
|---|---|---|
| **Comment persistence across versions** | 2 (very loud) | #1, #2 |
| **Reviewer / workflow re-entry on new version** | 2 | #3, #20 |
| **Search & filtering** | 3 | #4, #5, #23 |
| **Performance / load time** | 3 | #6, #7, #34 |
| **Pricing for small teams** | 3 | #8, #9, #33 |
| **Missing file-type depth (PPT notes, Word track-changes)** | 3 | #10, #11, #28 |
| **Missing convenience features (groups, notes, OOO, admin-edit)** | 4 | #13, #14, #15, #20 |
| **Mobile gap** | 2 | #21, #22 |
| **Bundle-export / multi-file review** | 3 | #24, #25, #30 |
| **Format mediation (RGB/CMYK, multi-page, Zip, InDesign)** | 4 | #16, #26, #27, plus help-doc INDD friction |
| **Permissions / stage rigidity** | 2 | #18, #19 |
| **Notification overload** | 1 | #29 |
| **Integration depth (Shopify, Word, reporting)** | 3 | #12, #17, #31 |

### Features that exist but work badly
- Live Website proofing (Shopify, HTTP, redirects)
- Mobile experience
- Search across older proofs
- Stage-permissions handling when a reviewer needs to comment past their stage
- Color profile handling on upload

### Features that simply don't exist
- Auto-carry-forward of unresolved comments to a new version
- Reviewer groups / saved reviewer lists
- Proof-level "note to file"
- PowerPoint speaker-notes commenting
- Word track-changes equivalent
- Native mobile app
- OOO / delegate-substitution for reviewers
- Native Shopify / WhatsApp / PLM integrations
- Comprehensive "save the whole bundle out as one package"
- A client portal that shows an external client *all* their proofs across the agency

### Workarounds users describe
- *"we still add proofing comments directly to Word documents because of the ability to track changes"* (#11)
- *"we still… in PowerPoint files because Ziflow does not allow one to comment on Talking Points"* (#10)
- Re-uploading unzipped supported formats manually because intake-form upload didn't accept the source ZIP (#26)
- Splitting multi-page assets to PDF before upload to avoid one-page-per-proof explosion (#27)

### Comparisons users volunteer
- vs **Frame.io**: switched away because Frame.io lacked Ziflow's automated multi-stage workflow.
- vs **GoVisually**: "great and simple tool, but it didn't have enough features to accomplish the proofing process we wanted."
- vs **ProofHQ / Workfront**: Ziflow viewed as the spiritual successor; price competitive.
- vs **PageProof / Filestage / ReviewStudio**: Ziflow seen as more enterprise; Filestage/ReviewStudio simpler/cheaper.

---

## 12. Part 11 — Strategic Implications for the Competing Product

### A. Mirror list — what to replicate

1. **Stage as a first-class workflow primitive with named, permission-scoped reviewers per stage** — Ziflow proves this UX is teachable to creative people and to external vendors. The competing product's "bundle moves through sequential stages with a named approver" is the same primitive; do not invent a novel metaphor.
2. **Decision-label semantics** — Approved / Approved with changes / Changes required / Not relevant / Pending — copy this taxonomy plus the precedence-rollup rule. It's battle-tested.
3. **Activity log as the audit object** — append-only, exportable, with timestamp + actor + decision + reason. Indie fashion brands operating under buyer audits or for licensing partners need this.
4. **Unlimited free external reviewers** — the most powerful commercial pattern in Ziflow's pricing. For fashion, *vendors* (factories, fabric mills, agents) are the external reviewer cohort and they must be free. Charging them is a deal-breaker at indie-brand scale.
5. **Per-reviewer-per-stage permission matrix** {view, comment, decide, manage} — copy the four-bit composability.
6. **Multi-asset / combined viewer with per-asset comment anchoring** — even though Ziflow ships this only on Enterprise, the UX of "switch between assets in one review" is the right pattern for the bundle.
7. **Frame-coded video, page-anchored PDF, pin-on-image, time-coded audio** — table stakes; don't try to be clever.
8. **Side-by-side and overlay version compare with pixel-diff** — a feature buyers expect.
9. **Public REST API + signed webhooks + Zapier app available from the free tier** — Ziflow's API-from-Free posture is friendly and proves API-first doesn't require monetization gates.
10. **Workflow Templates** — reusable per-customer stage-and-reviewer presets. Critical for fashion: "Tech-Pack-to-Sample" and "Sample-to-PP-Sample" are the same template repeated 200 times per collection.
11. **Activity log retention tied to tier** — but be more generous than 90 days on the entry tier; this is a fixable Ziflow friction point.
12. **Pixel-level diff** — Ziflow's "Smart Compare" rates 9.8/10 on G2; the feature exceeds expectations and is achievable on a small team's roadmap.

### B. Differentiate list — what to do differently, with reasoning

1. **Make the Bundle a first-class object, distinct from any one file.** Ziflow's "Proof" is the unit, and a multi-asset proof is a *bag of assets sharing one workflow.* The competing spec needs a Bundle where each Stage references a *different* file and the file produced at Stage N is the *input* to Stage N+1 (sketch → tech-pack → costing → sample photo → approval). This is structurally different from Ziflow and is the central architectural bet. Justification: indie fashion deliverables are produced as a pipeline of heterogeneous artifacts by different specialists; "proofing the same asset in stages" doesn't match the work.
2. **Per-stage file slot, not per-bundle file pool.** Each Stage has an input slot and a "Stage produces X" output slot. The Bundle is the unifying object that owns the slots in order. Comments anchor to (Bundle, Stage, File, Version, coordinate) — *not* to (Proof, Version, coordinate).
3. **Auto-carry forward of unresolved comments across versions.** This is the loudest structural Ziflow complaint. The competing product should default-promote unresolved comments to the next version of the same file with a visible "from v2, still open" badge. Cheap to ship; high perceived value.
4. **Transit-storage model with explicit project export.** Ziflow charges 1 TB / 2 TB / 4 TB of storage as a *permanent retention model*. The competing product's spec — files live in-product during active workflow, export to customer S3/Drive/Dropbox on project completion — is a structurally different commercial offer: lower cost-of-goods, lower data-liability, and lets the brand decide where archived collections live (a real fashion concern given seasonality and licensing). Build "Archive project to Dropbox/Drive/Shopify Files" as the *completion ritual.*
5. **Per-seat $49/mo pricing with included external collaborators.** Ziflow's $199-flat-rate floor punishes the 5-person studio. A simple per-seat price aligns with indie-team mental models. The cost-comparison only flips above ~15 seats; below that, $49/seat is cheaper than Ziflow Standard and far simpler to procure.
6. **Reviewer groups / saved roles.** Ziflow doesn't have these and users complain about retyping reviewer emails. Ship saved Reviewer Roles ("Tech Pack Approver = Maya," "Costing = Raj," "Sample Comments = Vendor X") as a permanent named binding that the Bundle template inherits.
7. **A genuinely fashion-shaped object schema beneath the API.** Bundle, Style, Season, Colorway, Size-Run, Vendor, PO Number — as first-class objects (or Enterprise-level custom-property analogues that ship by default). Ziflow has "custom properties" but they are Enterprise-only and free-form. The competing product can ship strongly-typed fashion attributes from day one without much extra code.
8. **Native Shopify, WhatsApp Business, and one PLM connector.** Ziflow's Shopify story is broken (#17); WhatsApp Business is the *primary* communication channel for India- and Turkey-based fashion vendors; one PLM connector (Centric or Backbone) signals seriousness. These are the differentiators that justify the vertical positioning.
9. **Stage-permissions that don't trap comments.** Ziflow's stage-permission rigidity (#18, #19) — where you can't add a comment after your stage closes — is a known frustration. Allow late commenting with explicit "post-stage note" labeling rather than a hard lock.
10. **Mobile-first reviewer experience, optionally native.** Ziflow is responsive-only (#21, #22). For fashion, buyers and designers approve from phones in showrooms and trade shows. A mobile-first reviewer flow (or a thin native iOS app for vendors) is a defensible feature.
11. **A real client/vendor portal showing all their bundles.** Ziflow's guests see one proof at a time (#30). Vendors managing multiple styles need a dashboard. Ship it.
12. **Public-by-default API surface that includes Bundle, Stage, File, Version, Comment, Decision, AuditEvent.** Mirror Ziflow's `api.ziflow.io/v1` shape, including the embed-in-your-product use case, but expose the Bundle as a top-level resource that Ziflow doesn't have. This is the API-first positioning.
13. **Drop ReviewAI-style "AI checks" until you understand fashion compliance.** Ziflow's ReviewAI verifies brand-and-regulatory checklists — useful for pharma/finance, not fashion. Don't copy this feature in v1; the indie fashion compliance surface (RSL chemical lists, fiber labeling, country-of-origin) is too domain-specific to slot a generic LLM into. Wait until you've watched 50 customer reviews.

### C. Gap list — features the competing product can include from day one for cheap

- Auto-carry-forward unresolved comments to next version (#1, #2)
- Reviewer groups / saved approver lists (#14)
- Proof/Bundle-level free-text notes (#15)
- OOO / delegate-substitution for an approver (#20)
- Export-as-PDF with annotations flattened (#31)
- Save-the-entire-bundle as a single ZIP/folder for archive (#24)
- Better filtering by tag, vendor, season, style code (#23)
- Mobile @-mentions (#22)
- Reviewer-side dashboard showing all their bundles across the brand (#30)
- "Allow comment after stage closes" toggle (#18)
- Editable client comments by admin (#13)
- Reasonable free / entry tier without arbitrary file-count caps (#33)
- Stage-permissions that don't block late comments
- Real-time CSV/JSON activity log retention from day one on the entry tier

### D. Trap list — Ziflow features the competing product should also resist

1. **Don't ship a generic AI checklist feature ("ReviewAI") in v1.** Tempting because Ziflow is selling it hard, but the indie fashion compliance surface is specific; a generic LLM-pass-fail will mis-fire and erode trust. Ship vertical-specific checks (RSL, fiber content, country-of-origin) only after observing customer reviews.
2. **Don't expand into general work-management.** Ziflow stays in "the active feedback phase" and *intentionally* doesn't try to be a DAM or project manager. This focus is why customers buy them. Do not bolt on Gantt, time tracking, or invoicing.
3. **Don't gate the API behind Enterprise.** Ziflow opens it on Free; that posture is correct and competitive.
4. **Don't sell stages as a tier gate (1/2/3/unlimited).** Ziflow does, and it forces upsells that real customers complain about implicitly (every Standard customer eventually wants more stages). Make stages unlimited from day one; gate on user seats only.
5. **Don't ship Live Website proofing through a proxy.** It is a maintenance nightmare (#17, HTTPS issues, mixed-content, Shopify preview, browser extensions). Stay in static asset land where the competing product's customers actually work.
6. **Don't ship "minor versions" as a separate concept.** It's elegant in principle but adds cognitive load; users either understand semver or they don't. Ship a single linear version chain.
7. **Don't take a free-tier-as-product-led-growth bet without watching free-tier abuse.** Ziflow's unlimited-reviewers-on-Free model invites freelancers to never upgrade. A 14-day trial + per-seat $49/mo is cleaner for a vertical SaaS.
8. **Don't try to support 1,200 file types.** Ziflow advertises this and it has cost them: InDesign issues, ZIP issues, RGB/CMYK issues, PowerPoint Notes issues, Excel print-area weirdness. Support 30 fashion-relevant types deeply (PDF, AI, PSD, INDD-via-PDF-export, JPG, PNG, TIFF, MP4, MOV, GIF, XLSX, DOCX) and refuse the long tail.
9. **Don't model decisions with five labels.** Approved / Changes required / Pending is enough for fashion. Ziflow's five-label scheme (with custom-decision-reasons) was needed for pharma/finance compliance and overcomplicates the indie-brand UX.

### E. Direct match assessment — is Ziflow an exact match? UNAMBIGUOUSLY NO.

Ziflow is a **strong partial match** in seven of the eleven dimensions and an **architectural mismatch** in four. Detail:

| Spec dimension | Ziflow position | Match? |
|---|---|---|
| Primary unit = a *bundle* of heterogeneous files representing one deliverable | Primary unit = a *Proof* (a single asset OR a "combined proof" of multiple assets sharing one workflow). The "combined proof" is the closest analog, but it is a sibling-set, not a pipeline. | **NO — different mental model** |
| Files within the bundle are heterogeneous (different file types per stage) | Yes for *display* in a multi-asset proof (Enterprise only for cross-media); No for *workflow semantics* — stages don't bind to a specific file. | **PARTIAL** |
| Each file has versions; versioning is first-class | Yes. Major + minor versions, pixel-diff, version history. | **YES** |
| Bundle moves through sequential stages | Yes — Proof moves through stages. | **YES** |
| Each stage has a named approver gating transition | Yes — first-class. | **YES** |
| Stage transitions write to an audit log | Yes — activity log with timestamp + actor + decision. | **YES** |
| Different specialists responsible at different stages | Yes — per-stage reviewer assignment with different permissions. | **YES** |
| **A file produced at one stage is input to the next** | **NO** — stages decision the *same* asset(s); they do not produce new files. The handoff between specialists is a *review* handoff, not a *production* handoff. | **NO — central mismatch** |
| Comments first-class, attached to bundle/file/version/stage, persisting across iterations | Comments are first-class and anchored to {proof, version, asset, stage, coordinate} — but they do **not** persist across versions. | **PARTIAL — known structural gap** |
| Granular permissions with external collaborator role for vendors | Yes — best-in-class guests. | **YES** |
| API-first / public REST / webhooks / Zapier / time-bounded transit storage | API + webhooks + Zapier: YES; transit-storage model: NO (Ziflow is permanent storage with tier caps). | **PARTIAL** |

**Verdict.** Ziflow is the closest commercially successful tool to the bundle-stage-approver shape, but it implements a *stage-gated review of a deliverable* rather than a *stage-gated production of a deliverable*. The competing product can credibly position as "what Ziflow would be if it knew that fashion deliverables are produced by a pipeline of specialists, not approved by a panel of stakeholders."

### F. Threat assessment — how quickly could Ziflow close the gap?

**Quarters to add: bundle-as-first-class-object?**
Estimate: **4–6 quarters**, *if* they prioritized it. The change touches their core data model (Proof → Bundle / Asset), the Proof Viewer, the Stages engine, the API, every integration, and every customer's existing workflow templates. Ziflow has shipped major changes (Connect/Zibots, multi-asset combined proofs, ReviewAI, PDF import) on roughly that cadence. A clean Bundle model is a 1+ year migration risk because of backward-compatibility with the existing Proof object across thousands of paying customers. **Likelihood: LOW.** Their existing ICP (regulated marketing, healthcare, CPG, agencies) does not demand the production-pipeline model; it demands deeper review-the-same-asset features. Ziflow has no commercial reason to risk this architectural change.

**Quarters to add: transit-storage model?**
Estimate: **1–2 quarters** to ship as an *option*, but **culturally improbable**. Ziflow's pricing power comes from storage tiers (1 TB / 2 TB / 4+ TB). Moving to transit storage would cannibalize the per-tier upsell mechanic. They could add "auto-archive to your Drive on approval" as a feature, but they will not turn off their own storage as the source of truth. **Likelihood: LOW–MEDIUM** for a hybrid; **near zero** for a true transit model.

**Quarters to add: fashion vertical positioning?**
Estimate: **2–3 quarters** for marketing only; **6–8 quarters** for real product-vertical fit (PLM integrations, fashion-shaped properties, vendor portal, WhatsApp). **Likelihood: VERY LOW.** Their ICP and customer logos (AWS, McCann, Toyota, BCBS, Klick Health) point in the opposite direction. Indie fashion 20–100-person teams are not Ziflow's target buyer at $199–$329+ flat. The CAC math would not work.

**Net threat to the competing product from Ziflow.**
- **As an existing-customer-displacement threat: HIGH** in any account where Ziflow is already deployed. Switching costs (templates, history, integrations) are real.
- **As a feature-parity threat in the next 12 months: LOW.** They will not re-architect for the production-pipeline model.
- **As a vertical-encroachment threat in the next 24 months: LOW.** Fashion is too small relative to their CPG/agency/regulated-industry pipeline.
- **As a pricing-pressure threat: MEDIUM.** Their Free + unlimited-guests posture is a strong commercial weapon — even if their object model is wrong for fashion, a budget-constrained brand might tolerate the mismatch.

**Strategic implication.** The competing product's defensible moat is the **Bundle object plus the production-pipeline mental model plus the fashion-shaped schema plus transit storage** — *not* feature parity on annotation or compare or stage gating. Ziflow will be hard to dislodge on review depth and easy to outflank on architecture for indie fashion teams that have *never* used Ziflow. The go-to-market should target greenfield fashion brands rather than Ziflow displacements.

---

## 13. Items requiring a hands-on trial

The following are not determinable from public documentation and would be valuable to confirm in a 14-day trial:

1. **Exact API rate limits and per-endpoint quotas.** Embedding docs hint at meaningful limits but never publish numbers.
2. **Whether "Edit All" permission combined with PDF-comment import can be used to manually carry comments forward as a workaround for the #1 complaint.** The Enterprise public-preview feature hints at this.
3. **The latency profile of large video processing** (e.g., a 4-GB 30-min MOV file) — reviews cite slowness but no published SLA.
4. **Whether folder-level permissions on Pro can scope a freelancer to a single style** (the IP question) in practice, given the absence of attribute-level filters.
5. **Whether Zapier app supports all six webhook events** or a subset.
6. **Whether ReviewAI's checklist verification can be customized with fashion-specific rules** or is a fixed-rule engine.
7. **Real average proof-creation-to-first-decision turnaround** in a typical Pro-tier deployment.
8. **Confirm that there is no native iOS/Android app** — the marketing site advertises only "responsive on device's native browser."
9. **Whether minor versions can be promoted to major versions retroactively** (versioning model edge case).
10. **Whether the "Satellite and trusted accounts" Enterprise feature would let a brand share a Bundle with a vendor's separate Ziflow workspace** — relevant to the vendor-portal differentiation.

These are valuable known-unknowns, not gaps in the analysis.