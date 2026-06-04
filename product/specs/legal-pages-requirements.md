# Legal Pages Requirements — Midpack (outdated doc)

Specification for the two legal pages the product needs before public launch: **Terms of Service** (`/terms`) and **Privacy Notice** (`/privacy`). Hand-off target: **claude-design** (visual layout + copy polish). Implementation details (Next.js MDX vs. plain TSX, component reuse) are deliberately not in this doc — they live in the build phase.

This is not a substitute for legal review. The copy below is a plain-English first draft sized for a PoC; before launch in regulated jurisdictions, run it past a lawyer. Everything here is calibrated to the **research preview** posture — see `to-do/pre-public-launch.md`.

## Scope

Exactly **two** pages in MVP:

| # | URL | Purpose | Length target |
|---|---|---|---|
| 1 | `/terms` | What you can/can't do, no-warranty posture, governing law, contact | ~1 screen on desktop, ≤ 2 min read |
| 2 | `/privacy` | What data we collect, why, who we share it with, your GDPR rights, retention, contact | ~1.5 screens on desktop, ≤ 3 min read |

Both pages are publicly accessible (no auth). Both are linked from the global footer on every page of the app and the landing page. Both have a visible **"Last updated"** date at the top.

---

## Cross-cutting requirements (apply to both pages)

### Operator / data controller

The named operator on both pages is a **solo individual**, not a registered entity:

| Field | Value |
|---|---|
| Name | Maksym Haponenko |
| Country of residence | Ukraine |
| Postal address | `[OPERATOR_POSTAL_ADDRESS]` — to be filled in before launch; designer leaves a placeholder |
| Contact email | `gaponenko.mm@gmail.com` (or `legal@midpack.app` if the alias is wired before launch — designer's call which one to render) |

GDPR Art. 3(2)(a) applies because the service is offered to data subjects in the EU/EEA. The docs name **Ukrainian law** as governing law, with an explicit clause acknowledging GDPR rights for EU/EEA users. No EU representative is appointed in MVP — flag as a known gap (Art. 27 obligation kicks in only if processing is regular and on a non-occasional basis; PoC scale arguably fits the exemption, but a real lawyer should confirm before scaling).

### Brand and voice

- **Product name:** Midpack (lowercase wordmark, same as `email-requirements.md`).
- **Voice:** plain English, second-person ("we" / "you"), short sentences. Same Maya-the-growth-marketer voice as the rest of the product — direct, warm, no corporate cruft. **No legalese unless a specific clause genuinely needs the precision** (e.g. governing law, limitation of liability — those stay formal because watering them down hurts the operator).
- **Honesty about PoC status:** the documents acknowledge in-line that the service is a **research preview**, that data may be removed with notice, and that no SLA is offered. This is a feature, not a footnote — it sits in the first paragraph of each page.
- **Language:** English only. No localized versions in MVP.
- **Reading time goal:** the average user finishes either page in under 3 minutes without scrolling fatigue.

### Visual treatment

- **Dark mode default** (matches the rest of the product). Light mode supported via the same `next-themes` toggle the app already has.
- **Typography:** body sized for comfort (16–17 px), generous line-height (1.6+), max line length **~70 characters** (`max-w-[640px]` or similar) — these pages are read, not scanned.
- **Headings:** H1 once at the top of the page; H2 per major section; H3 used sparingly. No emoji, no decorative icons.
- **Layout:** single column, centered. Top has a small breadcrumb-or-back link to the app. Bottom has the standard global footer (see "Footer integration" below).
- **Anchored sections:** every H2 has an `id` so deep links work (`/privacy#your-rights`, `/terms#liability`). Designer to specify the anchor slugs in the final markup.
- **"Last updated" stamp:** rendered directly under the H1 in muted foreground (`text-muted-foreground`), format `Last updated: 7 May 2026`.
- **No table-of-contents** in MVP. The pages are short enough that scroll-and-skim works. (Open question 1.)
- **Print-friendly:** a `@media print` rule that hides the global header / footer / theme toggle and renders body in serif at high contrast. Designer's call whether to ship this on day one.
- **Accessibility:** semantic HTML (`<main>`, `<article>`, `<section>`, real headings), focus-visible on all links, `prefers-reduced-motion` respected on any subtle entrance animation.

### Component layering (server-architecture-aligned)

These are static content pages — Server Components, no client interactivity. Per `frontend-architecture.md`:

- `app/terms/page.tsx` and `app/privacy/page.tsx` — Server Components, no `"use client"`.
- Content lives **inline in the page file as JSX**, not as MDX, in MVP. (Open question 2.)
- The "Last updated" date is a simple string constant at the top of each file (e.g. `const LAST_UPDATED = "7 May 2026"`).
- The contact email is rendered as a `mailto:` link with `rel="noopener"`.
- Standard global header + footer come from the root layout — these pages don't define their own chrome.

### Metadata

Each page sets its own `generateMetadata` export:

| Page | Title | Description |
|---|---|---|
| `/terms` | `Terms of Service — Midpack` | "Plain-English terms for using Midpack, our research preview." |
| `/privacy` | `Privacy Notice — Midpack` | "What we collect, why, and your rights — including GDPR rights for EU users." |

Both pages have `robots: { index: true, follow: true }` (these need to be findable / linkable).

---

## Page 1 — Terms of Service (`/terms`)

### Goal

Three jobs in one page. **Job 1:** make clear this is a research preview, no SLA, use at your own risk. **Job 2:** set the rules of the road (no abuse, no illegal content, you own what you upload, we can revoke access). **Job 3:** establish governing law and contact path so disputes have a clear answer.

### Body — sections in order

#### 1. Header block

- H1: **Terms of Service**
- "Last updated: 7 May 2026"
- One-paragraph TL;DR styled as a callout / note block (subtle border, muted background — designer's pattern):

  > **In short.** Midpack is a research preview built by one person. You can use it for free, but it has no SLA, no warranty, and your data may be removed with notice. Don't upload anything illegal or anything you'd be unhappy losing. By using the service you agree to the terms below.

#### 2. About the service

- H2: **About the service**
- Body (verbatim, designer to refine line breaks):

  > Midpack is a tool for publishing AI-generated drafts, sharing them with named reviewers, collecting structured feedback, and using AI to summarize that feedback into a clear next version. It is operated as a research preview by **Maksym Haponenko**, an individual based in Ukraine, reachable at `gaponenko.mm@gmail.com`.
  >
  > Because this is a research preview, expect the following:
  >
  > - The service may be unavailable, slow, or interrupted at any time.
  > - We may change, restrict, or remove features without notice.
  > - We may delete artifacts, comments, or accounts with reasonable notice if we need to (for example, before shutting the service down). "Reasonable notice" means **at least 14 days** by email to the address on your account, except where the law requires us to act faster.
  > - We do not offer any service-level agreement, uptime guarantee, or paid support.

#### 3. Who can use it

- H2: **Who can use it**
- Body:

  > To use Midpack you need to:
  >
  > - Have a Google account, since Google sign-in is currently the only way to publish or comment as a logged-in user.
  > - Agree to these terms and to our [Privacy Notice](/privacy).
  >
  > If you're under 18, please use Midpack with a parent's or guardian's awareness — the service isn't designed for children, but we don't actively block younger users (school students using it for AI-assisted projects are welcome). If you're a parent or guardian and want a young person's account removed, email us and we'll delete it.
  >
  > If you're using Midpack on behalf of an organization, you confirm that you're allowed to bind that organization to these terms.

#### 4. Your account

- H2: **Your account**
- Body:

  > We create your account when you first sign in with Google. You're responsible for what happens under your account, including anything reviewers do with share links you generate.
  >
  > You can delete your account at any time from **Settings → Account → Delete account**. When you do, we remove your profile, your artifacts, the files behind them, and the share links you created — **immediately**, not on a delay. Comments other reviewers left on your artifacts are deleted with the artifacts.
  >
  > Comments **you** left on other people's artifacts are handled differently: we **anonymize** them rather than delete them. The comment text stays on the artifact so the owner doesn't lose feedback context, but your name and email are detached from it. After anonymization, the comment is no longer associated with you.
  >
  > We may keep technical logs (errors, abuse signals) for a short period after deletion — see the [Privacy Notice](/privacy).

#### 5. Your content

- H2: **Your content**
- Body:

  > **You keep ownership** of every file, comment, and piece of metadata you upload to Midpack. We don't claim any rights to your content.
  >
  > To run the service, you grant us a limited license to **store, transmit, display, and process** your content for the sole purpose of operating Midpack — including running it through an LLM (currently Anthropic Claude) to summarize feedback or extract metadata. We do not use your content to train AI models, ours or anyone else's.
  >
  > **You are responsible for what you upload.** Don't upload content you don't have the right to share. Don't upload content that's illegal, infringes on someone else's rights, or that you'd be in trouble for if it leaked. If we get a credible complaint, we may remove the content and notify you.

#### 6. Acceptable use

- H2: **Acceptable use**
- Body:

  > Don't use Midpack to:
  >
  > - Upload illegal, infringing, defamatory, or harmful content (including malware, CSAM, or content that violates someone's privacy).
  > - Attempt to reverse-engineer, scrape at scale, or abuse the API or MCP server.
  > - Send spam or unsolicited invitations to people who haven't agreed to be reviewers.
  > - Circumvent rate limits or otherwise burden the service in a way that affects other users.
  >
  > We may suspend or terminate your account if you do any of the above.

#### 7. AI-generated outputs

- H2: **AI-generated outputs**
- Body (this is the section that distinguishes Midpack from a generic SaaS):

  > Some features of Midpack run your content through an LLM — for example, the feedback summary that turns reviewer comments into a "what to change next" digest. These outputs are generated automatically and may contain mistakes, hallucinations, or misrepresentations of what reviewers actually said.
  >
  > **Treat AI-generated summaries as a starting point, not a verdict.** The original comments are always available on the artifact page, and you should read them before making decisions that matter.

#### 8. Service changes and termination

- H2: **Changes to the service or these terms**
- Body:

  > We may update these terms when the service changes. If a change materially affects you, we'll notify you by email and update the "Last updated" date at the top of this page at least **14 days** before the change takes effect. Continuing to use Midpack after the effective date means you accept the new terms.
  >
  > You can stop using the service at any time. We can terminate your access if you break these terms or if we decide to shut the service down — in the second case, we'll give you at least 14 days' notice and a way to export anything that's still useful.

#### 9. No warranty

- H2: **No warranty**
- Body (this paragraph stays formal — it's load-bearing for the operator):

  > Midpack is provided **"as is"** and **"as available,"** without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or uninterrupted operation. We do not warrant that the service will be error-free, secure, or available at any specific time.

#### 10. Limitation of liability

- H2: **Limitation of liability**
- Body:

  > To the maximum extent permitted by applicable law, the operator's total liability arising out of or related to your use of Midpack is limited to **€100**. We are not liable for any indirect, incidental, consequential, or punitive damages, including lost profits, lost data, or business interruption.
  >
  > Nothing in this section limits liability that cannot be limited under applicable law — including, for EU/EEA users, liability for death, personal injury, or intentional misconduct.

#### 11. Governing law and disputes

- H2: **Governing law and disputes**
- Body:

  > These terms are governed by the laws of **Ukraine**, without regard to its conflict-of-laws rules. Any dispute arising under these terms may be brought before the competent courts of Ukraine.
  >
  > **If you are a consumer in the EU/EEA**, this clause does not deprive you of the protections of the mandatory laws of your country of residence, and you may bring proceedings before the courts of your country of residence as required by EU consumer law.

#### 12. Contact

- H2: **Contact**
- Body:

  > Questions, complaints, or legal notices: **[gaponenko.mm@gmail.com](mailto:gaponenko.mm@gmail.com)**.

---

## Page 2 — Privacy Notice (`/privacy`)

### Goal

Three jobs. **Job 1:** tell users in plain English what's collected and why, so they can make an informed decision. **Job 2:** disclose the categories of recipients required under GDPR Art. 13(1)(e), with a soft list of current providers — transparent enough that EU users trust it, loose enough that swapping a provider doesn't require a doc revision. **Job 3:** make their GDPR rights and the path to exercise them obvious.

### Body — sections in order

#### 1. Header block

- H1: **Privacy Notice**
- "Last updated: 7 May 2026"
- TL;DR callout:

  > **In short.** We collect your Google profile (name, email, picture), the files and feedback you upload, and basic logs for security and debugging. We use this to run Midpack — nothing more. We share data only with the platforms we run on (listed below). We don't sell your data, we don't use it to train AI models, and you can delete your account at any time. **EU/EEA users:** you have the rights GDPR gives you, and we'll honor them.

#### 2. Who's responsible (controller)

- H2: **Who's responsible for your data**
- Body:

  > The data controller for Midpack is **Maksym Haponenko**, an individual based in Ukraine. You can reach me at **[gaponenko.mm@gmail.com](mailto:gaponenko.mm@gmail.com)** for any privacy question, complaint, or rights request.
  >
  > Postal address (for legal notices): `[OPERATOR_POSTAL_ADDRESS]`.

#### 3. What we collect

- H2: **What we collect and why**
- Body — render as a table or a bulleted list (designer's call; table is more scannable). Four grouped categories rather than per-field granularity — this is the GDPR Art. 13(1)(c)–(d) disclosure, but we group at the level of "what kind of data" rather than committing to every individual field:

  | Category | What it includes | Why we collect it | Legal basis (GDPR) |
  |---|---|---|---|
  | **Profile** | Your Google profile (name, email, picture, Google account ID) | To create your account and email you about activity on your content | Contract (Art. 6(1)(b)) — we can't run the service without it |
  | **Content** | Everything you upload or create on Midpack: artifact files, titles, descriptions, tags, comments, reviewer email addresses you enter, share-link metadata | To store and display the artifacts you publish and route feedback back to you | Contract (Art. 6(1)(b)) for your own content; Legitimate interests (Art. 6(1)(f)) for reviewer emails you enter |
  | **Logs** | Technical signals tied to your sessions: IP address, user-agent, timestamps, error reports, anonymous usage analytics | To keep the service secure, debug failures, and understand which features get used | Legitimate interests (Art. 6(1)(f)) |
  | **Session cookie** | A signed cookie that keeps you signed in | To recognize you between page loads | Strictly necessary — no consent required (ePrivacy Art. 5(3) exception) |

  We **do not** collect special-category data (health, biometric, political, religious, etc.), and we ask you not to upload it. We **do not** use your content to train AI models — ours, or any third party's.

#### 4. Who we share it with

- H2: **Who we share it with**
- Body — categories of recipients (per GDPR Art. 13(1)(e)) plus a one-line list of current providers, so we stay transparent without committing to a specific provider for the lifetime of the service:

  > To run Midpack we rely on a small number of cloud platforms acting as **sub-processors** under standard data-processing agreements. The categories of recipients are:
  >
  > - A **hosting and storage provider** that runs the application, the serverless functions, and the file uploads.
  > - A **database provider** that stores your artifacts, comments, and account data.
  > - An **AI provider** that runs the LLM behind the feedback-summary feature. We only send it the reviewer comment text and version metadata of the artifact being summarized.
  > - An **email provider** that delivers the transactional emails (welcome, reviewer invitations, new-comment notifications, new-version notifications).
  > - An **error-reporting provider** that captures crash reports so we can debug failures.
  > - A **cache provider** for rate limiting and MCP session state.
  > - An **identity provider** (Google) that handles the sign-in flow. We never see your password.
  >
  > **Current providers** (this list may change as we evolve the service): Vercel (hosting and storage), Neon (database), Anthropic (AI), Resend (email), Sentry (error reporting), Upstash (cache), Google (sign-in). When we change providers, we'll update this page.
  >
  > **We do not sell your data**, share it with advertisers, or use it for any purpose outside running Midpack.

#### 5. International transfers

- H2: **International transfers**
- Body:

  > Some of the platforms we use are based in the **United States** (notably Anthropic, Sentry's parent, and Vercel's headquarters), even when they process data in EU regions. Where a transfer outside the EU/EEA happens, we rely on the European Commission's **Standard Contractual Clauses (SCCs)** included in the provider's data-processing agreement. Where the provider participates in the **EU-US Data Privacy Framework** (Vercel, Anthropic, and Google currently do), we rely on that framework as the transfer mechanism.

#### 6. How long we keep it

- H2: **How long we keep it**
- Body — criteria-based rather than specific day counts (per GDPR Art. 13(2)(a), which allows criteria when a fixed period would be misleading):

  > **Your account, artifacts, and content** are kept for as long as your account is active. Each artifact also has its own time-to-live set by you at publish; when that expires, the artifact and its comments are removed automatically.
  >
  > **When you delete your account**, your profile, your artifacts, and the files behind them are removed immediately. Comments you left on other people's artifacts are **anonymized** rather than deleted — the comment text stays on the artifact so the owner doesn't lose context, but your name and email are detached from it.
  >
  > **Server logs, error reports, and email-send logs** are kept for a short period for security and debugging — typically a few weeks to a few months, depending on the provider. We don't keep them longer than we need to.
  >
  > **Anonymous usage analytics** are aggregated without identifiers and retained per the analytics provider's defaults.

#### 7. Your rights

- H2: **Your rights**
- Body — keep this section deliberately prominent (it's the GDPR Art. 13(2)(b) summary):

  > If you are in the EU/EEA — and we extend the same rights to everyone else as a matter of policy — you have the right to:
  >
  > - **Access** the personal data we hold about you (Art. 15).
  > - **Correct** anything that's inaccurate (Art. 16).
  > - **Delete** your account and the data associated with it (Art. 17). You can do this yourself in **Settings → Account → Delete account**.
  > - **Restrict or object** to specific processing (Art. 18, Art. 21).
  > - **Export** your data in a portable format (Art. 20). Email us and we'll send a JSON archive of your artifacts and comments.
  > - **Withdraw consent** for any processing based on consent (Art. 7(3)). Most of our processing is based on contract or legitimate interest, but where consent applies, you can withdraw it without affecting prior processing.
  >
  > To exercise any of these rights, email **[gaponenko.mm@gmail.com](mailto:gaponenko.mm@gmail.com)**. We aim to respond within **30 days**.
  >
  > You also have the right to **lodge a complaint with a data protection authority** in your EU/EEA country of residence — for example, the [Polish UODO](https://uodo.gov.pl), the [German BfDI](https://www.bfdi.bund.de), the [French CNIL](https://www.cnil.fr), or the [Estonian AKI](https://www.aki.ee). The full list is on the [European Data Protection Board's site](https://edpb.europa.eu/about-edpb/about-edpb/members_en).

#### 8. Cookies and similar technologies

- H2: **Cookies**
- Body:

  > We use exactly **one cookie**: a signed **session cookie** that keeps you signed in. It's strictly necessary for the service, contains a JWT (no readable personal data), and expires within 30 days. EU/EEA cookie law allows strictly-necessary cookies without consent, so we don't show a cookie banner.
  >
  > Our analytics (Vercel Analytics + Speed Insights) are **cookieless** — they aggregate anonymous traffic data without storing any identifier on your device.

#### 9. Security

- H2: **Security**
- Body — keep this honest, not aspirational:

  > We rely on the security posture of the platforms we run on (Vercel, Neon, Resend, Anthropic, Sentry, Upstash, Google). Files are stored in **Vercel Blob private storage** and only accessible via authenticated proxy — there are no public URLs to your uploads. Sessions are signed cookies with rotating secrets. We use HTTPS everywhere. **No system is perfect.** If a breach affects your data, we'll notify you within **72 hours** of becoming aware, as GDPR Art. 33–34 requires.

#### 10. Changes to this notice

- H2: **Changes to this notice**
- Body:

  > If we materially change how we handle your data, we'll update this page and email you at least **14 days** before the change takes effect. The "Last updated" date at the top always reflects the current version.

#### 11. Contact

- H2: **Contact**
- Body:

  > Privacy questions, complaints, or rights requests: **[gaponenko.mm@gmail.com](mailto:gaponenko.mm@gmail.com)**.

---

## Footer integration

The global footer (rendered from the root layout, on every page including landing, app, and the two legal pages themselves) gets the following links:

```
© 2026 Midpack — research preview by Maksym Haponenko    Terms · Privacy · Feedback
```

- **`Terms`** → `/terms`
- **`Privacy`** → `/privacy`
- **`Feedback`** → existing feedback channel (per `to-do/pre-public-launch.md`)
- The "research preview" phrasing in the footer reinforces the in-product PoC banner.

Mobile: same content stacks vertically, links in a row centered below the copyright line.

---

## Out of scope (do not design)

- **Cookie consent banner** — we use one strictly-necessary cookie and cookieless analytics, so no banner is needed under ePrivacy Art. 5(3). If we later add marketing pixels (out of scope for PoC), this changes.
- **DPA / Data Processing Agreement** for B2B customers — we don't have B2B customers in MVP.
- **EU representative under GDPR Art. 27** — flagged as a known gap; PoC scale arguably qualifies for the "occasional processing" exemption. Revisit before scaling.
- **Localized legal pages** (EN-only in MVP).
- **Acceptable Use Policy as a separate page** — folded into the Terms.
- **Service Level Agreement** — explicitly disclaimed; no SLA exists.
- **Subprocessor change-notification system** — when a sub-processor changes, we'll update the page and notify by email; no dedicated subscribe-to-changes flow.
- **DSAR / privacy-request webform** — email is the channel in MVP.
- **Dedicated "Children" section in the Privacy Notice** — Midpack is a productivity tool, not a child-directed service. The Terms include a one-line note for under-18s + a parent/guardian removal path; that's the whole posture.
- **Cookie scanner / privacy dashboard** — overkill for one cookie.
- **Print stylesheet polish** — basic `@media print` is enough; no pagination, no logos, no decorative spacing.

---

## Open questions for design

1. **Table of contents at the top of `/privacy`?** The page is borderline-long. Recommendation: **skip in MVP** — anchor links in the URL bar are enough for power users, and a TOC adds visual weight to a page that should feel light. Reconsider if user testing shows people bouncing.
2. **MDX vs. inline JSX for the body content?** MDX is friendlier for non-engineer edits down the line; inline JSX is one fewer dependency for a 2-day spike. Recommendation: **inline JSX in MVP**, migrate to MDX only if a non-engineer needs to edit the copy regularly.
3. **Operator postal address.** The address has to be real (GDPR Art. 13(1)(a) requires it for the controller). Designer leaves a `[OPERATOR_POSTAL_ADDRESS]` placeholder; founder fills in before launch. Open: PO box vs. home address — PO box is safer for a public document, but adds a small ongoing cost.
4. **Contact email — `gaponenko.mm@gmail.com` vs. `legal@midpack.app`?** A custom alias on the midpack.app domain reads more serious and survives the founder's personal Gmail being deprecated. Recommendation: **wire up `legal@midpack.app` and `privacy@midpack.app` aliases that forward to Gmail** before launch, render those on the page. Cost: 5 minutes of DNS / Resend inbound config.
5. **TL;DR callouts — visual style.** Suggested pattern: subtle border, muted background, slightly smaller text, no icon. Designer to specify the exact tokens (`bg-muted/50` + `border-l-4 border-primary` is one option). Whatever lands should reuse the same component on both pages.
6. **Provider-list rendering.** §4 is now prose with a one-line current-providers list. On mobile the seven providers can be a comma-separated inline list; on desktop the designer may prefer a small unordered list under the prose. Either is fine — pick the one that reads cleaner alongside the categories paragraph.
7. **AI-training claim verification.** §3 commits that we do not use content to train AI models — ours or any third party's. Before launch, verify this remains true with the AI provider's API terms (currently Anthropic — their default Console access is zero-retention, but keep an eye on it). If a future provider trains on input by default, either change provider or update the copy.
8. **Per-provider region claims removed on purpose.** I deliberately stopped naming the EU/US region for each provider (it was over-specific and brittle when providers move). The §5 "International transfers" section still discloses the *fact* of US transfers and the legal mechanism — that's the GDPR-required disclosure. Don't add region claims back per-provider unless legal review requests it.

---

## Acceptance criteria

A reasonable EU-resident user, having read both pages in under 5 minutes, can answer:

- ✅ Who runs the service and how do I contact them?
- ✅ What data is collected about me?
- ✅ Where does that data go (which third parties)?
- ✅ How long is it kept?
- ✅ How do I delete my account?
- ✅ How do I exercise my GDPR rights, and which authority do I complain to if I'm unhappy with the response?
- ✅ Is this a real product or a research preview, and what does that mean for my data?

A non-engineer user, having read the Terms in under 2 minutes, understands:

- ✅ The service is "as is" — don't bet anything important on it.
- ✅ I own my content; the operator only has a license to run the service.
- ✅ I can be kicked off if I abuse the service.
- ✅ Disputes are decided under Ukrainian law, but my EU consumer rights aren't taken away.

If any acceptance check fails after the first design pass, the copy — not the layout — is what needs to change.
