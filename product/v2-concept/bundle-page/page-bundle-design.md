# Сторінка бандла — Design Reference

Довідник для побудови сторінки бандла (`product/page-structure.md` §8-9): модель сутностей, UI layout, специфікація кожної поверхні. Story map (`user-stories/bundle-page-story-map.md`) посилається на цей файл за номерами секцій замість дублювання моделі.

**Пов'язані:**
[`vision.md`](./vision.md) §pillars 1-3 ·
[`vpc-tech-designer.md`](./vpc-tech-designer.md) ·
[`vpc-head-of-design.md`](./vpc-head-of-design.md) ·
[`personas/persona-marta.md`](./personas/persona-marta.md) ·
[`personas/persona-olena.md`](./personas/persona-olena.md) ·
[`processes/typical-collection-flow.md`](./processes/typical-collection-flow.md) ·
[`page-structure.md`](./page-structure.md) §8-9

---

## §1. Модель сутностей

### Інтрінсік (сторінка ними володіє)

**Bundle** — корінь, контейнер для всього нижче.

| Поле | Тип | Примітка |
|---|---|---|
| `id` | string | cuid |
| `title` | string | "Style 247" |
| `collectionId` | FK → Collection | до якої колекції належить |
| `currentStageId` | FK → Stage | активна стадія |
| `coverImageId` | FK → Item? | nullable; має бути `type=file` з `mimeType = image/*`. Рендериться в шапці (див. §3.0). |
| `createdAt`, `updatedAt` | DateTime | стандартні |

**Stage** — інстанс стадії workflow для цього бандла (склонований з WorkflowTemplate).

| Поле | Тип | Примітка |
|---|---|---|
| `id` | string | cuid |
| `bundleId` | FK → Bundle | |
| `name` | string | "Ескізи й вибір тканин" |
| `position` | int | 1, 2, 3… |
| `status` | enum | `pending` / `active` / `passed` / `blocked` |
| `enteredAt` | DateTime? | коли стала active |
| `passedAt` | DateTime? | коли підписана approver'ами |
| `assigneeId` | FK → User | хто рухає стадію |
| `approverIds` | FK → User[] | хто має підписати завершення (один або кілька) |

**Member** — учасник з доступом до бандла.

| Поле | Тип | Примітка |
|---|---|---|
| `userId` | FK → User | |
| `bundleId` | FK → Bundle | |
| `accessLevel` | enum | `owner` / `editor` / `viewer` |
| `addedAt` | DateTime | |

Member = **доступ**. Конкретні люди на стадіях (assignee, approver) живуть на Stage — це дозволяє ротацію per stage без зміни доступу.

**Item** — поліморфний елемент дерева. **Одна таблиця з discriminator.**

Спільні поля:

| Поле | Тип | Примітка |
|---|---|---|
| `id` | string | cuid |
| `type` | enum | `folder` / `file` / `externalLink` |
| `bundleId` | FK → Bundle | |
| `stageId` | FK → Stage | під яку стадію група |
| `parentId` | FK → Item? | null = корінь стадії; ID Folder = всередині папки |
| `name` | string | display name |
| `position` | int | сортування серед сиблінгів |
| `addedById` | FK → User | |
| `addedAt` | DateTime | |

Підтипи додають свої поля:

- **Folder**: тільки контейнер; без додаткових полів.
- **File**: `currentVersionId` (FK → Version), `mimeType`.
- **ExternalLink**: `url`, `linkType` (`techpacker` / `figma` / `loom` / `gdoc` / `other`). Версій нема — live-документ у чужому інструменті.

**Version** — іммутабельна версія File.

| Поле | Тип | Примітка |
|---|---|---|
| `id` | string | cuid |
| `fileId` | FK → Item (file) | |
| `sequence` | int | 1, 2, 3… відображається як v1, v2, v3 |
| `uploadedById` | FK → User | |
| `uploadedAt` | DateTime | |
| `blobPath` | string | Vercel Blob private path |
| `size` | int | байти |
| `note` | string? | опційно, що змінилось |

**Comment** — коментар на чомусь у бандлі.

