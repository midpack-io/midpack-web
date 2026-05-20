# Kōbō PLM — Product Teardown for the Bundle-Stage-Approver Competitor

## Executive Summary

**What Kōbō fundamentally is.** Kōbō is a cloud "product operating system" for fashion brands that wraps a traditional fashion PLM data model (Styles, BOMs, POMs, Components, Colorways, Seasons) together with a sample-review workflow, a supplier portal, an inventory module, and a B2B-wholesale/sales-order back end. It is built on a *style-centric* data model: the **Style** is the indisputable atom of the product, and BOMs, POMs, tech packs, sample reviews, files, comments and approvals all hang off the Style as related sub-records. Marketing-wise it positions as "Centric without the complexity" — same lifecycle breadth, modern UI, weeks-not-months deployment, $140/user/month start.

**What they get right.** A genuinely broad, well-modelled API surface (80+ documented resource types, webhooks with HMAC signing, OpenAPI spec, Zapier webhook integration, Adobe Illustrator extension); free supplier seats with a real multi-tenant supplier portal; a tight sample-review primitive with status-change endpoints; first-class POMs/BOMs with style-scoped sub-collections; an iOS mobile app aimed at factory floor and fittings; an aggressive AI roadmap (POM detection from photos, BOM suggestions, anomaly detection, image generation); transparent self-serve pricing and a 14-day no-credit-card trial.

**Where they are weakest.** There is no first-class "bundle/deliverable" object distinct from the Style — file versioning, stage gates and approvals are *attributes* of the Style, not of a separate workflow entity. The audit/history surface in public docs is limited (no documented `stage_transitions` resource or signed approval log). The product is **brand new** — established in 2025 per their own blog; effectively zero independent G2/Capterra/Reddit reviews exist as of May 2026. The platform has bundled inventory, B2B wholesale, packing lists, pick tickets and accounting integrations — a wide surface that makes it expensive ($140–$300/seat) and surrenders ICP focus.

**Direct match to the bundle-stage-approver shape: NO — partial match only.** Kōbō is a **structured PLM database** that *includes* a sample-review workflow and a global "workflows" automation engine, not a workflow tool whose primary unit is a heterogeneous bundle of files moving through named approver-gated stages. The Style object is closer to a typed record with attachments than to a bundle. This is the most important strategic finding for the competing product. (Detailed reasoning in Part 11E.)

---

## Part 1 — Object Model

Kōbō exposes ~80 resource types via its public REST API at `https://api.kobolabs.io/api/v1`, which is the most reliable map of its data model.

**Primary unit of work: the `Style`.** Every other product-development concept is hung off a Style. The Style record carries `style_code`, `name`, `description`, `status` (enum incl. `development`, `active`), `category`, `season`, `brand`, `wholesale_price`, `retail_price`, `cost_price`, `currency`, `sizes`, `colors`, `images`, `skus`, and timestamps. It supports `duplicate`, `restore`, `trash`, `force-delete`, `export` and (importantly) a *tech-pack generator* endpoint at `/tech-packs/styles/{styleId}` that assembles a PDF on demand from live Style data.

**Hanging off the Style:**
- **BOM** (`/styles/{id}/bom`) — line items with `component_id`, `quantity`, `unit`, `placement`, `notes`. Components are a separate first-class library with supplier, MOQ, lead time, specifications.
- **POM** (`/styles/{id}/pom`) — points-of-measure with tolerances and a `measurements` map keyed by size.
- **Variants / SKUs / Colorways** — sub-collections of Style.
- **Sample Reviews** (`/sample-reviews`) — discrete records linked by `style_id` with their own status (`approved`, `rejected`, `revision needed`) and a `change-status` endpoint that takes a `comments` body. **This is the closest thing to a "stage-with-approver" primitive in Kōbō.**
- **Labdips, Moodboards, Quotations, Range Plans, Quality Control, Component Sourcing, Linesheets** — all separate first-class resources, most reference a `style_id` or `component_id`.
- **Tech Packs** — generated, not stored as a versioned entity. The tech pack is *projected* from current Style state; there is no `/tech-packs/versions` collection in the public API.

**Libraries (reusable, workspace-wide):** Colors (with Pantone refs, hex, groups, starred), Library Constructions (e.g. "Flat Felled Seam"), Components, Seasons, Locations, Currencies.

