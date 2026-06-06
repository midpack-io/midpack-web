import { ApiError, isApiErrorResponse } from "./errors";
import { getAccessToken, refreshAccessToken } from "./auth-tokens";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, ...init } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  // Token expired — try refresh once, then retry.
  if (response.status === 401 && auth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${getAccessToken()}`;
      response = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers,
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    if (isApiErrorResponse(errorBody)) {
      throw new ApiError(response.status, errorBody.detail.code, errorBody.detail.message);
    }
    throw new ApiError(response.status, "unknown_error", response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
