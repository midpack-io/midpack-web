# Comments — Mock Data

Mocked conversation for a bundle going through a typical creative workflow. Use this to ground the design.

## Scenario

**Bundle:** "Spring Launch — Landing Page Pack"
**Stages (in order):** Brief → Design → Copy → Review → Approval → Production
**Currently active stage:** Review

## People

| Avatar | Name | Role |
|---|---|---|
| OL | **Olena Kravchuk** | Designer (Design stage owner) |
| MA | **Marko Tkachenko** | Copywriter (Copy stage owner) |
| LI | **Lina Hrytsenko** | Art Director (Review stage owner, Approver on Approval) |
| PA | **Pavlo Shevchuk** | Brand Manager (Approver on Approval) |
| YU | **Yuri Bondarenko** | Producer (Production stage owner) |
| AN | **Anna Kovalenko** | Project Lead (Manager) |

## Files referenced

- `brief.pdf` — Brief stage
- `hero-banner.psd` — Design stage (versions v1, v2, v3)
- `product-shot.jpg` — Design stage
- `copy-draft.docx` — Copy stage (versions v1, v2)
- `brand-logo.svg` — **component file** (versions v3 → v4)
- `color-palette.pdf` — **component file** (v2)

---

## Main feed — 18 entries

> Legend for the designer:
> `@Name` = mention pill (avatar + name)
> `#file v2` = inline file chip with version badge — clicking opens preview of that exact version
> `[img]` = inline image rendered in the text flow
> `↳ Thread (N)` = thread affordance, opens side panel
> System entries (component bumps, stage events) live in the same feed but render without an avatar bubble.

---

**1.** **Anna Kovalenko** · *Brief* · May 12, 09:14
Kicking this off. Brief is final — see `#brief.pdf`. Tagging owners: `@Olena Kravchuk` on Design, `@Marko Tkachenko` on Copy. Deadline for the first design pass is May 15.

---

**2.** **Olena Kravchuk** · *Design* · May 12, 11:02
Started on the hero. First rough is up — `#hero-banner.psd v1`. Going with the warmer palette from `#color-palette.pdf v2`. Will iterate after lunch.
↳ Thread (4)

---

**3.** *System* · *Design* · May 12, 14:21
🔁 Component file `#brand-logo.svg` updated to **v4** in source library by `@Pavlo Shevchuk`. Bundle now references v4.

---

**4.** **Olena Kravchuk** · *Design* · May 12, 14:38
Caught the logo bump — `#brand-logo.svg v4` is cleaner on dark, good call `@Pavlo Shevchuk`. Refreshed the hero: `#hero-banner.psd v2`.
[img] *inline screenshot of the v2 hero, ~480px wide*

---

**5.** **Marko Tkachenko** · *Copy* · May 12, 16:50
First draft of headline + sub: `#copy-draft.docx v1`. Leaned into the "fewer, sharper" direction from the brief. `@Lina Hrytsenko` — want a read before I send to Review?

---

**6.** **Lina Hrytsenko** · *Copy* · May 12, 17:22
*↳ Replying to Marko's message #5*
> First draft of headline + sub: #copy-draft.docx v1. Leaned into the "fewer…

Headline works. Sub is doing two jobs — pick one. Also `#copy-draft.docx v1` line 4 contradicts the brief on pricing claims, double-check `#brief.pdf` page 3.

---

**7.** **Marko Tkachenko** · *Copy* · May 13, 09:08
Fixed both. New pass: `#copy-draft.docx v2`. Sub trimmed to one promise, pricing line removed.

---

**8.** **Olena Kravchuk** · *Design* · May 13, 10:44
Hero v3 is final from my side — `#hero-banner.psd v3`. Dropped `#product-shot.jpg` into the secondary slot. Moving stage to Review.

---

**9.** *System* · *Design → Review* · May 13, 10:44
✅ Stage **Design** completed by `@Olena Kravchuk`. **Review** is now active.

---

**10.** **Lina Hrytsenko** · *Review* · May 13, 13:30
Walking through `#hero-banner.psd v3` and `#copy-draft.docx v2` together now. Quick notes incoming.
↳ Thread (7)

---

**11.** **Lina Hrytsenko** · *Review* · May 13, 13:41
The lockup on `#hero-banner.psd v3` looks tight against the right margin — see this crop:
[img] *inline crop showing the margin issue*
Compare to the spec in `#brief.pdf` (margin section). `@Olena Kravchuk` can you nudge it 24px left?

---

**12.** **Olena Kravchuk** · *Review* · May 13, 14:02
*↳ Replying to Lina's message #11*
> The lockup on #hero-banner.psd v3 looks tight against the right margin…

