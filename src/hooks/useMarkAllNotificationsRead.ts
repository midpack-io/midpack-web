import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import type { NotificationFilter, NotificationPage } from "@/lib/api/types";

type InfiniteData = { pages: NotificationPage[]; pageParams: unknown[] };
type CountData = { count: number };

// Marks all (optionally filter-scoped) notifications read. Optimistically zeroes
// the unread count and flips every loaded row, rolling back on error and
// reconciling on settle (spec §7.1).
export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (filter?: NotificationFilter) =>
      apiPost<{ ok: true }>("/notifications/read-all", { filter }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const now = new Date().toISOString();

      const prevLists = qc.getQueriesData<InfiniteData>({
        queryKey: ["notifications"],
      });
      const prevCount = qc.getQueryData<CountData>([
        "notifications",
        "unread-count",
      ]);

      qc.setQueriesData<InfiniteData>({ queryKey: ["notifications"] }, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((pg) => ({
            ...pg,
            items: pg.items.map((n) =>
              n.readAt === null ? { ...n, readAt: now } : n,
            ),
          })),
        };
      });
      qc.setQueryData<CountData>(["notifications", "unread-count"], { count: 0 });

      return { prevLists, prevCount };
    },
    onError: (_err, _vars, ctx) => {
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