**Operations / Commerce side (also first-class):** Purchase Orders, Sales Orders, Invoices, Credit Notes, Payments, Pick Tickets, Delivery Notes, Packing Lists, Shipments, Goods Receipts, Cancellations (with approve/reject), Returns, Budgets, Inventory (style + component, with transfers, reservations, low-stock queries), Stock Takes.

**Collaboration:** **Notes** (the comment primitive — polymorphic via `notable_type`/`notable_id` with `is_internal` flag), **Tasks** (assignable, related to any record via `related_type`/`related_id`), **Projects** (organizational container for styles).

**Automation:** A **Workflows** resource (`/workflows`) with templates, executions and history — this is a global automation engine (think Zapier-internal), not a per-Style state machine.

**User customizability.** Custom code generation rules for styles/components per brand; Kanban columns can be added/hidden; custom report builder with filter rules; flexible "file sections" (Inspiration, Technical Drawings, Lab Dips, Production Samples) you can rename/reorder. There is no public documentation of custom-field schemas on Style or custom-status definitions — these likely exist in-app but require trial to verify.

**Answers to the three critical questions:**

1. **Unit of work = Style.** Unambiguous.
2. **No first-class "bundle of files representing one deliverable."** Files are attached to a Style and organised into named "sections." The closest workflow primitive is the **Sample Review**, which is more a feedback round than a heterogeneous file bundle.
3. **Heterogeneous files are treated as generic attachments** within sections, with sketches, images and tech-packs getting *some* privileged UI (sketch multi-canvas, image cropping, AI POM detection on images, in-app PDF tech-pack viewer). Video has no documented first-class treatment. PDFs and Excel are handled generically.

---

## Part 2 — Workflow & Stage Mechanics

**Out-of-box stages.** Inferred from the Kanban board feature and changelog screenshots: **Concept → In Development → Sampling → Approved → Production**. Style `status` field accepts at least `development` and `active`. Sample Reviews carry their own status sub-machine (`approved`/`rejected`/`revision needed`). Purchase Orders use `draft → pending → confirmed → in_production → shipped → delivered → cancelled`. Sales Orders mirror this with `processing` in place of `in_production`.

**Configurability.** The 26 January 2026 changelog notes Kanban columns are now toggleable per user with persisted view preferences, but Kōbō does **not publicly document** the ability to define custom stage names, custom transitions, or per-workspace state machines on Styles. The "Workflows" API is an automation/trigger engine ("when X, do Y") rather than a configurable state machine for Styles.

**Transitions.** Manual via UI (drag on Kanban, status dropdown) or programmatic via `PUT /styles/{id}` and `POST /sample-reviews/{id}/change-status`. There is no documented `transition_to(stage)` action with required approver, conditional rules, or branching.

**Gating.** Approval gating exists in two limited surfaces: **Sample Reviews** (you can move a review to `approved`/`rejected` with comments) and **Cancellations** (`/cancellations/{id}/approve`, `/reject`). There is no documented general "this stage requires approver X" model on Styles themselves.

**Parallel tracks.** Not modelled as first-class branches. Costing, sampling and supplier sourcing can all proceed concurrently because each is a separate first-class entity referencing the same Style, but the system does not provide a coordinated multi-track gate (e.g. "PP sample requires both fit-approved AND cost-approved").

**State machine vs labels.** Functionally: **status labels with status-change endpoints**, not a constrained state machine.

**Audit log.** Webhooks fire `style.status_changed`, `purchase_order.status_changed`, `sales_order.status_changed`, `task.completed`, `stock_take.*` with `previous_value` / `new_value` in the payload meta. Whether these transitions are persisted as a queryable audit log on the Style is **not documented publicly** and likely requires trial to verify.

**Notifications.** Yes — first-class `Notifications` resource, push notifications on mobile (May 2025 release), `@`-mentions in comments (per 6 May 2026 changelog showing "@Liam" pinging a supplier).

---

## Part 3 — Versioning & File Handling

**File handling.** Files are uploaded directly to a Style and grouped into customizable sections. The 13 Jan 2026 changelog shows a 50 MB upload cap per file, supports PDF, AI, JPG, PNG, XLSX, and a QR-code-to-mobile upload flow. Files can also be linked from Google Drive (22 Sep 2025) or synced from Dropbox (12 Aug 2025).

