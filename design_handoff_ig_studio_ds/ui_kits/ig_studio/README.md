# IG Studio · UI Kit

Interactive recreation of the four canonical IG Studio screens, factored into a small React component library.

## Open

`index.html` — click-through prototype. Navigates between:

- **Collections** — workspace landing, grid of collection cards.
- **Products** — list of styles inside a collection, with per-row stage stepper and returned-state banner.
- **Bundle** — single-style detail with header, stepper, files area, threaded comments, side panel.
- **Bundle · preview open** — clicking the first file row opens the in-place PDF preview pane.

Deep links via `#{"screen":"bundle","styleId":247}` etc. (encoded in the URL hash).

## Files

```
ui_kits/ig_studio/
├── README.md
├── index.html               ← entry point, loads everything below
├── app.css                  ← top-bar / page-header / filter-bar / button / avatar / chip styles
├── screens.css              ← collection-card, product-row, bundle-page, preview-pane
├── atoms.jsx                ← Icon, Button, Avatar, Pill, CfChip, StatusChip, Dropdown, ViewToggle
├── shell.jsx                ← TopBar, WorkspacePill, Crumbs, PageHeader, FilterBar
├── Collections.jsx          ← grid landing page
├── Products.jsx             ← per-collection list of styles
├── Bundle.jsx               ← single-style detail + preview pane + comments + side panel
├── App.jsx                  ← router
└── components/              ← web components from the original handoff
    ├── header.{css,html,js} ← <bundle-header>
    ├── stepper.{css,html,js}← <bundle-stepper>
    └── comments.{css,js}    ← threaded comments
```

The `components/` web components are bundled for completeness — the JSX recreation does not use them, but they're available if you want pixel-identical behaviour with the canonical CSS / JS.

## Conventions

- **Width is fixed at 1440px.** The `.app` wrapper is `width: 1440px; margin: 0 auto`. Pages do not respond below that.
- **Top bar 60px · filter bar 48px · bundle stepper sticky at 121px.** Avoid changing these — the stepper's sticky connector lines depend on them.
- **All colors come from `colors_and_type.css`** via CSS custom properties. Hardcoding hexes will lose dark-mode if/when it ships.
- **JSX exports go through `window`** so every Babel `<script>` shares scope. See atoms.jsx for the pattern.
- **No emoji.** Icons are inline SVG drawn on a 14×14 viewBox at stroke 1.4, round caps/joins.

## Component cheatsheet

### Buttons (`atoms.jsx`)
```jsx
<Button variant="primary">Mark approved</Button>
<Button variant="ghost"><Icon name="share" />Share</Button>
<Button className="cta-primary"><Icon name="plus" />New collection</Button>
<Button size="sm">Save</Button>
```
Variants: `default | primary | accent | ghost | cta-primary`. Sizes: `default | sm`.

### Avatar
```jsx
<Avatar person="marta" initial="MA" />              // 26px
<Avatar person="olena" size="sm" approver />        // 22px + ✓ corner
<AvatarStack avatars={[{person:"marta"},{person:"olena",approver:true}]} />
```
Person classes: `anna · olena · lina · pavlo · yuri · marta · roma · yulia · founder`.

### PillInline (tag)
```jsx
<PillInline color="indigo">FW25</PillInline>
```
Colors: `default | indigo | green | amber | pink | slate | teal`.

### CfChip
```jsx
<CfChip k="SKU" v="A047-CRM" />
<CfAdd />
```

### StatusChip
```jsx
<StatusChip status="in-review" />
// or pass a custom label:
<StatusChip status="done" label="APPROVED" />
```
Statuses: `todo | in-progress | in-review | done | returned | canceled`.

### TopBar / PageHeader / FilterBar (`shell.jsx`)
See `Collections.jsx` for a complete example.

## Iterating

- Edit `Collections.jsx`, `Products.jsx`, or `Bundle.jsx` to change a screen.
- Edit `atoms.jsx` to change a primitive — it cascades everywhere.
- Edit `app.css` / `screens.css` for visual tweaks; for token changes go to `../../colors_and_type.css` so the rest of the design system picks them up too.
