// Client-side helpers for the readable access-token cookie. The refresh token
// is a separate httpOnly cookie set by the server (JS cannot read it).
//
// getCookieDomain() returns the widest parent domain the cookie may be scoped to
// so the access token is shared across subdomains (SSO):
//   - bare localhost / 127.0.0.1     -> "" (host-only)
//   - *.localhost (app./admin.)      -> ".localhost"        (dev SSO family)
//   - *.local.midpack.io             -> ".local.midpack.io" (OAuth-compatible dev family)
//   - *.midpack.io                   -> ".midpack.io"        (prod)
const COOKIE_NAME = "access_token";
const COOKIE_MAX_AGE = 900; // 15 minutes — matches the JWT access-token TTL
const BASE_DOMAIN = "midpack.io";
const KNOWN_ENVS = new Set(["local", "dev", "stage", "prod"]);

export function getCookieDomain(): string {
  if (typeof window === "undefined") return "";

  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") return "";

  // *.localhost dev family — share across app.localhost / admin.localhost.
  if (hostname.endsWith(".localhost")) return ".localhost";

  const idx = hostname.indexOf(BASE_DOMAIN);
  if (idx === -1) return "";

  const labels = hostname.substring(0, idx).split(".").filter(Boolean);
  const envLabel = labels[labels.length - 1];
  if (envLabel && KNOWN_ENVS.has(envLabel)) {
    return `.${envLabel}.${BASE_DOMAIN}`;
  }

  return `.${BASE_DOMAIN}`;
}

export function getTokenCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  const value = match?.[1];
  return value !== undefined ? decodeURIComponent(value) : null;
}

export function setTokenCookie(token: string): void {
  const domain = getCookieDomain();
  const domainAttr = domain ? `; domain=${domain}` : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/${domainAttr}; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function deleteTokenCookie(): void {
  const domain = getCookieDomain();
  const domainAttr = domain ? `; domain=${domain}` : "";
  document.cookie = `${COOKIE_NAME}=; path=/${domainAttr}; max-age=0; SameSite=Lax`;
}
