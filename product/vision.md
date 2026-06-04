# Vision — Midpack

*Working name: Midpack. Final TBD.*

## The bundle

Midpack is a workflow tool for product-oriented teams (20–100 people, 3–8 active producers plus a wider reviewer ring, regular product or collection releases) where **each product is a bundle of files** — sketches, tech packs, sample / proof photos, reviewer comments, lab dips, costing, briefs, drafts, etc. — moving through sequential stages with a specific person who approves each transition. External collaborators (factories, freelance specialists, client reviewers, sample makers) join free — either via scoped persistent access with stage-level view permissions for ongoing partners, or via a one-off handoff packet (a versioned subset of bundle files at a pin-code URL, no account) for episodic reviews. Comments feed back to the bundle in both modes. The bundle — files, comments, audit log — lives in Midpack as the single source of truth, from first sketch through shipping and into the next season; the team can export the whole bundle to their own Drive / Dropbox / SharePoint at any time (no lock-in), but Midpack stays its canonical home. An MCP server lets the producer (or their AI agent) publish products, advance stages, summarize reviewer feedback across versions, and draft the next iteration from inside the same conversation that produced the brief.

**General-purpose architecture, vertical launch.** The bundle / stage / approver shape is generic — same across indie fashion, course / e-learning production, mid-tier video and branded-content agencies, packaging studios, furniture / home-goods brands, marketing-campaign teams. The product refuses any industry-specific data model. We launch against indie fashion brands first; the Wedge section explains why.

## Why now

**Two shifts in the indie-fashion market.**

Backbone PLM, the only SMB-priced fashion PLM ($99/seat), got acquired by Bamboo Rose in March 2023 and is drifting toward enterprise — its data model is locked to fashion-PLM entities (Style / BOM / POM) and onboarding still requires CSM-led setup. Above Backbone, Onbrand and Kōbō PLM are "Let's Talk" pricing across all tiers at $140–$300/seat. Below Backbone is a $0 stack of Google Drive + 47-tab spreadsheets + WhatsApp with the factory + Slack with the designer + Google Doc for lab dips.

The group of brands that explicitly rejected PLM — because the lock-in, the 2-week onboarding, and the per-industry data model didn't fit a 30-person brand running two collections a year — is still on that $0 stack. These brands are not "Backbone churners"; they are "PLM refusers." That's 90%+ of indie fashion, and the gap between $0 and $99/seat-with-CSM has nothing in it.

Separately, the buyer's calculus shifted: answering "Is style 247 approved?" now takes the head of design 15 minutes because the answer lives in person, on Slack, in email, on WhatsApp, and in three Google Docs. That cost has crossed the threshold where she'll try a tool on Tuesday afternoon if the price is on the homepage and the trial doesn't require a sales call.

## The pillars

1. **The bundle is the main thing tracked.** Products are bundles of heterogeneous files (PDF, PNG, MP4, XLS, AI — and external links to Techpacker / Figma / Loom / Google Doc as references), not tasks (Asana / Hive), not single-asset proofs (Ziflow / Frame.io), not database records (Onbrand), not business units (Kōbō). Each file has its own version chain; the bundle as a whole moves through stages. Remove this and we collapse into a file-attachment-on-a-task tool.

2. **Stages with a specific person who approves.** Each stage has an approver; transitions are gated; every transition is logged with author and timestamp. Remove this and we're a folder.

3. **Comments live on the product.** Discussion is anchored to the product in one continuous thread, so context isn't lost as files iterate — a comment can reference a specific file version via an inline tag, but it doesn't disappear when a new version lands. Re-explaining the same feedback every iteration is the loudest gap users complain about in tools they'd consider; anchoring comments to the product addresses it by default. Remove this and reviewers re-explain themselves every iteration.

4. **Two ways to invite outsiders, both free.** Persistent partners (long-term freelance tech designer, regular factory) get scoped account-less access with stage-level view permissions — they see only the stages they're cleared for. One-off reviewers (a factory cutting one sample, a printer reviewing one proof, a wholesale buyer reviewing one linesheet) get a handoff packet — a versioned subset of bundle files at a pin-code URL pasted into WhatsApp. Comments from either mode feed back to the bundle. Remove this and either external sign-up friction kills adoption, or full access kills IP control.