| Поле | Тип | Примітка |
|---|---|---|
| `id` | string | cuid |
| `authorId` | FK → User | |
| `body` | string | markdown |
| `createdAt` | DateTime | |
| `resolvedAt` | DateTime? | |
| `parentCommentId` | FK → Comment? | для тредів |
| `anchor` | { kind, refId } | один з: `bundle` / `item` / `version` / `stage` / `decision` |
| `crossVersionState` | computed | `open` / `resolved` / `still-open-from-v_n` |

Якщо коментар прив'язаний до v2 файла, а файл вже на v3 — коментар залишається видимим зі станом `still-open-from-v2`, поки не resolved.

**Decision** — структуроване рішення (типово з fit-review, але може бути на будь-якій стадії).

| Поле | Тип | Примітка |
|---|---|---|
| `id` | string | cuid |
| `bundleId` | FK → Bundle | |
| `stageId` | FK → Stage | де прийнято |
| `authorId` | FK → User | |
| `body` | string | "опустити талію на 2 см" |
| `createdAt` | DateTime | |
| `signOffs` | { approverId, at }[] | хто і коли підписав |
| `targetItemId` | FK → Item? | який файл/папку це адресує |
| `status` | enum | `proposed` / `signed` / `superseded` |

**ActionLogEntry** — append-only Action Log (як в Jira).

| Поле | Тип | Примітка |
|---|---|---|
| `id` | string | cuid |
| `bundleId` | FK → Bundle | |
| `actorId` | FK → User | хто зробив дію |
| `at` | DateTime | |
| `kind` | enum | `stage-transition` / `item-add` / `item-rename` / `item-move` / `version-upload` / `comment-add` / `comment-resolve` / `decision-sign` / `member-add` / `member-remove` / `cover-set` |
| `payload` | JSONB | контекст-специфічна структура |

### Референси (read-only з інших сторінок)

- **WorkflowTemplate** з `/settings/workflows` — шаблон, з якого Stages інстансовані при створенні бандла.
- **LibraryComponentReference** з `/library` — посилання на спільні компоненти (палітра, care label). На бандлі рендериться як ExternalLink спеціального типу або помічений File.
- **User** — учасники по бренду.

### Свідомо скіпнуто з MVP

- **ExternalInvite** (scoped довгостроковий партнер) — повернемось на сторінках 10-12 (`page-structure.md`).
- **HandoffPacketHandle** — те саме.
- **Presence** ("хто зараз дивиться") — real-time не core.

---

## §2. UI Layout

### Default state (без preview)

```
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
│ ┌─────┐                                                      │
│ │COVER│ ← Back to Workspace · [📋 Copy link]                 │
│ │ IMG │ Style 247                                            │
│ │     │ Collection: SS26                                     │
│ └─────┘                                                      │
│                                                              │
│ Stage stepper:                                               │
│ [✓ Ідея] → [✓ Ескізи] → [► Тех-пак] → [Лекала] → [Зразок]→…│
│              Assignee: Марта · Approver: Олена · 3 days     │
├────────────────────────────────────────────┬─────────────────┤
│                                            │ Side panel      │
│ Files area (центральна, primary)           │ ┌─ Tabs ──────┐ │
│                                            │ │ Comments    │ │
│ ┌─ Ідея ─────────────────────────────────┐│ │ Decisions   │ │
│ │ ▣ moodboard.pdf            v1 · 2d ago ││ │ Action Log  │ │
│ │ ▣ collection_plan.xlsx     v2 · 1d ago ││ │ Members     │ │
│ └───────────────────────────────────────────┘ └────────────┘ │
│                                            │                 │
│ ┌─ Ескізи ──────────────────────────────┐ │ [Active tab     │
│ │ ▼ 📁 sketches/                        │ │  content here]  │
│ │   ▣ front.pdf            v1 · 3d ago  │ │                 │
│ │   ▣ back.pdf             v1 · 3d ago  │ │                 │
│ │ ▣ fabric_swatches.xlsx   v3 · 1d ago  │ │                 │
│ │ 🔗 trims_inspiration     · 2d ago     │ │                 │
│ │    (figma)                            │ │                 │
│ └───────────────────────────────────────┘ │                 │
│                                            │                 │
│ ┌─ Тех-пак (active) ────────────────────┐ │                 │
│ │ ▣ TP_001_dress.pdf      v3 · 1h ago   │ │                 │
│ │ ▣ BOM_001.xlsx          v2 · 4h ago   │ │                 │
│ │ [+ Add file / link / folder]          │ │                 │
│ └───────────────────────────────────────┘ │                 │
└────────────────────────────────────────────┴─────────────────┘
```

