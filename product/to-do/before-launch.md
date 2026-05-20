# Pre-Public Launch Checklist

Context: launching as a public PoC. Clearly communicated as research / feedback collection. No reliability claims. Data may be removed with notice.

## Cannot skip

- **Rate limits** — portfolio of caps, each defending a different cost vector. Upstash Redis (already in stack) handles counters.
  - +++ **Per user (creation)**: 20 active artifacts per user — drafts + published count toward the cap; soft-deleted (`deletedAt IS NOT NULL`) do not, since they're no longer readable by reviewers (out of circulation, slot is freed). Modal on hit at the "Create artifact" entry point.
  - +++ **Per user (AI)**: 200 summary regenerations / month. On hit: graceful staleness — last generated summary stays visible with a footer note ("Last refreshed Xh ago. Monthly refresh limit reached.") + "Request a refresh →" link to feedback form. NO paywall, NO blocking. Captures monetization signal without committing to Stripe in PoC.
  - +++ **Per user (read)**: velocity-based, no monthly volume cap. 30 req/min + 2 GB/hour sliding windows. Invisible to humans, lethal to scripts. Toast on hit, not modal — temporary state, not "come back next month". Volume caps were rejected because they punish active legit reviewers across multiple projects.
  - +++ **Per artifact**: 50 invitees max (broadcast defense). Modal on hit at the invite form.
  - +++ **Per upload**: 25 MB max (already enforced via `handleUpload` in `/api/blob/upload`).
  - **Ultimate safety net**: Vercel Spend Management hard cap configured in dashboard. The rate limits are UX/hygiene; Spend Management is the actual ceiling that can't be bypassed.
  - **AI cost notes**: Sonnet ~$0.014/summary at 30 comments avg; Haiku 4.5 ~$0.005. Prompt caching only pays off above ~22% hit rate (cache writes cost 1.25× — at 25% hit it's break-even). Use debounce (5+ comments OR 60s idle) + Haiku to keep summary cost negligible.
- +++ **Denormalized counters** — three Prisma fields to power rate-limit UI, product analytics, and lightweight observability without a custom event log. All maintained by repository-layer increments on the relevant operations.
  - `Artifact.viewCount: Int @default(0)` — atomic INC on each successful read through `/api/artifacts/[id]/file`. Powers the "X views" indicator in the artifact card and detail page.
  - `Artifact.totalBytesServed: BigInt @default(0)` — `+= response Content-Length` on each successful read. Per-artifact bandwidth analytics; flags hot artifacts.
  - `User.totalStorageBytes: BigInt @default(0)` — `+=` on upload commit, `-=` on hard-delete. Powers the per-user storage gauge in settings and is the source of truth for any future per-user storage cap.
  Migration is one file. Updates land in the file proxy route handler and in the upload/delete flows.
- +++ **Sentry** — need to tell "actual bug" from "user confused" when feedback rolls in. Vercel integration, ~10 min.
- +++ **PoC banner + messaging** — persistent in-product banner ("Research preview — data may be removed with notice"), same line on landing + sign-in. Makes the no-reliability claim actually meaningful.
- +++ **ToS + Privacy one-pager** — storing Google OAuth profile data and user uploads. EU users will notice. Footer links. Template-based, half a day.
- +++ **Feedback channel** — GitHub issues link or Tally form, one click from header. The point of the launch.
- +++ **Data deletion path** — script to wipe a user's artifacts + blobs by user ID, plus "delete my account" button. Required to make the "data may be removed" promise real and to keep GDPR clean.
- **Move from epam to own vercel account** + Vercel Spend Management hard cap configured in dashboard.
- **DB backup strategy** ?
- **Multiple files in one artifact** ???
- **Shared with me user stories** ??? 
- **Workflow stages** ??? 

## Free wins

- **BotID** on `/api/blob/upload` and MCP transport route. Dashboard toggle.
- **Vercel Analytics + Speed Insights.** One line, free, shows what's actually used.

## Skip for PoC

- Paywall, Stripe, subscriptions
- Custom logging stack (Vercel default is fine)
- PostHog, Crisp, Intercom
- Content moderation infra — rely on "report" link + manual review
- MCP token revocation UI (manual DB delete if needed)
- Domain warming, OG polish, onboarding flows
- Auth secret rotation plan

## Budget estimate

~1.5 days for the cannot-skip list. Most of it is the rate limiter, the deletion path, and the ToS/Privacy/banner copy. Sentry + BotID are minutes.
