const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  // FormData bodies set their own multipart Content-Type (with boundary); forcing
  // application/json would break the upload. Let the browser handle it.
  const isForm = init.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      // non-JSON error body
    }
    throw new ApiError(res.status, `${res.status} ${res.statusText}`, body);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}

// Multipart POST for file uploads (library create / add-version). The backend
// reads fields off the FormData; in stage 2 this carries the real file bytes.
export function apiUpload<T>(path: string, form: FormData): Promise<T> {
  return request<T>(path, { method: "POST", body: form });
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}