5. **Midpack is the single source of truth.** The bundle — files, comments, audit log — lives in Midpack as the system of record, from first sketch through shipping and into the next season. The team can export the whole bundle to their own storage at any time (no lock-in), but the canonical, queryable history stays in one place. Remove this and the truth fragments back across Drive, Slack, and WhatsApp — the exact failure we exist to prevent.

6. **Conversational MCP loop.** The AI agent that drafted a product can also publish it, advance it through stages, summarize reviewer feedback across versions, and draft the next iteration — all from chat. Remove this and the AI-native angle is gone; the team is forced back into a separate UI for every workflow step.

In one line:
> Hive treats your product like a task. Ziflow treats it like a review. Onbrand treats it like a database record. Kōbō treats it like a business unit. Midpack treats it as what the work actually is — a bundle of files moving through stages, where each stage produces input for the next, and the work is done when the collection ships.

## Why this shape

The reason we exist is **coordination cost**. "Is style 247 approved?" takes 15 minutes because the answer lives across in-person reviews, Slack, email, WhatsApp, and three Google Docs. One factory cutting the wrong tech-pack version costs $500–800 and three weeks delay. Fit review decisions made on Thursday die between Thursday and Monday because the writeup never compiles. Cross-functional product work has a coordination tax that grows non-linearly with team size and collection complexity — Midpack exists to flatten it.

Two hidden constraints shape *how* we flatten it. They're not the reason we exist; they're the boundaries we have to respect to deliver coordination without breaking how people already work:

- **Brands won't tolerate vendor lock-in.** 90%+ of indie brands rejected dedicated fashion PLM specifically because two seasons of history end up trapped in someone else's database. So the whole bundle is exportable to the brand's own storage at any time — the data stays theirs, even though Midpack is its working home and system of record.
- **External reviewers won't sign up.** Factories live on WhatsApp; a one-off printer or wholesale buyer will not create an account to look at one PDF. So handoff packets use pin-code URLs and open on a phone — no signup ever.

Inside those boundaries, every pillar is a piece of coordination relief. The bundle gives one place to look. Stages with a specific approver make the answer to "is this approved?" a five-second glance. Comments-across-versions stop the re-explanation tax. The two ways to invite outsiders let them participate without infrastructure. One persistent source of truth ends the fragmentation tax; any-time export removes the lock-in objection. The MCP loop closes the AI generation → human review → next version cycle without a UI hop. Remove any pillar and coordination cost goes back up, which is the failure mode we exist to prevent.

A workflow tool, deliberately not a fashion business platform. No inventory. No wholesale. No accounting. No costing engine. No supplier scoring. That refusal is what funds the price and the simplicity.

## Audiences

- **Primary user at launch (the first industry we go after):** Head of design at a 20–100 person indie fashion brand with regular collection releases. Oversees 3–8 designers and tech designers. Owns creative output, accidentally owns process.
- **Other internal users:** designers, tech designers, production leads, founders.
- **Persistent external partners (free, scoped access):** long-term freelance tech designers, regular factory partners, ongoing buying offices. Stage-level view permissions, account-less link, optionally pin-locked.
- **Episodic external reviewers (free, pin-coded handoff packets):** factories cutting a single sample, printers reviewing one packaging proof, wholesale buyers reviewing one linesheet, freelance sample makers hired for one experiment.
- **Expansion industries (post-launch):** course / e-learning production, mid-tier video and branded-content agencies, packaging studios (agencies + small CPG), furniture / home-goods brands, marketing-campaign teams. The same bundle / stage / approver shape works in each; only the vocabulary on the marketing surface changes. Sequencing and reasoning live in the Wedge section below.

**Out-of-scope users:**

