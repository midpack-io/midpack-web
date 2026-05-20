# Bundle Page — Designer Handoff Brief

> Бриф для продуктового дизайнера: спроектувати сторінку бандла (`/bundles/{id}`) — найбільш відвідувану і найбільш цитовану сторінку в iterate.guru. Кожне outbound посилання з продукту (Slack, email, WhatsApp фабрики, MCP) веде сюди; кожна персона (tech designer / head of design / designer / production lead / founder) сходиться на цій сторінці. Якщо вона провалює тест "оріентуватись за 5 секунд", провалюється весь продукт. **Очікувані фінальні артефакти:** hi-fi mockups (список у §16.1) + clickable prototype для 5 ключових flows (§16.2) + Figma component library (§16.4) у форматі, готовому для dev handback. **Deadline:** _TBD — заповнити перед kickoff'ом._

---

## 1. Context & intent

### 1.1 What it replaces (status quo)

Сьогодні SMB-бренд координує один стиль через 5 розрізнених поверхонь:

- **Google Drive** — файли лежать десь у вкладених папках, назви типу `TP_v2_FINAL_FINAL.pdf`, ніхто не пам'ятає, де "та сама" версія
- **Spreadsheets** — collection plan, BOM, бюджет; у кожного власника своя локальна копія
- **Slack / WhatsApp** — рішення, апрували, "це фінальна версія?", все тоне в потоці
- **Notebook** (паперовий, на fit-review) — нотатки, які треба переписувати на чисто у вівторок
- **Email** — зовнішні партнери (фабрика, freelance конструктор)

Tech designer типу Марти втрачає 60-90 хвилин на день на реконструкцію "що було вирішено де". Сторінка бандла замінює всі п'ять поверхонь у scope "один стиль".

### 1.2 Why this is the most important page in the system

- **Єдина точка сходження.** Кожне outbound посилання з iterate.guru веде сюди. Інші сторінки рольові; ця — спільна.
- **URL — це продукт.** Скопіювати посилання й кинути у WhatsApp фабрики має бути дешевше, ніж писати "глянь, виправила талію". Сторінка має витримати 0-context recipient'а.
- **Найбільш частий touchpoint.** Марта відкриває 30+ разів на день. Будь-яке тертя множиться на 30.

### 1.3 One paragraph for the designer: "what the user must grasp in 5 seconds"

Коли Марта клікає Slack-посилання на бандл о 9:14 ранку, вона має побачити, без скролу: _який це стиль_ (cover image + title), _на якій стадії_ (підсвічена пілла у стіпері), _хто рухає_ (assignee avatar), _хто має апрувити_ (approver avatar), _скільки часу там стоїть_ ("3 days"), _які файли на цій стадії_ (розгорнута секція в дереві). Якщо вона за один погляд відповідає на питання "це моє зараз чи ні?" — сторінка виграла. Все інше — коментарі, decisions, історія — secondary.

---

## 2. Users & scenarios

### 2.1 Primary user — Marta (tech designer)

**Роль.** Tech designer у SMB fashion-бренді (~3-10 стилів на колекцію, 2-4 колекції на рік). Власник більшості тех-паків, відповідальний за передачу на фабрику.

**Session profile:**
- **Девайс:** desktop (MacBook 13"-14" найбільш імовірно), іноді iPad.
- **Частота:** 30+ відкриттів на день.
- **Точки входу:** Slack-нотифікація (60%) / Worklist на головній (25%) / закладка (10%) / email (5%).
- **Робочий час:** ~9:00-19:00, переривчасто. Контекст-свічинг кожні 15 хвилин.
- **Mental model на ленді:** "ОК, що чекає на мене? Чий хід? Що я можу закрити зараз?"

Повний профіль: [`personas/persona-marta.md`](./personas/persona-marta.md).

### 2.2 Secondary user — Olena (head of design)

**Роль.** Head of design / creative director. Approver на більшості стадій. Приймає рішення на fit-review (зазвичай четвер у студії).

**Session profile:**
- **Девайс:** iPhone (70%), MacBook (30%). На fit-review — _тільки телефон_, в руках, стоячи поруч з примірочною.
- **Частота:** 2-5 відкриттів на день, серіями (після fit-review — десяток підряд, потім тиша).
- **Точки входу:** Slack/WhatsApp посилання (80%), email digest (15%), власна закладка (5%).
- **Увага:** низька. Між нарадами, по дорозі, з кавою. Має 30 секунд на бандл.
- **Mental model на ленді:** "це чекає мого підпису чи ні? Що змінилось з минулого разу? Один тап — закрити".

Повний профіль: [`personas/persona-olena.md`](./personas/persona-olena.md).

### 2.3 Other roles (без окремої персони)

- **Designer** — створює ескізи на ранніх стадіях, потім стає occasional viewer. Desktop, день, без поспіху.
- **Production lead** — підбирає бандл на пізніх стадіях (Stage 8-9). Desktop, day-time, концентрований.
- **Founder** — випадковий viewer; 1-2 коментарі за колекцію. Mobile or desktop, рандомний час. Зазвичай коментує "застарілі" версії.

Жоден з цих ролей не повинен зустріти deadlock, відкривши сторінку — UI має пояснити "що це" і "що я можу" без онбордингу.

### 2.4 Top jobs-to-be-done

В порядку частоти:

1. **Orient** — "де ми зараз на цьому стилі? Чий хід?" (every load)
2. **Find file** — "де останній тех-пак?" / "де fit-comments PDF з четверга?"
3. **Comment** — "це треба переробити" / "не зрозуміла припуск"
4. **Decide** (with sign-off) — fit-review: "опускаємо талію на 2 см" + Олена підписала
5. **Approve / progress stage** — Олена тапає `Approve`, стадія рухається
6. **Share** — copy URL → паста у WhatsApp фабрики
7. **Audit** — "хто і коли поміняв assignee?" / "коли Олена підписала?" → Action Log

---

## 3. Design goals & principles

### 3.1 Goals

- **orient-in-5-seconds** — на _будь-якому_ device, _будь-якій_ персоні, _будь-якій_ стадії бандла відповідь на "що я бачу і що моє" має бути зрозумілою за 5 секунд без скролу й без ховеру.
- **file-as-primary-focus** — файли займають центр сторінки. Side panel (коментарі/decisions/log/members) — допоміжна.
- **comments-survive-versions** — коли загружається v3, коментар на v2 не зникає. "Still open from v2" має бути візуально очевидним.
- **mobile-approval-in-one-tap** — Олена на iPhone у фіттинзі апрувить стадію або підписує decision за 1 тап. Не два, не три.
- **URL-is-portable** — будь-хто з доступом, відкривши URL з будь-де, бачить ту саму актуальну картину. Без "ще тиць тут, щоб побачити".

