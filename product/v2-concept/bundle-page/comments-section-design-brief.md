# Comments Section — Design Brief

Short brief for Claude Design.

## What I want

Design the comments section on the bundle page. It needs to feel closer to Slack/Linear-style threaded discussion than a flat comment list, and it must treat **people, files, and images as first-class inline citizens** of the message body — not as attachments below it.

## User stories (translated)

- As a performer, I want to reply to a message — and have a snippet of the original quoted at the top of my reply.
- As a performer, I want to start a separate thread.
- As a performer, I want to mention people via `@`.
- As a performer, I want to filter comments to those left on my current stage, or where a file from the current stage is explicitly mentioned.
- As a performer, I want to reference a file (and a specific version of it) inline via `#`.
- As a performer, I want to see in the activity log when a component file is updated to a new version.
- As a performer, I want to view messages inside a dedicated thread panel.
- As a performer, I want to open a thread from any message (Slack-style side panel).
- As a performer, I want messages to render mentions, file references (with version), and images **inline** — placed inside the sentence, not stacked below it.
- As a performer, I want to click a file reference in a comment and open a preview of exactly the version that was cited.

## Core design ideas

### 1. Inline-rich message body
Mentions, file chips (with version badge), and images render **inside the text flow**, not as a separate attachment block. A comment can read like: "Looks good, but **@Olena** check **`hero-banner.psd v3`** against the brief — should match **<inline image>**."

- Mentions: pill with avatar + name.
- File chips: pill with file-type icon + name + small version badge (e.g. `v3`). Clickable → opens preview of that exact version.
- Inline images: rendered at a comfortable max height, clickable to expand.

### 2. Threading
- Each top-level message can spawn a **thread** (Slack pattern): a side panel or expandable inline view.
- Thread count + last-reply indicator on the parent message.
- Replies inside a thread can also **quote-reply** to a specific message — quoted snippet sits in the reply's header, collapsed but expandable.

### 3. Composer
- `@` opens a person picker.
- `#` opens a file picker — must support selecting a **specific version** of the file, not just the latest.
- Images can be dropped/pasted **into the text caret position** (not appended at the bottom).
- A "Reply" action on any message pre-fills the composer with a quote header.

### 4. Filters / scoping
- Default view: all comments on the bundle.
- Quick filter: **"Current stage only"** — shows comments left on the active stage OR comments that reference a file belonging to the active stage.
- Possibly a "mentions me" filter too.

### 5. Activity log integration
- Component-file version bumps appear as system entries in the same timeline ("`brand-logo.svg` updated to v4 from <source>").
- System entries are visually distinct from human comments (no avatar bubble, muted treatment), but live in the same scroll.

## Visual direction

- Comments are the conversational layer — calm, readable, dense without feeling cramped.
- Inline chips (mentions, files) should be **clearly tappable** but not louder than the surrounding text — subtle background fill, not heavy borders.
- Threads in a side panel keep the main feed scannable; the parent message stays visible in the main column with a "X replies" affordance.
- File-version badges are small and monospaced (`v3`) — easy to scan, easy to ignore when not relevant.

## Out of scope for this pass

- Reactions / emoji.
- Editing/deleting policy UI.
- Notification preferences.
- Rich-text formatting beyond inline entities (no bold/italic/lists in the first cut unless trivial).
