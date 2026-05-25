import { delay, http, HttpResponse } from "msw";
import type { CollectionId } from "@/lib/api/types";
import { collectionsById } from "../data/collections";
import { CUSTOM_FIELDS_BY_COLLECTION } from "../data/custom-fields";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

// Stage-2 contract: backend should expose the per-collection custom-field
// schema at GET /collections/:id/custom-fields — keys, labels, and the value
// set used to populate per-field filter dropdowns.

export const customFieldsHandlers = [
  http.get(`${BASE}/collections/:id/custom-fields`, async ({ params }) => {
    await delay(50);
    const id = params.id as CollectionId;
    if (!collectionsById.has(id)) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(CUSTOM_FIELDS_BY_COLLECTION.get(id) ?? []);
  }),
];