### При відкритому preview (overlay над Files area)

```
┌──────────────────────────────────────────────────────────────┐
│ Header · Stage stepper (sticky)                              │
├────────────────────────────────────────────┬─────────────────┤
│ ┌─ Preview pane ─────────────────────────┐ │ Side panel      │
│ │ × Close   TP_001_dress.pdf             │ │ ► Comments      │
│ │           v3 (active) · v2 · v1        │ │   Decisions     │
│ │ Open in tab · Upload new version       │ │   Action Log    │
│ ├────────────────────────────────────────┤ │   Members       │
│ │                                        │ │ ─────────────── │
│ │                                        │ │ Scope:          │
│ │                                        │ │ TP_001_dress.pdf│
│ │   [PDF rendered inline via proxy]      │ │ [all] v3 v2 v1  │
│ │                                        │ │ ─────────────── │
│ │                                        │ │ Олена on v2:    │
│ │                                        │ │ "cuff width…"   │
│ │                                        │ │ (still open v2) │
│ │                                        │ │                 │
│ │                                        │ │ Composer →      │
│ └────────────────────────────────────────┘ │ anchor to v3    │
└────────────────────────────────────────────┴─────────────────┘
```

При відкритті preview:

- Файлова область замінюється preview pane (close × або Esc — повертається).
- Side panel **auto-switch на Comments tab** + scope filter на відкритий файл.
- Stage stepper залишається sticky вгорі.
- Version pills (`v3` / `v2` / `v1`) у шапці preview перемикають яку версію рендеримо без закриття.

### Правила layout

- **Файли — primary focus.** Центральна область займає 65-70% ширини на desktop у default state; preview займає ту саму ширину.
- **Side panel** — 30-35% ширини, фіксована на desktop. На mobile — згортається в bottom-sheet або переключається на full-screen табом.
- **Stage stepper sticky** — залишається видимим при скролі Files area і при відкритому preview.
- **Files area / preview скролиться** окремо; stepper і side panel не скролиться разом з ними.

---

## §3. Per-surface specs

### §3.0 Page header

**Рендерить:** заголовок сторінки з ідентифікаційним блоком бандла — щоб користувач, який відкрив URL зі Slack/WhatsApp, упізнав стиль за 1 секунду без відкривання жодного файлу.

**Елементи:**

- **Back link** — `← Back to Workspace` (повертає в `/collections/{id}` колекції цього бандла).
- **Cover image thumbnail** — 64×64 px на desktop, 48×48 px на mobile. Рендериться зліва від title-блоку.
  - Якщо `Bundle.coverImageId` встановлено → показує current version вибраного Item через proxy URL (`/api/artifacts/{coverImageId}/file`).
  - Якщо null → placeholder з градієнтом + першою літерою `Bundle.title`.
  - Клік на thumbnail → відкриває cover image у preview pane (як §3.7).
- **Bundle title** (`Bundle.title`).
- **Колекція** — `Collection.name` від `Bundle.collectionId` (read-only label).
- **Copy link button** — копіює canonical URL бандла в clipboard (див. US-008).

