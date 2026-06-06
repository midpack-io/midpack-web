import { http, HttpResponse } from "msw";
import type { ProductId, Stage } from "@/lib/api/types";
import { productsById } from "../data/products";
import { FILES } from "../data/files";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

// Stage ordering for stable list output. The bundle page groups visually
// by stage, but server-side ordering keeps the response deterministic.
const STAGE_ORDER: Record<Stage, number> = {
  idea: 0,
  sketch: 1,
  techpack: 2,
  procurement: 3,
  patterns: 4,
  "pattern-review": 5,
  sample: 6,
  fitting: 7,
  grading: 8,
  production: 9,
};

export const filesHandlers = [
  http.get(`${BASE}/products/:id/files`, ({ params }) => {
    const id = params.id as ProductId;
    if (!productsById.has(id)) {
      return new HttpResponse(null, { status: 404 });
    }
    const items = FILES.filter((f) => f.productId === id).sort((a, b) => {
      const stageDiff = STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage];
      if (stageDiff !== 0) return stageDiff;
      const folderA = a.folderPath ?? "";
      const folderB = b.folderPath ?? "";
      if (folderA !== folderB) return folderA.localeCompare(folderB);
      return a.position - b.position;
    });
    return HttpResponse.json(items);
  }),
];
