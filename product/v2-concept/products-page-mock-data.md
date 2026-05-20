# Products Page — Mock Data

Mocked products for two collections. Workflow stages: **Brief → Design → Copy → Review → Approval → Production** (6 stages). Progress is `completed / 6`.

Viewing as: **Anna Kovalenko** (manager).

Today is **May 17, 2026**.

---

## Collection A — Spring 2026 Launch (15 products)

| # | Thumb | Name | Tags | Custom (SKU) | Stage · Status | Done | Left | Files | Comments | Deadline |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 🟦 | Pop-up Signage | retail, signage | SP26-SIGN-01 | Brief · Not started | 0 | 6 | 1 | 0 | Jun 5 |
| 2 | 🟦 | Press Kit PDF | pr, kit | SP26-PR-01 | Brief · In progress | 0 | 6 | 2 | 3 | May 28 |
| 3 | 🟪 | IG Story Set (10) | social, ig | SP26-SOC-02 | Design · In progress | 1 | 5 | 14 | 5 | May 22 |
| 4 | 🟪 | Influencer Brief Pack | pr, influencer | SP26-PR-02 | Design · In progress | 1 | 5 | 6 | 7 | May 26 |
| 5 | 🟪 | Retail Window Decals | retail, print | SP26-RET-01 | Design · In progress | 1 | 5 | 4 | 2 | May 30 |
| 6 | 🟨 | IG Carousel (6-post) | social, ig | SP26-SOC-01 | Copy · In progress | 2 | 4 | 8 | 12 | May 20 |
| 7 | 🟨 | Product Page — Cap | pdp, apparel | SP26-PDP-03 | Copy · In progress | 2 | 4 | 5 | 4 | May 21 |
| 8 | 🟧 | Product Page — Sneakers | pdp, footwear | SP26-PDP-01 | Review · Returned for rework | 3 | 3 | 9 | 17 | May 19 |
| 9 | 🟧 | Hero Landing Page | web, landing | SP26-WEB-01 | Review · In progress | 4 | 2 | 12 | 23 *(@you 2)* | May 16 *(overdue tomorrow)* |
| 10 | 🟧 | Lookbook Mini | lookbook, pdf | SP26-LB-01 | Review · In progress | 3 | 3 | 22 | 31 *(@you 1)* | May 24 |
| 11 | 🟥 | Pre-launch Teaser Email | email, crm | SP26-EM-02 | Approval · Returned for rework | 4 | 2 | 4 | 11 | May 14 *(overdue)* |
| 12 | 🟥 | Product Page — Tee | pdp, apparel | SP26-PDP-02 | Approval · In progress | 4 | 2 | 7 | 9 | May 17 *(due today)* |
| 13 | 🟩 | Launch Email | email, crm | SP26-EM-01 | Production · In progress | 5 | 1 | 6 | 8 | May 18 |
| 14 | 🟩 | OOH Poster A | ooh, print | SP26-OOH-01 | Production · In progress | 5 | 1 | 8 | 15 | May 16 *(due yesterday)* |
| 15 | 🟩 | OOH Poster B | ooh, print | SP26-OOH-02 | Production · In progress | 5 | 1 | 8 | 12 | May 16 *(due yesterday)* |

**Color legend (Stage column accent):** 🟦 Brief · 🟪 Design · 🟨 Copy · 🟧 Review · 🟥 Approval · 🟩 Production. Reference only — final treatment is the designer's call; the table just shows the spread.

**Default sort:** Progress (most-complete first → reverse the table above for that view; shown brief-first here for clarity of distribution).

---

## Collection B — Summer Capsule 2026 (10 products)

| # | Thumb | Name | Tags | Custom (SKU) | Stage · Status | Done | Left | Files | Comments | Deadline |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 🟦 | Pinterest Pin Set | social, pinterest | SU26-SOC-02 | Brief · Not started | 0 | 6 | 0 | 0 | Jul 12 |
| 2 | 🟦 | Product Page — Hat | pdp, accessories | SU26-PDP-03 | Brief · Not started | 0 | 6 | 0 | 0 | Jul 1 |
| 3 | 🟦 | Outdoor Activation Brief | event, activation | SU26-EVT-01 | Brief · In progress | 0 | 6 | 1 | 0 | Jul 10 |
| 4 | 🟦 | Product Page — Shorts | pdp, apparel | SU26-PDP-02 | Brief · In progress | 0 | 6 | 1 | 1 | Jul 2 |
| 5 | 🟦 | Hero Landing Page | web, landing | SU26-WEB-01 | Brief · In progress | 0 | 6 | 1 | 2 | Jul 5 |
| 6 | 🟦 | Product Page — Linen Shirt | pdp, apparel | SU26-PDP-01 | Brief · In progress | 0 | 6 | 1 | 0 | Jul 3 |
| 7 | 🟦 | Launch Email Series (3) | email, crm | SU26-EM-01 | Brief · In progress | 0 | 6 | 1 | 0 | Jul 8 |
| 8 | 🟪 | IG Reels Concepts | social, ig, video | SU26-SOC-01 | Design · In progress | 1 | 5 | 3 | 4 | Jul 14 |
| 9 | 🟪 | Lookbook Full | lookbook, pdf | SU26-LB-01 | Design · In progress | 1 | 5 | 8 | 6 | Jul 15 |
| 10 | 🟪 | Summer Color Story | brand, mood | SU26-BR-01 | Design · In progress | 1 | 5 | 5 | 8 | Jul 6 |

---

## Filter / sort states worth showing in the design

To make sure the page exercises all the filter/sort affordances, the mock supports these example views:

- **Filter: Stage = Review** → 3 products from Collection A (#8, #9, #10).
- **Filter: Stage = Approval** → 2 products from Collection A (#11, #12).
- **Filter: Tags = `pdp`** → 5 products in Collection A (#7, #8, #12) + Collection B (#2, #4, #6).
- **Filter: keyword = "email"** → Collection A (#11, #13), Collection B (#7).
- **Sort: Progress desc** → Production-stage products bubble to the top.
- **Sort: Name** → alphabetical across the active collection.
- **Collection switcher: A → B** → list swaps; filters persist.

## What this mock demonstrates (mapped to user stories)

| User story | Demonstrated in |
|---|---|
| List all products in active collection, sorted by progress | full Collection A / B tables |
| Per-product: name, photo, tags, custom fields, deadline, files, current stage + status, done count, left count, comments | every column in the table |
| Open comments inline, no nav | `Comments` column with `@you` callouts (#9, #10) — opens inline panel |
| Filter by stage / tags / custom fields / keyword | "Filter states" section above |
| Sort by progress / name | "Sort states" section above |
| Move product between collections | per-row action; not visualized in table |
| Switch collections | two collections (A, B) shown — both reachable via switcher |
