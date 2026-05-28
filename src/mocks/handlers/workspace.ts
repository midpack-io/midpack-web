import { delay, http, HttpResponse } from "msw";
import { WORKSPACE } from "../data/workspace";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

// Stage-2 contract: backend exposes the current workspace at GET /workspace.
// Drives the top-bar root crumb and the General settings identity card.
export const workspaceHandlers = [
  http.get(`${BASE}/workspace`, async () => {
    await delay(50);
    return HttpResponse.json(WORKSPACE);
  }),
];
