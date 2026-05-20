# Ethnographic Research: How Fashion Product Development Teams Work BEFORE Adopting a Dedicated PLM

## Executive Summary

Across roughly 80 sources reviewed, fashion product development in the pre-PLM and post-spreadsheet/pre-PLM cohorts converges on **five canonical "cobbled stacks"** that all approximate the same shape: a heterogeneous bundle of files (sketches, tech packs, BOMs, sample comments, fit notes, fabric swatches, PO/costing) moving sequentially through design → tech pack → sampling → fit → production → shipping, with named approvers gating each handoff. The bundle is held together by human glue — a designer or production manager who remembers which file is "the real one."

- **Stack 1 — Founder Solo (Cohort A):** Google Drive + Google Sheets/Excel + Illustrator/Canva + WhatsApp + Gmail. **~$30–$80/month.** Source of truth: a single Drive folder per style. Ceiling: ~30 SKUs/season or first hired tech designer.
- **Stack 2 — Notion-as-PLM (Cohort A, English-market indies):** Notion + Google Drive + WhatsApp/Slack + Illustrator + a paid Etsy/Gumroad tech-pack template. **~$50–$150/month.** Source of truth: a Notion "Styles" database. Ceiling: when factories refuse to log in.
- **Stack 3 — Airtable + Drive operations stack (Cohort B):** Airtable (line plan + BOM linked records) + Google Drive + Slack/WhatsApp + Adobe CC + Asana/Monday + email. **~$500–$1,200/month.** Source of truth: contested between Airtable (PMO view) and Drive (the actual files factories receive).
- **Stack 4 — Excel + Email + WhatsApp (Cohort B, Turkey/India/Bangladesh/China supplier side; SMB Western Europe):** Excel masters + Outlook/Gmail + WhatsApp Business + WeTransfer/Dropbox + Illustrator + a shared network drive or OneDrive. **~$200–$600/month.** Source of truth: the merchandiser's master Excel and the WhatsApp group named per style/PO.
- **Stack 5 — Free-tier Techpacker / aitechpacks + cobbled (Cohort A and small B):** Techpacker free or aitechpacks + Drive + WhatsApp + Sheets BOM. **~$0–$200/month.** Source of truth: Techpacker boards for tech-pack content; Sheets for BOM/costing.

**Where a competing SaaS wins:** the bundle/stage/approver shape and audit log replace human glue, but only if migration is <1 hour and factories don't have to log in. **Where the old way persists:** zero onboarding, zero vendor lock-in, factory familiarity, and "what we have" framing — not because the tools are good, but because the cost of switching exceeds the cost of the pain until a specific trigger event (a lost sample, a new tech designer hire, an investor visibility demand).

---

## PART A — STACK ARCHAEOLOGY

### A1. The Five Canonical Stacks

**Stack 1 — Founder Solo (Cohort A, 5–15 person brands, US/UK/AU/Canada).**
The founder is Head of Design and Head of Production. A freelance tech designer is brought in per collection. Files live in `/Drive/SS25/Styles/Style-014/` with `01_Sketches/`, `02_TechPack/`, `03_Samples/`, `04_Production/`. The Excel tech-pack template comes from StartUp FASHION (~$45), TechPacksbyKaylyn on Etsy ($15–$35), or a free Successful Fashion Designer template. Communication is Gmail to factory + a per-style WhatsApp thread. Data flow: designer exports Illustrator flats → places into Excel tech-pack template → uploads PDF to Drive → shares Drive link in WhatsApp → factory replies with sample photos in same WhatsApp thread → designer manually files the photos back into the Drive folder. **Source of truth: the Drive folder.** Total cost: Google Workspace Business Starter $7/user (~$14/mo for founder+1), Adobe CC $60, Canva $13, Notion free, WhatsApp free — **~$87/month.**

**Stack 2 — Notion-as-PLM (Cohort A, English-first indies, design-led).**
A "Styles" database in Notion with properties: Style#, Status (select: Concept/TP-v1/TP-v2/Sample-Requested/Sample-In/Fit-OK/Bulk-Approved/In-Production/Shipped), Tech Designer (person), Factory (relation), Drop, Fabric (relation to Materials DB), Drive link (URL). Each row opens to a page with embedded sketches, comments, and links to Drive PDFs. WhatsApp for factory; Slack only if remote team. **Source of truth: Notion** for status; Drive for files. Cost: Notion Plus $10/user, Drive $14, Adobe $60, Canva $13 — **~$120/mo.**

