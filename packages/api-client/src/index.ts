export { api } from "./client";
export { ApiError, isApiError, isApiErrorResponse } from "./errors";
export type { DataResponse, PaginatedResponse, PaginationMeta } from "./types";
export { getAccessToken, setAccessToken, refreshAccessToken } from "./auth-tokens";
export { getCookieDomain } from "./cookie";

// Auth domain client
export { authApi } from "./auth";
export type {
  ClientType,
  User,
  AuthTokens,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  OAuthRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
} from "./auth";
