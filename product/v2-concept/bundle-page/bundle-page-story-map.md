# Bundle Page — User Story Map

Story map для найважливішої сторінки системи: всі посилання зі Slack / email / WhatsApp ведуть сюди. Покриває page-structure.md §8 (стандартний вигляд бандла) і §9 (fit-review режим — це окремий tab у side panel, не окрема сторінка; див. §3.4 у design reference).

**Дизайн-довідник:** [`../page-bundle-design.md`](../page-bundle-design.md) — модель сутностей, layout, per-tab specs. Цей story map посилається на номери секцій звідти замість дублювання моделі.

**Пов'язані:**
[`../vision.md`](../vision.md) ·
[`../vpc-tech-designer.md`](../vpc-tech-designer.md) ·
[`../vpc-head-of-design.md`](../vpc-head-of-design.md) ·
[`../personas/persona-marta.md`](../personas/persona-marta.md) ·
[`../personas/persona-olena.md`](../personas/persona-olena.md) ·
[`../processes/typical-collection-flow.md`](../processes/typical-collection-flow.md)

---

## Intent

Дозволити внутрішній команді бренду (з Мартою як primary daily user'ом і Оленою як головним approver'ом) скоординувати кожне рішення, версію і підпис на одному стилі — на сторінці, на яку ведуть усі outbound посилання, що замінює клаптикову систему "Drive + spreadsheets + Slack + WhatsApp". Сторінка має відповідати на питання Мартиного вівторкового ранку ("де ми зараз на 247-му?") за один погляд і не змусити її повернутись у нотатник.

## Personas

- **Марта К.** ([`personas/persona-marta.md`](../personas/persona-marta.md)) — tech designer. Primary daily user. Це її основна робоча поверхня; вона відкриває її 30+ разів на день.
- **Олена П.** ([`personas/persona-olena.md`](../personas/persona-olena.md)) — head of design. Approver на більшості стадій; на бандлі — з мобільного, між нарадами.
- **Designer** — без окремої персони. Створює ескізи на ранніх стадіях, потім менш активний.
- **Production lead** — без окремої персони. Підбирає бандл на пізніх стадіях (preparation, production).
- **Founder** — без окремої персони. Випадковий viewer; коментарі на одну-дві стадії за колекцію.

---

## Story Map

### Backbone activities (у порядку Мартиного користувацького шляху)

1. **Орієнтуватись** — відкрила URL, прочитала за 5 секунд: де ми, чий хід, що моє.
2. **Працювати з файлами** — навігація по дереву, preview, upload нової версії, додавання нового.
3. **Обговорювати** — читати і додавати коментарі, що переживають перевипуски.
4. **Приймати рішення** — структуроване захоплення з sign-off (fit-review use case).
5. **Просувати стадію** — approve / request-changes.
6. **Простежити історію** — Action Log і Members для розв'язання спорів.

### Story map

**MVP (walking skeleton — повний коло "відкрила → побачила → діяла"):**

