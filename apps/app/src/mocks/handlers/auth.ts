import { http, HttpResponse } from "msw";

// Mock auth handlers — only used when NEXT_PUBLIC_API_URL is empty (so the auth
// client hits same-origin /api/v1/auth/*). They mirror the real midpack-server
// contract (see handoffs/auth-frontend-handoff.md) so the seam stays honest.
// Set NEXT_PUBLIC_API_URL=http://localhost:8000 to bypass these and use the
// live backend.

const MOCK_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "demo@midpack.io",
  name: "Demo User",
  avatar_url: null,
  auth_methods: ["password"],
  email_verified: true,
  is_saas_admin: false,
  created_at: "2026-01-01T00:00:00.000Z",
};

const MOCK_TOKENS = {
  access_token: "mock-access-token",
  refresh_token: null,
  token_type: "bearer",
};

const authPayload = () => HttpResponse.json({ data: { user: MOCK_USER, tokens: MOCK_TOKENS } });
const message = (m: string) => HttpResponse.json({ data: { message: m } });
const unauthorized = (code: string, m: string) =>
  HttpResponse.json({ detail: { code, message: m } }, { status: 401 });

export const authHandlers = [
  // Accepts any credentials — this is a demo session.
  http.post("/api/v1/auth/login", () => authPayload()),
  http.post("/api/v1/auth/register", () =>
    HttpResponse.json({ data: { user: MOCK_USER, tokens: MOCK_TOKENS } }, { status: 201 }),
  ),
  http.post("/api/v1/auth/oauth/:provider", () => authPayload()),

  // /me requires a bearer token (set by login), mirroring the real backend.
  http.get("/api/v1/auth/me", ({ request }) =>
    request.headers.get("authorization")
      ? HttpResponse.json({ data: MOCK_USER })
      : unauthorized("unauthorized", "Not authenticated"),
  ),

  // No mock refresh cookie — refresh fails so a logged-out visitor stays logged out.
  http.post("/api/v1/auth/refresh", () => unauthorized("invalid_refresh_token", "No session")),
  http.post("/api/v1/auth/sign-out", () => new HttpResponse(null, { status: 204 })),

  http.post("/api/v1/auth/forgot-password", () => message("If an account exists, a reset link was sent.")),
  http.post("/api/v1/auth/reset-password", () => message("Password updated.")),
  http.post("/api/v1/auth/verify-email", () => message("Email verified.")),
  http.post("/api/v1/auth/resend-verification", () => message("Verification email sent.")),
];