### 3.2 Non-goals

- **Not Figma-as-canvas.** Ми не редагуємо файли в браузері. Preview + comments — все.
- **Not a file manager.** Не Drive. Не показуємо raw folder paths. Папки — лише вторинна структура всередині стадії.
- **Not Slack.** Коментарі — анкоровані на файли/версії/стадії, не вільний chat. Без "@here", без emoji-реакцій, без notifications timeline.
- **Not a formal PLM.** Без RACI matrix, без BOM-roll-up через колекції, без production planning calendar. Все важке — out of scope.
- **Not e-signature ceremony.** Sign-off має бути одним тапом, не модалкою з legalese.

### 3.3 Tone & character

**Tool, not toy.** Користувачі — професіонали, що знають свою справу. Інтерфейс — інструмент, на який спираються; він не намагається їх вразити, не намагається бути "веселим".

- Дизайнерська компетенція видима, але стримана. Smart whitespace, акуратна типографіка, без декору.
- Густо, але читабельно. Марта в день обробляє сотні дрібних артефактів — порожнечі коштують їй скролу.
- Не consumer-app candy (Notion-style градієнти на CTA). Не big-corp PLM (SAP-style таблиці). Поміж ними — designerly утиліта.

**Tone-only references (не для копіювання, для калібрування):**
- **Linear** — як організована density і orient-in-1-second.
- **Notion comments** — як коментарі живуть поряд з контентом.
- **Figma comment threads** — версіонування і resolve-flow.
- **GitHub PR review** — sign-off як ритуал, але без важкості.
- **Vercel dashboard** — використання semantic tokens, темна сторона можлива але дефолт світлий.

---

## 4. Scope

### 4.1 In-scope (MVP)

9 історій з [`bundle-page-story-map.md`](./user-stories/bundle-page-story-map.md):

| ID | One-liner |
|---|---|
| **US-001** | Land on bundle, see current state at a glance (stage stepper з assignee/approver/time-in-stage) |
| **US-002** | Browse file tree grouped by stage (default view, з folder expand) |
| **US-003** | Open file in inline preview with comments alongside (overlay, scoped Comments) |
| **US-004** | Upload new version of existing file (version chip flips, history preserves) |
| **US-005** | Add comment that persists across versions ("still open from v2") |
| **US-006** | Capture decision with sign-off (fit-review use case, mobile-first) |
| **US-007** | Approve stage transition (1-tap, stepper reflows) |
| **US-008** | Copy bundle URL to share with teammate |
| **US-009** | Set and see cover image to identify bundle at a glance |

Повні BDD acceptance — у story map'і.

### 4.2 Out-of-scope, but design should leave room for

15 Next-історій. Дизайн _не повинен закривати їх_ — наприклад, file row має місце під action menu, навіть якщо MVP рендерить тільки "Upload new version":

| ID | One-liner |
|---|---|
| US-101 | Add file as external link (Techpacker/Figma/Loom URL) |
| US-102 | Add new local file to stage (не нова версія) |
| US-103 | Create folder within stage |
| US-104 | Move file between stages or folders |
| US-105 | Rename file or folder |
| US-106 | Resolve a comment |
| US-107 | Reply to comment (threaded) |
| US-108 | View per-file version history |
| US-109 | Request changes on stage with required comment |
| US-110 | Add internal member to bundle |
| US-111 | Change member's access level |
| US-112 | Open per-bundle Action Log (full tab) |
| US-113 | "Still open from v_n" lineage expanded |
| US-114 | Reassign stage assignee or approver |
| US-115 | Toggle Files area between grouped/flat views |

**Implication для дизайну:** file row має `•••` (hover/touch); side panel має slot під unread badges на табах; stepper має простір для "Reassign" дії в expanded card.

### 4.3 Out of scope entirely

12 Later-історій. Не дизайнити, не закладати:

| ID | One-liner |
|---|---|
| US-201 | Drag-and-drop file upload |
| US-202 | Drag-and-drop reorganize |
| US-203 | Bulk select + ZIP download |
| US-204 | Side-by-side version comparison |
| US-205 | @mentions in comments |
| US-206 | Inline PDF annotation (drawing) |
| US-207 | Subscribe to comment thread |
| US-208 | Action Log filters (kind/actor/date) |
| US-209 | Export Action Log to CSV |
| US-210 | Per-tab unread badges |
| US-211 | Keyboard shortcuts (J/K, etc.) |
| US-212 | Clone bundle as new style |

---

## 5. Information architecture

### 5.1 Page anatomy (high-level boxes)

З [`page-bundle-design.md`](./page-bundle-design.md) §2:

```
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
│ ┌─────┐                                                      │
│ │COVER│ ← Back to Workspace · [📋 Copy link]                 │
│ │ IMG │ Style 247                                            │
│ │     │ Collection: SS26                                     │
│ └─────┘                                                      │
│                                                              │
│ Stage stepper (sticky):                                      │
│ [✓ Ідея] → [✓ Ескізи] → [► Тех-пак] → [Лекала] → [Зразок]→…│
│              Assignee: Марта · Approver: Олена · 3 days     │
├────────────────────────────────────────────┬─────────────────┤
│ Files area (центральна, 65-70% width)      │ Side panel      │
│ View modes toggle (Group/Sort/Filter)      │ (30-35% width)  │
│                                            │ ┌─ Tabs ──────┐ │
│ ┌─ Ідея ─────────────────────────────────┐ │ │ Comments    │ │
│ │ ▣ moodboard.pdf            v1 · 2d ago │ │ │ Decisions   │ │
│ └────────────────────────────────────────┘ │ │ Action Log  │ │
│                                            │ │ Members     │ │
│ ┌─ Ескізи ──────────────────────────────┐ │ │             │ │
│ │ ▼ 📁 sketches/                        │ │ └─────────────┘ │
│ │   ▣ front.pdf            v1 · 3d ago  │ │ [Active tab     │
│ │   ▣ back.pdf             v1 · 3d ago  │ │  content here]  │
│ │ ▣ fabric_swatches.xlsx   v3 · 1d ago  │ │                 │
│ │ 🔗 trims_inspiration (figma) · 2d ago │ │                 │
│ └───────────────────────────────────────┘ │                 │
│                                            │                 │
│ ┌─ Тех-пак (active) ────────────────────┐ │                 │
│ │ ▣ TP_001_dress.pdf      v3 · 1h ago   │ │                 │
│ │ [+ Add file / link / folder]          │ │                 │
│ └───────────────────────────────────────┘ │                 │
└────────────────────────────────────────────┴─────────────────┘
```

