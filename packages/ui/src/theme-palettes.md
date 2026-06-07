# Brand accent palettes (swap reference)

The brand color is defined entirely by **six tokens** in `globals.css`. Swapping the
brand color = replacing these six lines; nothing else in the theme moves. Semantic colors
(`--color-linked` purple, the `--color-*-soft/ring/ink` status families for warn/ok/coral/
info/todo, the **`--color-progress*`** in-progress family, the `--color-st-*` stage palette,
`--color-destructive`) are **deliberately not part of the brand swap** — leave them alone.

> History / gotcha: the "in progress" status used to ride the accent tokens, so changing the
> brand accent also recolored it. It now has its own `--color-progress*` family (pinned to the
> original indigo). Keep status colors on their own tokens — don't point them back at `accent`.

The six tokens:

```css
--color-primary:       /* default buttons / bg-primary */
--color-accent-strong: /* the bold brand pop (eyebrow, accent CTAs) */
--color-accent-soft:   /* tinted accent backgrounds */
--color-accent-ring:   /* accent focus ring tint */
--color-accent-ink:    /* accent text on soft bg */
--color-ring:          /* shadcn focus ring (matches accent-ring) */
```

> Note: `--color-accent` (`#f1f1ee`) stays a neutral warm-cream hover surface — it is *not*
> the brand color (it backs shadcn's `hover:bg-accent`). Don't point it at the brand hue.

To preview all of these on the real landing hero, ask to regenerate the variants page
(`/tmp/midpack-landing-color-variants.html`) — it renders each palette below in context.

---

## Active: Indigo accent + slate buttons

The original. Note `primary` is a neutral slate (`#5d5d68`), not indigo — only the accent
is indigo.

```css
--color-primary:       #5d5d68;
--color-accent-strong: #4f46e5;
--color-accent-soft:   #eef0ff;
--color-accent-ring:   #c7caff;
--color-accent-ink:    #312e81;
--color-ring:          #c7caff;
```

## Terracotta (tried)

```css
--color-primary:       #c2410c;
--color-accent-strong: #ea580c;
--color-accent-soft:   #ffedd5;
--color-accent-ring:   #fdba74;
--color-accent-ink:    #7c2d12;
--color-ring:          #fdba74;
```

---

## Other candidates

### Emerald
```css
--color-primary: #059669; --color-accent-strong: #059669;
--color-accent-soft: #d1fae5; --color-accent-ring: #6ee7b7;
--color-accent-ink: #065f46; --color-ring: #6ee7b7;
```

### Teal
```css
--color-primary: #0d9488; --color-accent-strong: #0d9488;
--color-accent-soft: #ccfbf1; --color-accent-ring: #5eead4;
--color-accent-ink: #115e59; --color-ring: #5eead4;
```

### Rose
```css
--color-primary: #e11d48; --color-accent-strong: #e11d48;
--color-accent-soft: #ffe4e8; --color-accent-ring: #fda4af;
--color-accent-ink: #9f1239; --color-ring: #fda4af;
```

### Cobalt
```css
--color-primary: #2563eb; --color-accent-strong: #2563eb;
--color-accent-soft: #dbeafe; --color-accent-ring: #93c5fd;
--color-accent-ink: #1e3a8a; --color-ring: #93c5fd;
```
> Close to `--color-info` (#2563eb), the in-progress status blue — they'd read alike.

### Violet
```css
--color-primary: #7c3aed; --color-accent-strong: #7c3aed;
--color-accent-soft: #ede9fe; --color-accent-ring: #c4b5fd;
--color-accent-ink: #4c1d95; --color-ring: #c4b5fd;
```
> Same hue as `--color-linked` (#7c3aed) — would collide with the "linked" semantic.

### Amber / Gold
```css
--color-primary: #b45309; --color-accent-strong: #d97706;
--color-accent-soft: #fef3c7; --color-accent-ring: #fcd34d;
--color-accent-ink: #78350f; --color-ring: #fcd34d;
```
> Overlaps `--color-warn` (#b45309), the in-review amber — they'd read alike.

### Plum
```css
--color-primary: #a21caf; --color-accent-strong: #c026d3;
--color-accent-soft: #fae8ff; --color-accent-ring: #e879f9;
--color-accent-ink: #701a75; --color-ring: #e879f9;
```

### Forest
```css
--color-primary: #15803d; --color-accent-strong: #16a34a;
--color-accent-soft: #dcfce7; --color-accent-ring: #86efac;
--color-accent-ink: #14532d; --color-ring: #86efac;
```
> Deeper/greener than Emerald; near `--color-ok` (#2f7a4a), the done-status green.

### Charcoal (monochrome)
```css
--color-primary: #27272a; --color-accent-strong: #3f3f46;
--color-accent-soft: #e4e4e7; --color-accent-ring: #a1a1aa;
--color-accent-ink: #18181b; --color-ring: #a1a1aa;
```
> No competing hue — leans fully into the "paper & ink" identity.