**Versioning.** This is the most important architectural gap relative to the competing product. There is **no documented "version" object** as a first-class resource — no `/files/{id}/versions` endpoint, no version pinning, no side-by-side compare. Marketing language ("Track every design iteration with automated version control") suggests an in-app history view, and "Carry over existing styles to new seasons or versions" suggests Style-level cloning, but the public API exposes only `created_at`/`updated_at` timestamps and a `style_inventory` `sample_version` field. **Per-stage version pinning, branching, or "version v3 references v1's resolved comment" — undocumented; treat as not supported.**

**Privileged file types.** Images get a built-in cropper, auto-crop, multi-reference AI generation, AI POM extraction. Sketches have a multi-canvas system (Front/Back/Detail tabs). The tech pack itself has a "Live Tech Pack Viewer with Comments" (6 May 2026) — pin-able comments alongside a live-rendered tech pack. PDFs are generated, not edited. **No documented inline pin-anchored annotation on images, no page-anchored PDF comments, no time-coded video review.**

**Storage.** No published storage cap in tiers. Files live on `storage.koboplm.com` (note the alternate domain `koboplm.com`).

---

## Part 4 — Approval & Approver Mechanics

The strongest approval primitive is the **Sample Review**. The flow per their marketing: "request, submit, review, approve. Brands create sample requests… Suppliers submit samples through the portal with photos and notes. The brand team reviews with threaded comments, annotated images, and measurement comparisons. Approval or rejection is recorded with a timestamp and conditions."

**Assignment.** Not publicly documented as a "named approver per stage." Sample Reviews appear to be open to whichever workspace user has access; supplier-side actions are scoped to their supplier-portal seat.

**Multi-approver.** No documented support for sequential, parallel, or quorum approvals.

**What "approval" technically is.** A POST to `/sample-reviews/{id}/change-status` with `status: approved` and a `comments` body. It is a status mutation, not a signature, not a cryptographically signed audit entry.

**External approvers.** Yes — suppliers approve via the free supplier portal (15 Aug 2025 changelog: suppliers now self-manage their own team with Admin/Editor/Viewer roles).

**Rejection.** Mutates status to `rejected` with comments. No documented branching loops; the team would manually create a new sample round.

**Logged?** Timestamps and the `comments` payload are stored on the sample review; webhook events fire on status change. Whether a fully queryable approval log with author identity persists across iterations is **undetermined from public docs** and would require trial verification.

---

## Part 5 — Comment & Discussion Mechanics

**Comments are first-class but called "Notes."** The `/notes` endpoint is polymorphic: `notable_type` can be `style`, `component`, `supplier`, `customer`, `purchase_order`, `sales_order` and has an `is_internal: boolean` flag for visibility scoping. The 9 April 2026 changelog added categories (Design / Production / QC / Sourcing), rich-text editing, and improved search; 6 April 2026 added file attachments to notes.

**Pin-anchored / page-anchored comments?** The 6 May 2026 "Live Tech Pack Viewer with Comments" supports **pin** ("Pin important comments to keep them visible") and shows comments tied to BOM line and tech-pack sections; whether they anchor to image coordinates is unclear.

**Threading.** Reply UI shown in changelog mockup ("Reply" button) — threaded.

**Resolution.** "Resolve" button shown in changelog UI — resolved/unresolved states exist.

**Persistence across versions.** Because Styles, BOMs, POMs are mutated in place (no immutable version objects), historical comments persist as Notes on the Style — but you cannot view "this comment was made when BOM was at v2" because BOM has no v2.

**Mentions / notifications.** `@`-mentions shown ("@Liam"), notifications via web, mobile push, and email.

**External visibility.** `is_internal` flag on Notes controls supplier-portal visibility. The 6 May 2026 changelog shows "Public / Internal" toggles on tech-pack comments.

---

## Part 6 — Permissions & Collaboration

**Role model on the brand side:** Owner/Admin/Editor/Viewer-style implied from changelog ("Access controls based on your role and the style's lifecycle stage" — 6 May 2026); full matrix undocumented publicly.

**Supplier portal.** First-class, with multi-tenant team management: suppliers (e.g. "Da Pelle Tannery") invite their own team members and assign Admin / Editor / Viewer roles inside their own scope (15 Aug 2025 changelog). **Supplier seats are free** (no per-seat supplier cost) — confirmed on the Centric comparison page and the home page meta-description ("with a free supplier portal").

