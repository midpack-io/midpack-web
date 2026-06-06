export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public override message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiErrorResponse {
  detail: {
    code: string;
    message: string;
  };
}

// App errors use { detail: { code, message } }. Request-validation (422) uses
// FastAPI's default { detail: [ { loc, msg, type } ] } — an array — which this
// guard intentionally rejects so callers can branch on the two shapes.
export function isApiErrorResponse(body: unknown): body is ApiErrorResponse {
  return (
    typeof body === "object" &&
    body !== null &&
    "detail" in body &&
    typeof (body as ApiErrorResponse).detail?.code === "string" &&
    typeof (body as ApiErrorResponse).detail?.message === "string"
  );
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
