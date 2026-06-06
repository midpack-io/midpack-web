const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type OAuthProvider = "google";

// Redirect-based OAuth start (alternative to the implicit-flow popup in
// google-oauth.tsx). The backend handles the provider handshake and redirects
// back to `${origin}/auth/callback`.
export function startOAuthFlow(provider: OAuthProvider, redirectPath = "/") {
  const state = btoa(JSON.stringify({ redirect: redirectPath }));
  const callbackUrl = `${window.location.origin}/auth/callback`;

  window.location.href = `${API_URL}/api/v1/auth/oauth/${provider}?callback_url=${encodeURIComponent(
    callbackUrl,
  )}&state=${state}`;
}
