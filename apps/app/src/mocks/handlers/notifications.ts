import { delay, http, HttpResponse } from "msw";
import type {
  Notification,
  NotificationFilter,
  NotificationId,
} from "@/lib/api/types";
import { NOTIFICATIONS, notificationsById } from "../data/notifications";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

const PAGE_LIMIT = 12;

function applyFilter(
  list: Notification[],
  filter: NotificationFilter,
): Notification[] {
  if (filter === "unread") return list.filter((n) => n.readAt === null);
  if (filter === "mentions") return list.filter((n) => n.kind === "mention");
  return list;
}

// Newest first — the order the panel renders top-to-bottom.
function sortedDesc(): Notification[] {
  return [...NOTIFICATIONS].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

export const notificationsHandlers = [
  // NOTE: must precede the list route below — MSW matches first-registered
  // first, and `/notifications/unread-count` would otherwise be swallowed by
  // `/notifications`.
  http.get(`${BASE}/notifications/unread-count`, async () => {
    await delay(150);
    const count = NOTIFICATIONS.filter((n) => n.readAt === null).length;
    return HttpResponse.json({ count });
  }),

  http.get(`${BASE}/notifications`, async ({ request }) => {
    await delay(450);
    const url = new URL(request.url);
    const filter = (url.searchParams.get("filter") ?? "all") as NotificationFilter;
    const limit = Number(url.searchParams.get("limit")) || PAGE_LIMIT;
    // Cursor is a stringified offset into the *filtered* list, so every page
    // is full of matching rows regardless of the active tab.
    const offset = Number(url.searchParams.get("cursor")) || 0;

    const filtered = applyFilter(sortedDesc(), filter);
    const items = filtered.slice(offset, offset + limit);
    const nextOffset = offset + limit;
    const nextCursor = nextOffset < filtered.length ? String(nextOffset) : null;

    return HttpResponse.json({ items, nextCursor });
  }),

  http.post(`${BASE}/notifications/read`, async ({ request }) => {
    await delay(200);
    const { id } = (await request.json()) as { id?: NotificationId };
    if (!id) return HttpResponse.json({ error: "id required" }, { status: 400 });
    const n = notificationsById.get(id);
    if (!n) return new HttpResponse(null, { status: 404 });
    if (n.readAt === null) n.readAt = new Date().toISOString();
    return HttpResponse.json({ ok: true });
  }),

  http.post(`${BASE}/notifications/read-all`, async ({ request }) => {
    await delay(250);
    const { filter } = (await request.json().catch(() => ({}))) as {
      filter?: NotificationFilter;
    };
    const now = new Date().toISOString();
    const scope = applyFilter(NOTIFICATIONS, filter ?? "all");
    for (const n of scope) {
      if (n.readAt === null) n.readAt = now;
    }
    return HttpResponse.json({ ok: true });
  }),
];
