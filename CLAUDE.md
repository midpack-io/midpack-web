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

- `@midpack/ui` — shared shadcn primitives, theme, `cn`, cross-app URL helpers, and auth views.
- `@midpack/api-client` — typed fetch client + the SSO cookie/token logic (auth only).
- `@midpack/auth` — Zustand auth store, `useAuth`, `ProtectedRoute`/`PublicRoute` guards, OAuth.

Packages are consumed as **raw TS** via each app's `transpilePackages` — there is no build step.
Packages never use the `@/` alias (it resolves against the consuming app); they import each other by
scope (`@midpack/...`). Each app keeps its own `@/* → ./src/*` (or `./app/*`).

## Running

- `pnpm dev` — runs all three apps + the dev proxy. Open `http://app.localhost:3000` (product UI),
  `http://localhost:3000` (landing), `http://admin.localhost:3000` (admin).
- `pnpm dev --filter app` — a single app (still hit it through the proxy, or directly on its port).
- `sudo bash scripts/setup-hosts.sh` — once, to enable the `*.local.midpack.io` (OAuth-compatible)
  front door. The `*.localhost` family needs no setup.
- `pnpm build` / `pnpm typecheck` — via Turborepo across all apps and packages.

The umbrella `docker-compose.yml` runs this same `pnpm dev` proxy stack for the `web` service on
`:3000`. The proxy (`scripts/dev-proxy.mjs`) routes by `Host` header; set `PROXY_HOST=0.0.0.0` in
Docker.

## Auth / SSO

Single sign-on across subdomains via one cookie scoped to the shared parent domain (`.midpack.io`
prod, `.localhost` / `.local.midpack.io` dev). The backend is `midpack-server` (`/api/v1/auth/*`).
See the plan in `~/.claude/plans/` and `@midpack/api-client`'s `cookie.ts` for the domain logic.

## Conventions

- Files are kebab-case. Internal navigation never uses a raw `<a>` — use `next/link`.
- `apps/app` is mocks-first (MSW) and self-contained; its detailed rules live in `apps/app/CLAUDE.md`.
- Don't add app code to this root. Know which app/package a change belongs in before editing.
