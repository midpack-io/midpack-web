# MCP Design — iterate.guru

Companion to [`user-story-map.md`](./user-story-map.md) §6. The story map fixes *scope* (which tools and resources exist in MVP vs Optional, and what they do at the product level). This doc fixes *shape* — input schemas, return shapes, error mapping, and the auth model — so the implementation in `src/mcp/` and `src/app/api/[transport]/route.ts` can be lifted from here.

**Transport / adapter:** HTTP/SSE via `mcp-handler` (Vercel-blessed). Single Next.js Route Handler at `app/api/[transport]/route.ts`. Upstash Redis for SSE session persistence.

---

## 1. Identity & Auth

- **Mechanism:** bearer token in `Authorization` header, validated via `experimental_withMcpAuth`.
- **Token source:** generated in Settings (M5.1–M5.4). One token per user. Regenerating invalidates the previous one.
- **Scope:** every tool call is implicitly owner-scoped to the User the token resolves to. There is no cross-user surface in MCP — no discovery, no public catalog, no reviewer impersonation.
- **Failure shape:** unauthenticated calls return HTTP 401; tool handlers never see them.

---

## 2. Server instructions — how the agent learns the workflow

Tool wire descriptions (§4) tell the agent *what each tool does and when to call it*. They do not — and should not — tell the agent *what kind of system this is* or *how the pieces fit together*. That second job is what the MCP **`instructions`** field on `initialize` is for: a short, stable string the server returns in the handshake which most clients (Claude Desktop included) inject into the model's context for the duration of the session.

Without it, the agent is left to reverse-engineer the product mental model from per-tool descriptions, which both bloats those descriptions (everyone re-explains the same lifecycle) and lets the agent guess wrong on cross-tool decisions ("can a reviewer comment via `add_comment`?"). With it, the per-tool descriptions stay tight and the workflow rules live in one place.

Wired via `mcp-handler`:

```ts
// src/app/api/[transport]/route.ts
const handler = createMcpHandler(
  (server) => { /* tool + resource registration */ },
  { /* tool / resource declarations */ },
  {
    serverInfo: { name: "iterate.guru", version: "1.0.0" },
    instructions: SERVER_INSTRUCTIONS,
  },
);
```

**Tradeoff:** the string rides in the model's context every turn, so we pay tokens for it on every call. Keep it short — the canonical text below is the budget.

### 2.1 Canonical `SERVER_INSTRUCTIONS` text

Ships verbatim in `src/mcp/instructions.ts`. Source of truth — match in code.

