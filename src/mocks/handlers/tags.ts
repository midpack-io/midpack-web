import { delay, http, HttpResponse } from "msw";
import type { CollectionId } from "@/lib/api/types";
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
];
