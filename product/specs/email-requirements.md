# Email Requirements — Midpack

Specification for the transactional and onboarding emails the product sends. Hand-off target: **claude-design** (for visual mock-up + final copy polish). Implementation details (Resend wiring, template engine, retries) are deliberately not in this doc — they live in the build phase.

Source for product behavior: [`./user-story-map.md`](./user-story-map.md). When this doc and the user story map disagree, the map wins; flag the conflict.

## Scope

Exactly **four** emails in MVP. Anything not listed here is explicitly out of scope (see "Out of scope" at the bottom).

| # | Name | Trigger | Recipient | Frequency cap |
|---|---|---|---|---|
| 1 | **Welcome** | First successful Google OAuth sign-in for a given account | The newly-signed-up creator | Lifetime once per user |
| 2 | **Reviewer invitation** | Owner clicks **Publish** (M3.D4) OR adds a reviewer in Collecting state (M3.C3) | Each invited reviewer | One per invitation event |
| 3 | **New comment** | Any **non-owner** comment posted on the **latest** version (M3.C8 trigger boundary) | The artifact **owner only** | One per comment, no throttling |
| 4 | **New version** | Owner confirms a new version in Collecting state (M3.C2) | Every invited reviewer on the artifact's invitee list (anonymous share-link viewers excluded — no email captured) | One per version-add event per reviewer |

---

## Cross-cutting requirements (apply to all four emails)

### Brand and voice

- **Product name:** Midpack (lowercase wordmark).
- **Slogan (use in welcome and as a footer tagline elsewhere):** *"Where feedback loops actually close."*
- **Voice:** direct, warm, slightly cheeky. Maya-the-growth-marketer is the persona — assume she has good taste, dislikes corporate cruft, ships fast. No exclamation marks unless one really earns its place.
- **Length:** short. None of these emails should require scrolling on a phone for the primary information.
- **Plain-text fallback:** every email ships an HTML and a plain-text version. Plain-text is not optional.

### Sender, reply-to, footer

| Email | From | Reply-to |
|---|---|---|
| Welcome | `Midpack <hello@midpack.app>` | `hello@midpack.app` (founder-feel, even if unmonitored in MVP) |
| Reviewer invitation | `Midpack <noreply@midpack.app>` | **Owner's Google email** (so the reviewer can ask the owner directly) |
| New comment | `Midpack <noreply@midpack.app>` | `noreply@midpack.app` (owner replies via the app, not by email) |
| New version | `Midpack <noreply@midpack.app>` | **Owner's Google email** |

- **Domain:** sending domain `midpack.app` is verified — DKIM, SPF, DMARC all pass (per S5 in the user story map).
- **Footer (every email):**
  - Logo / wordmark
  - One-line context sentence: *"You're receiving this because {reason}."* (reason varies — see each email below)
  - Copyright line: `© 2026 Midpack — built by Maksym Haponenko for the LHHP-COAC challenge.`
  - **No unsubscribe link** in MVP — these are all transactional / one-shot. If we later add digest emails (out of scope), they'd require unsubscribe.

### Visual treatment

- Dark-mode-first product, but emails should render cleanly in a **light** default with a tasteful dark-mode media query. Most clients still default to light; some (Gmail iOS, Apple Mail) honour `prefers-color-scheme`.
- Single-column, max-width ~600 px.
- One primary CTA button per email. Secondary actions are text links, not buttons.
- Avoid hero images. A small wordmark in the header is enough.

### Variables (referenced across emails)