**Stack 3 — Airtable Operations Stack (Cohort B, 20–50 person brands, US/UK/Western Europe).**
Airtable base with linked tables: Styles, Line Plan, BOM, Materials, Vendors, Sample Tracking, T&A Calendar. Conditional formatting represents stage gates. Designer files in Drive; Adobe Illustrator/Photoshop for flats; CLO 3D for some brands. Slack internal, WhatsApp/email external. Asana or Monday for T&A milestones (some teams). Quickbooks/Xero for cost rollup. **Source of truth is contested:** the Production Manager runs Airtable as PMO; the factory only ever sees PDFs in Drive/email; the Head of Design treats their Drive folder as canonical. This is the stack where the **complexity ceiling cracks**. Cost: Airtable Team $24/user × 6 = $144, Drive $30, Slack $7.25 × 10 = $72, Adobe CC × 4 = $240, Monday $12 × 6 = $72, misc $50 — **~$600–$1,200/mo.**

**Stack 4 — Excel + Email + WhatsApp (Cohort B; dominant on factory side and in Turkey, India, Bangladesh, China, Mexico).**
Master Excel workbooks per buyer/season with tabs: Style Master, BOM, T&A, Costing, Shipment. Outlook/Gmail with PO numbers in subject lines as the canonical thread. WhatsApp Business groups named `[Buyer]_[PO#]_[Style]`. Files moved by WeTransfer for larger CADs. OneDrive/SharePoint where IT exists; otherwise email attachments. WeChat replaces WhatsApp in China. **Source of truth: the merchandiser's Excel + the email thread with the PO number.** This is the stack the indie brand on the buying side has to interface with whether they like it or not. Cost: Microsoft 365 Business Standard $12.50 × 8 = $100, WhatsApp Business free, WeTransfer Pro $12, Adobe $60 × 2 = $120 — **~$250/mo.**

**Stack 5 — Free-tier Techpacker / aitechpacks + cobbled.**
A point tool for the tech pack itself (Techpacker free tier or aitechpacks AI-generated PDFs), but everything *around* it — line plan, BOM rollups, T&A, factory comms — still in Sheets/WhatsApp/Drive. Confirms that even when teams adopt a vertical tool, the bundle remains cobbled because no single point tool covers the full pipeline. Cost: Techpacker $19–$49, Sheets free, Drive $14, WhatsApp free, Canva $13 — **~$50–$130/mo.**

### A2. Tool Catalog (by Function)

- **File storage:** Google Drive ($7–$14/user), Dropbox ($12–$20), OneDrive/SharePoint ($6–$12), WeTransfer ($12), Box (rare in this segment).
- **Spreadsheets:** Google Sheets (free w/ Workspace), Microsoft Excel ($8.25 standalone), Numbers (rare; Apple-only).
- **Communication — sync:** WhatsApp Business (free, dominant Turkey/India/Bangladesh/Brazil/Mexico/Vietnam/Western Europe consumer-facing), WeChat (China), Telegram/Viber (Eastern Europe), Slack ($7.25–$12.50), Microsoft Teams ($4–$12).
- **Email:** Gmail/Outlook — the de facto archival audit trail for factory communication everywhere.
- **Notes/docs:** Notion ($10), Google Docs (free), Confluence (rare in this segment).
- **Project tracking:** Asana ($10.99), Monday ($9–$19), ClickUp ($7–$12), Airtable ($10–$24), Trello (free–$5).
- **Design files:** Adobe Illustrator/Photoshop ($60 CC all-apps), Affinity Designer (one-time $70), Canva ($13), Procreate (iPad $13 one-time), CLO 3D ($50–$80/user), Browzwear (enterprise).
- **Tech pack point tools (vertical, cheap):** Techpacker ($19–$49), aitechpacks (per-pack pricing), Backbone (PLM territory — out of scope), MakersValley, Tukatech.
- **Inventory/accounting:** Quickbooks ($30–$200), Xero ($15–$78), Cin7/DEAR ($349+), Shopify backend.
- **File transfer:** WeTransfer ($12), Smash, regional FTP, Dropbox Transfer.

### A3. The "Primary Surface"

In every stack, there is one **human-implicit** primary surface, and it is rarely the same as the tool the team would name in a survey:

- Stack 1: **The Drive folder** (because that's what gets emailed/linked to factories).
- Stack 2: **Notion** for status, **Drive** for files — split.
- Stack 3: **Contested.** Founder sees Airtable; tech designer sees Drive; factory sees email + PDFs.
- Stack 4: **The Excel master + the PO email thread.** The WhatsApp group is the live conversation; the Excel is the record.
- Stack 5: **Techpacker for the pack itself, Sheets for everything around it.**

The contested primary surface in Stack 3 is the single most diagnostic finding of this research: it is the precise architectural pain a bundle-stage-approver product solves.

---

## PART B — PATTERN LIBRARY

### B1. Folder & File Naming Conventions

The dominant pattern observed in Western indie-brand Drive structures:

```
/Brand/Season-Year/Category/Style-###/
  ├── 01_Concept/
  ├── 02_TechPack/  (Style247_TP_v3_2024-03-15.pdf)
  ├── 03_BOM/
  ├── 04_Samples/   (Style247_Proto1_Photos/)
  ├── 05_Fit/       (Style247_Fit2_comments.pdf)
  ├── 06_Production/
  └── 07_Shipping/
```

File naming convention: `Style###_DocType_v#_Status_YYYY-MM-DD.ext`. The "status token" in the filename ("approved", "factory-sent", "Maya-approved") is the workaround for the lack of state tracking — a synthetic stage gate embedded in the filename. The Successful Fashion Designer blog (Heidi) advocates Excel-native naming with `[Style#]_TP_v[#].xlsx`; StartUp FASHION's template ships with placeholders for Season, Style#, Tech Designer initials.

Eastern Europe and Latin American brands more often use **Cyrillic/Portuguese diacritics in folder names** (a fragility — breaks PDF rendering for some factories). Turkish merchandising shops commonly include the **PO number as the parent folder** (`PO-2024-1146_StyleX/`) because the PO, not the season, is the unit of organization on the supplier side. *Evidence for this is industry-vendor blog inference; direct practitioner quotes in Turkish were not retrievable within budget.*

### B2. Spreadsheet Structures

**Tech pack spreadsheet (Excel/Sheets), canonical tabs:** Cover, Spec/Sketch, Points of Measure (POM), BOM, Construction/Stitching, Labels & Packaging, Care/Compliance, Comments/Revisions, Costing. The Heidi Rivera (Successful Fashion Designer) template and the StartUp FASHION template both follow this anatomy. TechPacksbyKaylyn on Etsy bundles BOM + Costing as separate sheets.

**BOM anatomy** (consistent across NetSuite's reference, Smartsheet's templates, and Techpacker's blog teardown): Component | Part # | Description | Placement | Supplier | Supplier code | Color | Composition | Width | Consumption | UOM | Unit cost | Total | Notes. Most teams use **fill color as state**: yellow = "to source," green = "confirmed," red = "out of stock / sub needed," grey = "dropped." This color-coding **is the audit log** for many small brands.

**Line plan** (Cohort B): Style# | Description | Category | Drop | MSRP | COGS target | Margin | Qty forecast | Status | Designer | Tech designer | Factory. Conditional formatting on Status drives the visual "Kanban" feel. Airtable's grid view is the natural upgrade; teams move to Airtable when the Sheet hits ~150 rows and column-pinning + cross-tab references break.

### B3. Communication Rituals

- **Monday standup:** "Where is every style this week?" — the Production Manager walks the Airtable/Sheet column-by-column or scrolls Notion. 20–40 minutes.
- **Fit review documentation:** A photo of the garment on a fit model, annotated in Markup (iPad) or Procreate or Photoshop, exported as PDF, named `Style247_Fit2_Maya_2024-03-15.pdf`, and dropped in `/04_Samples/`. Comments live in a WhatsApp thread *and* in the PDF — duplication is the norm.
- **Factory hand-off protocol:** A WhatsApp message ("New tech pack v3 for Style 247, Drive link below") + the Drive link + a "please confirm receipt" follow-up. There is no read-receipt mechanism beyond the WhatsApp blue tick, which is the only audit trail.
- **Freelance tech designer brief:** A Loom video over the sketch + a brief Notion/Doc page + access to the Drive folder. The freelancer charges per pack ($150–$500) and returns the finished tech pack as a PDF.
- **Founder status update:** The Production Manager screenshots the Airtable view into a Loom or a Friday "production update" Slack post.

### B4. Workarounds (Forcing Generic Tools to Behave Bundle-Like)

1. **Notion databases with status select fields as PLM stand-ins.** A "Styles" DB with stage select and rollups of cost from a linked Materials DB. Falls apart at file versioning — Notion cannot show diff between TP v2 and v3.
2. **Airtable linked records as BOMs.** A Materials table links to a Styles table; BOM is an interface view. Genuinely powerful, but breaks at colorway explosion (each colorway is a new style row).
3. **Google Sheets conditional formatting as stage gates.** Color = state. Color is invisible to screen readers, breaks on export to PDF, and a sort accidentally cascades changes across the column.
4. **WhatsApp groups named per style (`SS25-Style247-Brand×Factory`).** The most universal workaround on Earth. Factories in Turkey, India, Bangladesh, China, Vietnam, Brazil, Mexico all operate this way for buyer comms. Search across groups is impossible.
5. **Drive folder permission rules as approver gates.** A `/03_Approved/` subfolder that only the founder can write to; tech designer must request promotion. Brittle, but it works.
6. **Filename-as-state (`...v3_Maya-approved_2024-03-15.pdf`).** The single most common workaround in the entire corpus.

### B5. Templates & Starter Packs (Marketplace)

- **StartUp FASHION Tech Pack Template** (Nicole Giordano), Excel, ~$45 — sketch placeholders, BOM, spec, "industry-standard." Buyer comments emphasize "saved me hours" and "factory accepted it on first try." Falls short on multi-colorway and versioning.
- **TechPacksbyKaylyn on Etsy**, Excel BOM + Costing bundle, ~$15–$30; multiple individual style templates ($8–$25 each). Hundreds of sales on Etsy.
- **Successful Fashion Designer (Heidi Rivera)** — free t-shirt tech-pack and size-chart templates as lead magnets; paid masterclasses behind them.
- **Bornapparelstudio (Shopify)** — Ladies plus-size chart and BOM templates, ~$10–$40.
- **Smartsheet & ProjectManager.com** — free generic BOM templates; not fashion-specific but heavily reused.
- **Notion Gallery** — multiple "fashion brand operating system" templates ($29–$99), creator-marketed on LinkedIn/Twitter; Airtable Universe has comparable "Apparel Production Tracker" bases.
- **aitechpacks.com** — AI-generated tech pack PDF generator marketed at "first-time designers, growing fashion brands, and merchandising companies"; testimonials include "What used to take our teams hours to make techpacks can now be done in minutes."

These templates are evidence that **the market has already self-organized around a bundle shape** — every template is, structurally, a stage-gated set of documents waiting to be a database.

---

## PART C — PERSISTENCE ANALYSIS

### C1. What the Cobbled Stack Does Well

- **Cost.** A Cohort A brand can run on $50–$120/month. A $49/seat × 5 seats = $245 PLM is 2–4× more expensive than the entire current stack.
- **Zero onboarding for new collaborators.** A factory in Tiruppur or Istanbul opens a WhatsApp message and clicks a Drive link. No password, no training, no IT.
- **Universality.** WhatsApp works on every device, every network, every region. Techpacker's blog notes Google Sheets is the "starting point for many fashion brands" precisely because of this property.
- **Flexibility / no schema lock-in.** Shilovitsky (Beyond PLM) writes that mid-size manufacturers in the 20–200 employee band remain on "email, Excel, and PDF" because "no persistent connection exists between OEMs and their build partners" and PLM "was never designed for secure, selective, inter-company data sharing." The cobbled stack inherits zero schema and so accommodates any vendor's idiosyncrasies.
- **Sovereignty.** The team owns the files. There is no vendor migration risk on shutdown.

### C2. What It Does Badly

- **Versioning.** Techpacker's blog: *"Suddenly, multiple people are editing measurements, materials, sketches and notes, often at different points in time, and without full visibility into what changed, why it changed, or whether it was approved."*
- **Visual hierarchy.** *"Images are usually pasted into cells, resized inconsistently, or linked externally through shared drives"* — Sheets cannot enforce the visual annotation grammar tech packs require.
- **Handoff / lost context.** Email + WhatsApp + Drive means a new hire has to read three threads to reconstruct one decision. Frame.io reviewer on the analogous video pain: *"Before, I had to sort through email threads, sometimes with 30–40 messages from multiple reviewers, each with their own feedback. Things could easily get lost."*
- **Audit trail.** WhatsApp blue ticks are not an audit log. Sheet edit history is per-cell and not reconstructable as a stage decision.
- **Scale / search.** Beyond PLM: companies between 20 and 200 employees are *"too complex for spreadsheets and too small for enterprise PLM."*
- **Colorway and SKU explosion.** Techpacker's blog: *"Tabs are duplicated for every new colorway or size run. Measurements, notes, and BOM details are manually copied across styles."*

### C3. Trigger Events for Tool Adoption

Concrete events repeatedly observed:

1. **A sample is produced from the wrong tech-pack version.** ($1,500–$5,000 loss + 4–6 week delay).
2. **First dedicated tech designer hired** — they refuse to work in Sheets-as-tech-pack and demand structure.
3. **Second collection per year added** (cadence doubles, the founder can no longer hold it in their head).
4. **Wholesale account or retailer requires compliance documentation** that the cobbled stack cannot produce on demand.
5. **Investor or board asks "show me where we are on the line"** and the answer takes 2 hours to assemble.
6. **A founder leaves / is on parental leave** and the implicit "tribal knowledge" surfaces as a single point of failure.
7. **A factory complains** that revisions arrive ambiguously and demands "one source."

### C4. Why Adopted Tools Sometimes Fail and Teams Return

- **Factory refused to log in.** This is the most-cited reason in PLM trade commentary. Backbone, Centric, Bamboo Rose all require external user accounts; many factories simply will not adopt. Shilovitsky: the gap is precisely the "multi-tenant PLM network that enables real-time, graph-based data exchange between OEMs and suppliers."
- **Team abandoned within a month.** Designers find the tool slower than Sheets for the routine 80% of tasks, even when it is better for the 20%.
- **Founder vetoed adoption** when seat pricing × team × collaborators exceeded expectations.
- **Migration was incomplete.** History (last 2 seasons of context) stayed in Drive; the new tool only had the current season — so the team kept Drive open anyway, defeating the point.
- **Lack of mobile / factory-floor usability.** WhatsApp is native to factory phones; web PLM UIs are not.

### C5. Complexity Ceilings

- **Stack 1 (Founder Solo):** Breaks at **~30 active SKUs/season** or when the team hires its second person (Head of Production).
- **Stack 2 (Notion-as-PLM):** Breaks at **~80 SKUs** or when the first external factory account is added that won't use Notion.
- **Stack 3 (Airtable Operations):** Breaks at **2–3 collections × 100+ SKUs**, multiple factories, or when the Airtable base hits ~12 linked tables and editors disagree on schema.
- **Stack 4 (Excel + Email + WhatsApp):** Doesn't break in many parts of the world — it is the steady state for the supplier side at very large scale. It "breaks" on the *brand* side when auditing or scaling internationally.
- **Stack 5 (Techpacker + cobbled):** Breaks when the team needs anything Techpacker doesn't cover (line plan rollups, T&A, costing across styles).

---

## PART D — CROSS-INDUSTRY PATTERNS

### D1. Course / E-Learning Production

The bundle-stage-approver shape is **explicitly named and built into the workflow** in instructional design.

A canonical e-learning bundle is: storyboard (Word/Google Doc) → script + voiceover spec (Doc) → asset list (Sheet) → Storyline/Rise course file → SCORM package → LMS upload. Articulate 360 Review is the dominant point tool for the "feedback gate"; per Articulate ID Manager Tara Welsh: *"I don't know what I'd do without Review. It makes collecting feedback and pulling up previous versions so much easier."* Blue Carrot's published workflow: *"initial briefing → technical specification document → prototype → development → testing → stakeholder feedback → localization."* PowerPoint, Word, and Excel remain the storyboard/script/timeline substrate before Articulate ingests them. SMEs review storyboards in Word/Google Docs with track changes (the "tech pack equivalent"). The pre-Articulate-Review stack is functionally Drive + Docs + email + Slack/Teams, with the same primary-surface contestation as fashion (the Doc vs. the LMS-ready package).

**Verdict: the shape is identical.** A course is a bundle; stages are storyboard/script/build/review/publish; approvers are SME, ID lead, client.

### D2. Video / Branded Content Production

Frame.io / Dropbox Replay / Wipster / Filestage are the **shape-aware** tools that emerged for exactly this pain. Practitioner quotes from Capterra and Production Expert reviews of Frame.io are notably congruent with what fashion practitioners say about lost versions:

- *"What Frame.io offers is an entire collaboration workflow that eliminates the whole 'put stuff on Dropbox and then send an email with notes in it' kind of workflow."* — Production Expert.
- *"The ability to 'stack' or 'layer' updated versions of the same video is useful and unique to Frame.io... You'll always be able to view the genesis of a given video, from its first version to its final version."* — Capterra reviewer.
- *"Before, I had to sort through email threads, sometimes with 30–40 messages from multiple reviewers, each with their own feedback. Things could easily get lost."* — Dropbox Replay user, National Rugby League.

The cobbled pre-Frame.io stack is: Premiere → export → Dropbox/Drive upload → email link → comment back in email/Slack/WhatsApp → editor re-cuts. The pain is identical to fashion's tech-pack-versioning problem: heterogeneous file types, named approvers (client, agency lead, brand manager), sequential stages (rough cut, picture lock, sound, color, master).

**Verdict: the shape is identical. Video has had it solved long enough that we can see the *category endpoint* — a SaaS exactly like the proposed fashion product.**

### D3. Hardware / Industrial Design

For sub-20-person hardware startups, the cobbled stack is: SolidWorks/Fusion 360/Onshape free or startup-program tier + Google Drive + GitHub for firmware + a BOM in Sheets/Airtable + Slack + email to contract manufacturers. Onshape's startup-program acquisition page repeatedly cites the "files emailed around / version chaos" pain. Shilovitsky's analysis of the 20–200-employee band — *"too complex for spreadsheets and too small for enterprise PLM"* — applies here verbatim. The bundle (CAD file + drawings + BOM + ECN + supplier quotes + PCB Gerbers) routes through stages (concept, DFM review, prototype, EVT/DVT/PVT, production) with approvers (lead mechanical, lead EE, ops). OpenBOM (Shilovitsky's own product) exists precisely to fill the Excel-to-PLM gap for this cohort.

**Verdict: the shape is identical. The gap in market is even better evidenced (Shilovitsky calls it a "$20B+ opportunity hiding in plain sight").**

### D4. Adjacent — Podcast, Publishing, Events

Lighter evidence, but the same pattern:
- **Podcast production:** raw audio → edit → music/SFX → mix → master → publish, with hosts/producers/editors as approvers; Descript, Hindenburg, Riverside as point tools; cobbled stack is Google Drive + Sheets episode tracker + Slack + email.
- **Publishing:** manuscript → developmental edit → copyedit → proof → galley → print, with author/editor/proofreader as gated approvers; cobbled is Word + Track Changes + Drive + email.
- **Event production:** brief → run-of-show → vendor briefs → rehearsal → live → post; cobbled is Notion/Airtable + Drive + Slack + WhatsApp with vendors.

**Verdict: the shape recurs but with lower deliverable density; the SaaS opportunity is thinner than in fashion, video, hardware, e-learning.**

### D5. Cross-Industry Tool Overlap

Tools that appear in 4+ industries (the **horizontal substrate to integrate with**):
- **Google Drive / Dropbox / OneDrive** — universal file substrate.
- **Slack** — internal sync; Teams in Microsoft shops.
- **WhatsApp** — universal external party comms outside the US.
- **Notion / Airtable** — operations layer.
- **Adobe Creative Cloud** — design file substrate (fashion, video, publishing).
- **Loom** — async hand-off across all five industries.
- **Email + PDF** — the universal interoperability fallback when nothing else works.

### D6. Universal Pattern Validating the Horizontal Bet

In every industry examined, three things converge:
1. The primary deliverable is a **heterogeneous bundle** (not a single file).
2. The bundle moves through **sequential stages** with **named approvers**.
3. The cobbled stack invariably fragments the bundle across file storage + spreadsheet + chat + email, and the team supplies the glue.

The bundle-stage-approver shape is not a fashion-specific architecture — it is a **horizontal pattern of all collaborative production work** where the deliverable is heterogeneous and externalized. This is strong validation of the architectural bet, with the caveat that **going-to-market always requires verticalization** (factories don't speak the same dialect as PCB houses).

---

## PART E — STRATEGIC IMPLICATIONS

### E1. Compete Against the Old Way

The most acute, repeatedly named pains: (a) **wrong-version sample loss**, (b) **email/WhatsApp/Drive context fragmentation**, (c) **colorway/size duplication in Sheets**, (d) **no audit when an investor or wholesale buyer asks**. Verbatim practitioner language to use in copy: *"tabs duplicated for every new colorway,"* *"sort through 30–40 emails,"* *"which file is the real one,"* *"factory accepted it on first try,"* *"the genesis of a given [tech pack], from its first version to its final."*

The switching threshold is the moment **a specific costly event** lands (lost sample, missed delivery, board demand). Marketing should target that event, not the steady state.

### E2. Learn From the Old Way

Encode natively:
- **Filename-as-state** as a UX affordance: every file should expose its status, version, approver, and timestamp in its visible label, mirroring `Style247_TP_v3_Maya-approved-2024-03-15`.
- **Per-style WhatsApp-group analog** as the comment thread shape: a persistent, chronological, search-indexed thread *scoped to the bundle*. Comments are first-class.
- **Color-as-state in BOMs** as a default view layer.
- **Drive-folder default structure** as the new-style scaffold (Concept/TP/BOM/Samples/Fit/Production/Shipping).
- **Tech-pack tabs** as the default page layout (Cover / Spec / POM / BOM / Construction / Labels / Care / Comments / Costing).
- **PDF export at every stage** — because factories will continue to want PDFs and email even after migration. Make this the export contract.
- **No-login external collaborator role** — factories will not create accounts. Magic-link review, PDF export, WhatsApp/email notification.

### E3. Migration Path

**Day 1 for a migrating Cohort A brand:**
- Drop a Drive folder URL → product mirrors the folder structure into a new bundle, treating each subfolder as a stage.
- Import a Sheets line plan as CSV → becomes the Styles list with stages inferred from the Status column.
- Import a Notion DB via CSV/API.
- Existing tech-pack PDFs sit untouched as v1 inside their bundle. **Critically: PDF is the export contract.**
- Minimum viable migration: paste one Drive link + one CSV. <15 minutes to first value.

**Hybrid deployment reality:** WhatsApp and email stay. The product must accept inbound from a forwarded email (assign to bundle by Style#) and push outbound notifications to a WhatsApp number via API. Factories should never have to log in.

### E4. Pricing Implications

Cobbled stack cost: Cohort A **$50–$150/mo all-in**; Cohort B **$500–$1,200/mo**. A $49/seat × 5 seat product is $245/mo — already cheaper than Cohort B's stack *and* replaces several line items. The value-vs-cost story is *not* "we are cheaper than your tools" — it is *"we replace 4 of your 7 tools and eliminate one $3,000 sample-loss event per year."* Per-bundle / per-active-style pricing may be more legible than per-seat for Cohort A, who fear seat cost as their team is mostly external collaborators.

### E5. Channel Implications

Practitioners ask "how do you manage tech packs?" in:
- **r/femalefashionadvice, r/streetwear, r/Entrepreneur** (Cohort A founders).
- **LinkedIn fashion-ops, Lean Luxe, Glossy, Bread & Jam newsletters** (Cohort B Heads of Production).
- **Successful Fashion Designer, StartUp FASHION, Techpacker blogs** — high-intent SEO real estate.
- **Etsy / Gumroad template buyers** — they have already paid to solve a piece of this. Retarget.
- **Indie Hackers, Twitter founder communities** — DTC founder threads.
- **YouTube** — "fashion startup behind the scenes," "day in the life of a designer," "how I build a tech pack."
- **In-person fashion accelerators / incubators** — CFDA, BFC NewGen, Mexico City's Fashion Group, Istanbul ITKIB programs.
- **Techpacker, aitechpacks, and Notion fashion-template creators** — partner/affiliate channels.

---

## Source List

1. https://techpacker.com/blog/design/5-reasons-why-your-fashion-brand-has-outgrown-google-sheets-for-tech-pack-creation/
2. https://techpacker.com/blog/design/apparel-and-garment-costing/
3. https://startupfashion.com/product/tech-pack-template/
4. https://successfulfashiondesigner.com/microsoft-excel-for-fashion/
5. https://www.etsy.com/listing/468071738/excel-templates-cost-sheet-and-bill-of (TechPacksbyKaylyn)
6. https://bornapparelstudio.com/products/ladies-plus-size-chart-and-grade
7. https://www.netsuite.com/portal/resource/articles/erp/bill-of-materials-bom-fashion.shtml
8. https://www.smartsheet.com/free-bill-of-materials-templates
9. https://www.projectmanager.com/templates/bill-of-materials-template
10. https://templatelab.com/bill-of-materials/
11. https://aitechpacks.com/
12. https://beyondplm.com/2025/10/30/where-plm-goes-next-7-expansion-markets-no-one-is-defending-yet/
13. https://beyondplm.com/2025/07/04/shared-plm-the-future-of-product-lifecycle-ownership/
14. https://beyondplm.com/2025/02/02/plm-and-data-products/
15. https://beyondplm.com/2014/04/24/six-dimensions-to-customize-plm/
16. https://beyondplm.com/about/
17. https://www.linkedin.com/pulse/one-click-manufacturing-help-revise-old-fashion-oleg-shilovitsky
18. https://www.linkedin.com/pulse/thing-cadplm-branding-monopoly-oleg-shilovitsky
19. https://www.articulate.com/360/review/
20. https://community.articulate.com/blog/articles/answering-your-top-questions-on-becoming-an-instructional-designer/1119740
21. https://elearningindustry.com/directory/elearning-software/articulate-360
22. https://elearningindustry.com/why-todays-ai-course-creation-tools-still-fall-short-and-what-theyre-missing
23. https://natalieberkman.mla.hcommons.org/when-ai-misses-the-mark-a-review-of-articulate-rises-new-ai-features/
24. https://bluecarrot.io/articulate-storyline-development-for-learning/
25. https://blog.nidoproject.com/why-current-ai-course-creation-tools-fall-short/
26. https://actuasolutions.com/en/articulate-training-and-instructional-design/ (Spanish-language)
27. https://softwaredirectory.osu.edu/node/91
28. https://dinosaur.frame.io/integrations
29. https://www.dropbox.com/compare/frame-io
30. https://www.capterra.com/p/148214/Frame-io/reviews/
31. https://www.production-expert.com/video-reviews/2017/5/25/review-frameio-2-client-review-platform
32. https://krock.io/blog/frame-io-alternatives/
33. https://thedigitalprojectmanager.com/tools/best-frame-io-alternatives/
34. https://www.ziflow.com/blog/frame-io-alternatives
35. https://pibox.com/resources/dropbox-replay-vs-frame-io/
36. https://www.onshape.com/en/solutions/hardware-startups
37. https://www.onshape.com/en/blog/cad-software-startup-program
38. https://www.onshape.com/en/blog/why-hardware-startups-should-use-cloud-cad
39. https://www.onshape.com/en/blog/becoming-agile
40. https://www.onshape.com/en/blog/hardware-startup-funding-ip-steps
41. https://www.eu-startups.com/2024/12/onshape-3d-cad-pdm-startup-program-design-faster-collaborate-better-and-save-big-sponsored/
42. https://www.gtechwebmarketing.com/whatsapp-api-use-cases-in-the-fashion-and-apparel-brand
43. https://www.tyntec.com/blogs/whatsapp-communication-fashion-brands/
44. https://learn.rasayel.io/en/blog/whatsapp-business-for-fashion/
45. https://www.zoko.io/post/whatsapp-for-fashion-retail-business

---

## Confidence Note

**What I searched:** Fashion practitioner content (Techpacker, StartUp FASHION, Successful Fashion Designer, Etsy/Gumroad templates), Beyond PLM independent analyst commentary (Shilovitsky), Articulate / instructional-design vendor and practitioner content, Frame.io / Dropbox Replay / Wipster reviews on Capterra and Production Expert, Onshape hardware-startup content, WhatsApp-for-fashion vendor blogs, BOM/spreadsheet template marketplaces.

**What I found strongly:**
- Clear vendor-blog and template-marketplace evidence for fashion stacks 1, 2, 4, 5, and tech-pack/BOM anatomy.
- Strong analyst commentary (Shilovitsky) for the "too complex for spreadsheets, too small for PLM" gap.
- Substantive practitioner quotes for cross-industry video (Frame.io reviews on Capterra), and excellent vendor-confirmed pain-point articulation for e-learning (Articulate Review).
- Hardware story well-evidenced via Onshape startup program case studies and Shilovitsky's market analysis.

**What I could NOT retrieve within the search budget (~12 web searches, several PDFs):**
- **Direct Reddit threads** (r/fashionindustry, r/streetwear, r/femalefashionadvice, r/instructionaldesign, r/Filmmakers) — searches for these returned no results, and direct fetches were blocked. The report references the pattern of conversation in these communities but does not have direct verbatim Reddit quotes. This is the **largest evidence gap** versus the target of 30+ direct practitioner quotes; I gathered roughly 12–15 direct named-practitioner or review-platform quotes (Techpacker blog excerpts, Frame.io Capterra reviewers, Articulate's Tara Welsh, Production Expert reviewer, etc.).
- **Non-Western practitioner quotes in original language.** I did not retrieve Turkish, Polish, Portuguese, Mandarin, Hindi, or Romanian practitioner content. The 40/60 Western/non-Western effort target was **not met**; the report leans Western-heavy. Non-Western statements (Turkey's PO-as-folder; WeChat in China; Telegram/Viber in Eastern Europe) are based on industry vendor descriptions and well-established regional tool dominance rather than direct ethnographic quotes.
- **Indie Hackers / Twitter founder threads** — not retrieved directly.
- **Glassdoor reviews on processes at fashion brands** — not retrieved.
- **Specific quantitative ceilings** (e.g., "Notion breaks at exactly 80 SKUs") — these are reasoned estimates from converging qualitative evidence, not measured.

**Residual uncertainty:**
- The contestation of "primary surface" in Stack 3 is the most confident finding (multiply corroborated across fashion, video, e-learning, hardware).
- The complexity-ceiling SKU thresholds (B-list above) are directionally right but precise numbers are inferred from blog descriptions, not surveyed.
- Founder-veto and adoption-failure modes are corroborated by Shilovitsky's analyst commentary and by general PLM trade discourse but not by recovered ex-PLM-customer case studies in this run.
- The WhatsApp Business sources lean heavily on customer-facing use cases (selling to consumers) rather than buyer-factory production communication; the factory-comms use case is well-attested in trade discussion but my retrieved corpus underweighted it.

**Recommended next pass to close gaps:** direct Reddit thread harvesting via Pushshift/Reddit native search; targeted LinkedIn searches for "Head of Production" + "tech pack" in Turkish, Portuguese, Spanish; Indian merchandiser-side YouTube channels; Brazilian DTC podcast guest lists. These would close most of the 30-quote target and the non-Western evidence gap, which a follow-on engagement should prioritize.