> **iterate.guru — Artifact Hub**
>
> A platform for publishing AI-generated artifacts (HTML, images, PDFs, slides, docs) and collecting structured feedback from invited reviewers. The bearer token identifies one **owner**; every tool call is scoped to that owner.
>
> **Artifact lifecycle:**
> - **Draft** — the owner is preparing it. No invitees, no comments, no TTL counting. Drafts only ever exist on the *first* version of a *new* artifact.
> - **Collecting feedback** — published. Reviewers see the latest version and post comments. TTL clock counts down from publish.
> - **Finished** — owner-flipped or TTL-expired. Read-only.
> - **Deleted** — soft-deleted. Invisible to reviewers; the owner can Restore via the web UI.
>
> **Versions.** Each artifact has 1..N versions. Comments always attach to the *latest* published version. Reviewers always see the latest version when they open the artifact.
>
> **Two caller roles per artifact:**
> - **Owner** — full surface: publish, list, comment, summarize feedback, read full artifact state.
> - **Reviewer** (caller's email is on the invitee list) — list shared artifacts and read a *redacted* artifact view. Posting reviewer-side comments and viewing files happen in the web UI, not via MCP.
>
> Owner-private signals — tags, the full reviewer list, distilled feedback, reception stars — are never returned to reviewer-role callers. The agent must not attempt to surface them.
>
> **Typical owner workflow:**
> 1. **Publish** with `publish_artifact` — one turn; optionally pass `reviewers` to invite + email them in the same call.
> 2. **Add v2+** with `publish_artifact` + `version_of`. Status is inherited — Finished does not auto-reopen.
> 3. **Check feedback** with `summarize_feedback` — aggregate stars, paragraph summary, 3 ranked things to change next. Reads cached distillation; the server reruns distillation on each new non-owner comment.
> 4. **Owner self-notes** with `add_comment` — always lands on the latest published version; owner comments do not move distillation or reception stars.
> 5. **File too large for inline MCP upload (> 8 MB after base64 decode):** for a first-version publish, fall back to `create_artifact_draft` *without* `source` — preserves title / tags / description / reviewers and returns a `draft_url` the user opens to attach the file. For v2+ adds, use the web UI or pass the file as `external_url`.
>
> **Typical reviewer workflow (chat surface):**
> 1. `list_shared_with_me` — list artifacts where the caller's email is on the invitee list. Unread = `last_seen_version < latest_version_number`.
> 2. Read `artifact://{id}` for a redacted view — status, owner, versions, latest comments.
> 3. To post comments or view files, open the artifact's `artifact_url` in the web UI. MCP does not expose reviewer-side commenting.
>
> **Hard rules.** The agent must not: publish on behalf of a reviewer (token identifies one owner); fabricate `artifact_id`s; post comments on behalf of reviewers (`add_comment` is owner-only); retry calls flagged `retryable: false`; or surface owner-private signals to reviewer-role callers.

---

## 3. Source modes — `inline` vs `external_url`

Every artifact version has exactly one *source*. Two modes:

| Mode | What we store | What reviewers see |
|---|---|---|
| `inline` | Bytes in our Vercel Blob private store at `v1/artifacts/{id}/v{n}/{slug}` + mime type | Auth-gated proxy `/api/artifacts/[id]/file` streams the bytes |
| `external_url` | The URL only — no bytes copied + (optional) mime hint | Click-through link to the external host. We do not proxy, embed, or fetch |

**Per-version, not per-artifact.** v1 can be `inline` and v2 can be `external_url` (or vice versa). Versions seal their own source on creation, like all other per-version fields.

**Tradeoffs of `external_url`:**
- We cannot guarantee the URL stays reachable. If the host removes the file, the version is dead.
- We cannot enforce our auth boundary on the bytes. Anyone with the external URL can fetch directly.
- Comments still work — the artifact row exists in our DB independent of where the bytes live.

**Inline size cap: 8 MB after base64 decode — hard, non-transient limit.** The server pre-checks decoded length *before* touching Vercel Blob and rejects oversized payloads with `payload_too_large` (see §4.1 and §7). Retrying the same call produces the same error — this is an architectural ceiling, not a flaky network. Justification: practical MCP message ceiling ~10 MB; Vercel function body limit; base64 inflates ~33%. Anything bigger uses the web upload UI (M3.D1 / M3.C2) — direct browser→Blob upload, no MCP transport in the path.

**`external_url` validation:** must parse and use `https://`. No HEAD request, no fetch — we trust the owner.

---

## 4. Tools

**About the `Description (wire, sent to the agent)` blocks below.** Each MVP tool ships a description string on the wire — that string is what the LLM sees in its tool catalog every turn. It is **canonical for agent behavior**: it is how the agent decides between tools and, just as importantly, when *not* to call one. The wire descriptions below are the source of truth (copy them verbatim into `src/mcp/tools.ts`); the prose around each tool is human-facing context for implementers.

### 4.1 `publish_artifact` — *MVP, load-bearing*

**Description (wire, sent to the agent):**

> Publish an artifact in one turn — skips Draft. The `source` is either `kind: "inline"` (bytes shipped via the call, hard 8 MB cap after base64 decode) or `kind: "external_url"` (an https URL stored as a reference; we don't copy or proxy bytes). Set `version_of` to add a new version to an existing artifact. Optionally pass `reviewers` to invite people in the same turn — each gets an invitation email with the artifact link. Returns the URL of the published artifact. Use this when the user wants to publish; do not use to create a Draft (that's `create_artifact_draft`, optional).

Creates an artifact and publishes it in one shot — skips Draft. If `version_of` is set, adds a new version to an existing artifact and inherits its current status (Collecting / Finished). The tool *only* publishes — Draft creation is §4.6 `create_artifact_draft` (MVP).

```ts
type PublishArtifactInput = {
  title: string;                 // 1..200 chars
  source:
    | { kind: "inline"; content_base64: string; mime_type: string; filename?: string }
    | { kind: "external_url"; url: string; mime_type?: string };
  tags?: string[];               // owner-private namespace; never shown to invitee surfaces (M2.12)
  description?: string;          // per-version description; defaults to inherited (version_of) or empty (new)
  version_of?: string;           // artifactId — if set, adds vN+1 to that artifact; otherwise creates a new artifact
  ttl_days?: number;             // default 14; only honored when creating a new artifact
  reviewers?: Array<{            // optional invitee list; max 50 entries; emails validated and lowercased on the local part
    name: string;
    email: string;
  }>;
};

type PublishArtifactOutput = {
  artifact_id: string;
  version_number: number;        // 1 for new artifact, N+1 for version_of
  status: "collecting_feedback" | "finished";   // never "draft" — MCP.1 always publishes
  artifact_url: string;          // canonical URL of the published artifact (`/artifacts/[id]`) — circulate this
};
```

**Behavior:**
- **`inline`:** server decodes base64, validates size (≤ 8 MB), uploads to Vercel Blob with `access: "private"`. Slug derived from `filename` (if provided) or generated.
- **`external_url`:** server validates the URL parses and uses `https://`. Stored as-is.
- **`version_of` set:**
  - Artifact must exist and be owned by the bearer-token user; otherwise `not_found_or_forbidden`.
  - Status must be Collecting or Finished — Drafts are not addressable via MCP. Deleted → `gone`.
  - New version inherits current status. Adding a version to a Finished artifact stays Finished — same as the web flow does not auto-reopen.
- **`version_of` unset:** new artifact created with TTL counting from now.
- **Reviewers:** when `reviewers` is provided, each `{ name, email }` is added to the invitee list and Resend sends an invitation email containing the artifact link per S5 / M3.D4. On a `version_of` call, the list is *merged* with the artifact's existing invitees — de-duplicated by email (case-insensitive on the local part) — and emails are sent only to the newly added entries (existing reviewers are not re-emailed for a v2 add). Useful for "publish v2 and pull in two more reviewers" in one turn. The web UI flow (M3.D3) and `OMCP.6 add_reviewer` remain available for the after-the-fact case.
- **Distillation trigger:** publishing does not run distillation (M3.C8); the first non-owner comment does.

**Errors** (all non-retryable except `internal` — see §7):
- `validation` — input fails schema (missing mime, malformed URL, title length, malformed reviewer email, > 50 reviewers, etc.).
- `not_found_or_forbidden` — `version_of` does not exist or is not owned by caller.
- `gone` — `version_of` is soft-deleted. Owner must Restore via the web UI before the agent can add a version.
- `payload_too_large` — `inline.content_base64` decodes to more than 8 MB. **Hard architectural limit, not a transient failure.** `retryable: false`. The agent must change strategy — retrying produces the same error. The `message` surfaced to the agent is, verbatim:

  > "File too large for inline MCP upload: received {actual_mb} MB after base64 decode; the limit is 8 MB. This is a hard architectural limit (MCP message ceiling + Vercel function body limit), not a transient failure — retrying will not help. Three alternatives: (1) **for first-version publishes** (no `version_of`): call `create_artifact_draft` *without* `source` — that returns a `draft_url` the user opens in the web UI to attach the file, preserving the title, tags, description, and reviewers so the user does not re-enter them; (2) ask the user to upload via the web UI from scratch (`/artifacts/{id}` to add a version, or the home-page **New artifact** button for the first version) — direct browser→Blob upload bypasses the MCP message ceiling; (3) host the file at an `https://` URL the reviewers can reach and pass it as `{ kind: \"external_url\", url }` instead."

  `details` payload: `{ actual_bytes: number, limit_bytes: 8388608, version_of: string | null }`. The agent is expected to surface the available alternatives to the user, not pick one silently. The `version_of` echo lets the agent detect whether option (1) applies — for v2+ adds, only options (2) and (3) are valid.

---

### 4.2 `list_my_artifacts` — *MVP*

**Description (wire, sent to the agent):**

> List the caller's own artifacts. Filter by `status` (`draft` / `collecting_feedback` / `finished` / `deleted`). Paginate with `limit` (default 20, max 100) and `cursor` from a prior call's `next_cursor`; do not exceed `limit` — page through if the user asks for more. Use this to find an `artifact_id` before calling `summarize_feedback`, `add_comment`, or a versioned `publish_artifact`. Do not use to view artifacts shared *with* the user — that's `list_shared_with_me`.

Lists artifacts owned by the caller.

```ts
type ListMyArtifactsInput = {
  status?: "draft" | "collecting_feedback" | "finished" | "deleted";
  limit?: number;   // default 20, max 100
  cursor?: string;  // opaque token from a prior call's next_cursor; omit for first page
};

type ListMyArtifactsOutput = {
  items: Array<{
    artifact_id: string;
    title: string;
    status: "draft" | "collecting_feedback" | "finished" | "deleted";
    latest_version_number: number;
    tags: string[];
    ttl_expires_at: string | null;       // null when Draft
    last_activity_at: string;
    aggregate_score: number | null;      // 1..5 stars from distillation; null if no non-owner comments yet
  }>;
  next_cursor: string | null;
};
```

Default sort matches the home page (M2.5): `last_commented` → `date_added` → `date_published`, descending.

---

### 4.3 `summarize_feedback` — *MVP, load-bearing*

**Description (wire, sent to the agent):**

> Return the structured distillation for one of the caller's artifact versions: aggregate stars (1..5), reviewer count, comment count, a one-paragraph summary, and exactly 3 ranked things to change next. Defaults to the latest version if `version` is omitted. Returns nulls / empty arrays when there are zero non-owner comments yet — that is "nothing to summarize," not an error. Use this when the user asks "what did people think?" or "what should I change in v2?".

Returns the same structured distillation as M3.C8.

```ts
type SummarizeFeedbackInput = {
  artifact_id: string;
  version?: number;   // defaults to latest
};

type SummarizeFeedbackOutput = {
  artifact_id: string;
  version_number: number;
  aggregate_score: number | null;        // 1..5; null if zero non-owner comments
  reviewer_count: number;                // distinct non-owner authors on this version
  comment_count: number;
  summary_paragraph: string;             // 1 paragraph, descriptive ("here's the gist")
  things_to_change_next: Array<{          // ranked, exactly 3 items when distillation has run
    title: string;
    rationale: string;
  }>;
  computed_at: string | null;            // ISO 8601; null when no comments yet
};
```

**Behavior:**
- Reads the cached distillation if present — the in-page panel and this tool share storage. No second LLM call when the in-page panel is already up to date.
- Zero non-owner comments → returns nulls / zero counts / empty `things_to_change_next`. Does not call Claude.
- Cache invalidation: each new non-owner comment retriggers distillation server-side; this tool reads whatever is fresh.

**Errors:** `not_found_or_forbidden`, `version_not_found`.

---

### 4.4 `add_comment` — *MVP*

**Description (wire, sent to the agent):**

> Append an owner-authored comment to the **latest published version** of one of the caller's artifacts. The tool intentionally does not accept a `version` argument — comments always land on whatever is latest at write time. Author is the bearer-token user; the agent cannot post on behalf of reviewers. Use this for self-notes ("will address X in v2") or owner acknowledgements that belong alongside the artifact, not in chat. Do not use to comment on artifacts shared *with* the user — reviewer-side commenting is not exposed through MCP.

Appends a comment to the **latest published version** of the caller's artifact. The author is the caller (owner) — the agent cannot post on behalf of reviewers via MCP.

**Hard rule (matches `user-story-map.md` line 17):** comments are written *only* on the latest version. The tool does not accept a `version` argument. If a new version is published between the agent's read and the write, the comment lands on the (now) latest version — that is the intended behavior, not a race condition the caller needs to guard against.

```ts
type AddCommentInput = {
  artifact_id: string;
  body: string;     // 1..5000 chars after trim
};

type AddCommentOutput = {
  comment_id: string;
  artifact_id: string;
  version_number: number;     // the version it was attached to (latest at write time)
  created_at: string;          // ISO 8601
};
```

**Behavior:**
- Comment is owner-authored. Author name and email come from the bearer-token user's record — not passed by the agent.
- Owner comments do **not** trigger distillation (M3.C8 is non-owner only). Reception stars (M2.11) are unchanged.
- Status check is strict: artifact must be `collecting_feedback`. Draft (no comments allowed at all), Finished (input disabled everywhere), Deleted (gone) are all rejected with non-retryable errors.
- Body is trimmed but not otherwise transformed. No markdown rendering on write — the same text the agent sends is what reviewers see.

**Errors** (all non-retryable except `internal`):
- `validation` — body empty after trim, or > 5000 chars.
- `not_found_or_forbidden` — artifact does not exist or is not owned by caller.
- `gone` — artifact is soft-deleted. Owner must Restore via the web UI before the agent can comment.
- `not_commentable` — artifact is in Draft or Finished state. The error `message` distinguishes the two so the agent can explain to the user, verbatim:
  - **Draft:** *"This artifact has no published version yet — comments are only accepted on the latest published version. Publish it first (or ask the user to do so via the web UI) before adding a comment."*
  - **Finished:** *"This artifact is Finished — no new comments accepted. Reopening is owner-only via the web UI and not exposed through MCP."*

  `details` payload: `{ status: "draft" | "finished" }` so the agent can branch without parsing the message.

---

### 4.5 `list_shared_with_me` — *MVP*

**Description (wire, sent to the agent):**

> List artifacts shared *with* the caller for review (the caller's email is on the invitee list). Defaults to `status: "collecting_feedback"`. Each item includes `last_seen_version` so unread items (`latest_version_number > last_seen_version`) can be highlighted to the user. Paginate with `limit` (default 20, max 100) and `cursor` from a prior call's `next_cursor`. This is a *list* surface only — viewing files and posting reviewer comments happen in the web UI. Owner-only signals (tags, distillation, reception stars, full reviewer list) are never returned.

Lists artifacts where the bearer-token user's verified Google email is on the invitee list — the chat-side equivalent of the web `/shared-with-me` inbox (Section 2b).

```ts
type ListSharedWithMeInput = {
  status?: "collecting_feedback" | "finished";  // default: "collecting_feedback" only
  limit?: number;   // default 20, max 100
  cursor?: string;  // opaque token from a prior call's next_cursor; omit for first page
};

type ListSharedWithMeOutput = {
  items: Array<{
    artifact_id: string;
    title: string;
    owner: { name: string; email: string };
    status: "collecting_feedback" | "finished";   // Draft never appears (no invitees); Deleted is hidden per M2b.1
    latest_version_number: number;
    last_seen_version: number | null;              // null until the user first opens /artifacts/[id]; drives the M2b.7 unread badge
    ttl_expires_at: string | null;                 // null when Finished
    last_activity_at: string;
  }>;
  next_cursor: string | null;
};
```

**Behavior:**
- Match rule: bearer-token user's verified Google email matches an entry in the artifact's invitee list (case-insensitive on the local part).
- Default sort matches M2b.5: unread (`latest_version_number > last_seen_version`) first; then `last_commented` → `date_added` → `date_published`, descending.
- Owner-only signals — tags, distillation output, reception stars, full reviewer list — are **never** included. Reviewer surfaces are governed by M4.A6 / M3.A8.
- Drafts never appear (no invitees); Deleted artifacts never appear (M2b.1 default).

**Errors:**
- `validation` — invalid `status`, `limit`, or `cursor`.
- `internal` — DB / SDK failure (retryable).

**What this tool does *not* do:**
- Return file bytes or proxy URLs. Viewing happens in the web UI; the agent suggests opening `/artifacts/[id]`.
- Open a path for the agent to comment on shared artifacts. `add_comment` (§4.4) is owner-only by design — see §9.

---

### 4.6 `create_artifact_draft` — *MVP*

**Description (wire, sent to the agent):**

> Create a Draft artifact owned by the caller — does *not* publish, does *not* send invitation emails. `source` is optional: pass it to seed the file (same discriminated union and 8 MB inline cap as `publish_artifact`), or omit it to create a metadata-only Draft the user finishes in the web UI. `reviewers`, `tags`, and `description` are stored on the Draft; reviewer invitation emails go out only on Publish (per M3.D4). Returns a `draft_url` deep-link to `/artifacts/[id]` where the user picks up. Use this when the user wants to start an artifact but isn't ready to publish — most importantly, as the recovery path when `publish_artifact` returned `payload_too_large`: the agent reissues the call without `source`, hands the user the `draft_url`, and the user attaches the file in the web UI without re-typing the metadata.

Creates a Draft. Drafts are owner-only — no invitee or anonymous-reviewer visibility, no TTL counting, no comments. The Draft persists until the owner Publishes it via the web UI (M3.D4); promoting an existing Draft to Collecting feedback from chat is **not** in MVP and is a future tool.

```ts
type CreateArtifactDraftInput = {
  title: string;                 // 1..200 chars
  source?:                       // optional — omit for metadata-only Draft
    | { kind: "inline"; content_base64: string; mime_type: string; filename?: string }
    | { kind: "external_url"; url: string; mime_type?: string };
  tags?: string[];               // owner-private namespace; never shown to invitee surfaces (M2.12)
  description?: string;          // per-version description; defaults to empty
  reviewers?: Array<{            // optional invitee list; max 50 entries; emails validated and lowercased on the local part. NO emails sent — invitations dispatch on Publish (M3.D4)
    name: string;
    email: string;
  }>;
};

type CreateArtifactDraftOutput = {
  artifact_id: string;
  draft_url: string;             // canonical `/artifacts/[id]` URL — the Draft edit page in the web UI
};
```

**Behavior:**
- **`source` provided, `inline`:** server decodes base64, validates size (≤ 8 MB), uploads to Vercel Blob with `access: "private"`. Slug derived from `filename` (if provided) or generated.
- **`source` provided, `external_url`:** server validates the URL parses and uses `https://`. Stored as-is.
- **`source` omitted:** Draft is metadata-only. The web UI Draft edit page (M3.D1) gates Publish on at least one file being attached.
- **`reviewers`:** added to the invitee list immediately, but **no Resend email is sent** — invitation emails fire on Publish per M3.D4. This matches the web UI flow (M3.D3).
- **No `version_of`:** Drafts apply to the *first* version of a *new* artifact only. Adding a v2 to an existing Collecting / Finished artifact is `publish_artifact` with `version_of` set, not a Draft action — this matches the web UI (per user-story-map line 11, per-version fields seal once "Draft published or new version added").
- **No `ttl_days`:** TTL begins counting on Publish (M3.D4). The owner can configure TTL in the web UI before publishing.

**Errors** (all non-retryable except `internal`):
- `validation` — title length, malformed reviewer email, > 50 reviewers, malformed external URL.
- `payload_too_large` — `source` is `inline` and exceeds 8 MB. Same hard architectural limit as `publish_artifact`. The agent's recovery here is narrower because the same tool is already the recovery path: omit `source` (create a metadata-only Draft), or switch `source` to `external_url`. Verbatim message:

  > "File too large for inline MCP upload: received {actual_mb} MB after base64 decode; the limit is 8 MB. This is a hard architectural limit, not a transient failure — retrying will not help. Two alternatives: (1) reissue this call without `source` to create a metadata-only Draft and let the user attach the file via the returned `draft_url`; (2) host the file at an `https://` URL and pass it as `{ kind: \"external_url\", url }` instead."

  `details` payload: `{ actual_bytes: number, limit_bytes: 8388608 }`.

---

### 4.7 Optional tools

Cut order matches story map §7. Schemas are deferred to implementation time — listed here only for completeness.

- `OMCP.2 propose_v2(artifact_id)` — agent drafts v2 inline from distillation; returns proposed `description` + change rationale (no upload yet).
- `OMCP.4 mark_finished(artifact_id)` — flips status to Finished.
- `OMCP.5 extend_ttl(artifact_id, days)` — extends the artifact's TTL.
- `OMCP.6 add_reviewer(artifact_id, name, email)` — invites a reviewer; sends Resend email (per S5).
- `OMCP.publish_existing_draft(artifact_id)` *(future)* — promote a Draft (created via `create_artifact_draft`) to Collecting feedback from chat without going through the web UI. Out of MVP because the web UI Publish (M3.D4) covers this today.

---

## 5. Resources

### 5.1 `artifact://{id}` — *MVP*

Read-only view of artifact state for the agent. Available to **two caller roles**: the artifact's owner, and any invited reviewer (the bearer-token user's verified Google email is on the invitee list — same match rule as `list_shared_with_me` §4.5). The response shape is a discriminated union on `viewer_role` — the redactions match the web-side reviewer surfaces (M3.A8 / M4.A6) so chat-side and web-side never disagree on what a reviewer is allowed to see.

```ts
type ArtifactResourceVersion = {
  number: number;
  description: string;
  source:
    | { kind: "inline"; mime_type: string; filename: string | null }
    | { kind: "external_url"; url: string; mime_type: string | null };
  created_at: string;
  comment_count: number;
  latest_comments: Array<{
    author_name: string;
    author_email: string | null;
    body: string;
    created_at: string;
  }>;  // last 5 per version
};

type ArtifactResource =
  | {
      viewer_role: "owner";
      artifact_id: string;
      title: string;
      status: "draft" | "collecting_feedback" | "finished" | "deleted";
      tags: string[];
      ttl_expires_at: string | null;
      artifact_url: string;           // canonical `/artifacts/[id]` URL
      reviewers: Array<{ name: string; email: string; added_at: string }>;
      versions: ArtifactResourceVersion[];
    }
  | {
      viewer_role: "reviewer";
      artifact_id: string;
      title: string;
      status: "collecting_feedback" | "finished";   // Draft / Deleted are never visible to reviewers
      ttl_expires_at: string | null;                 // null when Finished — same as the M2b inbox
      artifact_url: string;                          // canonical `/artifacts/[id]` URL — reviewers open the file there
      owner: { name: string; email: string };
      versions: ArtifactResourceVersion[];
      // Owner-private fields are intentionally omitted: tags (M2.12), full reviewer list (M3.A8 / M4.A6), and any distillation / reception-stars output (M3.C8 / M2.11 — those live in `summarize_feedback` and remain owner-only).
    };
```

**Auth & role resolution:**
- **Owner match wins.** If the bearer-token user owns the artifact, `viewer_role: "owner"` is returned regardless of any other relation.
- **Reviewer match.** If the user does not own the artifact but their verified Google email is on the invitee list (case-insensitive on the local part — same rule as §4.5), `viewer_role: "reviewer"` is returned.
- **No relation.** Caller is neither owner nor invitee → `not_found_or_forbidden`.
- **Drafts and Deleted artifacts** are never visible to reviewers. A reviewer-role read of a Draft or Deleted artifact returns `not_found_or_forbidden` (Draft) or `gone` (Deleted), consistent with the M2b inbox hiding both.

**Why this lives in `artifact://{id}` and not a second resource:** there's only one artifact identity. A separate `reviewer-artifact://{id}` URI would force the agent to know its own role before reading, defeating the point of a resource. The discriminated union lets the agent fetch and branch in one step.

**Errors:** `not_found_or_forbidden`, `gone`.

### 5.2 `feedback://{artifact_id}` — *Optional, OMCP.7*

Raw comments per version, paginated. Out of MVP.

---

## 6. Prompts

**No MCP Prompts in MVP.** The third MCP primitive is intentionally unused. The wire descriptions on each tool (§4) carry the agent's behavior model; a parallel prompt-template layer would only duplicate that contract and create a second source of truth that can drift. If a future workflow needs a named, menu-discoverable entry point in the MCP client UI, a Prompt can be added then — out of scope for MVP.

---

## 7. Errors — wire shape

All tool errors share one envelope:

```ts
type ToolError = {
  code:
    | "validation"
    | "not_found_or_forbidden"
    | "gone"
    | "not_commentable"
    | "payload_too_large"
    | "version_not_found"
    | "internal";
  message: string;        // human-readable, safe to surface to the agent and to the user
  retryable: boolean;     // if false, the agent MUST change strategy — retrying produces the same error
  details?: unknown;      // optional structured detail (Zod issues, byte counts, etc.)
};
```

`retryable` is load-bearing for agent behavior — without it, the agent has no machine-readable signal that "the same call will fail the same way" and may waste turns retrying. Mapping:

| Code | `retryable` | Meaning for the agent |
|---|---|---|
| `validation` | false | Bad input. Fix the input or ask the user — do not retry. |
| `not_found_or_forbidden` | false | Wrong id or wrong owner. Token's user has no access to that artifact. |
| `gone` | false | Artifact is soft-deleted. Owner must Restore via the web UI first. |
| `not_commentable` | false | Artifact is in Draft or Finished state. Owner must Publish or Reopen via the web UI before MCP can comment. See §4.4. |
| `payload_too_large` | false | Hard architectural limit. For first-version publishes, fall back to `create_artifact_draft` without `source` (preserves metadata). Otherwise switch to the web UI or `external_url`. See §4.1 and §4.6. |
| `version_not_found` | false | Requested version number does not exist on this artifact. |
| `internal` | true | Catch-all for unexpected failures (DB hiccup, transient SDK issue). One retry is reasonable; do not loop. Never leaks stack traces or DB errors in `message`. |

---

## 8. Conversational flow examples

**Maya generates HTML in Claude, publishes it in one turn:**
> Maya: *"Publish this draft as 'Q3 launch teaser', tags landing-page and copy."*
> Agent → `publish_artifact({ title: "Q3 launch teaser", source: { kind: "inline", content_base64: "...", mime_type: "text/html" }, tags: ["landing-page", "copy"] })`
> Agent: *"Published as v1. Link: https://iterate.guru/artifacts/abc"*

**Maya links a Figma board instead of uploading bytes:**
> Maya: *"Publish 'Hero redesign' linking to https://figma.com/file/…, tag it design."*
> Agent → `publish_artifact({ title: "Hero redesign", source: { kind: "external_url", url: "https://figma.com/file/..." }, tags: ["design"] })`
> Agent: *"Done. Reviewers will see a click-through to Figma."*

**Maya publishes and invites reviewers in the same turn:**
> Maya: *"Publish 'Onboarding email v2' from this draft and send it to Sarah (sarah@acme.com) and Marcus (marcus@acme.com)."*
> Agent → `publish_artifact({ title: "Onboarding email v2", source: { kind: "inline", content_base64: "...", mime_type: "text/html" }, reviewers: [{ name: "Sarah", email: "sarah@acme.com" }, { name: "Marcus", email: "marcus@acme.com" }] })`
> Server publishes v1, adds both invitees, and Resend dispatches invitation emails containing the artifact link per S5 / M3.D4.
> Agent: *"Published as v1. Sarah and Marcus have the link by email. Here's the URL too: https://iterate.guru/artifacts/abc"*

**Maya checks in two days later:**
> Maya: *"What did people say about the Q3 teaser?"*
> Agent → `list_my_artifacts({})` → finds the artifact → `summarize_feedback({ artifact_id: "..." })`
> Agent: *"3.6/5 from 4 reviewers. Gist: tone reads too corporate. Top 3 changes: …"*

**Maya checks what's been shared with her, then drills into one:**
> Maya: *"Anything new shared with me this week?"*
> Agent → `list_shared_with_me({})`
> Server returns 2 items in `collecting_feedback`, both with `latest_version_number > last_seen_version` (unread).
> Agent: *"Two waiting on you: 'Onboarding email v2' from Sarah (you last saw v1, she's added v2) and 'Pricing page draft' from Marcus (new since you last opened it). Want a summary of either before you open the web UI to comment?"*
> Maya: *"What did Sarah change in v2?"*
> Agent → reads `artifact://abc` → server returns `{ viewer_role: "reviewer", title: "Onboarding email v2", status: "collecting_feedback", versions: [{ number: 1, description: "..." }, { number: 2, description: "Tightened the opening paragraph and dropped the second CTA per Marcus's v1 feedback.", latest_comments: [...] }], owner: { name: "Sarah", ... }, ... }` (no `tags`, no full `reviewers` list — those are owner-only).
> Agent: *"Sarah's v2 description says: 'Tightened the opening paragraph and dropped the second CTA per Marcus's v1 feedback.' Two comments on v2 already, both from Marcus. Open it in the web UI to view the file and add yours — I can't post comments on artifacts shared with you from here."*

**Maya leaves a self-note before drafting v2:**
> Maya: *"Add a comment on the Q3 teaser saying I'll address the corporate-tone feedback in v2."*
> Agent → `add_comment({ artifact_id: "...", body: "I'll address the corporate-tone feedback in v2 — pulling back the formal language and grounding the copy in the actual launch story." })`
> Agent: *"Comment added on v1 (the latest version). Owner-authored, so it doesn't move distillation or reception stars."*

**Maya asks the agent to comment on a Finished artifact:**
> Maya: *"Add a quick thanks-note to the Hero redesign artifact."*
> Agent → `add_comment({ artifact_id: "...", body: "Thanks everyone — final version locked." })`
> Server → `not_commentable` with `retryable: false`, `details: { status: "finished" }`.
> Agent (does **not** retry): *"That artifact is marked Finished — comments are closed and reopening is owner-only via the web UI. Want me to do something else, or open it in the browser?"*

**Maya tries to upload a file that exceeds the inline cap (first-version publish):**
> Maya: *"Publish this 25 MB PDF as 'Annual report draft', tag it finance and Q4, and invite Sarah and Marcus."*
> Agent → `publish_artifact({ title: "Annual report draft", source: { kind: "inline", content_base64: "...", mime_type: "application/pdf" }, tags: ["finance", "q4"], reviewers: [{ name: "Sarah", email: "sarah@acme.com" }, { name: "Marcus", email: "marcus@acme.com" }] })`
> Server → `payload_too_large` with `retryable: false`, `details: { actual_bytes: 26214400, limit_bytes: 8388608, version_of: null }`.
> Agent (does **not** retry; reads `version_of: null` so option 1 applies; offers the metadata-preserving path first):
> Agent → `create_artifact_draft({ title: "Annual report draft", tags: ["finance", "q4"], reviewers: [{ name: "Sarah", email: "sarah@acme.com" }, { name: "Marcus", email: "marcus@acme.com" }] })` (note: no `source` — file is too big to ship inline)
> Server returns `{ artifact_id: "...", draft_url: "https://iterate.guru/artifacts/abc" }`.
> Agent: *"That PDF is 25 MB — the chat-based publish path is hard-capped at 8 MB. I've created a Draft for you with the title, tags, and reviewers already filled in: https://iterate.guru/artifacts/abc — open that, attach the PDF, and click Publish. Sarah and Marcus will be emailed once you Publish. (If you'd rather, I can publish it as a link to an external `https://` URL instead — say the word.)"*

**Maya tries to add a v2 that exceeds the inline cap (`version_of` set):**
> Maya: *"Add v2 to the Annual report — here's the revised 25 MB PDF."*
> Agent → `publish_artifact({ source: { kind: "inline", ... }, version_of: "abc" })`
> Server → `payload_too_large` with `details: { actual_bytes: 26214400, limit_bytes: 8388608, version_of: "abc" }`.
> Agent (reads `version_of: "abc"` — option 1 does **not** apply for v2+ adds; falls back to options 2 and 3): *"That PDF is 25 MB — too big for the chat-based path, and the Draft fallback only works for first-version publishes, not v2 adds. Two options: (1) open the artifact in the web UI to add v2 directly there, or (2) host the file at an `https://` URL and I'll add it as a reference. Which do you prefer?"*

**Maya publishes v2:**
> Maya: *"OK, here's the revision — publish it as v2."*
> Agent → `publish_artifact({ title: "Q3 launch teaser", source: { kind: "inline", ... }, version_of: "..." })`
> Agent: *"v2 published. Same artifact link, reviewers will see the new version on next visit."*

---

## 9. Out of scope

- Streaming tool output. Tools return JSON, not chunks.
- Webhooks / push notifications back to MCP clients. The conversational loop is poll-based — Maya re-asks.
- Tool / resource calls on artifacts the caller has no relation to. The bearer-token user can act on artifacts they own (publish, list, comment, summarize, full-fidelity resource read) and can *list* + *read* (with reviewer-side redactions) artifacts they're invited to review (§4.5, §5.1). They cannot discover or act on artifacts they are neither owner nor invitee of.
- Reviewer-side commenting via `add_comment`. The bearer-token user can list shared artifacts (§4.5) but `add_comment` (§4.4) rejects when the caller is not the owner. Lifting this requires a second auth path (owner OR invited reviewer) and a second post-write path (non-owner comments trigger distillation per M3.C8) — explicitly not MVP. Reviewers comment via the web UI today.
- Embed / preview of `external_url` artifacts. Click-through only.
- File ingestion from external URLs (download → re-upload as `inline`). If we ever want this, it becomes a separate tool — not a flag on `publish_artifact`.
- HTTP (non-HTTPS) external URLs. Mixed-content / privacy traps not worth the surface area.
