import { http, HttpResponse } from "msw";
import type { PersonId } from "@/lib/api/types";
import { PEOPLE, peopleById } from "../data/people";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const peopleHandlers = [
  http.get(`${BASE}/people`, () => HttpResponse.json(PEOPLE)),

  http.get(`${BASE}/people/:id`, ({ params }) => {
    const p = peopleById.get(params.id as PersonId);
    if (!p) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(p);
  }),
];