- Enterprise PLM customers (Centric, FlexPLM, Bamboo Rose, Teamcenter buyers). 6–18 month implementations, procurement committees, CSM-led onboarding — not our motion.
- Excel + WhatsApp **defenders** (Brazilian São Paulo private-label clusters, Turkish *fason* workshops, parts of the Indian Tirupur supply chain). They defend the cobbled stack as their optimum ("for the *ficha técnica* the best is Excel — don't doubt it" — verbatim from a Brazilian style assistant). Not slow adopters — explicitly the wrong audience.
- Public-broadcast or open-hosting use cases. We are not Imgur, Pastebin, or a public gallery.
- Single-asset reviewers (Frame.io / Ziflow / Filestage territory). We don't do pixel-perfect annotation through stages of one asset.
- Compliance- or IP-regulated review (HIPAA, regulated audit retention). We have an audit log, but not SOC2-grade access logging in scope.

## Wedge and expansion

The same bundle / stage / approver shape shows up across at least six adjacent industries — indie fashion, course / e-learning production, mid-tier video and branded-content agencies, packaging design (agencies + small CPG), furniture / home-goods brands, marketing-campaign teams. All seven invariants hold in each: heterogeneous files per product, file-level versioning, sequential stages, cross-functional approvers, gated transitions, and the output of stage N is the input to stage N+1. The product is built once; each industry is a template difference, not a code change.

**Launch industry: indie fashion brands.** Three concrete reasons:

- **Acute, directly-quoted pain.** A head of design at a 30-person brand answering "Is style 247 approved?" takes 15 minutes; one wrong-version sample costs $500–800 and three weeks; fit decisions die between Thursday and Monday. Verbatim user quotes are available in volume from G2, Capterra, and Software Advice across all four nearest tools (Hive, Ziflow, Onbrand, Kōbō). No other industry in the candidate set has this density of quoted pain.
- **Existing supply-chain network.** Direct factory contacts that warm-introduce the first 5–10 factories — useful for testing the handoff-packet UX with real factory partners early instead of in synthetic conditions. No other candidate industry gives a solo founder this concentration of network leverage.
- **Backbone Lite drift.** The only SMB-priced fashion PLM ($99/seat) was acquired by Bamboo Rose in March 2023 and is drifting toward enterprise. Its data model is locked to fashion-PLM entities (Style / BOM / POM); onboarding still requires CSM-led setup. The 90%+ of indie brands that explicitly rejected PLM ergonomics — vendor lock-in, 2-week onboarding, sales-call procurement — are still on Drive + spreadsheets + WhatsApp, with no SMB-priced product purpose-built for them.

**The architecture refuses fashion specificity.** No Style, no BOM, no POM as built-in entities — just bundles, stages, files, comments, approvers. Lab dips are "just another file with status." The same product moves to course production (outline → storyboard → script → audio → assembly → QA → publish), to a video agency (brief → treatment → storyboard → dailies → rough cut → fine cut → delivery), to packaging (concept → dieline → art → regulatory → printer proof) with zero code changes — only template differences and vocabulary on the marketing surface. This is the advantage Backbone cannot follow without rewriting their core: their Style / BOM / POM model breaks the moment the product isn't apparel.

**Expansion sequence after fashion validates.** Two candidate next industries, ranked by go-to-market cost:

1. **Course / e-learning production.** Reachable via SEO ("instructional design project tracker"), LinkedIn, ATD and IDOL Academy communities. No dedicated PLM-like tool; current stack is Articulate + Asana + Drive + Loom. Highest accessibility for a solo founder.
2. **Mid-tier video / branded-content agencies.** Reachable via YouTube, agency communities, and Frame.io's own integration directory (structural proof of the cobble: Asana + Trello + Monday + Airtable + Box + Dropbox bolted onto Frame.io). Window is real but narrowing as Adobe (Frame.io) and Dropbox (Replay) move up the workflow stack.

If handoff packets fail to displace WhatsApp even partially — i.e., the packet itself as a record isn't valuable enough to the brand — the first industry shifts toward those where the "external collaborator" is more captive to the buyer's network (course production with internal SMEs, packaging with on-account clients) — same architecture, different first industry.

## What success looks like

