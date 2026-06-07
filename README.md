# midpack-web

Frontend monorepo for **Midpack** — a [pnpm](https://pnpm.io) + [Turborepo](https://turbo.build)
workspace of three Next.js 16 apps that share one auth surface and a set of `@midpack/*` packages. A
small dev proxy serves all three under local subdomains on a single port.

## Apps & domains

| App          | Prod domain        | Dev URL (via the proxy on `:3000`)     | Port | What it is |
|--------------|--------------------|----------------------------------------|------|------------|
| `apps/web`   | `midpack.io`       | http://localhost:3000                  | 3001 | Landing |
| `apps/app`   | `app.midpack.io`   | http://app.localhost:3000              | 3002 | Customer platform (the product UI) |
| `apps/admin` | `admin.midpack.io` | http://admin.localhost:3000            | 3003 | Internal SaaS management |

## Packages

| Package | Purpose |
|---------|---------|
| `@midpack/ui` | Base layer — shared shadcn/ui primitives, theme, `cn`, cross-app URL helpers (`getAppUrls`), generic chrome, and the auth views (`LoginView`, `SignUpView`, …). |
| `@midpack/product-ui` | Domain layer on top of `@midpack/ui` — Midpack-specific components (product rows, the stage stepper, domain types). |
| `@midpack/api-client` | Typed `fetch` client for `/api/v1/auth/*` + the SSO cookie/token logic. |
| `@midpack/auth` | Zustand auth store, `useAuth`, `ProtectedRoute`/`PublicRoute` guards, Google OAuth, silent refresh. |

Packages are consumed as **raw TypeScript** via each app's `transpilePackages` — there is no build
step. They never use the `@/` path alias (that resolves against the consuming app); they import each
other by scope.

## Quick start

```bash
pnpm install
pnpm dev            # runs all three apps + the dev proxy on :3000
```

Then open:

- **http://localhost:3000** — landing
- **http://app.localhost:3000** — the product app
- **http://admin.localhost:3000** — admin

`*.localhost` resolves to `127.0.0.1` automatically (no `/etc/hosts` needed). The proxy
(`scripts/dev-proxy.mjs`) listens on `:3000` and routes by `Host` header to the three apps; it also
proxies the HMR websocket.

Other commands (all via Turborepo, run from the repo root):

```bash
pnpm dev --filter app   # just one app (still reachable through the proxy, or directly on its port)
pnpm build              # production build of every app
pnpm typecheck          # tsc --noEmit across every app and package
```

> Don't run `pnpm build` while `pnpm dev` is running — they fight over the `.next` cache.

## The two dev domain families

The proxy serves **both**:

- **`*.localhost`** — `localhost` / `app.localhost` / `admin.localhost`. Zero setup. Use this for
  day-to-day dev. It matches the backend's default cookie domain (`COOKIE_DOMAIN=.localhost`), so
  real backend auth works here out of the box.
- **`*.local.midpack.io`** — `local.midpack.io` / `app.local.midpack.io` / `admin.local.midpack.io`.
  Real-looking domains, needed because Google OAuth rejects `*.localhost` redirect URIs. These need
  `/etc/hosts` entries — run once:

  ```bash
  sudo bash scripts/setup-hosts.sh
  ```

  That adds the `*.local.midpack.io` (+ `api.local.midpack.io`) entries and a macOS `pfctl` rule
  redirecting port 80 → 3000 (so you can drop the `:3000`). For **real backend auth** on this family
  you must also point the server at it (`COOKIE_DOMAIN=.local.midpack.io`, add the origins to
  `CORS_ORIGINS`, and serve the API at `api.local.midpack.io`) — a cookie has one `Domain`, so it's
  the `.localhost` family **or** the `.local.midpack.io` family, not both at once.

## Auth

Auth runs against **`midpack-server`** at `/api/v1/auth/*`. SSO works across the apps via a single
httpOnly refresh cookie scoped to the shared parent domain; the short-lived JWT access token is sent
as `Authorization: Bearer`. See the umbrella's `handoffs/auth-frontend-handoff.md` for the contract.

`apps/app` has two modes, controlled by `NEXT_PUBLIC_API_URL` (in `apps/app/.env.local`):

- **Mocked (default, value empty):** MSW intercepts `/api/v1/auth/*` (handlers in
  `src/mocks/handlers/auth.ts`) so you can log in with any credentials and explore the product UI with
  no backend running.
- **Real (`http://localhost:8000`):** auth hits the live server. Bring it up with `docker compose up`
  from the umbrella (server + Postgres + Mailpit at http://localhost:8025 for verification/reset
  mail). Product data stays MSW-mocked.

`NEXT_PUBLIC_CLIENT_TYPE` is `app` here and `admin` in `apps/admin` (it tells the backend which app's
URLs to put in email links). The admin app is gated on `user.is_admin`.

## Running in Docker

The umbrella `docker-compose.yml` runs this same `pnpm dev` proxy stack for its `web` service on
`:3000` (with `PROXY_HOST=0.0.0.0`). From the host browser, reach the apps at `app.localhost:3000` /
`admin.localhost:3000` as above. Native `pnpm dev` is the primary dev path.

## Layout

```
apps/{web,app,admin}     # the three Next.js apps
packages/{ui,api-client,auth}
scripts/dev-proxy.mjs    # the subdomain proxy (:3000)
scripts/setup-hosts.sh   # *.local.midpack.io hosts entries + pfctl 80->3000
turbo.json · pnpm-workspace.yaml · tsconfig.base.json · .npmrc (node-linker=hoisted)
```

`apps/app` carries the detailed product/prototype conventions in its own `apps/app/CLAUDE.md`.
