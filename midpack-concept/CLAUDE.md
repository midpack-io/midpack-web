# midpack-concept — the longread (static, multilingual)

A single-page editorial "longread" describing the Midpack product. Plain
**HTML + CSS + vanilla JS**, no build step, no framework. Deployed as static
files to Vercel (`concept.midpack.io`).

- `index.html` — the page. Hand-tuned markup, inline SVG, CSS animations.
- `assets/longread.css` — all styling + design tokens. Cache-busted via
  `longread.css?v=N` in `index.html` — **bump `N` on every CSS change**
  (and the matching `assets/i18n.js?v=N` and `assets/analytics.js?v=N`).
- `assets/i18n.js` — the runtime translation layer (see below).
- `assets/analytics.js` — Vercel Web Analytics custom events (see **Analytics**
  below). Cache-busted via `analytics.js?v=N` — **bump `N` on every change.**
- `i18n/en.js` — the English translations. It's a **JS file**, not JSON: it does
  `window.MP_I18N.en = { meta, strings }` and is loaded via a `<script>` tag in
  `index.html`. (It's a JS file precisely so the page translates when you
  **double-click `index.html`** / open it over `file://` — browsers block
  `fetch()` of local JSON, but `<script src>` works.) The content is still a plain
  JSON object — edit it like JSON, just keep the `window.MP_I18N.en = … ;` wrapper
  and valid JS (don't drop a closing brace).
- `tools/i18n-extract.mjs` — regenerates the translation keys from the live DOM.

## ⚠️ The translation contract — READ BEFORE EDITING UKRAINIAN TEXT

**Ukrainian is the source language and lives directly in `index.html`.** English
is layered on at runtime by `assets/i18n.js`, which keys each translation by the
**normalized `innerHTML` of the source block** (whitespace collapsed to single
spaces, trimmed). So the keys in `i18n/en.js` literally *are* the Ukrainian
source strings.

This means the keys are **coupled to the Ukrainian text**. If you change a
Ukrainian string and don't update its key in `i18n/en.js`, that block will
silently fall back to Ukrainian in the English view (it won't break — it just
won't translate).

### When you change / add / remove Ukrainian text, you MUST:

1. **Edited an existing string?** Find its old value (the exact source text) as a
   key in `i18n/en.js` and update *that key* to match the new Ukrainian, keeping
   the same English value (or update the English too). The key must equal the new
   normalized `innerHTML` exactly — same inline tags (`<b>`, `<em>`, `<code>`,
   `<span class="…">`, `<svg>…</svg>`), same `&nbsp;`/`→` characters.
2. **Added a new translatable block?** Add a new `"<ukrainian source>": "<english>"`
   entry to `i18n/en.js`. If you skip it, the block shows Ukrainian in EN mode.
3. **Removed a block?** Delete its now-orphaned key from `i18n/en.js` (optional —
   orphans are harmless, just dead weight).
4. **Strings generated in JS** (the interactive stepper in `index.html`: stage
   names, performer names, deadlines, button labels) are translated via
   `MPI18N.t('<ukrainian>')`. Add their Ukrainian→English pairs to
   `i18n/en.js` too (they live in the same `strings` map).

### How keys are matched (so you get them byte-exact)

The key = `element.innerHTML` with `/\s+/g` collapsed to one space and trimmed.
`&nbsp;` becomes a normal space *in the key* (but keep `&nbsp;` in the English
*value* where you want a non-breaking space). Brand/technical tokens that read the
same in both languages (filenames, `Midpack`, `Google Drive`, `SS-26`) have **no
key** — they're left as-is on purpose.

If markup changed and you're unsure of the exact key, **regenerate** them:

```bash
# requires Playwright (npx playwright install chromium once)
node tools/i18n-extract.mjs > /tmp/keys.json
# /tmp/keys.json lists every translatable block's exact normalized key + raw HTML
```

Then reconcile `i18n/en.js` against that list (every Cyrillic key should have an
English value; no English value should still contain Cyrillic). To diff in Node,
load the dict with a `window` shim:
`node -e 'global.window={};require("./i18n/en.js");const en=window.MP_I18N.en.strings; /* compare against /tmp/keys.json */'`

### What gets translated

`assets/i18n.js` walks a fixed selector set (`SEL`) plus any element marked
`data-i18n`, and also translates `alt` / `aria-label` / `title` attributes, the
`<title>`, and the meta description. **`SEL` and the `norm()` function in
`assets/i18n.js` must stay byte-identical to those in `tools/i18n-extract.mjs`** —
if you add a new kind of text container, add its selector to *both*.

Two inline labels that the selectors can't catch cleanly (the cover
"Tech pack · в роботі" chip and the "Конструктор workflow" chip) are marked with a
bare `data-i18n` attribute so the runtime picks them up.

### Adding a third language

Add `i18n/<lang>.js` doing `window.MP_I18N.<lang> = { meta, strings }` (same shape
as `en.js`), load it with a `<script defer src="i18n/<lang>.js?v=N">` in
`index.html` (before `assets/i18n.js`), add the code to `SUPPORTED` in
`assets/i18n.js`, and add a `<button class="lang-opt" data-lang="<lang>">` to the
`.lang-switch` in the sidebar.

## Analytics (`assets/analytics.js`)

Vercel Web Analytics is wired in `index.html` (the `window.va` queue +
`/_vercel/insights/script.js`). On top of the automatic page views / visitors /
referrers, `assets/analytics.js` sends **custom events** for the key interactions.
It's purely additive — it only *adds* listeners (delegation / `mp:langchange` /
IntersectionObserver), so it never touches the page logic or the translation
contract.

- **Load order matters.** `analytics.js` must stay the **first** deferred script,
  **before** `i18n/en.js` and `assets/i18n.js`. It listens for the boot
  `mp:langchange` (fired in `assets/i18n.js`) to record the initial reading
  language, so its listener has to be registered first.
- **Events only report from the deployed Vercel domain** — not `file://` or a
  plain local server. To see them fire locally, temporarily swap the insights
  `script.js` to the debug build (`https://cdn.vercel-insights.com/v1/script.debug.js`)
  and watch the console.
- **Custom-event data** must be primitives (`string|number|boolean|null`), no
  nesting, ≤255 chars each.
- Events emitted: `language_initial`, `language_switch`, `stepper_step`,
  `stepper_first_interaction`, `partner_cta_open`, `contact_click`,
  `contact_copy`, `partner_section_view`, `scroll_depth`, `screenshot_open`,
  `reading_time`. View them in the Vercel dashboard → **Analytics → Events**.
- `STAGE_SLUGS` in `analytics.js` mirrors the `stages` array in `index.html`
  (same order) so the stepper stage is language-independent — keep them in sync if
  stages change.

## Deploying

`vercel deploy --prod` from this folder publishes the working directory (only
`index.html`, `assets/`, `i18n/` ship — see `.vercelignore`). It does **not** go
through git, so committing is a separate step.