What a head of design at a 30-person indie fashion brand can do once Midpack is in her stack:

- **Day-1 onboarding without a sales call.** Sign up Tuesday afternoon, get her first style into the system within an hour by pasting a Drive folder link — the existing folder becomes a bundle scaffold, the current tech-pack PDF sits as v1. Shadow Excel keeps running in parallel for 4–8 weeks until the team trusts the bundle enough to drop it; pretending the migration is finished on Friday would be dishonest. No sales call, no CSM.
- **"Is this approved?" answered in 5 seconds.** A glance at the style page replaces a 15-minute investigation across channels.
- **Fit review writeup compresses to a 10-minute Friday task.** Decisions captured directly into the style bundle during or right after the review — not a Monday-morning panic compiling 60 phone photos and three Slack threads.
- **New tech designer onboards from bundle history.** Three months of iteration on style 247 is readable as one timeline, not a series of interviews.
- **Collection ships on calendar, sample iterations average ≤ 3 per style.** Faster decisions, fewer wrong-version errors, clearer fit comments.

**Measurable outcomes.**

Leading (visible weekly):

- **Handoff packet engagement** — % of one-off reviewers who comment inside the packet (vs. reply on WhatsApp).
- **Decision-to-factory delay** — median hours from a fit review to the factory receiving the updated tech pack. Target: under 24 hours.
- **Stage-transition rate** — average number of stage advances per active style per week.
- **"Is this approved?" answer time** — target ≤ 10 seconds.

Lagging (visible monthly+):

- **Sample iterations per style** — target ≤ 3; 4 is a red flag, 5 is a crisis.
- **Collection-on-calendar rate** — % of brand-committed delivery dates met.
- **Brand retention season-over-season** — % of brands using us this collection who used us last collection.
- **Time-to-first-style** — median hours from signup to first active style in a bundle. Target ≤ 1 hour.
- **% of unresolved comments from v_n still visible on v_{n+1}** — target 100% (this is mechanical, not behavioral).

## Out of scope

- **Not a fashion business OS.** No inventory, no wholesale, no accounting, no costing engine, no supplier scoring. (Kōbō PLM territory.)
- **Not a single-asset review tool.** No pixel-perfect annotation through stages of one file. (Frame.io / Ziflow territory.)
- **Not an enterprise PLM.** No 6–18 month implementations, no procurement-team sales motion, no CSM-led onboarding. (Centric / FlexPLM / Bamboo Rose territory.)
- **Not a generation or authoring tool.** We don't help you write the tech pack, sketch the style, or model in CAD. We accept what your team produced and run the workflow around it.
- **Single source of truth, not a vault we lock you into.** The bundle and its history live in Midpack as the system of record; the brand can export everything to its own storage at any time.
- **Not public hosting.** No open-internet "anyone with the link" hosting, no public artifact galleries, no anonymous reviewers. External reviewers are scoped (persistent) or pin-coded (episodic). The brand decides who reviews.
- **Not compliance-bound review.** No SOC2-grade access logging, no HIPAA, no regulated retention in scope.
- **Not a CRM for reviewers.** We don't track reviewer relationships across brands or build a reviewer graph.

## Positioning sanity check (Crossing-the-Chasm)

> For indie fashion brands — and adjacent product-oriented teams in course production, video, packaging, furniture, and marketing campaigns — who lose decisions between fit reviews and the factory, **Midpack** is a workflow tool that turns each product into a bundle of files moving through stages with a specific person who approves each step. Unlike fashion PLMs (Onbrand, Kōbō, Backbone), our architecture is general-purpose — no Style / BOM / POM as built-in entities — pricing is on the homepage (self-serve, no sales call), and external collaborators (factories, freelancers, clients) join free, either through scoped persistent access or through a one-off handoff packet at a pin-code URL.

---

**Related documents:**
- [`risks.md`](./risks.md) — hypotheses we're testing in customer discovery and early customers.
- [`vpc-head-of-design.md`](./vpc-head-of-design.md) — the Olena-P. customer discovery artifact (jobs, pains, gains, competitor reference table).