- **US-001** ([Орієнтуватись](#us-001)) Land on bundle and see current state at a glance
- **US-002** ([Файли](#us-002)) Browse file tree grouped by stage
- **US-003** ([Файли](#us-003)) Open a file in inline preview with comments alongside
- **US-004** ([Файли](#us-004)) Upload new version of an existing file
- **US-005** ([Обговорювати](#us-005)) Add a comment that persists across versions
- **US-006** ([Рішення](#us-006)) Capture a decision with sign-off
- **US-007** ([Просувати](#us-007)) Approve stage transition
- **US-008** ([Орієнтуватись](#us-008)) Copy bundle URL to share with teammate
- **US-009** ([Орієнтуватись](#us-009)) Set and see a cover image to identify the bundle at a glance

**Next:**

- **US-101** (Файли) Add a file as external link (Techpacker / Figma / Loom URL)
- **US-102** (Файли) Add a new file from local upload to a stage
- **US-103** (Файли) Create a folder within a stage
- **US-104** (Файли) Move a file between stages or folders
- **US-105** (Файли) Rename a file or folder
- **US-106** (Обговорювати) Resolve a comment
- **US-107** (Обговорювати) Reply to a comment (threaded)
- **US-108** (Файли) View per-file version history
- **US-109** (Просувати) Request changes on a stage with a comment
- **US-110** (Простежити) Add an internal member to a bundle
- **US-111** (Простежити) Change a member's access level
- **US-112** (Простежити) Open per-bundle Action Log
- **US-113** (Обговорювати) See "still open from v_n" badge on cross-version comments
- **US-114** (Просувати) Reassign a stage's assignee or approver
- **US-115** (Орієнтуватись) Toggle Files area between "grouped by stage" and "flat sorted by recent"

**Later:**

- **US-201** (Файли) Drag-and-drop file upload from desktop
- **US-202** (Файли) Drag-and-drop to move items between folders / stages
- **US-203** (Файли) Bulk select + bulk download as ZIP
- **US-204** (Файли) Compare two versions side-by-side
- **US-205** (Обговорювати) @mention a teammate in a comment
- **US-206** (Файли) Inline annotation on PDF within preview
- **US-207** (Обговорювати) Subscribe to a specific comment thread
- **US-208** (Простежити) Filter Action Log by kind / actor / date
- **US-209** (Простежити) Export Action Log to CSV
- **US-210** (Орієнтуватись) Per-tab unread badges (Comments / Decisions / Action Log)
- **US-211** (Орієнтуватись) Keyboard shortcuts: navigate stages, open file, upload
- **US-212** (Орієнтуватись) Clone this bundle as a new style

## MVP Scope

MVP — це 9 історій, які разом дозволяють Марті виконати її типовий вівторковий ранок на одному стилі від кінця до кінця:

- Відкрила бандл з Slack-посилання (US-001) → одразу впізнала "navy blazer" по cover image в шапці (US-009), побачила, що ми на стадії "Тех-пак", вона assignee, Олена approver, файл TP_001.pdf на v2.
- Знайшла потрібний файл у дереві (US-002) → відкрила inline preview (US-003) → одразу побачила в side panel поряд: "Олена on v2: cuff width needs 6.5cm" + "still open from v2".
- Завантажила v3 з її правками (US-004) → у preview переключилася на v3 → composer auto-анкериться на v3, відповіла "fixed in v3" (US-005). Коментар з v2 залишається open зі статусом "still open from v2".
- На fit-review у четвер опускали талію — записала рішення з sign-off Олени (US-006).
- Олена відкрила з телефона і підписала стадію (US-007).
- Скопіювала URL і кинула в WhatsApp фабрики (US-008).

Цей цикл = bench-тест прийняття з [`vpc-tech-designer.md`](../vpc-tech-designer.md) §0, кроки 1-4 (крок 0 і 3 на інших сторінках — Worklist і Handoff composer).

Pillars з [`vision.md`](../vision.md) під покриттям MVP:

- **Pillar 1** (bundle is the main thing tracked) — US-001, US-002, US-003.
- **Pillar 2** (stages with specific approver) — US-001, US-007.
- **Pillar 3** (comments persist across versions) — US-003, US-005.
- **MCP loop (pillar 6)** — не на цій сторінці; MCP — окрема поверхня.

Pains з персон, які MVP знеболює:

- Марта pain #1 (реконструкція рішень) → US-006 (decision capture з sign-off).
- Марта pain #2 ("Олена це затвердила?") → US-001 (stage stepper показує approver).
- Марта pain #3 (яку версію фабрика різе) → US-004 + US-008 (одна актуальна версія, посилання веде на неї).
- Марта pain #4 (founder коментує застарілі версії) → US-003 + US-005 (persistent коментарі поряд з preview, посилання завжди на актуальну).
- Олена pain #1 (рішення fit review гинуть до понеділка) → US-006.
- Олена pain #3 ("це затверджено?" 15 хв) → US-001.

---

## MVP Stories

### US-001

#### Land on bundle and see current state at a glance

**As** Марта (tech designer),
**I want** to open the bundle URL and immediately see which stage is active, who is assigned, who needs to approve, and the time spent in stage,
**So that** I can answer "where is style 247 right now and what's mine?" in under 5 seconds without opening Slack, email, or asking Олена.

**Бере участь:** Bundle, Stage (всі поля), Member (через Stage.assigneeId / approverIds), див. design-reference §1.

#### Acceptance Criteria

##### Scenario: Bundle URL opens directly to active stage

- **Given** a Bundle with 5 Stages, where `Stage[3].status = active`
- **When** Марта opens `/bundles/{id}`
- **Then** the Stage stepper highlights Stage 3 with the "active" indicator
- **And** the Files area scrolls to and expands Stage 3's section
- **And** the side panel defaults to the Comments tab filtered on "open"

##### Scenario: Active-stage badge shows assignee and approver

- **Given** `Stage[3].assigneeId = Марта` and `Stage[3].approverIds = [Олена]`
- **When** Марта views the Stage stepper
- **Then** Stage 3's expanded card displays "Assignee: Марта" with her avatar
- **And** displays "Approver: Олена" with her avatar
- **And** displays "3 days in stage" (computed from `Stage.enteredAt`)

##### Scenario: Marta is not the assignee on the active stage

- **Given** `Stage[3].assigneeId = Designer-John` (not Марта) and Марта is a Member with `accessLevel = editor`
- **When** Марта opens the bundle
- **Then** the Stage 3 card shows John as assignee
- **And** the Approve / Request-changes buttons are hidden (Марта not in `approverIds`)
- **But** the file tree, side-panel tabs, and comment composer are fully accessible

##### Scenario: Bundle on a stage with multiple approvers

- **Given** `Stage[3].approverIds = [Олена, Head-Patternmaker]`
- **When** the Stage stepper renders
- **Then** the active stage shows both approver avatars side-by-side
- **And** a tooltip lists both names on hover

---

### US-002

#### Browse file tree grouped by stage

**As** Марта (tech designer),
**I want** to see all files of the bundle grouped by their stage, with folders expandable and external links inline,
**So that** I can find the correct file ("the tech-pack at the current stage", "last week's fit-comments PDF") without remembering folder paths.

**Бере участь:** Item (Folder / File / ExternalLink, single table з discriminator), Version (для current-version chip), Stage (для grouping). Див. design-reference §3.2.

#### Acceptance Criteria

##### Scenario: Items render grouped by stage in workflow order

- **Given** a Bundle with 9 Stages and Items distributed across them via `Item.stageId`
- **When** the Files area renders
- **Then** the area shows 9 collapsible stage sections in `Stage.position` order
- **And** the active stage is expanded by default; others are collapsed
- **And** within each stage, items render in `Item.position` order

##### Scenario: Folder expands to reveal nested files

- **Given** Stage 2 has a Folder Item "sketches/" with three child File Items
- **When** Марта clicks the chevron on "sketches/"
- **Then** the folder expands to show the three child files indented under it
- **And** each child file shows its current version chip (e.g., `v1`) and last-update relative time

##### Scenario: External link is rendered inline alongside files

- **Given** Stage 2 contains a File `fabric_swatches.xlsx` and an ExternalLink to a Figma board with `linkType = figma`
- **When** the stage section renders
- **Then** both items appear in the same list
- **And** the ExternalLink shows a Figma icon and the link title (not the raw URL)
- **And** the File shows an XLSX icon and the `v_n` version chip

##### Scenario: Stage with zero items shows empty state

- **Given** Stage 6 (`Перший зразок`) has no items yet
- **When** Stage 6 expands
- **Then** the section displays "No files yet · [+ Add file / link / folder]"

---

### US-003

#### Open a file in inline preview with comments alongside

**As** Марта (tech designer),
**I want** to click a file and have an inline preview open over the Files area with the Comments tab auto-scoped to that file's open feedback,
**So that** I can read the file and respond to Олена's comments in the same view — instead of jumping between a new tab, the file tree, and a re-anchored composer.

**Бере участь:** Item (File), Version (active version + version pills), Comment (scope filter за `anchor`), proxy route `/api/artifacts/[id]/file` (CLAUDE.md §Artifact rendering). Див. design-reference §3.7 + §3.3 "Scoped-to-preview behavior".

#### Acceptance Criteria

##### Scenario: PDF opens inline preview with Comments scoped to file

- **Given** `TP_001_dress.pdf` is a File Item at v3 with 2 open comments anchored to v2 and 1 anchored to v3
- **When** Марта clicks the file in the tree
- **Then** the preview pane opens over the Files area
- **And** the PDF v3 renders inline via `/api/artifacts/{itemId}/file?version={v3.id}` (raw Blob URL not exposed)
- **And** the side panel auto-switches to the Comments tab
- **And** the Comments list filters to only the 3 comments on this file (across versions); the 2 v2-anchored comments show "still open from v2"
- **And** Stage stepper remains sticky at the top of the page

##### Scenario: Switch versions within the preview

- **Given** preview is open on `TP_001_dress.pdf v3`
- **When** Марта clicks the `v2` pill in the preview header
- **Then** the preview body re-renders v2 (different `versionId` in proxy URL)
- **And** the Comments tab scope chip stays on this file across versions
- **And** the 2 v2-anchored comments now show as plain "Open" (no "still open from v2" badge — we are viewing v2)
- **And** the composer auto-anchor updates to v2

##### Scenario: Non-previewable file opens preview shell with download CTA

- **Given** `BOM_001.xlsx` is a File Item (`mimeType = application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)
- **When** Марта clicks it
- **Then** the preview pane still opens
- **But** the body shows "Цей тип не рендериться inline. [Download] [Open in tab]" instead of rendered content
- **And** the side panel still auto-scopes Comments to this file (so Марта can comment without downloading)

##### Scenario: Close preview returns to Files area

- **Given** preview is open on any file
- **When** Марта clicks `× Close` or hits Esc
- **Then** preview pane closes
- **And** the Files area is visible again with its prior scroll position and group/expand state
- **And** the Comments tab scope filter clears (returns to "all open on bundle")

---

### US-004

#### Upload new version of an existing file

**As** Марта (tech designer),
**I want** to upload v_{n+1} of an existing file from a row-level action, with the previous version preserved and the new version becoming current,
**So that** every collaborator who opens the link gets the latest cut while v_{n} stays intact for history and unresolved comments.

**Бере участь:** Item (File), Version (new row inserted, immutable), Item.currentVersionId pointer flip, ActionLogEntry (`version-upload`). Upload через `@vercel/blob/client` direct, потім Server Action для DB commit (CLAUDE.md §File storage).

#### Acceptance Criteria

##### Scenario: Upload increments sequence and flips current pointer

- **Given** File Item `TP_001_dress.pdf` has Version v1 (sequence=1) and v2 (sequence=2), currentVersionId = v2.id
- **When** Марта clicks the file's "Upload new version" action and selects a PDF from disk
- **Then** a new Version with `sequence = 3` is created
- **And** `Item.currentVersionId` updates to v3.id
- **And** the file row shows the `v3` chip + relative timestamp "just now"
- **And** v1 and v2 remain in storage (not deleted), accessible from history (US-108 — Next)

##### Scenario: Upload generates Action Log entry

- **Given** the same setup
- **When** the upload completes
- **Then** a new `ActionLogEntry` is created with `kind = version-upload`, `actorId = Марта.userId`, and payload containing `{ itemId, versionId, sequence: 3 }`
- **And** the entry appears at the top of the Action Log tab

##### Scenario: Upload preserves cross-version comments

- **Given** there is an unresolved Comment anchored to v2 of `TP_001_dress.pdf`
- **When** v3 is uploaded
- **Then** the Comment remains visible in the Comments tab
- **And** its `crossVersionState` updates to `still-open-from-v2`

##### Scenario: Upload fails on permission denial

- **Given** Марта has `Member.accessLevel = viewer` on the bundle
- **When** she attempts to upload a new version
- **Then** the "Upload new version" action is hidden in the UI
- **And** if a direct API call is made anyway, the server returns 403 with no DB write

---

### US-005

#### Add a comment that persists across versions

**As** Олена (head of design),
**I want** to leave a comment on a specific file/version and have it stay visible after the author uploads the next version, with a "still open from v2" marker until I resolve it,
**So that** my feedback isn't silently lost when Марта uploads v3, and I stop having to re-explain the same point twice.

**Бере участь:** Comment (`anchor.kind = version`, `crossVersionState`), Item (File), Version, ActionLogEntry (`comment-add`). Див. design-reference §3.3.

#### Acceptance Criteria

##### Scenario: Comment created against a specific version is anchored to that version

- **Given** `TP_001_dress.pdf` is at v2; Олена opens the file in preview (US-003) so the version pill `v2` is active
- **When** Олена types "the cuff width needs to be 6.5cm, not 6cm" and submits in the Comments composer
- **Then** a Comment is created with `anchor = { kind: 'version', refId: v2.id }`, `authorId = Олена.userId`, and `body` containing the text
- **And** the comment appears in the Comments tab with `crossVersionState = open`
- **And** an anchor chip on the comment reads "on TP_001_dress.pdf v2"

##### Scenario: Comment persists with "still open from v2" badge after new version

- **Given** the open Comment above on v2 of `TP_001_dress.pdf`
- **When** Марта uploads v3 of the same file (per US-004)
- **Then** the Comment remains in the open list in the Comments tab
- **And** the status badge updates from "Open" to "Still open from v2"
- **And** the anchor chip still references v2

##### Scenario: Comment composer auto-anchors to previewed or selected file

- **Given** Олена either has `front.pdf` open in preview, OR has it single-click-selected in the Files area
- **When** she focuses the Comments composer and submits text
- **Then** if preview is open, the new Comment is anchored to the currently-displayed version of `front.pdf`
- **And** if `front.pdf` is selected without preview, the comment is anchored to its current version
- **And** if nothing is previewed or selected, the comment is anchored to the bundle itself

##### Scenario: Comment renders markdown safely

- **Given** Олена's comment body contains `**bold**` and a link `[review](https://example.com)`
- **When** the comment renders in the tab
- **Then** "bold" appears bold-styled and "review" is a clickable link
- **And** any embedded raw HTML / script tags are escaped (XSS guard)

---

### US-006

#### Capture a decision with sign-off

**As** Марта (tech designer),
**I want** to capture a structured decision during the Thursday fit review on my phone — body + target file + approver pick — and have Олена sign it off in-room with one tap,
**So that** by Friday morning the decision is a referenceable artifact with author, timestamp, and approval, not a notebook scribble + 60 photos that I reconstruct on Tuesday.

**Бере участь:** Decision (entity), Stage (для `stageId`), Item (опційно — `targetItemId`), ActionLogEntry (`decision-sign`). Див. design-reference §3.4.

#### Acceptance Criteria

##### Scenario: Decision created on the active stage with target item

- **Given** the bundle is on Stage 7 (Примірка); Марта has the Decisions tab open on mobile
- **When** she taps "+ Add decision", enters body "опустити талію на 2 см", picks target item `TP_001_dress.pdf` and approver Олена, and submits
- **Then** a Decision is created with `stageId = Stage[7].id`, `authorId = Марта.userId`, `body = "опустити талію на 2 см"`, `targetItemId = TP_001_dress.id`, `signOffs = []`, `status = proposed`
- **And** the decision appears at the top of the Decisions tab with status badge "Proposed"
- **And** the approver row shows Олена's avatar in greyed-out state (not signed yet)

##### Scenario: Approver signs the decision in-room

- **Given** the Decision above in `status = proposed` and Олена in `approverIds` (matches Stage[7].approverIds)
- **When** Олена opens the bundle on her phone, taps the Decision, and taps "Sign"
- **Then** `signOffs` gets `{ approverId: Олена.userId, at: <now> }` appended
- **And** `status` updates to `signed` (only one approver expected for this stage)
- **And** Олена's avatar in the sign-off row flips to ✓ with timestamp
- **And** a new ActionLogEntry with `kind = decision-sign` is created

##### Scenario: Multi-approver decision stays "proposed" until all sign

- **Given** Stage[7].approverIds = [Олена, Creative-Director]; one Decision is `proposed`
- **When** only Олена has signed
- **Then** `status` remains `proposed`
- **And** Creative-Director's row shows greyed avatar
- **When** Creative-Director also signs
- **Then** `status` updates to `signed`

##### Scenario: Decision targeting is optional

- **Given** Марта creates a Decision without picking a target item ("we agreed sleeve construction stays as-is")
- **When** she submits
- **Then** `targetItemId` is null
- **And** the Decision renders without a target-item chip but is otherwise complete

---

### US-007

#### Approve stage transition

**As** Олена (head of design),
**I want** to approve the active stage from the bundle page with one tap (or one click), with all sign-offs and the current set of items locked in as the stage record,
**So that** the bundle moves to the next stage without me opening Slack to message Марта "ok approved" — and the timestamp + my name are on the record.

**Бере участь:** Stage (transition `active → passed`), наступна Stage (transition `pending → active`), Bundle.currentStageId (flip), ActionLogEntry (`stage-transition`). Permission gate: викликач має бути в `Stage.approverIds`.

#### Acceptance Criteria

##### Scenario: Single-approver stage advances on click

- **Given** Stage[3] is `active`, `approverIds = [Олена]`, all stage-related decisions are `signed` or absent
- **When** Олена clicks "Approve" on the Stage 3 expanded card
- **Then** `Stage[3].status = passed`, `Stage[3].passedAt = <now>`
- **And** `Stage[4].status = active`, `Stage[4].enteredAt = <now>`
- **And** `Bundle.currentStageId = Stage[4].id`
- **And** Stage stepper visually reflows: ✓ on 3, ► on 4
- **And** ActionLogEntry with `kind = stage-transition` payload `{ from: 3, to: 4, by: Олена }` is created

##### Scenario: Multi-approver stage requires all approvers

- **Given** Stage[3].approverIds = [Олена, Head-Patternmaker]
- **When** Олена alone clicks "Approve"
- **Then** her approval is recorded but `Stage[3].status` stays `active`
- **And** the Stage card shows "1 of 2 approvers signed"
- **When** Head-Patternmaker also approves
- **Then** the transition happens as in the single-approver scenario

##### Scenario: Non-approver cannot approve

- **Given** Марта has `Member.accessLevel = editor` but is not in `Stage[3].approverIds`
- **When** Марта views the active Stage 3 card
- **Then** the "Approve" / "Request changes" buttons are not rendered
- **And** if she sends a direct API request to approve, the server responds 403

##### Scenario: Final-stage approval marks bundle as completed (no next stage)

- **Given** Stage[9] is `active` and is the last stage in `Stage.position` order
- **When** Олена approves Stage 9
- **Then** `Stage[9].status = passed`
- **And** `Bundle.currentStageId` becomes null (or stays on Stage[9] — pick one — for now: stays on 9, with bundle-level "complete" flag in Next)
- **And** the Stage stepper shows all stages as ✓

---

### US-008

#### Copy bundle URL to share with teammate

**As** Марта (tech designer),
**I want** a one-click action that copies the canonical bundle URL to my clipboard from the bundle page itself, with a confirmation toast,
**So that** I can paste it into the factory's WhatsApp in under 5 seconds instead of fishing the URL out of the address bar or hunting it down.

**Бере участь:** Bundle URL (page route). Це найдрібніша MVP-історія, але вона закриває крок "send to factory" з bench-acceptance §0 (vpc-tech-designer).

#### Acceptance Criteria

##### Scenario: One-click copy from header action

- **Given** Марта has the bundle page open
- **When** she clicks the "Copy link" button in the page header
- **Then** the canonical URL `https://app.midpack.app/bundles/{id}` is written to the clipboard
- **And** a toast appears with text "Bundle URL copied" for 2 seconds

##### Scenario: Copied URL opens to the same bundle for an authorized viewer

- **Given** Олена receives the URL via WhatsApp and clicks it on her phone
- **And** Олена is a `Member` on the bundle
- **When** the URL loads
- **Then** the bundle page renders identically for Олена (auth check via Google OAuth)
- **And** she lands on the same active stage as Марта (because state is per-bundle, not per-user)

##### Scenario: URL is not the raw Blob URL

- **Given** Марта uses "Copy link"
- **When** the URL is copied
- **Then** the URL is the bundle page route (`/bundles/{id}`), not a `https://...vercel-storage.com/...` raw Blob URL
- **And** anyone opening it without auth hits the sign-in page, not file contents

##### Scenario: Unauthorized recipient is gated at sign-in

- **Given** Марта shares the bundle URL with a random outsider (not a Member)
- **When** the outsider opens the URL
- **Then** they are redirected to `/auth/sign-in`
- **And** after sign-in via Google, they see a 403 page ("You don't have access to this bundle. Ask the bundle owner.")

---

### US-009

#### Set and see a cover image to identify the bundle at a glance

**As** Марта (tech designer),
**I want** to set any image file in the bundle as its cover and have it render as a thumbnail in the page header,
**So that** anyone who opens the bundle from a Slack/WhatsApp link instantly recognizes which style it is — instead of reading the title or opening a file to remember "ah, the navy blazer".

**Бере участь:** Bundle (новий `coverImageId` FK → Item?), Item (`type = file`, `mimeType = image/*`), Version (current of the linked item), ActionLogEntry (`cover-set`). Див. design-reference §1 Bundle + §3.0 Page header.

#### Acceptance Criteria

##### Scenario: Cover image renders in header when set

- **Given** Bundle has `coverImageId` pointing to Item `front_navy_blazer.jpg` (image File)
- **When** Марта opens the bundle page
- **Then** the page header shows a 64×64 thumbnail next to the bundle title
- **And** the thumbnail renders via `/api/artifacts/{coverImageId}/file` (resolving to the linked Item's current version)
- **And** clicking the thumbnail opens the image in preview pane (US-003)

##### Scenario: Bundle without cover shows placeholder

- **Given** `Bundle.coverImageId` is null
- **When** Марта opens the page
- **Then** the header shows a gradient placeholder with the first letter of `Bundle.title`
- **And** a `Set cover image` action is visible to editors+ via the placeholder hover-menu

##### Scenario: Set an existing image as cover from Files area

- **Given** the bundle has image File `front_navy_blazer.jpg` in Stage 2
- **When** Марта hovers over the file in the Files tree and clicks `Set as cover`
- **Then** `Bundle.coverImageId` updates to that Item's id
- **And** the header thumbnail refreshes immediately
- **And** an `ActionLogEntry` with `kind = cover-set`, payload `{ itemId }` is created

##### Scenario: Set-as-cover action hidden for non-image types

- **Given** the bundle has `TP_001_dress.pdf` (`mimeType = application/pdf`)
- **When** Марта hovers over the PDF
- **Then** `Set as cover` is NOT in the hover-actions
- **And** the same constraint applies to other non-image types (xlsx, docx, dxf, ai, dwg)

##### Scenario: Cover follows underlying image's new version automatically

- **Given** `front_navy_blazer.jpg` is set as bundle cover; current version is v1
- **When** Марта uploads v2 of the same image (per US-004)
- **Then** the header thumbnail reflects v2 on next page render (FK points to Item, not Version)
- **And** no extra `cover-set` ActionLogEntry is generated (just `version-upload`)

---

## Next stories (one-liners)

| ID | Backbone | Story |
|---|---|---|
| US-101 | Файли | As a tech designer, I want to add a Techpacker/Figma/Loom URL as a bundle item, so that live-documents in external tools sit alongside binary files. |
| US-102 | Файли | As a tech designer, I want to add a new local file (not a new version) to a specific stage, so that I can introduce a file type that wasn't in the bundle yet. |
| US-103 | Файли | As a tech designer, I want to create a folder within a stage, so that I can group related sub-files (e.g., `sketches/`) without polluting the stage's root. |
| US-104 | Файли | As a tech designer, I want to move a file between stages or folders, so that misclassified items can be corrected without re-uploading. |
| US-105 | Файли | As a tech designer, I want to rename a file or folder, so that I can clean up names without breaking the bundle URL or version chain. |
| US-106 | Обговорювати | As a head of design, I want to mark a comment resolved, so that addressed feedback drops from the open-comments view but stays in history. |
| US-107 | Обговорювати | As a designer, I want to reply to a comment in a thread, so that follow-up clarification stays connected to the original point. |
| US-108 | Файли | As a tech designer, I want to view the full version history of a file with author/timestamp/note per version, so that I can audit "who uploaded v5 and why" without opening Action Log. |
| US-109 | Просувати | As a head of design, I want to "Request changes" instead of "Approve" with a required comment, so that I can block stage transition with a clear ask. |
| US-110 | Простежити | As a head of design, I want to add an internal teammate to a bundle, so that someone who needs read or edit access gets it without going through Settings. |
| US-111 | Простежити | As an owner, I want to change a member's access level (viewer → editor or vice versa), so that role mistakes from invitation can be corrected. |
| US-112 | Простежити | As a head of design, I want to open the per-bundle Action Log tab and see the chronological feed of every event, so that I can resolve disputes without opening Slack. |
| US-113 | Обговорювати | As a tech designer, I want to see the "still open from v2" lineage on cross-version comments expanded into "originally posted on v2, last touched on v4", so that I know how long a comment has been outstanding. |
| US-114 | Просувати | As a head of design, I want to reassign a stage's assignee or change its approver list, so that team rotation or absences don't block the bundle. |
| US-115 | Орієнтуватись | As a tech designer, I want to toggle the Files area between "grouped by stage" and "flat sorted by recent / name / type", so that I can audit all current files at a glance without scrolling through nine stage sections (and so that onboarding a teammate doesn't require explaining the stage layout). |

## Later stories (one-liners)

| ID | Backbone | Story |
|---|---|---|
| US-201 | Файли | As a tech designer, I want to drag-and-drop a file from my desktop into a stage section, so that uploads don't require clicking through a file picker. |
| US-202 | Файли | As a tech designer, I want to drag-and-drop items between folders / stages, so that reorganization is faster than the right-click "Move" action. |
| US-203 | Файли | As a tech designer, I want to bulk-select multiple files and download them as a ZIP, so that handing off a stage's full contents takes one action. |
| US-204 | Файли | As a head of design, I want to compare two versions of a file side-by-side in the preview pane, so that I can see what changed without alternating windows. |
| US-205 | Обговорювати | As a designer, I want to @mention a teammate in a comment, so that they get a notification instead of me Slack-pinging them separately. |
| US-206 | Файли | As a head of design, I want to draw inline annotations on a PDF preview (boxes, arrows, sticky notes), so that visual feedback lives with the file instead of in WhatsApp screenshots. |
| US-207 | Обговорювати | As a tech designer, I want to subscribe to a specific comment thread, so that I get notified of replies even when I'm not the original author. |
| US-208 | Простежити | As a head of design, I want to filter the Action Log by event kind, actor, or date range, so that finding "who changed the assignee last Thursday" is one filter, not a scroll. |
| US-209 | Простежити | As a head of design, I want to export the bundle's Action Log to CSV, so that I can attach it to a board report or post-mortem write-up. |
| US-210 | Орієнтуватись | As a tech designer, I want unread badges on Comments / Decisions / Action Log tabs, so that I know which tab has activity I haven't seen. |
| US-211 | Орієнтуватись | As a tech designer, I want keyboard shortcuts to navigate between stages, open the file preview, and start a new version upload, so that common actions don't need a mouse round-trip. |
| US-212 | Орієнтуватись | As a head of design, I want to clone an existing bundle into a new style with the same workflow template + a fresh file tree, so that style #2 reuses style #1's structure without re-config. |

---

## Verification

- **Coverage of typical-collection-flow.md** — кожна з 9 стадій з `processes/typical-collection-flow.md` (Ідея → Ескізи → Тех-пак → ... → Підготовка до виробництва) рендериться як Stage у стіпері, з Items під своєю стадією. Reviewer-та-approver моделі (наприклад, "Stage 8 має двох approver'ів") покривається multi-approver scenario в US-007. ✓
- **Bench-тест прийняття з vpc-tech-designer §0** — кроки 1-4 покриваються MVP історіями (крок 1 → US-001, крок 2 → US-006, крок 3 → US-008, крок 4 → US-001 stage stepper). Крок 0 (worklist як перший екран) — не на цій сторінці; крок 3 в повному вигляді (handoff packet) — окрема сторінка (page-structure §10). ✓
- **Pillars vision.md** — MVP покриває pillars 1-3 (bundle as main thing tracked, stages with named approver, comments persist across versions). Pillars 4-6 — поза цією сторінкою (зовнішні invites — §10-12 page-structure; transit storage — §3 Settings; MCP — окрема поверхня). ✓
- **Entity model consistency** — кожна MVP історія G/W/T згадує сутності з `page-bundle-design.md` §1, з посиланням на конкретні поля (Stage.assigneeId, Item.currentVersionId, Comment.anchor, Decision.signOffs, тощо). Не testable, якщо немає сутності — інакше це signal, що модель не повна.