| Variable | Source |
|---|---|
| `{ownerName}` | The owner's Google profile display name |
| `{ownerEmail}` | The owner's Google account email |
| `{reviewerName}` | The reviewer's name as the owner entered it on the invitee list (M3.D3) |
| `{artifactTitle}` | Artifact-level title field |
| `{versionNumber}` | Integer (`v3` rendered as "v3") |
| `{versionDescription}` | Per-version description (sealed at version creation) |
| `{ownerComment}` | Optional first comment owner attaches to a new version (M3.C2). May be empty. |
| `{commentBody}` | The full text of a single comment |
| `{commentAuthorName}` | The name field on the comment (Google profile name for invited reviewers; freeform name for anonymous reviewers) |
| `{shareUrl}` | Full URL to `/share/[token]` for that artifact |
| `{artifactUrl}` | Full URL to `/artifacts/[id]` (owner's canonical view) |
| `{ttlExpiresAt}` | Absolute date+time when the share link expires (e.g. "Thu 12 May, 18:00 UTC"). Render in the recipient's locale where possible; otherwise UTC with the suffix. |

---

## Email 1 — Welcome

### When it fires

The very first time a Google account completes OAuth and lands on `/artifacts`. Server-side guard: a `welcomedAt` timestamp on the user row prevents duplicate sends if the auth callback runs twice.

### Recipient

The signed-in user.

### Goal

Two jobs in one email. **Job 1:** re-state the value prop one more time so they remember why they signed up. **Job 2:** point them at the single first action that gets them to value.

### Subject line

> Welcome to Midpack — let's ship your first v3

### Body — content blocks in order

1. **Greeting**
   *"Hey {ownerName} —"*

2. **Re-state the pitch (one short paragraph, salesy)**
   Lead with the slogan as a styled line, then a sentence or two reinforcing what they just signed up for.
   Example direction (designer to refine):
   > **Where feedback loops actually close.**
   > Stop consolidating Slack threads at midnight. Publish drafts straight from Claude Desktop, let reviewers comment in one click — no signup, no install — and ship the version your AI distilled from what they actually said.

3. **First steps — three short numbered items**
   Tight. Numbered. Each one ≤ 12 words. The point is to make step 1 feel obvious.
   1. Click **New artifact** on your home page.
   2. Drop a PDF, image, or HTML file. Add reviewer emails. Hit **Publish**.
   3. Reviewers comment in one click. We email you the gist when they do.

4. **Primary CTA**
   Button: **Create your first artifact** → `/artifacts`

5. **PS — soft Claude Desktop teaser (one line)**
   *"PS — power user? Settings → MCP gives you a snippet that lets you publish straight from Claude Desktop."* Link the word "Settings" to `/settings`.

### Footer reason line

> *"You're receiving this because you just signed up for Midpack."*

---

## Email 2 — Reviewer invitation

### When it fires

Two paths, identical payload:
- Owner clicks **Publish** on a Draft (M3.D4) → fan-out, one email per invitee on the list at that moment.
- Owner adds a reviewer to an artifact already in Collecting state (M3.C3) → one email, immediately.

### Recipient

The invited reviewer.

### Goal

Get them to click the share link and leave a comment — in one click, no signup, no install (M4.A5 is load-bearing).

### Subject line

> {ownerName} wants your feedback on "{artifactTitle}"

### Body — content blocks in order

1. **Greeting**
   *"Hi {reviewerName} —"*

2. **One-sentence ask**
   *"{ownerName} just shared a draft and asked for your eyes on it."*

3. **Artifact card (lightweight)**
   - Title: `{artifactTitle}`
   - Optional: 1–2 line description of v1 (the per-version description sealed at Publish)
   - No thumbnail in MVP — keep the email small. Designer may surface a placeholder if it's quick.

4. **Primary CTA**
   Button: **Open and comment** → `{shareUrl}`

5. **TTL footer line (small, muted, above the brand footer)**
   *"This link expires {ttlExpiresAt}."*

6. **No-signup reassurance (one line under the CTA, small)**
   *"No account, no install. One click and you're in."*

### Footer reason line

> *"You're receiving this because {ownerName} ({ownerEmail}) added you as a reviewer on Midpack."*

### Reply-to behavior

Reply-to is set to `{ownerEmail}`, so a "I don't have time this week" reply lands in the owner's inbox, not ours.

### Edge cases

- **Same reviewer added twice across two artifacts** — they get two separate emails, each with their own share link.
- **Owner re-sends by removing and re-adding the same reviewer** — out of scope; not a concern for MVP. (Per M3.A9, removing a reviewer doesn't revoke the share link in MVP, so this scenario doesn't change link state.)

---

## Email 3 — New comment

### When it fires

Every new comment on the **latest version** by **anyone other than the owner** (invited reviewer logged in via Google, or anonymous reviewer on `/share/[token]`).

- Owner's own comments do **not** trigger this email.
- Comments on **older** versions don't exist (per M3.A4 the form is locked to the latest version), so no edge case there.
- Per-comment, no throttling, no batching. If a reviewer leaves five comments in two minutes, the owner gets five emails.

### Recipient

The artifact owner only. No CC to other reviewers.

### Goal

Tell the owner that someone reacted, show them enough of the comment to decide whether to switch tabs right now, give them one click to the page.

### Subject line

> {commentAuthorName} commented on "{artifactTitle}"

### Body — content blocks in order

1. **Greeting**
   *"Hey {ownerName} —"*

2. **Lede sentence**
   *"{commentAuthorName} left a comment on **{artifactTitle}** ({versionNumber})."*

3. **Comment quote block**
   - Render `{commentBody}` as a styled blockquote.
   - **Truncation rule:** if longer than 400 characters, truncate at the nearest word boundary and append "…". The full body is on the page.
   - Preserve newlines (visual paragraph breaks) — no Markdown formatting in MVP, just whitespace-respecting text.

4. **Primary CTA**
   Button: **Open the thread** → `{artifactUrl}` (deep-link straight to the comment list, anchor-jumping nice-to-have)

5. **Reception note (one line, optional, designer's call)**
   *"We'll re-summarise your reviewer reception once the comment lands on the page."*
   Rationale: M3.C8 distillation runs on every new non-owner comment; the email itself is dumb (the comment text), the page is smart (stars + summary + 3 things to change). Setting this expectation in the email keeps the email simple and pulls the owner to the page.

### Footer reason line

> *"You're receiving this because you own the artifact "{artifactTitle}" on Midpack."*

### Reply-to behavior

`noreply@midpack.app` — the owner replies inside the app (M3.C1), not via email. Email replies bounce.

---

## Email 4 — New version

### When it fires

Owner confirms the **Add new version** modal in Collecting state (M3.C2) — exactly the moment a new version is sealed.

### Recipient

Every invited reviewer on the artifact's invitee list at the moment of the version add. Anonymous share-link viewers (zero-install path) never gave us an email and so are excluded — they'll see the new version next time they open the share URL (M2b.7-style unread tracking is logged-in-only).

### Goal

Pull the reviewer back. The owner did the work of iterating; the reviewer should know there's a new draft worth a look.

### Subject line

> New version of "{artifactTitle}" — {ownerName} pushed {versionNumber}

### Body — content blocks in order

1. **Greeting**
   *"Hi {reviewerName} —"*

2. **Lede sentence**
   *"{ownerName} just published **{versionNumber}** of **{artifactTitle}** based on the feedback so far."*

3. **Owner's note (conditional block — render only if `{ownerComment}` is non-empty)**
   Styled blockquote, prefixed with a small "Note from {ownerName}:" label. Same truncation rule as Email 3 (400 chars, word boundary, "…"). If `{ownerComment}` is empty, omit this block entirely — don't render an empty quote.

4. **Optional: short version description (conditional, designer's call)**
   If `{versionDescription}` differs meaningfully from the previous version's description (heuristic: any difference at all), include it as one line under the lede. Otherwise skip.

5. **Primary CTA**
   Button: **Open {versionNumber}** → `{shareUrl}` (same share URL as the original invitation — still valid, still works for both anonymous and logged-in reviewers)

6. **TTL footer line**
   *"This link expires {ttlExpiresAt}."*

### Footer reason line

> *"You're receiving this because {ownerName} ({ownerEmail}) added you as a reviewer on Midpack."*

### Reply-to behavior

`{ownerEmail}` — same as the invitation email.

### Edge cases

- **Reviewer removed before version add (M3.A9)** — they are not in the invitee list at the moment of send and so do not receive this email. (Their share link still works if they happen to have it, per M3.A9.)
- **Reviewer added between v_N_ and v_N+1_** — they got the invitation email pointing at v_N_ originally. When v_N+1_ drops they get this version email like everyone else.

---

## Out of scope (do not design)

These are tracked as Optional in `user-story-map.md` and explicitly **not** in this requirements doc:

- **O3.8** Founder express-lane "this is blocking" priority email
- **O4.1** Reviewer email opt-in for new versions (we already send to all invitees in Email 4 — this would extend it to anonymous share-link reviewers who provided an email when commenting; out of scope)
- Share-link expiry warning emails ("your link expires in 24 h")
- Digest / batched comment emails (we send per-comment in MVP)
- Reviewer-to-reviewer notifications (only the owner is pinged on new comments)
- Email when an artifact is marked Finished (M3.C7) — neither owner nor reviewers are emailed; the page state communicates it
- Email when an artifact is soft-deleted or restored
- Account-management emails (no password, no account deletion in MVP — Google OAuth handles all of it)

---

## Open questions for design

1. **Email 1 (welcome) — should the salesy paragraph re-use the landing page's exact sub-slogan verbatim, or should it be a light rewrite for the email medium?** Recommendation: light rewrite, second person ("Stop consolidating *your* Slack threads…").
2. **Email 3 (new comment) — do we want to colour-code the quote block based on the M3.C8 per-comment 1–5 star score?** Recommendation: **no** for MVP. The score is owner-only context inside the app; surfacing it in the email mixes the dumb-email / smart-page split.
3. **Dark-mode rendering** — designer's call. Specify the dark-mode background / foreground tokens if you go for the media query, or skip it and rely on light-mode universally.
4. **Wordmark asset** — we don't have one yet. Either render the word `midpack.app` in the brand font as text, or commission a quick SVG. Designer's call.