При відкритому preview — Files area замінюється на preview pane (Stage stepper і Side panel залишаються видимими). Див. design-reference §2 для другого ASCII.

### 5.2 Entities rendered on the page

8 сутностей. Повна модель: [`page-bundle-design.md`](./page-bundle-design.md) §1.

| Entity | What it represents on the page |
|---|---|
| **Bundle** | Корінь сторінки. Title + collection + cover image. |
| **Stage** | Інстанс стадії workflow. Рендериться як пілла у стіпері. 1-9 на бандл. |
| **Member** | Учасник з доступом (owner / editor / viewer). Рендериться в Members tab + аватарки на стадіях. |
| **Item** | Поліморфний (folder / file / externalLink). Рендериться у Files area. |
| **Version** | Іммутабельна версія File. Рендериться як `v_n` chip і у Version pills preview. |
| **Comment** | Анкорований на bundle/item/version/stage/decision. Рендериться у Comments tab. Виживає крос-версійно. |
| **Decision** | Структуроване рішення з sign-off. Рендериться у Decisions tab. |
| **ActionLogEntry** | Append-only лог (11 видів подій). Рендериться у Action Log tab. |

### 5.3 Navigation model

- **Canonical URL:** `https://app.iterate.guru/bundles/{id}` — це той URL, що Марта копіює.
- **Inbound traffic:**
  - Slack notification → bundle URL (~60% trafic)
  - Worklist row click → bundle URL (~25%)
  - WhatsApp/email від колеги → bundle URL (~10%)
  - Власна закладка / MCP output (~5%)
- **Back link:** `← Back to Workspace` → `/collections/{collectionId}` (колекція цього бандла).
- **Auth gate:** Google OAuth. Неавтентифікований → `/auth/sign-in?next=/bundles/{id}`. Автентифікований, але не Member → 403-сторінка ("You don't have access to this bundle"). Дизайн обох екранів — у scope (див. §16.1).

---

## 6. Layout & screen states

### 6.1 Default state (desktop) — files-as-primary

- 65-70% Files area / 30-35% Side panel.
- Side panel default tab: **Comments**, filter `open`.
- Stage stepper sticky на скролі.
- Активна стадія у Files area розгорнута; інші — згорнуті (клік-розгортання).
- Header повністю видимий перед скролом; при скролі Files area — Stepper залишається sticky, header вислизає.

### 6.2 File preview open (desktop) — overlay over files area

- Preview pane замінює Files area (Stepper і Side panel залишаються видимими).
- Side panel **auto-switch на Comments tab** + scope chip на відкритий файл.
- Version pills у шапці preview pane (`v3` active, `v2`, `v1`).
- Composer auto-anchor на поточно-відображувану версію.
- Close: × у шапці / Esc / навігація на іншу сторінку.

### 6.3 Empty bundle / new bundle

- 9 секцій стадій рендеряться, кожна з empty state: "No files yet · [+ Add file / link / folder]".
- Stage 1 — active.
- Cover image — placeholder з градієнтом і першою літерою title.
- Side panel Comments tab — empty state ("No open comments yet. Add the first one →").
- Action Log — empty state ("No activity yet.").
- Members — 1 запис (owner = creator).

### 6.4 Single-stage vs 9-stage extremes

- **Min:** 1 стадія (рідко, "draft" бандл, кастомний workflow template). Стіпер — одна пілла, активна, expanded.
- **Typical:** 9 стадій (з [`typical-collection-flow.md`](./processes/typical-collection-flow.md)). 9 пілл — поміщаються на desktop ≥1280; horizontal scroll на меншому.
- **Max:** 12 стадій (умовний ліміт). Стіпер scrollable; активна стадія auto-scroll у видиму зону.

### 6.5 Fit-review mode (mobile-first for Olena)

Не окремий route — це поведінкова варіація на mobile, коли користувач у `Stage.approverIds`:

- Decisions tab — primary, відкритий за замовчуванням.
- Files area collapsible (bottom-sheet) — підняти, щоб подивитись референси.
- Add decision composer — full-screen modal з autofocus.
- Sign-off CTA — 64px tap target, сильний primary color, без модалки-confirm.

### 6.6 Permission-restricted state (viewer without upload/approve)

- Усі read-affordances видимі (file tree, preview, коментарі, decisions, log).
- Усі write-affordances **приховані, не задизейблені**:
  - `+ Add file / link / folder` — відсутня.
  - `Upload new version` у hover-actions — відсутній.
  - `Approve` / `Request changes` у stepper'і — відсутні.
  - `Sign` на decision — відсутній.
  - `+ Add comment` композер — присутній (viewer може коментувати; це не editor-only).
- Member badge у header або side panel показує "Viewer" — щоб користувач розумів, чому write-actions немає.

### 6.7 Tablet — how the side panel scales

- **768-1023 portrait:** side panel стає slide-over (icon-button у header або у float-CTA внизу). За замовчуванням згорнута.
- **1024-1279 landscape:** side panel залишається фіксованою, але вузькою (300px); Files area — широка.

---

## 7. Surface specs (per area)

Це детальна специфікація кожної поверхні. Кожна посилається на відповідну секцію design-reference; не дублюємо все слово в слово.

### 7.1 Page header

Reference: [`page-bundle-design.md`](./page-bundle-design.md) §3.0.

**Елементи (зліва направо):**
- **Cover image thumbnail** — 64×64 (desktop) / 48×48 (mobile). Border-radius м'який (8px). Клік → відкриває cover у preview pane.
  - Якщо `Bundle.coverImageId` встановлено — рендериться через `/api/artifacts/{coverImageId}/file` (auth-gated proxy).
  - Якщо null — placeholder: градієнт + перша літера `Bundle.title`.
- **Back link** — `← Back to Workspace`. Малий, secondary color.
- **Bundle title** (Bundle.title) — H1, prominent.
- **Collection label** — `Collection: SS26`, secondary muted.
- **Copy link button** — справа, primary або secondary CTA. Іконка 📋 + текст "Copy link". Toast on success.

**Cover image actions** (editor+):
- На file-row, що має `mimeType = image/*` — hover-action `Set as cover`.
- На cover thumbnail — hover-menu з `Change cover` (picker зі всіх image Items бандла) і `Remove cover`.