**Granularity.** The 6 May 2026 changelog reveals lifecycle-stage-aware access ("Access controls based on your role and the style's lifecycle stage") — a positive sign of granular permissioning, though not enumerated. **Per-style IP isolation** (e.g. a freelance designer sees only one Style, not the whole collection) is **plausible but undocumented** — needs trial.

**External collaborator role.** The Supplier role is the documented external role. There is no documented separate "Freelance Designer" or "Buyer" role, though buyer-facing linesheet sharing exists via `/linesheets/{id}/share`.

---

## Part 7 — Integrations & API

**This is Kōbō's biggest pleasant surprise and the most important update to the brief's initial scan.** Kōbō has a **mature public REST API** at `https://api.kobolabs.io/api/v1`, openly documented at `/features/api`.

- **Authentication:** API key in `X-API-Key` header. Scopes are granular (~50 read/write scope pairs).
- **OpenAPI 3.0 spec** published at `api.kobolabs.io/api/v1/openapi.yaml`; Postman collection provided.
- **Rate limits:** 100/min (Basic), 500/min (Professional), 2,000/min (Enterprise). Standard `X-RateLimit-*` headers; `Retry-After` on 429.
- **Pagination/filtering:** standard; supports `updated_since` and `created_since` for incremental sync; idempotency keys for create operations.
- **Webhooks:** ~40 event types across style/component/supplier/PO/SO/inventory/BOM/task/project/payment/stock_take/workflow. HMAC-SHA256 signature verification with rotatable secrets and exponential-backoff retry (1m, 5m, 30m, 2h). Test-fire, delivery history and replay endpoints exist.
- **SDKs:** "Coming Soon" for JS/TS, Python, PHP as of May 2026.
- **Docs domain:** `docs.koboplm.com` referenced (not verified live).

**Native integrations confirmed:** Shopify (bidirectional product/inventory/sales orders), Xero (POs, invoices, payments), Dropbox (file sync), Google Sheets (export), Google Drive (link & magic import), Google Calendar (timeline sync), Adobe Illustrator (extension launched 28 Oct 2025 — browse styles, build BOMs, upload artwork from inside Illustrator), Instagram (post management + AI images), Zapier (webhook integration launched 12 Sep 2025). **Not present:** Figma, Slack, WhatsApp Business, Clo3D, Browzwear, NetSuite, QuickBooks, Stripe, native SAP/Oracle (their comparison page explicitly cites no SAP/Oracle as a weakness).

---

## Part 8 — UX Patterns

Inferred from changelog screenshots and marketing imagery (no trial conducted):

- **Navigation:** Sidebar nav (Styles, Components, Suppliers, etc.) with a top action bar; Kanban board view for styles; dashboard with widgets (production progress, supplier scorecard, open tasks, on-time delivery).
- **Style page** appears to be a card with tabs: Sketches / BOM / POM / Files / Tech Pack / Sample Reviews / Pricing / Inventory.
- **Mobile:** iOS app, supports push notifications, barcode scanning (EAN-13, UPC-A, Code 128, QR, ITF-14), photo-from-mobile via QR upload, 11-language UI (Jan 2026). Marketed at "factories, fittings & trade shows."
- **Onboarding:** Self-serve 14-day trial (no credit card), free supplier seats invited via portal, data migration service from Excel/PDF/Other PLM offered.
- **Speed/reliability:** No independent reports; vendor claims "1–2 weeks to go live."
- **Search/filter:** Global search across linkable types (3 May 2026); custom report builder with dynamic filter rules; bulk actions toolbar.

---

## Part 9 — Pricing & Packaging

| Tier | Price (USD) | Confirmed source |
|---|---|---|
| **Studio Lite** | $140 / user / month | Multiple sources incl. Software Finder |
| **Agency Lite** | $140 / user / month | Software Finder |
| **Studio Pro** | $210 / user / month | Software Finder |
| **Agency Pro** | $210 / user / month | Software Finder |
| Range upper bound | up to $300 / user / month | Centric comparison page |

