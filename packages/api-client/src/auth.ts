import { api } from "./client";
import type { DataResponse } from "./types";
import type { components } from "./generated";

export type ClientType = components["schemas"]["ClientType"];
export type User = components["schemas"]["UserResponse"];
export type AuthTokens = components["schemas"]["TokenResponse"];
export type AuthResponse = components["schemas"]["AuthResponse"];
export type LoginRequest = components["schemas"]["EmailLoginRequest"];
export type RegisterRequest = Omit<components["schemas"]["EmailRegisterRequest"], "client_type">;
export type OAuthRequest = components["schemas"]["OAuthRequest"];
export type ForgotPasswordRequest = Omit<components["schemas"]["RequestPasswordResetRequest"], "client_type">;
export type ResetPasswordRequest = components["schemas"]["ResetPasswordRequest"];
export type VerifyEmailRequest = Omit<components["schemas"]["VerifyEmailRequest"], "client_type">;
export type ResendVerificationRequest = Omit<components["schemas"]["ResendVerificationRequest"], "client_type">;
type MessageResponse = components["schemas"]["MessageResponse"];

// `app` (customer) or `admin` — selects which app's URLs email links point to.
// Must be one of those two; "user" is rejected by the backend with 422.
const CLIENT_TYPE = (process.env.NEXT_PUBLIC_CLIENT_TYPE ?? "app") as ClientType;

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<DataResponse<AuthResponse>>("/api/v1/auth/login", data, { auth: false }),

  register: (data: RegisterRequest) =>
    api.post<DataResponse<AuthResponse>>(
      "/api/v1/auth/register",
      { ...data, client_type: CLIENT_TYPE },
      { auth: false },
    ),

  me: () => api.get<DataResponse<User>>("/api/v1/auth/me"),

  // Refresh uses the httpOnly cookie; no body needed for web clients.
  refresh: (refreshToken?: string) =>
    api.post<DataResponse<AuthResponse>>(
      "/api/v1/auth/refresh",
      refreshToken ? { refresh_token: refreshToken } : {},
      { auth: false },
    ),

  logout: () => api.post<void>("/api/v1/auth/sign-out", {}, { auth: false }),

  oauthAuthenticate: (provider: string, data: OAuthRequest) =>
    api.post<DataResponse<AuthResponse>>(`/api/v1/auth/oauth/${provider}`, data, { auth: false }),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<DataResponse<MessageResponse>>(
      "/api/v1/auth/forgot-password",
      { ...data, client_type: CLIENT_TYPE },
      { auth: false },
    ),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<DataResponse<MessageResponse>>(
      "/api/v1/auth/reset-password",
      { token: data.token, new_password: data.new_password },
      { auth: false },
    ),

  verifyEmail: (data: VerifyEmailRequest) =>
    api.post<DataResponse<MessageResponse>>(
      "/api/v1/auth/verify-email",
      { ...data, client_type: CLIENT_TYPE },
      { auth: false },
    ),

  // Midpack: unauthenticated, body { email, client_type } (NOT the template's
  // authenticated /resend-verification-email).
  resendVerification: (data: ResendVerificationRequest) =>
    api.post<DataResponse<MessageResponse>>(
      "/api/v1/auth/resend-verification",
      { ...data, client_type: CLIENT_TYPE },
      { auth: false },
    ),
};
