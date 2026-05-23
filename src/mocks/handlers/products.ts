import { delay, http, HttpResponse } from "msw";
import type { CollectionId, ProductId } from "@/lib/api/types";
import { collectionsById } from "../data/collections";
import { PRODUCTS, productsById } from "../data/products";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

// Stage-2 contract: this list endpoint should eventually accept query params
// for server-side filtering when product counts grow past a single page —
// `?tab=needs-you|in-review|returned|in-production|done`, `?owner=<personId>`,
// `?sort=stage|activity|due|name|progress`. The mock list stays small enough
// that the page filters client-side; the backend should match this shape.

export const productsHandlers = [
  http.get(`${BASE}/collections/:id/products`, async ({ params }) => {
    await delay(700);
    const id = params.id as CollectionId;
    if (!collectionsById.has(id)) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(PRODUCTS.filter((p) => p.collectionId === id));
  }),

  http.get(`${BASE}/products/:id`, async ({ params }) => {
    await delay(700);
    const p = productsById.get(params.id as ProductId);
    if (!p) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(p);
  }),
];