Other confirmed terms: **per-user** seat pricing; **monthly contracts, cancel any time**; **$0 setup fee**; **14-day free trial, no credit card**; **free supplier seats** (suppliers are not billed); free onboarding/migration assistance; rate-limit-tier mapping ("Basic / Professional / Enterprise") implies API quota scales with plan. Add-ons exist ("plus add-ons based on needs") but no public price list. No published storage caps, user caps, or freemium tier. The marketing example "5-person brand = $14,940/year vs Centric's $100K–$300K+" implies Studio Lite at $140 × 5 × 12 ≈ $8,400 plus presumably add-ons or pro tier.

---

## Part 10 — User Feedback Synthesis

**Critical flag: Kōbō has effectively no third-party review footprint as of May 2026.**

- **G2:** No Kōbō PLM listing found.
- **Capterra / GetApp / Software Advice:** No Kōbō PLM listing found.
- **TrustRadius:** No listing.
- **Reddit** (r/fashion, r/SaaS, r/Entrepreneur, r/smallbusiness, r/femalefashionadvice, r/fashionindustry, r/Sewing): **Zero relevant results.** The name "Kobo" returns only the Rakuten Kobo e-reader.
- **Hacker News / Product Hunt:** No Kōbō PLM launch threads located.
- **YouTube reviews / podcast appearances by the founder:** None located via public search.
- **Software Finder** has a vendor-style listing (no user reviews).
- **Apparel News / WWD / Business of Fashion** — no editorial coverage located.

This is **consistent with vendor self-reporting** that the platform was "established in 2025." The 30 quote target is **not achievable** from independent sources without first-hand trial use. The only available "voice of customer" is vendor-published material on the kobolabs.io blog, marketing site and changelog, all of which is necessarily promotional. The competing product's research plan should treat Kōbō as a **pre-review-volume startup**, not a Backbone or Techpacker-stage competitor.

**Vendor-stated customer signals worth recording:**
- Marketing claim: "Launch Collections 40% Faster."
- Positioning quote: "Built by a fashion founder who spent 10 years managing product development across email, WhatsApp, and 10+ spreadsheets. The goal: stop being the 'human middleware' between design and production." (vs-Centric page)
- About page tagline: "Built by a founder who spent a decade in the Illustrator-to-Excel loop." Based in Australia, used globally.
- Self-acknowledged weaknesses from the Centric comparison page: (1) "Newer platform (established 2020s)," (2) "Less suited for complex global compliance needs," (3) "No legacy ERP integrations (SAP, Oracle)."

**Workarounds and gaps to expect from prospective users** (inferred from the absence of public features, not from quotes): no first-class file-version objects, no time-coded video review, no documented SAML/SSO or HIPAA-tier compliance, no native Slack/Teams notifications (Zapier only), no AI-spec-from-Figma flow.

---

## Part 11 — Strategic Implications for the Competing Product

### A. Mirror list

1. **Free external-collaborator seats.** Kōbō's free supplier portal is its single sharpest competitive lever vs Centric. The competing product, with its "external collaborator role for vendors," should match this — bill only the brand-side seats. Indie brands have many more suppliers/freelancers than internal users; charging per-supplier kills adoption.
2. **Polymorphic comment object (`notable_type` + `notable_id` + `is_internal`).** Kōbō's `/notes` model maps almost exactly to the competing product's "comments attached to bundles, files, versions, and stages." Mirror the polymorphic pattern, add `is_internal` from day one.
3. **HMAC-signed webhooks with retry policy and replay UI.** Kōbō's webhook system (HMAC-SHA256, rotatable secrets, 5-attempt exponential backoff, delivery history, manual retry) is the right reference architecture for an API-first product.
4. **OpenAPI spec + Postman collection at launch.** Kōbō publishes these. For an API-first competitor at $49/seat, this is table stakes, not a moat — but worth committing to.
5. **iOS mobile app for factories/fittings.** Kōbō's mobile app with QR-upload, barcode scan and photo-capture is genuinely well-targeted at the indie-brand reality. Don't skip mobile.
6. **Self-serve, no-credit-card 14-day trial + free migration.** Standard for the segment.
7. **Granular API key scopes (read/write per resource).** Kōbō's scope model is well-designed and a good template.

### B. Differentiate list