**Cover image actions** (видимі editor'ам+):

- На File-item у Files area, що має `mimeType = image/*` → hover-action `Set as cover`.
- На cover thumbnail у header → menu з `Change cover` (picker зі всіх image Items бандла) і `Remove cover`.
- Зміна → оновлює `Bundle.coverImageId`, генерує ActionLogEntry (`cover-set`).

**Що cover image НЕ робить:**

- Не дублює storage — це FK на існуючий Item; нової версії не створює.
- Не змінюється автоматично — користувач обирає явно (бо «перша картинка» може бути неправильною).
- Не з'являється у Worklist / Workspace як thumbnail рядка стилю — це окрема історія (Next, не на цій сторінці).

### §3.1 Stage stepper (шапка)

**Рендерить:** масив `Stage` упорядкований по `position`.

**Кожна стадія-пілл показує:**

- Назву (з `Stage.name`).
- Іконку статусу: ✓ (passed) / ► (active) / ○ (pending) / ⊘ (blocked).
- Avatar assignee (з `Stage.assigneeId`) — маленький.
- Час у стадії, якщо active (з `Stage.enteredAt`).

**Активна стадія (status = `active`) виділена:**

- Жирніше + кольоровий border.
- Розкриває під собою додаткові метадані: assignee + approver(s) + дні в стадії + наступний approver.
- На активній стадії — кнопки `Approve` / `Request changes` (видимі тільки користувачам у `approverIds`).

**Взаємодія:**

- Клік на пілл → Files area прокручується до секції цієї стадії, але стадія НЕ міняє active (active змінюється тільки через approval/request-changes).
- Hover на пілл → tooltip з повним списком approver'ів + датою переходу.

### §3.2 Files area (центральна)

**Рендерить:** Items за активним view mode (див. нижче). Default — групування по `Stage` у порядку `Stage.position`.

**View modes** (sticky toggle угорі Files area):

- **Group by** — `Stage` (default) / `Folder` / `None` (плоский список без груп).
- **Sort within group** — `Position` (default, manual order) / `Recent` (за `currentVersion.uploadedAt desc`) / `Name` / `Type`.
- **Filter** — `All` (default) / `Files only` / `Folders only` / `External links only`.

Коли `Group by = None`:

- Stage stepper угорі залишається — це окрема навігація, не view mode.
- Файли — плоский список, default sort `Recent`.
- Кожен рядок отримує chip зі стадією, до якої item належить — щоб контекст не загубився.

Use case "плоский режим" — для аудиту ("які файли є на бандлі взагалі?"), онбордингу нової людини, пошуку коли не пам'ятаєш на якій стадії файл завантажила.

**Усередині стадії (Group by = Stage):**

- Корінь стадії — items з `parentId = null`.
- Папки розкриваються/згортаються (default — згорнуті, окрім active stage).
- Усередині папки — її items, сортовані по `position`.
- Сортування серед сиблінгів: за `position`, з можливістю drag-перетягування (Next, не MVP).

**Кожен File-item у списку показує:**

- Іконку типу (PDF, AI, XLSX, image).
- Назву (`Item.name`).
- Поточну версію (`v{Item.currentVersion.sequence}`).
- Останнє оновлення (`Item.currentVersion.uploadedAt` — relative time).
- Hover-actions: `Upload new version` / `Rename` / `Move` / `Delete`.

**Кожен ExternalLink-item:**

- Іконку типу (Techpacker / Figma / Loom / GDoc).
- Назву.
- Час додавання.
- Клік → відкриває URL у новій вкладці.

**Кожен Folder-item:**

- Іконку папки + chevron (expand/collapse).
- Назву.
- Лічильник items усередині.

**Додавання:**

- На корені кожної стадії — кнопка `[+ Add file / link / folder]`.
- Усередині папки — те саме.
- File — direct upload (через `@vercel/blob/client`, див. `CLAUDE.md`).
- Link — input URL + auto-detect type.
- Folder — modal з назвою.

**Open behavior:**

- Клік на File-item → відкривається inline preview pane (overlay над Files area, див. §3.7).
- Клік на ExternalLink-item → `url` відкривається в новій вкладці напряму (не через проксі — це не stored file).
- Клік на Folder-item → expand/collapse.

### §3.3 Side panel — Comments tab

**Рендерить:** Comments на бандлі, відфільтровані по anchor.

**Default view:**

- Фільтр: `open` (включно з `still-open-from-v_n`).
- Сортування: createdAt desc.
- Тоглє: показати resolved.

**Кожен Comment:**

- Avatar + ім'я автора.
- Timestamp (relative).
- Body (markdown rendered).
- Anchor-chip: "on `front.pdf v2`" / "on Stage Ескізи" / "on Decision: 'опустити талію'".
- Status-badge: `Open` / `Still open from v2` / `Resolved`.
- Actions: `Reply` / `Resolve`.

**Add comment composer:**

- Внизу панелі — sticky composer.
- Auto-anchor: до Item, виділеного у Files area; bundle-level якщо нічого не виділено; до поточної версії, якщо preview відкритий (див. нижче).
- Submit → створює Comment + ActionLogEntry (`comment-add`).

**Empty state:** "No open comments yet. Add the first one →"

**Scoped-to-preview behavior:**

Коли користувач відкриває file preview (див. §3.7), tab автоматично:

- Перемикається на Comments, якщо був на іншому.
- Додає **scope chip** у заголовку: "Comments on `{fileName}`" з версійними пілами `[all]` / `v3` / `v2` / `v1`.
- Фільтрує список до коментарів з `anchor.kind = item` (refId = fileId) АБО `anchor.kind = version` (refId in fileVersions). Default — всі версії; клік на пілу — звужує до однієї.
- Composer auto-anchor до **поточно-відображуваної версії** preview pane.

Закриття preview → scope chip знімається, повертається попередній фільтр.

### §3.4 Side panel — Decisions tab

**Рендерить:** Decisions на бандлі, відсортовані createdAt desc.

**Кожен Decision:**

- Avatar + ім'я автора + timestamp.
- Body (markdown).
- Target item chip (якщо `targetItemId` встановлено).
- Sign-off rail: список approver'ів з avatar; підписані — з ✓ + час, не підписані — світло-сірі.
- Status badge: `Proposed` / `Signed` / `Superseded`.

**Sign-off action:**

- Кнопка `Sign` видима користувачу, який є в очікуваних approver'ах для цього Decision (визначається з `Stage.approverIds`).
- Клік → додає `{approverId, at}` у `signOffs[]`; якщо всі очікувані підписали → `status = signed` + ActionLogEntry (`decision-sign`).

**Add decision composer:**

- Кнопка `+ Add decision` угорі панелі.
- Modal: body + target item picker (з Files tree) + approver picker (preselected з `Stage.approverIds`).
- На mobile — full-screen modal, оптимізований для primanting (fit-review use case).

**Fit-review mode (на mobile):**

- Сторінка автоматично переключається в режим, де Decisions tab — primary, а Files area згортається в нижню зону.
- Composer відкривається швидко з shortcut на mobile.

### §3.5 Side panel — Action Log tab

**Рендерить:** ActionLogEntry відсортовані `at desc`.

**Кожен запис:**

- Avatar actor.
- Timestamp (absolute, з hover-tooltip relative).
- Action verb + context, рендериться per kind:

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

**Фільтри (Next, не MVP):** по `kind`, по actor, по date range.

**Empty state:** "No activity yet."

### §3.6 Side panel — Members tab

**Рендерить:** Members бандла, групованих за `accessLevel`.

**Секції:**

- **Owners** — повний доступ + редагування доступу інших.
- **Editors** — редагування контенту, додавання коментарів/decision'ів.
- **Viewers** — read-only.

**Кожен Member-row:**

- Avatar + ім'я + email.
- Бейдж accessLevel.
- Action `Remove` (видима owner'у).

**Нижче — "Currently on stages" блок:**

- Список активної стадії та її assignee + approver(s).
- Read-only зріз `Stage.assigneeId` + `Stage.approverIds[]` для поточної (і наступних) стадій.
- Для зміни ролей — окремий flow (Next): "Reassign stage" → picker з Members.

**Add member action:**

- Кнопка `+ Add member` → modal з email-picker (з directory користувачів бренду) + accessLevel.
- Submit → створює Member + ActionLogEntry (`member-add`).

### §3.7 File preview pane

**Тригер:** клік на File-item у Files area (див. §3.2). Не застосовується до ExternalLink (зовнішня вкладка) і Folder (expand/collapse).

**Layout:** overlay над Files area; Stage stepper і side panel залишаються видимими. Див. ASCII у §2 ("При відкритому preview").

**Шапка preview pane:**

- `× Close` (Esc також закриває).
- Назва файла (`Item.name`).
- **Version pills**: список усіх версій файла; активна виділена. Клік перемикає рендер на іншу версію.
- Дії: `Upload new version` (видима editor'ам+), `Open in new tab` (proxy URL з `versionId`).

**Тіло preview pane (за `mimeType`):**

| Тип | Рендер |
|---|---|
| `application/pdf` | Inline PDF render через `<embed>` або `<object>` з proxy URL `/api/artifacts/{itemId}/file?version={versionId}`. |
| `image/*` (PNG, JPG, WebP) | `<img>` з proxy URL; pinch-zoom / wheel-zoom на mobile / desktop. |
| `text/html` | Inline iframe з proxy URL (sandboxed). |
| `application/vnd.openxmlformats-officedocument.*` (PPTX/DOCX/XLSX) | "Цей тип не рендериться inline. [Download] [Open in tab]". |
| AI / CLO / DXF / інше бінарне | Те саме — download CTA. |

Для невідображуваних типів preview pane **усе одно відкривається** — це поверхня для коментарів, а не тільки для перегляду.

**Side panel при preview:**

- Auto-switch на Comments tab з scope-фільтром до цього файла (див. §3.3 "Scoped-to-preview behavior").
- Decisions / Action Log / Members залишаються доступні — клік на них перемикає tab без закриття preview.

**Коментарі біля файла (primary use case):**

Олена відкриває preview на `TP_001_dress.pdf v3`, читає файл, бачить open-коментар з v2 ("опустити талію") у side panel поряд, відповідає в composer'і — новий коментар анкериться на v3. Без свопу вкладок, без копіювання посилань, без втрати контексту коментарів між версіями.

**Версійна навігація без закриття preview:**

Клік на пілу `v2` у шапці preview → тіло рендерить v2; side panel показує коментарі тієї ж самої наскрізної історії, але бейдж `still-open-from-v2` знімається на v2 (бо ми вже на ній).

**Mobile:**

На вузьких екранах preview pane розгортається на full-width; side panel переходить у bottom-sheet, який витягується вгору для коментаря. Stage stepper стає компактним (horizontal scroll).

**Закриття:**

- `× Close` у шапці.
- Esc keystroke.
- Click outside preview (на side panel? — ні, не закриває; на Stage stepper? — ні).
- Навігація на іншу сторінку.

При закритті — scope chip у Comments tab знімається, фільтр повертається до попереднього стану (bundle-wide open).

---

## §4. Перевірка проти типового потоку

Кожна стадія з `processes/typical-collection-flow.md` мапиться на цю модель без модифікацій:

| Стадія потоку | На сторінці бандла |
|---|---|
| 1. Ідея колекції | Stage 1, Items: `moodboard.pdf`, `collection_plan.xlsx`, `color_palette.pdf`. Approver: founder. |
| 2. Ескізи й вибір тканин | Stage 2, Items включно з папкою `sketches/`. Approver: creative director. |
| 3. Тех-пак | Stage 3, Items: `TP_001.pdf`, `BOM_001.xlsx`. Assignee: tech designer. Approver: head tech designer. |
| 4. Закупівля матеріалів | Stage 4, Items: PO files, budget. Approver: commercial director. |
| 5. Лекала | Stage 5, Items: `Pattern_*.dxf`. Approver: head patternmaker. |
| 6. Перший зразок | Stage 6, Items: photos zip + report. No approver (draft). |
| 7. Примірка (fitting) | Stage 7. **Decisions tab у фокусі.** Items: fit comments PDF + approved-sample reference. Approver: creative director. |
| 8. Градація розмірів | Stage 8, Items: graded patterns + size chart. Approver: head patternmaker + tech. |
| 9. Підготовка до виробництва | Stage 9, Items: marker, consumption, production order. Approver: production head. |

Стадії з кількома approver'ами (8, 9) використовують `Stage.approverIds` як масив. Стадії без approver (6) мають `approverIds = []` і transition на наступну стадію через assignee, не через sign-off.

Модель витримує всі 9 стадій без extension.
