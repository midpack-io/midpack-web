---
name: ig-studio-design
description: Use this skill to generate well-branded interfaces and assets for IG Studio, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the IG Studio workflow tool (collections → bundles of styles → per-style production pipeline).
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Tokens:** `colors_and_type.css` — drop in `<link>` and use the CSS custom properties verbatim.
- **UI kit:** `ui_kits/ig_studio/` — JSX components recreating the four canonical screens (Collections, Products list, Bundle page, Bundle page with preview open). Open `index.html` for the interactive prototype.
- **Reference screens:** `reference/` — the original hand-built handoff prototypes. Treat as the visual + behavioural spec.
- **Assets:** `assets/` — logo mark + wordmark + sample cover. Icons are inline SVG drawn on a 12/14/16-px grid with stroke 1.2–1.6, round caps/joins. Use Lucide if you need a CDN icon set — it matches the weight.
- **Preview cards:** `preview/` — the small swatches/specimens that populate the Design System tab.

## Cardinal rules

1. **Warm light surfaces, never cool.** Backgrounds are `#f7f7f5` cream-white, not gray. Hairlines are `#e6e6e1` not `#e5e7eb`. Mixing in cool grays will read as wrong.
2. **Ink-1 (`#16161a`) primary buttons, indigo only for active state.** The accent indigo `#4f46e5` is reserved for "live" stages, focus rings, current selection. CTAs are near-black.
3. **Mono for status, sans for everything else.** Geist Mono with uppercase + tracking is the status-chip / cf-key voice. Don't put sans-serif in a status chip.
4. **Status vocabulary is fixed:** `todo / ready / active / in-review / returned / passed / canceled / reopened`. Each has a defined chip + pill state. Don't invent new ones.
5. **Coral is for returns + @you, never decoration.** Reserved for things that need the user's attention.
6. **No emoji, ever.** Use SVG icons (inline or Lucide).