1. **Object model — promote "bundle" to first-class.** Kōbō's Style-with-attachments model collapses the deliverable into the product record. The competing product should make the **Bundle a separate, named entity** with its own lifecycle, its own approver chain, and a Style/Project as one of many possible parent types. This is the single biggest structural differentiator.
2. **File versions as first-class objects.** Kōbō has no documented version entity; tech packs are projected from live state, BOMs/POMs mutate in place. The competing product should ship immutable versioned files with side-by-side compare, "current at stage" pinning, and resolved-comment persistence across iterations. This is the design conviction that justifies "files live in the product during active workflow" model.
3. **Real stage engine, not status labels.** Kōbō has status fields plus a global Workflows-as-automation engine, but no per-bundle configurable state machine with named approvers, gates, and signed transitions. Ship this from day one — it's cheap to build correctly upfront and very expensive to retrofit.
4. **Audit log as a queryable, append-only resource.** Webhook payloads tell you what changed, but Kōbō publishes no `/audit_log` endpoint. The competing product should expose stage transitions as a first-class, queryable, immutable log with approver identity and timestamp.
5. **API surface scoped to the workflow, not to running a fashion business.** Kōbō's API includes pick tickets, packing lists, sales-order payments, credit notes, customer addresses, sales shipments, stock takes. The competing product's API should expose only the workflow primitives — bundles, stages, files, versions, comments, approvers, audit — and let customers integrate to their own ERP/commerce stack.
6. **Pricing.** $49 vs $140 is justified entirely by scope: Kōbō includes inventory, B2B wholesale, Xero accounting integration, range planning, linesheets, supplier scoring, QC inspections. Strip the commerce/ops layer and the price drops cleanly.
7. **Transit storage model.** Kōbō stores files indefinitely on `storage.koboplm.com`; the competing product's "export to customer storage when project completes" is a genuine point of difference — pitch it as data sovereignty and lower long-run TCO.
8. **Permissions: per-bundle IP isolation as a marketed feature.** Kōbō's per-style isolation for freelancers is undocumented; lead with it.

### C. Gap list (ship these from day one)

