import { delay, http, HttpResponse } from "msw";
import type { CollectionId } from "@/lib/api/types";
import { COLLECTIONS, collectionsById } from "../data/collections";
import { ACTIVITY } from "../data/activity";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

function enrich(c: (typeof COLLECTIONS)[number]) {
  const recentActivity = ACTIVITY.filter((a) => a.collectionId === c.id)
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 3);
  return { ...c, recentActivity };
}

function isActiveLike(c: (typeof COLLECTIONS)[number]): boolean {
  return c.status === "active" || c.status === "wrapping_up";
}

export const collectionsHandlers = [
  http.get(`${BASE}/collections`, async ({ request }) => {
    await delay(1000);
    const status = new URL(request.url).searchParams.get("status");
    let list = COLLECTIONS;
    if (status === "active") list = COLLECTIONS.filter(isActiveLike);
    else if (status === "archived") list = COLLECTIONS.filter((c) => c.status === "archived");
    // Sort by deadline ascending. ISO date strings sort lexicographically =
    // chronologically. Copy first so the shared COLLECTIONS array (mutated in
    // place by the PATCH handler) is never reordered destructively.
    return HttpResponse.json(
      [...list].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(enrich),
    );
  }),

  http.get(`${BASE}/collections/counts`, async () => {
    await delay(1000);
    const active = COLLECTIONS.filter(isActiveLike).length;
    const archived = COLLECTIONS.filter((c) => c.status === "archived").length;
    return HttpResponse.json({ active, archived });
  }),

  http.get(`${BASE}/collections/:id`, async ({ params }) => {
    await delay(1000);
    const c = collectionsById.get(params.id as CollectionId);
    if (!c) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(enrich(c));
  }),

  http.patch(`${BASE}/collections/:id`, async ({ params, request }) => {
    await delay(400);
    const c = collectionsById.get(params.id as CollectionId);
    if (!c) return new HttpResponse(null, { status: 404 });
    const patch = (await request.json()) as Partial<
      Pick<(typeof COLLECTIONS)[number], "name" | "description" | "dueDate">
    >;
    if (typeof patch.name === "string") {
      const next = patch.name.trim();
      if (next.length === 0) {
        return HttpResponse.json({ error: "name required" }, { status: 400 });
      }
      c.name = next;
    }
    if (typeof patch.description === "string") c.description = patch.description;
    if (typeof patch.dueDate === "string") c.dueDate = patch.dueDate;
    return HttpResponse.json(enrich(c));
  }),

  http.get(`${BASE}/collections/:id/activity`, async ({ params }) => {
    await delay(1000);
    const id = params.id as CollectionId;
    if (!collectionsById.has(id)) {
      return new HttpResponse(null, { status: 404 });
    }
    const items = ACTIVITY.filter((a) => a.collectionId === id).sort((a, b) =>
      b.time.localeCompare(a.time),
    );
    return HttpResponse.json(items);
  }),
];