**Що cover image НЕ робить:**
- Не дублює storage (FK на Item, не нова Version).
- Не змінюється автоматично — користувач обирає явно.
- Не з'являється у Worklist (інша сторінка, інша історія).

### 7.2 Stage stepper

Reference: §3.1.

**Кожна стадія-пілла показує:**
- Назву (`Stage.name` — українською у production: "Ескізи", "Тех-пак", "Лекала").
- Іконку статусу: ✓ (passed) / ► (active) / ○ (pending) / ⊘ (blocked).
- Маленький avatar assignee (`Stage.assigneeId`).
- Якщо active — додатково час у стадії ("3 days").

**Активна стадія (status = `active`):**
- Виділена жирніше + кольоровий border / fill.
- Розкриває під собою expanded block:
  - `Assignee: {name}` з avatar.
  - `Approver: {name}` (або кілька, якщо `approverIds.length > 1`) з avatar(s).
  - `{N} days in stage` (з `Stage.enteredAt`).
  - CTA: `Approve` / `Request changes` (видимі тільки користувачам у `approverIds`).

**Multi-approver рендеринг:**
- 2 approver'и — avatar stack (overlapping) + tooltip з обома іменами.
- 3+ — stack + "+2" indicator.

**Взаємодія:**
- Клік на пілу → Files area scroll до секції цієї стадії. Active не міняється (active змінюється тільки через approval/request-changes).
- Hover → tooltip з повним списком approver'ів + датою переходу.

**Sticky behavior:**
- При scroll Files area, stepper лишається у в'юпорті (sticky top).
- При відкритті preview pane, stepper також залишається видимий.

### 7.3 Files area

Reference: §3.2.

**Sticky toggle угорі (view modes):**
- **Group by:** `Stage` (default) / `Folder` / `None` (плоский).
- **Sort within group:** `Position` (default) / `Recent` / `Name` / `Type`.
- **Filter:** `All` (default) / `Files only` / `Folders only` / `External links only`.

**Усередині стадії (Group by = Stage):**
- Корінь — items з `parentId = null`.
- Папки розкриваються/згортаються (default — згорнуті, окрім active stage).
- Драг-перетягування — Next, не MVP.

**File row (показує):**
- Іконка типу (PDF / AI / XLSX / DXF / image / ZIP / DOCX). Реальні файли з [`typical-collection-flow.md`](./processes/typical-collection-flow.md): `TP_SS26_001_dress.pdf`, `BOM_SS26_001.xlsx`, `Pattern_SS26_001_base_M.dxf`, `Sample_SS26_001_v1_photos.zip`.
- Назва (truncate з ellipsis, full на hover у tooltip — назви бувають до 60 символів).
- Version chip — `v3` (з `currentVersion.sequence`).
- Relative time — "1h ago" / "2d ago" (з `currentVersion.uploadedAt`).
- Hover actions: `Upload new version` / `Set as cover` (тільки для image) / `•••` (Rename/Move/Delete — Next).

**ExternalLink row:**
- Іконка типу: Techpacker / Figma / Loom / GDoc / generic 🔗.
- Назва (не raw URL).
- `· {time} ago`.
- Клік → open in new tab напряму (не через проксі, бо це live-doc).

**Folder row:**
- Chevron expand/collapse + іконка папки.
- Назва.
- Лічильник items.

**Add controls:**
- На корені стадії: `[+ Add file / link / folder]` — split-button або dropdown.
- Усередині folder: те саме.

**Open behavior:**
- File click → inline preview pane (overlay).
- ExternalLink click → нова вкладка.
- Folder click → expand/collapse.

**Group by = None edge:**
- Stage sections зникають; плоский список з default sort `Recent`.
- Кожна row отримує stage-chip ("Stage: Тех-пак"), щоб контекст не загубився.

### 7.4 File preview pane

Reference: §3.7.

**Layout:** overlay над Files area. Stage stepper + Side panel залишаються видимими.

**Шапка preview pane:**
- `× Close` (Esc також).
- Назва файла.
- **Version pills:** `[v3]` (active, виділена), `v2`, `v1`. Клік перемикає рендер.
- Дії: `Upload new version` (editor+), `Open in new tab` (proxy URL з versionId).

**Тіло (per `mimeType`):**

| MIME | Render |
|---|---|
| `application/pdf` | Inline через `<embed>` або `<object>` з proxy URL. |
| `image/png`, `image/jpeg`, `image/webp` | `<img>` з proxy URL. Pinch-zoom / wheel-zoom. |
| `text/html` | Inline `<iframe sandbox>` з proxy URL. |
| `application/vnd.openxmlformats-officedocument.*` (PPTX/DOCX/XLSX) | Download/Open CTA: "Цей тип не рендериться inline. [Download] [Open in tab]". |
| `application/dxf`, `.ai`, `.clo`, інше бінарне | Те саме — download CTA. |

Для не-previewable типів preview pane **усе одно відкривається** — це поверхня для коментарів, а не тільки для рендеру.

**Side panel при preview:**
- Auto-switch на Comments tab з scope-фільтром (детально у §7.5).
- Decisions / Action Log / Members залишаються доступні (клік на них перемикає tab без закриття preview).

**Закриття:** `× Close` / Esc / навігація. Scope chip знімається.

### 7.5 Side panel — Comments tab

Reference: §3.3.

**Default view (без preview):**
- Фільтр: `open` (включно з `still-open-from-v_n`); toggle `Show resolved`.
- Сортування: `createdAt desc`.

**Comment card:**
- Avatar + ім'я автора.
- Timestamp (relative; absolute on hover tooltip).
- Body (markdown rendered; XSS escape).
- **Anchor chip** — "on `front.pdf v2`" / "on Stage Ескізи" / "on Decision: 'опустити талію'". Клік на chip → переходить до anchor'у (file → відкриває preview, stage → scroll, decision → перемикає tab).
- **Status badge:** `Open` / `Still open from v2` (з накладеним накладеним кольором — warm/amber, щоб око ловило) / `Resolved` (мутовано).
- Actions: `Reply` / `Resolve` (обидва Next, але affordance треба зарезервувати).