- Time-coded comments on video and pin-anchored comments on image coordinates (Kōbō has neither documented).
- Native Slack and Microsoft Teams integration (Kōbō relies on Zapier).
- Figma integration (Kōbō has Adobe Illustrator, missing Figma).
- Branching workflows / parallel-track gates (e.g. fit AND cost both approved before PP).
- SSO/SAML, SOC 2 (no public mention).
- Public SDKs (Kōbō's are "coming soon").
- Documented audit-log resource with author + signed entry.

### D. Trap list (do NOT chase)

- **Inventory management** (component + style, multi-location, transfers, reservations, stock takes) — Kōbō has all of this. Drop entirely.
- **B2B wholesale** (sales orders, linesheets, buyer portal, invoicing, credit notes, payments) — entirely off-scope for a workflow tool.
- **Accounting integrations** (Xero, QuickBooks) — adjacency that bloats the build.
- **Shopify product sync** — leave to customers' own integration layer.
- **Range planning, season planning, costing calculators, supplier scoring** — fashion-PLM-specific data layers that lock you out of horizontal expansion later.
- **PDF tech-pack generator** — looks easy, becomes a tar pit of template requests.
- **AI image generation / AI BOM suggestions** — Kōbō is going hard here; competing at $49/seat will burn margin.

### E. Direct Match Assessment — Unambiguous Verdict

**Kōbō is NOT an exact match to the bundle-stage-approver shape. It is a structured fashion-PLM database with a sample-review workflow bolted onto it.**

Dimension-by-dimension:

| Dimension | Bundle-stage-approver shape | Kōbō | Match? |
|---|---|---|---|
| Primary unit | Bundle of heterogeneous files | Style (typed record) | ❌ |
| File heterogeneity | First-class equal citizens | Mostly attachments; images/sketches privileged | Partial |
| Version as first-class object | Yes | No documented version entity | ❌ |
| Sequential stages with named approvers | Yes, per-bundle configurable | Status labels + sample-review sub-flow | ❌ |
| Audit log of transitions | First-class, queryable | Webhook events; no documented audit resource | Partial |
| Comments first-class & polymorphic | Yes | Yes (`/notes` polymorphic) | ✅ |
| External collaborator role | Yes, free | Yes, free supplier portal | ✅ |
| Granular per-bundle permissions | Yes | Implied lifecycle-stage-aware; not fully documented | Partial |
| API-first | Yes, public REST | **Yes, public REST + webhooks + OpenAPI** | ✅ |
| Transit storage | Yes | No — permanent storage in Kōbō | ❌ |

**Six dimensions diverge structurally. Kōbō should be treated as a *category-adjacent* competitor, not a direct one.** The customer who needs a bundle-stage-approver workflow tool would have to bend Kōbō's Style object into a shape it wasn't designed for — which is exactly the opening.

### F. Threat Assessment

| Move | Estimated quarters | Likelihood |
|---|---|---|
| Add bundle-as-first-class-object | **6+ quarters** — would require a parallel data model and re-skinning the entire Style page | **Low** — would cannibalise their "Style is the source of truth" pitch |
| Add transit-storage model | 3–4 quarters — Dropbox sync exists, but inverting default-permanent to default-transit is a billing/retention rewrite | **Very low** — directly conflicts with their "one source of truth" marketing |
| Add public API | **Already shipped** — comprehensive, with webhooks and OpenAPI | **N/A — closed gap** |
| Drop pricing to $49/seat | 1–2 quarters technically; commercially difficult given the breadth they bundle | **Low** — would require unbundling inventory/wholesale, which is core to their breadth pitch |
| Real per-bundle state machine | 2–3 quarters — Workflows engine and sample-review primitive provide foundation | **Medium** — natural extension of existing capabilities |
| Pin-anchored image comments + time-coded video | 2 quarters | **Medium** — they're shipping in this neighbourhood (Live Tech Pack Viewer with pinned comments) |

**Net threat.** Kōbō is fast-shipping (the changelog shows 50+ features in 12 months, including a non-trivial public API) and well-funded enough to maintain that pace. But their roadmap signal — AI, inventory depth, wholesale, supplier scoring, accounting — points *away* from the bundle-stage-approver shape, toward becoming a fashion-vertical operating system. **They are unlikely to converge on the competing product's target shape within 18 months.** The competing product's real risk is not Kōbō pivoting toward it; it's Kōbō expanding the fashion-PLM definition so broadly that mid-market buyers stop perceiving a need for a separate workflow tool. Counter by being explicit that the competing product is a *workflow* tool, not a PLM — and by selling into segments beyond fashion as the horizontal architecture allows.

---

## Source List

- `https://www.kobolabs.io/` — home / positioning
- `https://www.kobolabs.io/about-us` — founder origin story
- `https://www.kobolabs.io/features/integrations` — integrations marketing
- `https://www.kobolabs.io/features/api` — full REST API documentation
- `https://www.kobolabs.io/features/project-management` — workflow/project marketing
- `https://www.kobolabs.io/changelog` — release notes Mar 2025 – May 2026
- `https://www.kobolabs.io/academy` — feature taxonomy
- `https://www.kobolabs.io/versus/kobo-plm-versus-centric-software` — Centric comparison page
- `https://www.kobolabs.io/comparisons/kobo-vs-centric` — alternate Centric comparison
- `https://www.kobolabs.io/fashion-plm-articles/kobo-plm-versus-centric-software` — vendor-published comparison
- `https://www.kobolabs.io/blog/tech/best-fashion-plm-software` — self-published landscape article
- `https://www.kobolabs.io/blog/tech/sample-management-software` — sample workflow detail
- `https://www.kobolabs.io/research/plm-state-2026` — vendor market report
- `https://www.kobolabs.io/contact-us` — FAQ surface
- `https://softwarefinder.com/enterprise-resource-planning-software/kobo` — third-party listing confirming Studio Lite / Agency Lite ($140), Studio Pro / Agency Pro ($210)
- `https://apps.shopify.com/size-break-app` — Kōbō PLM's Shopify App Store presence
- `https://api.kobolabs.io/api/v1/` — base API URL
- LinkedIn company page `linkedin.com/company/105757217/` — referenced from site footer
- Cal.com discovery booking link `cal.com/matter-li3qc8/kobo-discovery-call-30-mins`

**No third-party review sources cited** because none with substantive Kōbō PLM content were located on G2, Capterra, GetApp, Software Advice, TrustRadius, Reddit, Hacker News, Product Hunt, or YouTube as of May 2026. This absence is itself a finding and is flagged in Part 10.