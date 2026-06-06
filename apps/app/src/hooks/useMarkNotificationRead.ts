import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import type { NotificationId, NotificationPage } from "@/lib/api/types";

type InfiniteData = { pages: NotificationPage[]; pageParams: unknown[] };
type CountData = { count: number };

// Marks one notification read. Optimistically flips the row in every loaded
// list cache and decrements the unread count (only if the row was actually
// unread), rolling back on error and reconciling on settle (spec §7.1).
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: NotificationId) =>
      apiPost<{ ok: true }>("/notifications/read", { id }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const now = new Date().toISOString();

      const prevLists = qc.getQueriesData<InfiniteData>({
        queryKey: ["notifications"],
      });
      const prevCount = qc.getQueryData<CountData>([
        "notifications",
        "unread-count",
      ]);

      let wasUnread = false;
      for (const [, data] of prevLists) {
        for (const pg of data?.pages ?? []) {
          for (const n of pg.items) {
            if (n.id === id && n.readAt === null) wasUnread = true;
          }
        }
      }

      qc.setQueriesData<InfiniteData>({ queryKey: ["notifications"] }, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((pg) => ({
            ...pg,
            items: pg.items.map((n) =>
              n.id === id && n.readAt === null ? { ...n, readAt: now } : n,
            ),
          })),
        };
      });

      if (wasUnread && prevCount) {
        qc.setQueryData<CountData>(["notifications", "unread-count"], {
          count: Math.max(0, prevCount.count - 1),
        });
      }

      return { prevLists, prevCount };
    },
    onError: (_err, _id, ctx) => {
      ctx?.prevLists.forEach(([key, data]) =>
        qc.setQueryData(key as QueryKey, data),
      );
      if (ctx?.prevCount) {
        qc.setQueryData(["notifications", "unread-count"], ctx.prevCount);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
