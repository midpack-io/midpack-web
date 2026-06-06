import { getTokenCookie, setTokenCookie, deleteTokenCookie } from "./cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function getAccessToken(): string | null {
  return getTokenCookie();
}

export function setAccessToken(token: string | null): void {
  if (token) {
    setTokenCookie(token);
  } else {
    deleteTokenCookie();
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    // Refresh token is in the httpOnly cookie, sent automatically with credentials.
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) return false;

    // Midpack wraps the payload: { data: { user, tokens: { access_token } } }.
    const json = await response.json();
    const token = json?.data?.tokens?.access_token;
    if (!token) return false;

    setAccessToken(token);
    return true;
  } catch {
    return false;
  }
}
