# midpack-web — frontend monorepo

This repo is a **pnpm + Turborepo monorepo** of the Midpack front-ends. Three Next.js apps share one
auth surface and a set of `@midpack/*` packages; a small dev proxy serves them under local
subdomains. Application work happens inside one of the `apps/*` (or a `packages/*`); this root only
coordinates them.

## Apps and domains

| App          | Prod domain        | Dev domains (via proxy on :3000)            | Port | What |
|--------------|--------------------|---------------------------------------------|------|------|
| `apps/web`   | `midpack.io`       | `localhost`, `local.midpack.io`             | 3001 | Landing |
| `apps/app`   | `app.midpack.io`   | `app.localhost`, `app.local.midpack.io`     | 3002 | Customer platform (the product UI; see `apps/app/CLAUDE.md`) |
| `apps/admin` | `admin.midpack.io` | `admin.localhost`, `admin.local.midpack.io` | 3003 | Internal SaaS management |

## Packages

- `@midpack/ui` — **base** layer: shadcn primitives, theme/tokens, `cn`, cross-app URL helpers, and
  generic chrome (Logo, UserMenu, Breadcrumbs, filters, StatusChip) + the auth views. Generic, not
  domain-aware.
- `@midpack/product-ui` — **domain** layer built on `@midpack/ui`: Midpack-specific components
  (product rows, the stage stepper, domain types). Depends on `ui`; never the reverse.
- `@midpack/api-client` — typed fetch client + the SSO cookie/token logic (auth only).
- `@midpack/auth` — Zustand auth store, `useAuth`, `ProtectedRoute`/`PublicRoute` guards, OAuth.

**Where a component goes:** generic/reusable chrome → `@midpack/ui`; anything that knows about a
Midpack domain concept → `@midpack/product-ui`. Apps compose from both. **Never copy a shared
component into a per-app twin** — `app` and `admin` use the exact same UI and theme; if something
must differ, parameterize the shared component, don't fork it.

Packages are consumed as **raw TS** via each app's `transpilePackages` — there is no build step.
Packages never use the `@/` alias (it resolves against the consuming app); they import each other by
scope (`@midpack/...`). Each app keeps its own `@/* → ./src/*` (or `./app/*`).

## Running

**Always use `pnpm`** (pinned via `packageManager`; Node 20+). Never `npm`/`yarn`. Add a dependency
to the workspace it belongs to — `pnpm add <pkg> --filter <app|@midpack/package>` — never to the repo
root.

- `pnpm dev` — runs all three apps + the dev proxy. Open `http://app.localhost:3000` (product UI),
  `http://localhost:3000` (landing), `http://admin.localhost:3000` (admin).
- `pnpm dev --filter app` — a single app (still hit it through the proxy, or directly on its port).
- `sudo bash scripts/setup-hosts.sh` — once, to enable the `*.local.midpack.io` (OAuth-compatible)
  front door. The `*.localhost` family needs no setup.
- `pnpm build` / `pnpm typecheck` — via Turborepo across all apps and packages.
- `pnpm generate` — regenerates `@midpack/api-client`'s types from the backend OpenAPI schema
  (`openapi-typescript http://localhost:8000/openapi.json`). **Requires `midpack-server` running on
  :8000.**

**Verifying a change:** there is no test suite and **no ESLint** (rely on TypeScript strict). Confirm
work with `pnpm typecheck` (always) and `pnpm build` for anything that affects the build. Formatting
is Prettier via `pnpm format` — there is no lint step to run.

The umbrella `docker-compose.yml` runs this same `pnpm dev` proxy stack for the `web` service on
`:3000`. The proxy (`scripts/dev-proxy.mjs`) routes by `Host` header; set `PROXY_HOST=0.0.0.0` in
Docker.

## Auth / SSO

Single sign-on across subdomains via one cookie scoped to the shared parent domain (`.midpack.io`
prod, `.localhost` / `.local.midpack.io` dev). The backend is `midpack-server` (`/api/v1/auth/*`).
See the plan in `~/.claude/plans/` and `@midpack/api-client`'s `cookie.ts` for the domain logic.

## Environment (the two seams)

There are **two independent base URLs** plus the MSW switch. Going from mocks to a real backend means
setting all the ones you need — miss one and part of the app silently keeps mocking. Configured
per-app in `.env.local` (see `apps/app/.env.example`):

| Var | Controls | Stage-1 (mock) | Stage-2 (real) |
|-----|----------|----------------|----------------|
| `NEXT_PUBLIC_API_MOCKING` | MSW request interception | `enabled` | unset |
| `NEXT_PUBLIC_API_BASE_URL` | the **data** fetch client (bundles/products/…) | `/api` | real backend URL |
| `NEXT_PUBLIC_API_URL` | the **auth** client (`/api/v1/auth/*`, `@midpack/api-client`) | empty = mock auth | `http://localhost:8000` |
| `NEXT_PUBLIC_CLIENT_TYPE` | `app` \| `admin`, for the backend's email-link routing | `app` / `admin` | same |

`NEXT_PUBLIC_API_BASE_URL` (data) and `NEXT_PUBLIC_API_URL` (auth) are **different knobs** — don't
assume setting one repoints the other.

## Where the deeper rules live (read before editing)

- **`apps/app`** (the product UI) has its own `apps/app/CLAUDE.md` — the mocks-first / network-seam
  rules, data architecture, and design-token conventions. Read it before touching `apps/app`.
- **`apps/admin`** and **`apps/web`** have no separate doc — follow the conventions here.
- **`midpack-concept/`** is a *separate* static sub-project (plain HTML/CSS/JS, deployed to
  `concept.midpack.io`) and is **not part of the pnpm/Turbo workspace** — `pnpm --filter` won't reach
  it. It has its own `midpack-concept/CLAUDE.md` with a fragile Ukrainian↔English translation contract
  and its own `vercel deploy`. Read that doc before editing it.

## Conventions

- Files are kebab-case. Internal navigation never uses a raw `<a>` — use `next/link`.
- `apps/app` is mocks-first (MSW) and self-contained (see `apps/app/CLAUDE.md`).
- Don't add app code to this root. Know which app/package a change belongs in before editing.
