# Bundle Page — Build Brief для claude-design

> **Цільовий читач: AI-агент (claude-design).** Не людина-дизайнер. Це work-order, не narrative. Авторитетні джерела для дизайнерських рішень — `page-bundle-design.md` (entity model, layout, per-surface specs) і `user-stories/bundle-page-story-map.md` (9 MVP історій з BDD acceptance). Не повторюй їх; читай і керуйся.

---

## 1. Goal

Згенерувати **static HTML/CSS prototype** сторінки бандла (`/bundles/{id}`) у вигляді набору **окремих HTML-файлів по одному на стан**, готових до візуальної ітерації. Це **не production React**, не `src/`. Мета — мати швидкий візуальний прототип, на якому ми ітеруємо поточно перед написанням React-компонентів.

**Iteration approach: MVP states end-to-end → polish per-component.**

- **Phase 1:** ти за один прохід генеруєш усі 8 MVP-станів грубо, але рендерабельно. Правильні layout proportions, правильні елементи на правильних місцях, semantic tokens (з твоєї design-системи), базова responsive. Не polish'иш typography і transitions.
- **Phase 2:** користувач каже "polish [component-name]" — ти проходиш всі стани, де цей компонент є, і уніфікуєш/допрацьовуєш всі instances одночасно.

---

## 2. What to read first (in this order)

1. `page-bundle-design.md` — §1 (entity model), §2 (ASCII layouts — це твоя layout-карта), §3.0-§3.7 (per-surface specs).
2. `user-stories/bundle-page-story-map.md` — MVP історії US-001 — US-009.
3. `processes/typical-collection-flow.md` — реалістичні назви файлів і стадій.

---

## 3. Output target

### 3.1 Tech stack

- **Static HTML + Tailwind через CDN.**
- **Без React, без JS-фреймворків, без build step.**
- **Design system / кольори / tokens — використовуй власну claude-design систему.** Не вписуй raw color values у HTML; semantic tokens обов'язково (через ту систему, що в тебе вже є).
- **shadcn НЕ встановлений** (це prototype). Якщо потрібен component pattern, який у production буде shadcn primitive, відтвори його вручну через Tailwind utilities + твою design-систему.
- **Інтерактивність — тільки CSS** (`:hover`, `:focus-within`, `:checked` через hidden checkbox/radio для toggle simulation). **Жодного JavaScript.**

### 3.2 File structure

```
prototypes/bundle-page/
├── index.html                          # gallery: thumbnails + links на 8 states
├── states/
│   ├── 01-default-desktop.html         # Marta орієнтуєтcя
│   ├── 02-preview-desktop.html         # File preview overlay + scoped Comments
│   ├── 03-mobile-default.html          # Marta з телефона
│   ├── 04-mobile-fit-review.html       # Olena fit-review, Decisions primary
│   ├── 05-empty-bundle.html            # новостворений бандл
│   ├── 06-permission-viewer.html       # Member з accessLevel = viewer
│   ├── 07-not-a-member.html            # 403 page
│   └── 08-sign-in.html                 # Google OAuth gate
└── README.md                           # як відкрити в браузері, як ітерувати
```

Кожен HTML state — **self-contained**. Partials не використовуємо (без build step). Уніфікацію патернів забезпечує Phase 2 (polish-pass).

Якщо твоя design-система генерує shared CSS-файли — поклади їх під `prototypes/bundle-page/shared/` і лінкуй з кожного state'у. Жодних обовʼязкових файлів зверху не нав'язуємо.

---

## 4. States to produce (Phase 1 — all in one pass)

| # | File | Stories covered | Viewport | Key elements |
|---|---|---|---|---|
| 01 | `01-default-desktop.html` | US-001, US-002, US-008, US-009 | 1440×900 | Header (cover + title + Copy link) → Stage stepper (active = Тех-пак, expanded) → Files area grouped by stage (3-4 stages з items) → Side panel Comments tab |
| 02 | `02-preview-desktop.html` | US-003, US-005 | 1440×900 | Preview overlay (PDF placeholder з v3) over Files area, Stepper + Side panel sticky, Comments tab з scope chip + version pills, composer з anchor preview "v3" |
| 03 | `03-mobile-default.html` | US-001 + US-002 mobile | 375×812 | Header compact (48×48 cover), Stepper horizontal-scroll, Files full-width, side panel як bottom-sheet (peek) |
| 04 | `04-mobile-fit-review.html` | US-006 | 375×812 | Decisions tab primary, Files area як bottom-sheet (peek), `Sign` CTA великий (64px tap target), decision card з sign-off rail |
| 05 | `05-empty-bundle.html` | (newly created bundle) | 1440×900 | Cover placeholder (gradient + "S"), 9 порожніх stage sections з "No files yet · [+ Add file / link / folder]", Side panel з empty states у всіх 4 табах |
| 06 | `06-permission-viewer.html` | viewer permission state | 1440×900 | Same as 01, але без write-affordances: `+ Add` зник, `Upload new version` зник з file-row hover, `Approve` зник зі stepper'а, у header — badge "Viewer" |
| 07 | `07-not-a-member.html` | US-008 unauthorized recipient | 1440×900 | Centered 403 card: "You don't have access to this bundle. Ask the bundle owner.", back-link на Workspace |
| 08 | `08-sign-in.html` | US-008 unauthenticated gate | 1440×900 | Centered Google OAuth button, app logo, тонкий рядок "Sign in to view bundle Style 247" |

