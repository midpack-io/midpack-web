# Landing Page — iterate.guru

Two body sections: a tight hero and a visual three-step infographic. That's the whole page. The day-by-day walk-through and the before/after are removed in favor of clarity — a visitor should understand the product in five seconds, click *Continue with Google*, and discover the rest in the app.

## The job (one line — internal anchor)

> When my AI just produced a draft and I need 2–4 specific people to weigh in before I ship, I want their input collected in one thread, distilled into "what to change," and posted back as v2 — without spending an afternoon consolidating chats.

Every visible line on the page either gestures at that situation or shows what stops happening. Internal anchor only — never appears on the page verbatim.

## Feature inventory the page may safely claim

Verified shipped (audit, 2026-05-07):

- **Publish artifacts** — HTML, images, PDFs, PPTX/DOCX/XLSX (per `CLAUDE.md`).
- **Versioned threads** — every artifact has v1, v2, v3, …; reviewers browse all versions.
- **Per-version comment lanes** — comments are scoped to the version they were left on (`Comment.versionId` FK; `artifact-detail-comment-thread.tsx`).
- **Scoped reviewers** — Google OAuth + invitee list per artifact.
- **AI distillation** — Claude Sonnet runs after every new comment and produces a 1–5 score, a paragraph, and three ranked "things to change" (`services/feedback-distillation.ts`; UI in `artifact-detail-reception-panel.tsx`).
- **MCP server** — 6 tools: `list_my_artifacts`, `list_shared_with_me`, `create_artifact_draft`, `publish_artifact`, `add_comment`, `summarize_feedback`.

**Do NOT claim** (not built):

- "Did v2 address v1's feedback?" cross-version check.
- MCP composing actions in one turn (each tool is standalone).
- Zero-install reviewers.
- TTL / drafts-expire-on-purpose.

---

## Section 1 — Hero (kept verbatim from the live landing)

**Eyebrow chip:** `mcp enabled` *(unchanged — live-pulse dot stays)*

**H1:**
> Your Artifact *feedback* loop

*(verbatim from `src/app/(public)/page.tsx` — italicized "feedback" earns the visual emphasis)*

**Sub:**
> Stop consolidating Slack threads at midnight. Publish drafts, let reviewers comment, and ship the version your AI distilled from what they actually said.

*(verbatim from the live landing)*

**Primary CTA:** `Continue with Google`
**Secondary line:** `free while in beta · no credit card`

**Removed:** the existing three-step strip in the hero. Section 2 owns the three steps now — keeping a strip in the hero would duplicate it. Hero stays as it ships today, minus the strip: chip, H1, sub, CTA, secondary line.

---

## Section 2 — How it works *(the visual three-step)*

> *The friendly, simple section the user asked for. Three large cards, plain language, one product screenshot. Anyone — technical or not — should grok the product in one glance.*

**Eyebrow:** `how it works`

**H2:**
> Three steps. That's it.

**Layout — three cards, left-to-right on desktop, stacked on mobile:**

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ 01               │      │ 02               │      │ 03         ✨ AI │
│                  │      │                  │      │                  │
│   📄  →          │  →   │   💬             │  →   │   ↻              │
│                  │      │                  │      │                  │
│ Publish          │      │ Collect feedback │      │ Improve and post │
│                  │      │                  │      │ the next version │
│ Upload your      │      │ They comment on  │      │ See what to      │
│ draft. Add the   │      │ the version.     │      │ change. Post     │
│ people you want  │      │ Everything stays │      │ the next version │
│ feedback from.   │      │ in one place.    │      │ — same chat,     │
│                  │      │                  │      │ via MCP.         │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

### Per-card spec

**Card 01 — Publish**

- Number chip: `01` (mono, top-left)
- Icon: a file/document glyph (Lucide `FileUp` or a custom SVG of a paper with an upward arrow). Sized large — the visual is the hook.
- Label: **Publish** (sans, bold, ~24px)
- Caption: *Upload your draft. Add the people you want feedback from.*
- Technical detail (smaller, muted, optional): `PDF, doc, deck, image, web — reviewers see it natively.`

**Card 02 — Collect feedback**

- Number chip: `02`
- Icon: stacked comment bubbles (Lucide `MessagesSquare` or two overlapping speech glyphs)
- Label: **Collect feedback**
- Caption: *They comment on the version. Everything stays in one place.*
- Technical detail: `Per-version threads. No scattered chats.`

**Card 03 — Improve and post the next version**

- Number chip: `03`
- **Accent chip in the corner:** `✨ AI` (small mono pill, primary color) — the visual cue that the AI does the work in this step
- Icon: a circular arrow / refresh glyph (Lucide `RotateCw` or a stylized "v1 → v2" loop)
- Label: **Improve and publish next**
- Caption: *See what to change. Post the next version — same chat, via MCP.*
- Technical detail: `AI summary: 1–5 score, paragraph, three things to change.`

### Connectors between cards

- Desktop: a thin horizontal line with a chevron (`›`) midway between adjacent cards. Same color as the border tokens.
- Mobile: a vertical chevron (`⌄`) between stacked cards.
- Subtle animation optional: a slow pulse on the chevrons (~2s) to imply motion. Reuse the existing `animate-pulse-ring` keyframe if it fits — don't introduce new animation tokens.

### Product screenshot (one — anchor for the section)

Below the three cards, full-width-ish (capped at the section's `max-w-[1080px]` — slightly wider than the cards to feel like proof, not a card itself).

**What to capture:** the artifact detail page showing the version selector tabs (`v1 · 4 comments`, `v2 · 2 comments`) AND the AI distillation panel (1–5 score chip, paragraph, three numbered "things to change"). The screenshot is the literal output of step 03 — visitors see the friendly cards above, then see what the cards actually produce.

**Treatment:**
- Soft drop shadow, rounded `rounded-xl`, border in `border` token.
- Optional one-line caption underneath: *the artifact view: every version, every comment, the AI's distill — in one place.* Mono, muted.

### Closing CTA

Centered below the screenshot:
> `Continue with Google` · *free while in beta*

---

## Notes for build

- **Keep the existing backdrop** (radial-gradient + dot-grid) for the whole page — visual through-line.
- **Hero shrinks slightly** without the three-step strip. That's fine; the visual weight shifts to Section 2 where it belongs now.
- **Section 2 width:** cards in a `max-w-[920px]` container (matching the hero); the screenshot below allowed slightly wider (`max-w-[1080px]`) to feel more like proof and less like another card.
- **Card height:** equal across all three (use `grid-cols-3` with `auto-rows-fr`). Desktop card ~280–320px tall; mobile cards stack with full width.
- **Icons:** prefer Lucide — already a likely dependency via shadcn. Custom SVGs only if a Lucide glyph doesn't fit.
- **Tone of card copy:** plain language, ~10 words for caption + ~10 for technical detail. No jargon (MCP / distillation / thread) in the headline; allow them in the smaller technical-detail line for the visitor who wants the under-the-hood.
- **The `✨ AI` chip on Card 03** is the only "AI" branding on the page below the hero's `mcp enabled` chip. That's deliberate — the AI is in the product, not in the marketing.
- **No new top-level dependencies.** Lucide icons, existing tokens, existing keyframes.
- **Out of scope** for this page: testimonials, logos, pricing, comparison grids, multiple screenshots, video. One screenshot, three cards, one CTA.

## Notes for re-review

If the build later adds the cross-version check or true MCP tool composition, Card 03's technical-detail line gains a phrase about it — but only after audit confirms it ships.
