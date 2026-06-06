import { delay, http, HttpResponse } from "msw";
import type { CollectionId, ProductsQuery, SavedView, ViewId } from "@/lib/api/types";
import { collectionsById } from "../data/collections";
import { newViewId, VIEWS_BY_COLLECTION, viewsById } from "../data/views";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

type ViewBody = { name?: string; query?: ProductsQuery };

export const viewsHandlers = [
  http.get(`${BASE}/collections/:id/views`, async ({ params }) => {
    await delay(200);
    const id = params.id as CollectionId;
    if (!collectionsById.has(id)) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(VIEWS_BY_COLLECTION.get(id) ?? []);
  }),

  http.post(`${BASE}/collections/:id/views`, async ({ params, request }) => {
    await delay(250);
    const id = params.id as CollectionId;
    if (!collectionsById.has(id)) return new HttpResponse(null, { status: 404 });

    const body = (await request.json()) as ViewBody;
    const name = body.name?.trim();
    if (!name) return HttpResponse.json({ error: "name required" }, { status: 400 });
    if (!body.query) return HttpResponse.json({ error: "query required" }, { status: 400 });

    const now = new Date().toISOString();
    const view: SavedView = {
      id: newViewId(),
      collectionId: id,
      name,
      query: body.query,
      createdAt: now,
      updatedAt: now,
    };

    let list = VIEWS_BY_COLLECTION.get(id);
    if (!list) {
      list = [];
      VIEWS_BY_COLLECTION.set(id, list);
    }
    list.push(view);
    viewsById.set(view.id, view);

    return HttpResponse.json(view, { status: 201 });
  }),

  http.patch(`${BASE}/collections/:id/views/:viewId`, async ({ params, request }) => {
    await delay(250);
    const view = viewsById.get(params.viewId as ViewId);
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

  http.delete(`${BASE}/collections/:id/views/:viewId`, async ({ params }) => {
    await delay(200);
    const viewId = params.viewId as ViewId;
    const view = viewsById.get(viewId);
    if (!view) return new HttpResponse(null, { status: 404 });

    viewsById.delete(viewId);
    const list = VIEWS_BY_COLLECTION.get(params.id as CollectionId);
    if (list) {
      const i = list.findIndex((v) => v.id === viewId);
      if (i !== -1) list.splice(i, 1);
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
