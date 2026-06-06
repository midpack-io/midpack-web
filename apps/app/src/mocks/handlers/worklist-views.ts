import { delay, http, HttpResponse } from "msw";
import type { ProductsQuery, SavedView, ViewId } from "@/lib/api/types";
import {
  newWorklistViewId,
  WORKLIST_VIEWS,
  worklistViewsById,
} from "../data/worklist-views";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

type ViewBody = { name?: string; query?: ProductsQuery };

export const worklistViewsHandlers = [
  http.get(`${BASE}/worklist/views`, async () => {
    await delay(200);
    return HttpResponse.json(WORKLIST_VIEWS);
  }),

  http.post(`${BASE}/worklist/views`, async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as ViewBody;
    const name = body.name?.trim();
    if (!name) return HttpResponse.json({ error: "name required" }, { status: 400 });
    if (!body.query) return HttpResponse.json({ error: "query required" }, { status: 400 });

    const now = new Date().toISOString();
    const view: SavedView = {
      id: newWorklistViewId(),
      name,
      query: body.query,
      createdAt: now,
      updatedAt: now,
    };
    WORKLIST_VIEWS.push(view);
    worklistViewsById.set(view.id, view);

    return HttpResponse.json(view, { status: 201 });
  }),

  http.patch(`${BASE}/worklist/views/:viewId`, async ({ params, request }) => {
    await delay(250);
    const view = worklistViewsById.get(params.viewId as ViewId);
    if (!view) return new HttpResponse(null, { status: 404 });

    const patch = (await request.json()) as ViewBody;
    if (typeof patch.name === "string") {
      const next = patch.name.trim();
      if (next.length === 0) {
        return HttpResponse.json({ error: "name required" }, { status: 400 });
      }
      view.name = next;
    }
    if (patch.query) view.query = patch.query;
    view.updatedAt = new Date().toISOString();

    return HttpResponse.json(view);
  }),

  http.delete(`${BASE}/worklist/views/:viewId`, async ({ params }) => {
    await delay(200);
    const viewId = params.viewId as ViewId;
    if (!worklistViewsById.has(viewId)) {
      return new HttpResponse(null, { status: 404 });
    }
    worklistViewsById.delete(viewId);
    const i = WORKLIST_VIEWS.findIndex((v) => v.id === viewId);
    if (i !== -1) WORKLIST_VIEWS.splice(i, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
