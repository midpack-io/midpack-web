import { delay, http, HttpResponse } from "msw";
import type { CollectionId, Tag } from "@/lib/api/types";
import { collectionsById } from "../data/collections";
import { TAGS_BY_COLLECTION } from "../data/tags";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

// Stage-2 contract: backend should expose the available tag catalog for a
// collection at GET /collections/:id/tags. Used by the products workspace
// filter bar to populate the Tags multi-select with real options.

export const tagsHandlers = [
  http.get(`${BASE}/collections/:id/tags`, async ({ params }) => {
    await delay(50);
    const id = params.id as CollectionId;
    if (!collectionsById.has(id)) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(TAGS_BY_COLLECTION.get(id) ?? []);
  }),

  // Aggregate catalog across all collections — backs the Worklist Tags filter.
  http.get(`${BASE}/tags`, async () => {
    await delay(50);
    const seen = new Map<string, Tag>();
    for (const list of TAGS_BY_COLLECTION.values()) {
      for (const t of list) if (!seen.has(t.label)) seen.set(t.label, t);
    }
    return HttpResponse.json([...seen.values()]);
  }),
];