### `index.html` (gallery)

Просто 8 cards-link'ів у grid, з thumbnail-області-знімок (можна `<iframe>` зі state-файла з `pointer-events: none; transform: scale(0.3)` як превʼю) + label state'у + список stories покритих.

---

## 5. Fixture data (use this verbatim — do not invent)

**Bundle:**
- Title: `Style 247`
- Collection: `SS26`
- Cover image: `front_navy_blazer.jpg` (для default state); null для empty state

**Members:**
- Марта К. (Marta) — tech designer, accessLevel = `editor`
- Олена П. (Olena) — head of design, accessLevel = `editor` (вона approver на Stage 7)
- Власник бренду — accessLevel = `owner`

**Stages (9, з `typical-collection-flow.md`):**
1. Ідея колекції (passed ✓)
2. Ескізи й вибір тканин (passed ✓)
3. Тех-пак (**active ►**, assignee: Марта, approver: Олена, 3 days)
4. Закупівля матеріалів (pending)
5. Лекала (pending)
6. Перший зразок (pending)
7. Примірка (pending) — для state 04 fit-review цей stage стає active
8. Градація розмірів (pending)
9. Підготовка до виробництва (pending)

**Items (under Stage 3 — Тех-пак, active):**
- `TP_001_dress.pdf` — file, v3, "1h ago"
- `BOM_001.xlsx` — file, v2, "4h ago"

**Items (under Stage 2 — Ескізи):**
- Folder `sketches/` (expanded), contains:
  - `front.pdf` — file, v1, "3d ago"
  - `back.pdf` — file, v1, "3d ago"
- `fabric_swatches.xlsx` — file, v3, "1d ago"
- `trims_inspiration` — externalLink, type = `figma`, "2d ago"

**Items (under Stage 1 — Ідея):**
- `moodboard.pdf` — file, v1, "2d ago"
- `collection_plan.xlsx` — file, v2, "1d ago"

**Comments (Side panel default tab):**
- Олена on `TP_001_dress.pdf v2`: "the cuff width needs to be 6.5cm, not 6cm" — status: **still open from v2**
- Марта on `front.pdf v1`: "тканина — supplier №2, артикул 4501" — status: open
- Founder on bundle: "коли запускаємо?" — status: open

**Decisions (for state 04 fit-review):**
- "Опустити талію на 2 см" — author: Марта, target: `TP_001_dress.pdf`, approver: Олена, status: `proposed` (для state 04 — рендериться також варіант `signed` поряд)
- "Залишити рукав як є" — author: Марта, no target, signed by Олена

**Action Log items (Members tab варіант або під фільтром):**
- "↑ Uploaded v3 of TP_001_dress.pdf" — by Марта, 1h ago
- "✓ Signed decision 'Залишити рукав як є'" — by Олена, 2d ago
- "🖼 Set cover image to front_navy_blazer.jpg" — by Марта, 3d ago
- "✓ Approved stage Ескізи" — by Олена, 5d ago

Не вигадуй більше — 3-5 items per list достатньо, щоб показати pattern.

---

## 6. Phase 1 acceptance

Кожен з 8 state-файлів має:

- **Self-contained** — copy-paste у Chrome → renders без помилок 404.
- **Real example data з §5** — Style 247, SS26, наведені stage names, наведені file names.
- **Layout proportions з `page-bundle-design.md` §2** — 65-70% files / 30-35% side panel на desktop; full-width files + bottom-sheet на mobile.
- **Semantic tokens** (з твоєї design-системи) — жодних raw color values у markup.
- **HTML semantic + ARIA** — `<header>`, `<nav>` (для stepper), `<main>`, `<aside>` (для side panel), `<section>` per stage, `role="tab"` / `role="tablist"` для tabs.
- **5-second test** — open у браузері, screenshot, без пояснень зрозуміло "що це за стан і про що бандл".
- **HTML comment-маркер** першим рядком у `<body>`:
  ```html
  <!-- State: 01-default-desktop · Covers: US-001, US-002, US-008, US-009 · Persona: Marta (desktop) -->
  ```

