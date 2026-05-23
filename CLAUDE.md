# midpack-web

Frontend for **Midpack** — a workflow tool where each product is a bundle of files moving through approver-gated stages. Read [`product/vision.md`](./product/vision.md) for the product thesis and [`product/page-structure.md`](./product/page-structure.md) for the page inventory and user stories. Page-level designs live under [`product/v2-concept/`](./product/v2-concept/) and [`product/specs/`](./product/specs/).

The `/product` directory is the source of truth for *what* to build. This file is the source of truth for *how* to build it.

## Two-stage plan

This repo serves two stages of work. Always know which one you're in before making decisions.

### Stage 1 — UI prototype (current)

Goal: a clickable demo of the product UI, running locally, with no backend — but with **realistic async behavior** so loading, empty, and error states are designed for, not skipped.

- **All API calls are real `fetch` calls**, intercepted by [MSW](https://mswjs.io/) (Mock Service Worker). The app code makes real HTTP requests; MSW answers them with mock data.
- Mock REST handlers live in `src/mocks/handlers/`, one file per resource (e.g. `bundles.ts`, `users.ts`). The handlers *are* the API contract for stage 2.
- In-memory data behind the handlers lives in `src/mocks/data/` and is mutated by `POST`/`PATCH`/`DELETE` handlers. State resets on full page reload — that's fine for the demo.
- Components use TanStack Query (`useQuery` / `useMutation`) through per-resource hooks. Loading / error / empty states are designed from day one against the briefs in `product/v2-concept/`.
- Routing is real (Next.js App Router) so URLs match `product/page-structure.md`. Auth pages render but the handler accepts any input and MSW returns a fake session.
- Don't fake polish where the brief is specific. Do simulate latency / errors when the brief calls them out.

### Stage 2 — Real frontend (future)

Goal: same UI, wired to a real backend with auth, REST API, and persistence.

- **Disable MSW and point the API client base URL at the real backend.** Components, hooks, the API client, and the QueryClient configuration do not change.
- The handlers in `src/mocks/handlers/` are the spec for the backend team — endpoints, request/response shapes, status codes.
- Auth (Google OAuth per `product/page-structure.md` §2) and the MCP server land here.

**Implication for any code you write:** the seam between stages is the network. Code above the seam (components, hooks, API client, QueryClient) is identical in both stages. Code below the seam (MSW handlers, in-memory data) is deleted in stage 2. **Never import from `src/mocks/` outside `src/mocks/` itself** — doing so leaks stage-1 internals above the seam and creates migration tax.

## Tech stack

- **Next.js (App Router)** — framework. Handles routing, middleware (pin-code handoff URLs, auth gating in stage 2), and API routes / server actions when stage 2 needs them.
- **Turbopack** — Next.js's built-in dev bundler. Used for `next dev` and `next build`.
- **Tailwind CSS** — styling. No CSS modules, no styled-components, no inline `style={{ ... }}` except for truly dynamic values (e.g. computed widths).
- **shadcn/ui** — component primitives. Components are *copied* into `src/components/ui/` via the shadcn CLI, not installed as a dependency. Edit them freely. Compose product-specific components on top in `src/components/`.
- **TanStack Query** (`@tanstack/react-query`) — server-state cache. Every data read/write goes through `useQuery` / `useMutation` via a per-resource hook. Owns loading, error, refetch, optimistic updates, cache invalidation.
- **MSW** (`msw`) — request interception in stage 1. Runs in the browser (and Node, for SSR / route handlers). Removed in stage 2.
- **TypeScript** — strict mode. No `any` without a comment explaining why.
- **lucide-react** — icons (shadcn default).

Available tooling via skills: `vercel:shadcn`, `vercel:nextjs`, `vercel:turbopack`. Use them when relevant.

## Data architecture

The data flow in both stages is identical above the network seam:

```
Component
  └─ useBundle(id)                       ← per-resource hook (src/hooks/)
       └─ useQuery(['bundle', id], …)    ← TanStack Query
            └─ apiGet(`/bundles/${id}`)  ← thin fetch client (src/lib/api/)
                 │
                 ▼   ───── network seam ─────
                 │
   ┌─────────── stage 1 ───────────┐   ┌──────── stage 2 ────────┐
   │ MSW handler in                │   │ Real backend            │
   │ src/mocks/handlers/bundles.ts │   │ (REST API + auth)       │
   │ reads/writes                  │   └─────────────────────────┘
   │ src/mocks/data/bundles.ts     │
   └───────────────────────────────┘
```

**Above the seam (stays in stage 2):**

- **Components** import hooks. They don't call `fetch` and don't know the URL pattern.
- **Hooks** (`src/hooks/`) wrap `useQuery` / `useMutation` per resource. One file per resource (`useBundles.ts`, `useBundle.ts`, `useUpdateBundle.ts`). They own query keys and invalidation.
- **API client** (`src/lib/api/`) is a thin `fetch` wrapper: base URL, JSON parse, error → throw. Nothing smart. No interceptors that mock things.
- **QueryClient** is configured once in `src/lib/query-client.ts` and provided at the app root.

**Below the seam (deleted in stage 2):**

- **MSW handlers** in `src/mocks/handlers/` answer the same URL patterns the real backend will. They read and mutate in-memory data.
- **In-memory data** in `src/mocks/data/` is the stage-1 "database." Seeded on app start, reset on full page reload.
- **MSW setup** lives in `src/mocks/browser.ts` (worker for the browser) and `src/mocks/server.ts` (Node, for SSR). Wired in once, near the app root.

**Rules this implies:**

- A component calling `fetch` directly is a bug. Use a hook.
- A hook reading from `src/mocks/` is a bug. Hooks only know about the API client.
- A handler in `src/mocks/handlers/` returning a shape that won't match the eventual REST API is a bug — it makes the contract a lie. If you're unsure of the real shape, write the handler the way the backend *should* respond; that becomes the spec.
- `src/mocks/` may import from itself and from `src/lib/api/` types only. Nothing else imports from `src/mocks/`.

### Mock data conventions

When adding a new resource:

- **One file per resource.** Data lives in `src/mocks/data/<resource>.ts`; handlers in `src/mocks/handlers/<resource>.ts`. `handlers/index.ts` combines them.
- **Each data file exports an `ARRAY` and a `byId` Map.** Handlers do `byId.get(params.id)` for single-record lookups (O(1)) and `ARRAY.filter(...)` for list endpoints.
- **Hybrid normalized shape.** Top-level entities (`collections`, `products`, `people`, `comments`, `activity`) are their own files with FK references. "Owned" 1-to-many data that's never shared lives inline on the parent: `Product.stages`, `Product.tags`, `Product.customFields`. Cross-cutting data (activity feeds, comments, files) gets its own file + FK back to the owner. This matches the eventual SQL backend — don't fold cross-cutting data into the parent record.
- **Branded IDs.** Every entity ID is a branded string (`ProductId`, `CollectionId`, `CommentId`, ...). Cast literal IDs at the seed site: `"prod-247" as ProductId`. The compiler will reject passing a `CollectionId` to something expecting a `ProductId` — that catch is the whole reason.
- **Dates are ISO 8601 strings, not `Date` objects.** That's what JSON-over-HTTP returns, and it keeps the seam honest.
- **Comment/activity body strings carry inline tokens.** Mentions are `@<personId>`, stage refs are `#stage:<n>`, file refs are `[file:<name>@<version>]`. The renderer parses these. Don't denormalize the body into a token array — the eventual backend will store text and the frontend will parse it the same way.

## Project layout

```
src/
  app/                        Next.js App Router routes. File structure mirrors URLs in product/page-structure.md.
  components/
    ui/                       shadcn primitives (generated via `shadcn add`). Don't hand-edit; they're themed via the token aliases at the bottom of globals.css.
    ds/                       Midpack design system components composed from shadcn primitives. The handoff under `design_handoff_ig_studio_ds/` is the visual source of truth; the `/components` route is the live reference.
    <feature>/                Product components composed from ds + ui primitives.
  hooks/                      Per-resource hooks wrapping useQuery / useMutation. useBundle, useBundles, useUpdateBundle, useCurrentUser.
  lib/
    api/                      Thin fetch client. apiGet/apiPost/apiPatch/apiDelete + shared types.
    query-client.ts           Singleton TanStack QueryClient + <QueryClientProvider> wiring.
  mocks/                      Stage-1 only. Deleted in stage 2.
    handlers/                 MSW handlers, one file per resource.
    data/                     In-memory data the handlers read/write.
    browser.ts                MSW worker setup (browser).
    server.ts                 MSW server setup (Node / SSR).
    seed.ts                   Initial fixtures loaded into data/ on app start.
product/                      Product docs. Read-only from code's perspective.
```

Don't create directories not in this layout without reason. Don't add a `pages/` directory — App Router only.

## Conventions

- **The API client stays thin.** `src/lib/api/` is just `fetch` + JSON + error throwing. No retry logic, no auth headers, no interceptors in stage 1. Those land in stage 2 when there's a real auth flow to plug in.
- **No backwards-compat shims between stage 1 and stage 2.** Stage 2 deletes `src/mocks/`; it doesn't keep MSW behind a feature flag. The handlers' job is to make this deletion safe, not to ship.
- **Handlers should look like the real API will.** Use the URL shape, HTTP methods, status codes, and JSON shape you'd want the backend to expose. If the backend later disagrees, that's a contract discussion — not a "the mock was lying" cleanup.
- **Loading / error / empty states are first-class.** Every page that uses `useQuery` has to render all three. If the brief doesn't specify them, follow shadcn conventions (`<Skeleton>`, inline error with retry, empty-state component) and flag the gap.
- **Pages match `product/page-structure.md` URLs.** If you're adding a route, confirm the URL is one the doc lists. If it isn't, surface that — the page inventory is deliberate.
- **Match the briefs.** When implementing a page that has a brief in `product/v2-concept/` or `product/specs/`, the brief wins over your own design instinct. Surface conflicts; don't silently diverge.
- **No emojis in code or commits** unless the design brief explicitly calls for one.
- **Comments only where the *why* is non-obvious.** Don't annotate what `useBundle` does — its name is enough. Do annotate "this prop is here because the brief explicitly calls out behavior X."
- **URLs vs. resource names.** Routes live at `/products` and `/products/[id]` (the user-facing noun is "product"). The resource type in code stays `bundle` (`useBundle`, `bundles.ts` handler, etc.) per the data model. Don't unify them — the split is deliberate.
- **`src/mocks/server.ts` deferred.** The project layout above lists a Node-side MSW server for SSR, but the scaffold doesn't create one. Stage-1 data fetching is client-only via `useQuery`, so SSR-time mocking isn't needed yet. Add the file the day we start SSR-fetching mocked data.
- **Design-system handoff folder.** The folder `design_handoff_ig_studio_ds/` carries an "IG Studio" name for historical reasons (it's the original handoff kit), but everywhere user-visible the brand is **Midpack**: workspace logo (`MP` mark), wordmark, page titles, copy. The folder name itself stays — only strings change.
- **Design system reference route.** `/components` renders the Midpack DS components currently in the project for visual verification against `design_handoff_ig_studio_ds/preview/*.html`. It's a developer / reviewer page; don't link it from the production shell.
- **shadcn primitives stay in `src/components/ui/`; Midpack DS components live in `src/components/ds/`.** When a `ds/` component needs an underlying accessible primitive (focus management, keyboard nav, popover positioning), install the shadcn primitive via `shadcn add` into `ui/` and compose. Don't put feature-specific composites in either — those go in `src/components/<feature>/`.
- **Every `ds/` component must wrap a shadcn primitive (which uses Radix under the hood).** No bare `<span>` / `<button>` chips. Chips and inline tags wrap `Badge`; clickable variants use `<Badge asChild>` with a button child to inherit ARIA + focus management. If shadcn doesn't have a matching primitive, run `pnpm dlx shadcn@latest add <name>` first, then build the `ds/` wrapper on top. This is what makes the project's accessibility predictable — we don't reinvent focus rings, keyboard handlers, or portal positioning per component.
- **No inline arbitrary values for design tokens.** Don't write `text-[14px]`, `text-[#16161a]`, `bg-[#fafaf8]`, `border-[#e6e6e1]`, `rounded-[8px]`, or `style={{ color: "#…" }}` anywhere in components. Use the Tailwind utility that resolves to a token: `text-base`, `text-foreground`, `bg-surface-2`, `border-border`, `rounded-card`. The design tokens live in `@theme` inside `src/app/globals.css` — colors (`--color-*`), font sizes (`--text-*`), spacing (`--spacing-*`), radii (`--radius-*`), shadows (`--shadow-*`). If the value you need doesn't have a token yet, **add the token to `@theme` and reuse the utility** — don't slip an inline value in as a workaround. The only exceptions are (1) one-off layout pixels that are not part of the design system (`h-[60px]` for a sticky top bar, `w-[280px]` for a search input width, `grid-cols-[96px_1fr]`) and (2) genuinely dynamic values computed at runtime (`style={{ width: computedPct + "%" }}`).
- **Inline chips next to body text align by baseline, not center.** When a chip / badge / pill-shaped clickable (e.g. `DateField`, tag, status pill) sits in the same line as plain prose, the wrapping container must use `items-baseline` — never `items-center` — so the chip's text baseline lines up with the surrounding sentence. `items-center` lines up box centers, which reads as a vertical drift whenever the chip uses a different font (mono vs sans), a different size (`text-[12.5px]` vs `text-base`), or different padding than the prose around it. This applies to any inline "label + interactive value" pair, not just dates.
- **Font sizes follow the Tailwind default scale** (with our `html { font-size: 14px }` root): `text-xs` 10.5px, `text-sm` 12.25px, `text-base` 14px (body default), `text-lg` 15.75px, `text-xl` 17.5px, `text-2xl` 21px, `text-3xl` 26.25px. Sizes that don't map cleanly to that scale (the 28px page H1, the 9px stage-legend numbers) have named tokens (`text-h1`, `text-micro`) — extend `@theme` rather than inlining `text-[Npx]`.

## Common commands

- `pnpm dev` — dev server at http://localhost:3000 (Turbopack, MSW enabled when `NEXT_PUBLIC_API_MOCKING=enabled`).
- `pnpm build` — production build.
- `pnpm start` — serve the production build.
- `pnpm typecheck` — `tsc --noEmit` across the whole tree.

Lint is intentionally not configured for the stage-1 prototype; rely on TypeScript strict.

## When in doubt

- Building something the product docs cover: read the relevant doc before coding.
- Adding a dependency: check if shadcn or Next.js already covers it.
- Unsure whether to mock or wire real: it's stage 1 — add an MSW handler and a hook; never call `fetch` from a component.
- A `product/` doc and an existing component disagree: the doc wins; flag the drift.
