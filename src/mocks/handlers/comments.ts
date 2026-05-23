import { http, HttpResponse } from "msw";
import type { ProductId } from "@/lib/api/types";
import { productsById } from "../data/products";
import { COMMENTS } from "../data/comments";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const commentsHandlers = [
  http.get(`${BASE}/products/:id/comments`, ({ params }) => {
    const id = params.id as ProductId;
    if (!productsById.has(id)) {
      return new HttpResponse(null, { status: 404 });
    }
    const items = COMMENTS.filter((c) => c.productId === id).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
    return HttpResponse.json(items);
  }),
];