**Composer (sticky bottom):**
- Textarea + Submit.
- Anchor preview над textarea: "Commenting on `TP_001_dress.pdf v3`" або "Commenting on this bundle" — щоб користувач бачив, куди приліпиться.
- Auto-anchor logic (важливо для дизайнера):
  - Якщо preview відкритий → anchor на displayed version (рендериться у composer'і).
  - Якщо file селектнутий у Files area (single-click) → anchor на current version.
  - Якщо нічого не виділено → anchor на bundle.

**Scoped-to-preview behavior:**
- Коли preview відкривається — Comments tab автоматично активується.
- Над списком коментарів з'являється **scope chip**: "Comments on `TP_001_dress.pdf`" з version pills `[all]` / `v3` / `v2` / `v1`.
- Список фільтрується до коментарів з `anchor.kind = item` (refId = fileId) АБО `anchor.kind = version` (refId in fileVersions). Default — всі версії; клік на пілу — звужує.
- При перемиканні version pill у preview header — composer auto-anchor flips до нової версії.

**Empty state:** "No open comments yet. Add the first one →"

### 7.6 Side panel — Decisions tab

Reference: §3.4.

**Decision card:**
- Avatar + ім'я автора + timestamp.
- Body (markdown).
- Target item chip (якщо `targetItemId` встановлено) — клік → відкриває file preview.
- **Sign-off rail:** список approver-avatar'ів. Підписані — з ✓ і timestamp. Не підписані — світло-сірі.
- Status badge: `Proposed` / `Signed` / `Superseded`.
- `Sign` button — видимий тільки користувачу, що в очікуваних approver'ах.

**Add decision composer:**
- Кнопка `+ Add decision` угорі панелі.
- **Desktop:** inline expand або side modal — body + target picker + approver picker (preselect з `Stage.approverIds`).
- **Mobile fit-review:** full-screen modal з autofocus на body. Target picker — quick-select з recent files на цій стадії. Approver — preselect.

**Fit-review mode (mobile):**
- Decisions tab — primary.
- Files area — bottom-sheet (peek), розгортається для подивитись референс.
- Sign-off CTA — 64px tap target.

### 7.7 Side panel — Action Log tab

Reference: §3.5.

**Append-only feed.** Сортування `at desc`.

**Кожен запис:**
- Avatar actor.
- Timestamp (absolute з hover-tooltip relative).
- Action verb + context, per kind:

| kind | Renders as |
|---|---|
| `stage-transition` | "✓ Approved stage **Ескізи**" / "▶ Moved to **Тех-пак**" |
| `item-add` | "+ Added file **front.pdf** to **Ескізи**" |
| `item-rename` | "✎ Renamed **front_v2.pdf** → **front.pdf**" |
| `item-move` | "→ Moved **front.pdf** to folder **sketches/**" |
| `version-upload` | "↑ Uploaded **v3** of **TP_001_dress.pdf**" |
| `comment-add` | "💬 Commented on **TP_001_dress.pdf v2**" |
| `comment-resolve` | "✓ Resolved comment by Олена on **front.pdf v1**" |
| `decision-sign` | "✓ Signed decision **'опустити талію на 2 см'**" |
| `member-add` | "+ Added **Олена** as approver" |
| `member-remove` | "− Removed **John** from members" |
| `cover-set` | "🖼 Set cover image to **front_navy_blazer.jpg**" |

**Sticky day separators:** "Today", "Yesterday", "Mar 14" — щоб око хапало хронологію.

**Фільтри (kind / actor / date) — Next, не MVP.** Affordance: дрібна іконка фільтра у шапці tab'у, навіть якщо disabled.

**Empty state:** "No activity yet."

### 7.8 Side panel — Members tab

Reference: §3.6.

**Секції за `accessLevel`:**
- **Owners** — повний доступ + керування іншими.
- **Editors** — редагування, коментарі, decision'и.
- **Viewers** — read-only + коментарі.

**Member row:**
- Avatar + ім'я + email.
- Бейдж accessLevel.
- Action `Remove` (owner-only).

**"Currently on stages" block (нижче):**
- Read-only зріз поточної (і наступних) активних стадій з їх `assigneeId` + `approverIds`.
- Дозволяє побачити "хто на чому зараз".
- `Reassign stage` — Next.

**Add member action:**
- `+ Add member` (owner-only) → modal з email-picker (з directory користувачів бренду) + accessLevel select.

---

## 8. Component states (cross-surface)

### 8.1 Loading

- **First paint:** skeleton (header без cover, stepper з placeholder pills, file rows як rectangles, comments як rectangles). Без spinner — skeleton точніший psychologically.
- **Subsequent operations:** inline spinner на тригерній кнопці; optimistic update де можливо (наприклад, comment з'являється одразу і fade-in у normal state коли підтверджено).

### 8.2 Empty

- Per-surface, специфіковано у §7.
- Не використовуй "Lottie illustrations" / "404 mascots". Tool, not toy.

### 8.3 Error

- **Transient (network, 500):** toast — "Couldn't load. Retry?" з retry-action.
- **Bundle not found:** page-level "This bundle no longer exists or you don't have access" + back-link на Workspace.
- **Permission denied (403):** окремий екран (див. §16.1) — "You don't have access to this bundle. Ask the bundle owner."

### 8.4 Permission-denied (viewer)

- Write-affordances приховані (не disabled). Логіка у §6.6.
- Single hint у header — badge "Viewer" — щоб користувач знав свою роль.

### 8.5 In-flight (uploading, signing, approving)

- **Upload:** progress bar на file row (replaces version chip під час аплоаду). При завершенні — chip миготить раз і фіксується на новій версії.
- **Sign-off:** button → spinner stage ("Signing...") → ✓ checkmark fade-in у sign-off rail.
- **Approve:** button → "Approving..." → stepper reflow (active → passed, next pending → active) з 200ms transition.

---

## 9. Key user flows (story-by-story)

Покрокова візуалізація. Дизайнер бере це як скрипт для prototype screens.

### 9.1 Tuesday morning orientation — US-001 + US-009

1. Марта клікає Slack-посилання `https://app.iterate.guru/bundles/abc123` о 9:14.
2. Автентифікація прозора (Google session). Лендить на сторінці бандла.
3. **Бачить за 5 секунд:**
   - Cover image "navy blazer" (64×64) → впізнала стиль.
   - Title "Style 247". Collection: SS26.
   - Stepper: ✓ Ідея → ✓ Ескізи → **► Тех-пак (active)** → Лекала → … (далі pending).
   - Active pill розкритий: "Assignee: Марта · Approver: Олена · 3 days in stage".
   - Files area scroll'нувся до Тех-пак секції; vyдно `TP_001_dress.pdf v2`.
   - Side panel = Comments tab з 1 open ("Олена on v2: cuff width needs 6.5cm").
4. Розуміє: "це мій стиль, мій хід, Олена чекає від мене v3 з її правками".

### 9.2 Browse files & open inline preview — US-002 + US-003

1. Марта клікає `TP_001_dress.pdf` у Files area.
2. **Файлова область замінюється preview pane** (Stepper sticky).
3. PDF v3 рендериться inline через proxy.
4. Side panel auto-switch на Comments з scope chip "Comments on TP_001_dress.pdf" + version pills `[all] v3 v2 v1`.
5. Comments list — 3 коментарі (2 з v2 з бейджем "still open from v2", 1 з v3).
6. Марта клікає `v2` pill у preview header → preview body рендерить v2; коментарі тієї ж file'и, але v2-anchored втрачають бейдж (бо ми на v2).
7. Esc → preview закривається; Files area повертається з попереднім scroll'ом.

### 9.3 Upload new version & cross-version comments — US-004 + US-005

1. Марта в preview pane v3 `TP_001_dress.pdf`. У side panel — Олена'ин коментар "cuff width needs 6.5cm" з "still open from v2".
2. Клікає `Upload new version` у preview header → file picker → обирає `TP_001_dress_v3.pdf` з диску.
3. Progress bar поверх file row у memory (Files area позаду preview також оновлюється).
4. Завершено: version pills у preview оновились (тепер `[v4] v3 v2 v1`); body рендерить v4; Comments composer auto-anchor flips на v4.
5. Марта пише в composer: "fixed cuff width to 6.5cm in v4" → submit.
6. Новий коментар з'являється у списку, anchored на v4.
7. Олена'ин коментар з v2 _залишається_ open зі статусом "still open from v2".

### 9.4 Capture decision with sign-off (mobile fit-review) — US-006

1. Четвер 16:30, фіттинг. Олена + Марта стоять біля моделі.
2. Олена дивиться на куртку, каже "талія занадто висока, опускаємо на 2 см".
3. Марта дістає iPhone, відкриває bundle URL → лендить у mobile fit-review mode → Decisions tab primary, Files area як bottom-sheet (peek).
4. Тапає `+ Add decision` → full-screen modal з autofocus.
5. Body: "опустити талію на 2 см". Target item: tap → quick-select показує recent files на Stage 7 → обирає `TP_001_dress.pdf`. Approver: preselected = Олена.
6. Submit → Decision card з'являється у списку, status `Proposed`, Олена'ин avatar greyed.
7. Олена бере телефон у Марти (або відкриває на своєму) → тапає decision → тапає `Sign`.
8. Spinner 200ms → ✓ checkmark + timestamp у Олена's row → status badge flips на `Signed`.
9. ActionLogEntry `decision-sign` записаний.

### 9.5 Approve stage transition — US-007

1. Олена між нарадами, на iPhone. WhatsApp нагадування: "глянь Style 247".
2. Відкриває посилання → лендить на bundle page (mobile portrait).
3. Stepper: active = Тех-пак. Expanded card: "Approver: Олена · Approve / Request changes".
4. Тапає `Approve`.
5. Animation 200ms: stepper reflows — Тех-пак pill flips на ✓ passed; наступний Лекала pill flips на ► active; current expanded card зсувається на Лекала.
6. ActionLogEntry `stage-transition` (from: 3, to: 4, by: Олена).
7. Toast: "Stage approved · Лекала is now active".

### 9.6 Copy URL & external recipient lands — US-008

1. Марта на bundle page → клікає `📋 Copy link` у header.
2. URL `https://app.iterate.guru/bundles/abc123` копіюється у clipboard. Toast: "Bundle URL copied".
3. Марта Cmd-V у WhatsApp фабрики: "ось тех-пак на 247-й, остання версія".
4. Працівник фабрики (член бренду, OAuth-authenticated) тапає посилання → лендить на ту саму сторінку, ту саму стадію, з тим самим v4.
5. Якщо outsider (не member) тапнув: → `/auth/sign-in` → 403 ("You don't have access to this bundle").

### 9.7 Set cover image — US-009

1. Марта створила новий бандл "Style 248" → cover є placeholder (градієнт + "S").
2. Загрузила `front_navy_blazer.jpg` у Stage 2 (Ескізи) → file з'явився у tree.
3. Hover на file row → action `Set as cover`. Клік.
4. Header thumbnail миттєво оновлюється на navy blazer image.
5. ActionLogEntry `cover-set`.
6. Завтра Марта аплоадить v2 цього image (краще освітлення) → header thumbnail auto-refresh на v2 (FK на Item, не Version).
7. Через тиждень: вирішила, що інше фото краще → клік на cover у header → `Change cover` → picker зі всіх image-items бандла → обрала іншу.

---

## 10. Interactions & micro-interactions

### 10.1 Stage pill interactions

- **Hover:** tooltip з повним списком approver'ів + датою enteredAt.
- **Click:** Files area scroll-to-stage section (smooth, 200ms). Active не міняється.
- **Active pill:** auto-expands inline, без окремого клику.

### 10.2 File row hover actions

- На hover (desktop) — action icons fade-in справа: `Upload new version` (↑), `Set as cover` (для image only) (🖼), `•••` (overflow menu, Next).
- На touch (mobile/tablet) — trailing `•••` button (постійно видимий, не hover).

### 10.3 Preview open/close transitions

- **Open:** Files area fade-out + Preview pane slide-in зправа (180ms ease-out).
- **Close:** reverse, same duration.
- **Esc** — закриває preview (не side panel).
- **Click outside preview** — не закриває (side panel clicks дозволені).

### 10.4 Version pill switch

- Клік на іншій версії → preview body fade-out → нова версія fade-in (120ms). Не slide — щоб не нудило.
- Comments scope chip залишається; composer auto-anchor flips видимо (chip-text оновлюється).

### 10.5 Comment composer focus & scope-chip animation

- Focus textarea → anchor preview (chip над textarea) fade-in: "Commenting on TP_001_dress.pdf v3" або "Commenting on this bundle".
- Submit → comment card slide-in згори списку (200ms).
- Якщо comment з v2 (a v3 active), на ньому з'являється "still open from v2" badge — fade-in коли v3 запушили.

### 10.6 Approve / sign-off feedback (tactile)

- Button press → 80ms depress state (transform: scale(0.97)).
- Spinner 200-400ms.
- Success: button label flips на ✓ для 500ms, потім button зникає (replaced by passed state у stepper / signed row у decisions).
- Mobile: subtle haptic on tap (iOS).

### 10.7 Toast pattern

- **Desktop:** bottom-right corner. 320px width, 2s duration, auto-dismiss.
- **Mobile:** top, full-width, 2s.
- One-liner: "Bundle URL copied" / "Stage approved" / "Decision signed" / "Cover image set" / "New version uploaded".
- Error variant: same position, destructive color, з retry CTA де доречно.

---

## 11. Responsive behavior

### 11.1 Breakpoints

| Name | Range | Primary device |
|---|---|---|
| Mobile | <768 | iPhone, Android phones |
| Tablet | 768-1279 | iPad portrait/landscape |
| Desktop | ≥1280 | MacBook 13" і вище |

### 11.2 Desktop (≥1280)

- Two-column: Files area (65-70%) + Side panel (30-35%).
- Stepper horizontal full-width під header.
- Cover thumbnail 64×64.
- Preview pane overlay over Files area.

### 11.3 Tablet (768-1279) — side panel collapse rules

- **Portrait (<1024):** Side panel — slide-over (drawer з icon-button у header). Default collapsed. Files area full-width.
- **Landscape (≥1024):** Side panel вузька (~300px), фіксована. Files area вужче, але дволанковий layout зберігається.

### 11.4 Mobile (<768) — особливо для Olena і fit-review

- Files area — full-width, single column.
- Stepper — horizontal scroll; activа auto-scroll у в'юпорт; pills компактні (icon + skinned name).
- Side panel — **bottom-sheet** (див. §11.5).
- Cover thumbnail 48×48.
- Preview pane — full-screen на open (заміщає Files area).
- Approve / Sign tap targets 64px.

### 11.5 Mobile bottom-sheet pattern for the side panel

- 3 висоти: **peek** (тільки tabs row, ~80px), **half** (~50vh), **full** (~95vh).
- Drag-handle угорі.
- Tab switching доступний з peek (клікнув tab → bottom-sheet auto-розгортається на half).
- Composer focus → auto-розгортається на full.
- При відкритті preview pane — bottom-sheet auto на half (щоб scope chip і коментарі були видні поряд з preview).

---

## 12. Microcopy

### 12.1 Language (UA vs EN policy)

- **App shell UI labels:** English (Approve, Request changes, Upload new version, Copy link, Set as cover, Add file, Add link, Add folder, Resolve, Sign).
- **Stage names** — українською (як у [`typical-collection-flow.md`](./processes/typical-collection-flow.md)): "Ідея колекції", "Ескізи й вибір тканин", "Тех-пак", "Лекала", "Зразок", "Примірка", "Градація", "Виробництво".
- **User-generated content** — pass-through, без перекладу (file names, bundle title, comments, decisions).
- **System narrative copy** (toasts, empty states): English на MVP. UA — Next (Олена двомовна, target market — UA SMB; дизайнеру: тестуй обидва — українська UI копія довша на ~30%).

### 12.2 Empty states (per surface)

| Surface | Empty copy |
|---|---|
| Bundle (no items) | "No files yet · Add the first one →" |
| Stage section | "No files yet · [+ Add file / link / folder]" |
| Comments tab | "No open comments yet. Add the first one →" |
| Decisions tab | "No decisions yet. Capture one during the fit review →" |
| Action Log | "No activity yet." |
| Members | "Just you so far. [+ Add member]" |

### 12.3 Toasts

- Success: "Bundle URL copied" / "New version uploaded" / "Decision signed" / "Stage approved" / "Cover image set" / "Comment added".
- Error: "Couldn't upload. Retry?" / "Couldn't sign. Network error."

### 12.4 Confirmations

- File delete: "Delete `{name}`? Previous versions stay accessible from history." (MVP має `delete`? — Next; design affordance treba)
- Remove member: "Remove `{name}` from this bundle? They'll lose access immediately."
- Revoke cover: no confirm — single-step undo via "Restore cover" toast for 5s.

### 12.5 Button labels

- Primary CTAs: **Approve**, **Request changes**, **Sign**, **Upload new version**, **Copy link**, **Set as cover**, **Add file**, **Add link**, **Add folder**, **Add decision**, **Add member**.
- Secondary: **Reply**, **Resolve**, **Change cover**, **Remove cover**, **Rename**, **Move**, **Remove**.
- Destructive: **Delete** (з confirm).

---

## 14. Accessibility

### 14.1 Keyboard navigation

- **Tab order:** back-link → cover → title → copy-link → stepper (pills L→R) → view modes toggle → files area (rows top-down) → side panel (tabs L→R, then list).
- **Esc:** close preview / close modal / close composer (preserves textarea content).
- **Enter on file row:** open inline preview.
- **Enter on stage pill:** scroll to stage section.
- **Hotkeys (J/K, V, U) — Next, not MVP** — але tab-order у дизайні має не блокувати майбутній shortcut overlay (`?`).

### 14.2 Screen reader labels

- Stage pill: `"Stage 3 of 9: Тех-пак. Active. Assignee: Марта. Approver: Олена. 3 days in stage. Press Enter to scroll to this stage's files."`
- Status badges: read out (e.g., `"Comment, still open from version 2"`).
- Anchor chips: `"Comment on TP_001_dress.pdf version 2"`.
- File row: `"TP_001_dress.pdf, PDF, version 3, uploaded 1 hour ago. Press Enter to open preview."`
- Version pills (preview): `"Version 3 of 3, current"`.

### 14.3 Color contrast (WCAG AA)

- AA minimum on all text. AAA on body де технічно можливо.
- Status icons завжди paired with shape (✓ vs ►), не тільки color — colorblind-friendly.
- "Still open from v2" — не покладатись лише на amber; додатково prefix-icon або текст.

### 14.4 Focus indicators

- Visible focus ring на _всіх_ interactive elements (pills, rows, buttons, composer).
- Custom focus styling (не browser default outline) — узгоджений з design system (3px ring у primary token).
- Focus trap у modal'ах (Add decision, Add member).

---

## 15. Edge cases & open questions

### 15.1 Very long file / stage names

- File names: до 60+ chars (приклади з real data: `Pattern_SS26_001_base_M.dxf`, `Sample_SS26_001_v1_photos.zip`). Truncate з ellipsis у середині, full на hover (tooltip).
- Stage names: коротші (≤20 chars зазвичай) — full visible.
- Bundle title: до 60 chars, truncate з ellipsis у header.

### 15.2 Bundle with 1 stage vs 9 stages

- **1 stage** — стіпер не приховуємо, рендеримо одну expanded pill. Edge case, але buy-it-cheap.
- **9 stages** — поміщається у ≥1280; horizontal scroll на меншому. Active auto-scroll into view.
- **12 stages** (custom workflow, theoretical max) — те саме, scroll.

### 15.3 50+ files на одній стадії

- Virtualize file list (під капотом — react-window або similar).
- Default-collapse folder children коли стадія >20 items.
- Sticky stage-section header у Files area, щоб контекст не губився при scroll'і.

### 15.4 Broken cover image / 404

- Proxy повертає 404 → fall back на placeholder (gradient + first letter).
- Лог warning на бекенді; UI не показує error toast (просто не порушує header).

### 15.5 Stage with no approver vs multiple approvers

- **0 approvers** (наприклад, Stage 6 "Перший зразок" у [`typical-collection-flow.md`](./processes/typical-collection-flow.md) — без approver'а): кнопка `Approve` зникає; замість неї `Mark as done` (видима assignee). Stage просувається через assignee, не sign-off.
- **2+ approvers**: stack avatar; clicked stack → expanded list з sign status per approver; transition тільки коли _всі_ підписали.

### 15.6 Very long resolved-comments thread

- Comments tab: при увімкненому "Show resolved" — секція resolved колапсується за замовчуванням з "Show {N} resolved" link.
- Розгорнута — virtualized list, sticky stage separator.

### 15.7 Action Log with 500+ entries

- Virtualize.
- Sticky day separators ("Today", "Yesterday", "Mar 14, 2026").
- Infinite scroll, fetch older on reach bottom.

### 15.8 Open questions for discussion

Питання, на які бажано отримати відповідь дизайнера або product'а перед лочем мокапу:

1. **Reorder stages once bundle created?** Поточно: ні, `Stage.position` локнутий від template. Залишаємо так? Affordance "reorder" не дизайнимо.
2. **File thumbnails для не-image типів?** Proposal: native render для image; first-page-extract render для PDF; generic typed-card для решти. Дизайнер: погодж/відхил?
3. **Cover image у Worklist row?** Інша сторінка, інша історія. Якщо так — це впливає на header thumbnail spec тут (узгодити стиль).
4. **Mobile fit-review: bottom-sheet vs full-screen tab?** Proposal: bottom-sheet. A/B перед лочем варто?
5. **Light vs dark default?** Поточно: light (per `.claude/rules/frontend-architecture.md` — `:root` token set активна; `.dark` готова, але не вмикається). Залишаємо light для MVP?
6. **"Request changes" flow — required comment?** Per US-109 (Next): так, required. Affordance для composer-on-click — лишити slot у дизайні active stage card.
7. **Approve в multi-approver stage — show прогрес ("1 of 2 signed") на самому пілу?** Чи тільки в expanded card?

---

## 16. Deliverables expected from designer

### 16.1 Hi-fi mockups

Список екранів/станів, очікуваних як фінальні мокапи:

**Desktop:**
- Default state — Files area + Comments tab.
- Default state — Decisions tab активний (без preview).
- Default state — Action Log tab активний.
- Default state — Members tab активний.
- Preview pane open — PDF v3 з scoped Comments + version pills.
- Preview pane open — image (з cover affordance).
- Preview pane open — non-previewable (XLSX) з download CTA.
- Empty bundle (новостворений, 9 порожніх stages, без cover).
- Permission-restricted (viewer) — usual state without write-affordances.
- Approve mid-action (in-flight state).

**Mobile:**
- Default portrait — Files area + bottom-sheet peek.
- Default portrait — bottom-sheet half (Comments visible).
- Default portrait — bottom-sheet full (Comments + composer focused).
- Fit-review mode — Decisions tab primary, Add decision modal.
- Sign-off in-flight.
- Preview pane (PDF на full-screen mobile).
- 403 not-a-member page.
- Sign-in page (Google OAuth button).

**Tablet:**
- Portrait — Files area + slide-over side panel (collapsed).
- Landscape — two-column compressed.

### 16.2 Interactive prototype

Кликабельні flows з §9. Минімум:
- **9.1** Tuesday morning orientation
- **9.2** Browse + preview
- **9.3** Upload version + cross-version comments
- **9.4** Mobile fit-review decision
- **9.5** Approve stage

Nice-to-have: 9.6 (Copy URL) і 9.7 (Set cover).

### 16.3 Assets

- **File-type icons** (SVG, optimized): PDF, AI, DXF, XLSX, DOCX, PPTX, image-generic, ZIP, video-generic, audio-generic, fallback.
- **ExternalLink icons:** Techpacker, Figma, Loom, GDoc, generic 🔗.
- **Status icons:** ✓ (passed), ► (active), ○ (pending), ⊘ (blocked).
- **Action-Log verb icons:** 11 видів (див. §7.7). Maps to Lucide де можливо.
- **Empty-state illustration:** 1 tasteful illustration для empty bundle (опційно — текст-only теж OK).
- **Cover placeholder gradient generator:** spec для генерації gradient'ів за first letter title (consistent кольори per letter).

### 16.4 Figma library / components

Reusable components для dev handback (Figma library exported as components, mapped до shadcn primitives де можливо):

- `StagePill` — 4 status variants (passed/active/pending/blocked) × 2 sizes (compact/expanded).
- `FileRow` — 3 type variants (file/folder/external link) × 2 states (default/hover) × 2 permission states (editor/viewer).
- `FolderRow` — collapsed/expanded.
- `VersionPill` — active/inactive.
- `CommentCard` — 3 status variants (open / still-open-from-vN / resolved) + thread variant.
- `AnchorChip` — 5 anchor kinds (bundle/item/version/stage/decision).
- `DecisionCard` — 3 status variants (proposed/signed/superseded) × 2 sign-off rail sizes.
- `ActionLogRow` — 11 kinds (per §7.7 table).
- `MemberRow` — 3 accessLevel variants.
- `ViewModesToggle` — Group by / Sort / Filter.
- `ScopeChip` — comments scope в preview mode.
- `ToastBase` — success / error / info.
- `BottomSheet` — 3 heights (peek/half/full).
- `Avatar` + `AvatarStack` (для multi-approver).
- `EmptyState` — універсальний.

### 16.5 Handback format

- Figma file з dev-mode enabled.
- **Component map:** таблиця Designer ↔ Dev — який Figma component на який shadcn/ui primitive мапиться (для dev: де достатньо `npx shadcn add`, де треба кастом).
- **Token map:** color/spacing/typography tokens документовані у Figma styles → відповідні CSS variable names (узгодити з `.claude/rules/frontend-architecture.md`).
- **Export specs** для icons: SVG, view-box normalized, fill currentColor.
- **README у Figma file:** короткий guide для dev — як шукати components, як читати variants.