---

## 7. Component inventory (Phase 2 polish targets)

Не імплементуй окремо — це **targets для пізнішого polish-pass**, коли користувач скаже "polish StagePill". Зараз вони існують як inline-patterns у state-файлах.

| Component | Variants | Source spec |
|---|---|---|
| `StagePill` | passed ✓ / active ► (expanded) / pending ○ / blocked ⊘; +compact mobile | §3.1 |
| `FileRow` | file / hover state / viewer state; per-mimeType іконка | §3.2 |
| `FolderRow` | collapsed / expanded | §3.2 |
| `ExternalLinkRow` | per linkType (techpacker/figma/loom/gdoc) | §3.2 |
| `VersionPill` | active / inactive | §3.7 |
| `CoverThumbnail` | image / placeholder (gradient + letter); 64×64 / 48×48 | §3.0 |
| `CommentCard` | open / still-open-from-vN / resolved | §3.3 |
| `AnchorChip` | per anchor.kind (bundle/item/version/stage/decision) | §3.3 |
| `ScopeChip` | preview-mode header chip + version pills row | §3.3 |
| `DecisionCard` | proposed / signed / superseded; sign-off rail | §3.4 |
| `ActionLogRow` | 11 kinds (per §3.5 table) | §3.5 |
| `MemberRow` | owner / editor / viewer | §3.6 |
| `ViewModesToggle` | Group by / Sort / Filter | §3.2 |
| `BottomSheet` | peek / half / full (CSS-driven via radio hack) | §3.7 mobile |
| `Toast` | success / error | §3 specs |
| `EmptyState` | per surface | §3.2-§3.6 |

---

## 8. Five things NOT to do

1. **Не вписувати raw color values** (`#fafafa`, `text-slate-900`, `border-gray-200`). Semantic tokens з твоєї design-системи. Палітра — одне місце редагування.
2. **Не додавати JavaScript.** Ніякого jQuery, Alpine, vanilla JS, inline `onclick`. Інтерактивність — тільки CSS (`:hover`, `:focus-within`, `:checked` для tab/toggle через hidden input). Якщо щось не можна виразити CSS — лиши статичний state і додай HTML comment `<!-- TODO: needs JS for X -->`.
3. **Не дублювати реальні обсяги даних.** 3-5 representative items per list (Files, Comments, Decisions, Action Log, Members). Brief показує patterns, не volume stress test.
4. **Не вигадувати microcopy.** Copy strings — лише з `page-bundle-design.md` per-surface specs (empty states, button labels, status badges, anchor chip formats) і `bundle-page-story-map.md` acceptance criteria. Якщо точного формулювання немає — використовуй найближче з джерел, додай HTML-comment `<!-- TODO: confirm copy -->`.
5. **Не порушувати layout proportions з §2 design ref'у.** Files area 65-70% / Side panel 30-35% на desktop. Header sticky. Stepper sticky (і при scroll'і Files area, і при відкритому preview). Preview overlay — тільки над Files area, не над Header/Stepper/Side-panel.

---

## 9. Delivery checklist

- [ ] `prototypes/bundle-page/index.html` — gallery з 8 thumbnails
- [ ] `prototypes/bundle-page/states/01-default-desktop.html`
- [ ] `prototypes/bundle-page/states/02-preview-desktop.html`
- [ ] `prototypes/bundle-page/states/03-mobile-default.html`
- [ ] `prototypes/bundle-page/states/04-mobile-fit-review.html`
- [ ] `prototypes/bundle-page/states/05-empty-bundle.html`
- [ ] `prototypes/bundle-page/states/06-permission-viewer.html`
- [ ] `prototypes/bundle-page/states/07-not-a-member.html`
- [ ] `prototypes/bundle-page/states/08-sign-in.html`
- [ ] `prototypes/bundle-page/README.md` — як відкрити, як ітерувати, посилання на цей brief

---

## 10. How to use this brief

Передати claude-design так:

> Read `product/bundle-page-build-brief.md` and follow it. Authoritative design references are `product/page-bundle-design.md` and `product/user-stories/bundle-page-story-map.md`. Use your own design system for colors/tokens/typography. Produce all 8 states + index in one pass (Phase 1 acceptance §6). Do not iterate yet — wait for explicit polish commands.

Після генерації — відкрити `prototypes/bundle-page/index.html` у браузері, пройти всі 8 states. Перевірити §6 acceptance. Polish — окремими commands ("polish StagePill across all states", "tighten CommentCard hierarchy", etc.).