On it. Will keep the same version number until Lina signs off — bumping to v3.1 internally, then v4 on next post.

---

**13.** **Pavlo Shevchuk** · *Review* · May 13, 15:10
Skimmed the bundle. Brand-side I'm fine pending the margin fix. One nit: `#copy-draft.docx v2` uses "Spring '26" once and "Spring 2026" once — pick one. `@Marko Tkachenko`.

---

**14.** **Marko Tkachenko** · *Review* · May 13, 15:18
Consistency fix queued. Will push v3 once Olena's hero is settled so we have one round of changes, not two.

---

**15.** **Anna Kovalenko** · *Approval* · May 14, 09:00
Heads up — Production needs final files by EOD May 16 to make the print slot. `@Lina Hrytsenko` `@Pavlo Shevchuk` keep that in mind on approvals.

---

**16.** *System* · *Component update* · May 14, 11:47
🔁 Component file `#color-palette.pdf` updated to **v3** in source library by `@Pavlo Shevchuk`. Bundle still pinned to v2 — `@Anna Kovalenko` review whether to bump.

---

**17.** **Anna Kovalenko** · *Bundle* · May 14, 12:05
Holding on the palette bump until after this launch — `#color-palette.pdf v2` stays. Pavlo, please apply v3 to the **Summer** collection bundles only.

---

**18.** **Yuri Bondarenko** · *Production* · May 14, 16:20
Standing by. Will pick up the bundle the moment Approval flips. Reminder: I need `#hero-banner.psd` flattened + `#copy-draft.docx` as final-final, not "final v3."

---

## Thread — opened from message #10

> Side panel. Parent message stays pinned at top of the thread. Thread comments scroll below.

**Parent (pinned):**
**Lina Hrytsenko** · *Review* · May 13, 13:30
Walking through `#hero-banner.psd v3` and `#copy-draft.docx v2` together now. Quick notes incoming.

---

**T1.** **Lina Hrytsenko** · May 13, 13:32
Note 1: type hierarchy on the hero. Subhead is competing with the headline — needs more contrast.

**T2.** **Olena Kravchuk** · May 13, 13:35
Weight or size?

**T3.** **Lina Hrytsenko** · May 13, 13:36
*↳ Replying to T2*
> Weight or size?

Size. Drop sub by 2px, keep the weight.

**T4.** **Olena Kravchuk** · May 13, 13:38
Got it. Also fixing the margin from your other note in the main feed.

**T5.** **Pavlo Shevchuk** · May 13, 13:55
Jumping in — make sure the `#brand-logo.svg v4` clear-space rule from the brand book still holds after the size change. Easy to lose 4–8px of breathing room when you nudge type around.
[img] *inline reference image from brand book, clear-space rule*

**T6.** **Olena Kravchuk** · May 13, 14:10
Verified. Logo clear-space is unchanged. Sub is at -2px, hierarchy reads cleaner now.
[img] *inline before/after crop*

**T7.** **Lina Hrytsenko** · May 13, 14:14
👍 That's the one. Once the margin fix lands I'll move us to Approval.

---

## What this mock demonstrates (mapped to user stories)

| User story | Demonstrated in |
|---|---|
| Reply with quoted snippet | #6, #12, T3 |
| Start a separate thread | #2, #10 (parents) |
| `@` mention | #1, #4, #5, #11, #13, #15, #16, #17 |
| Filter "current stage only" | feed entries tagged *Review* (#10–#14) vs others |
| Inline file ref with version (`#file vN`) | every #file mention above |
| Component file version bump in activity log | #3, #16 |
| Standalone thread view | the side-panel block (T1–T7) |
| Open thread from a specific message | #2 (4 replies), #10 (7 replies) |
| Inline mentions / files / images in the text | #4, #11, T5, T6 |
| Click file → preview that exact version | every `#file vN` chip |

---

## Notes for the designer

- Stage tags (`Design`, `Review`, etc.) on every entry are essential — they drive the "current stage only" filter and they orient the reader scanning a long feed.
- System entries (#3, #9, #16) sit in the same scroll as human messages but should be visually quieter — no avatar bubble, muted background, monospace timestamp.
- Quote-reply headers (#6, #12, T3) should be **collapsible** — truncated to ~one line by default, expandable on click.
- Thread affordance on the parent (`↳ Thread (N)`) must show the reply count and ideally the last-reply timestamp.
- File chips with version badges (`#hero-banner.psd v3`) need to feel like one atomic unit, not "file name + separate badge" — the version is part of the citation.
