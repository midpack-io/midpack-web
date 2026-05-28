import { useInfiniteQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { NotificationFilter, NotificationPage } from "@/lib/api/types";

// Cursor-paginated notifications for the bell panel. Each filter (tab) is its
// own query key, so switching tabs refetches from cursor 0 and resets the
// accumulated pages for free.
export function useNotifications(filter: NotificationFilter) {
  return useInfiniteQuery({
    queryKey: ["notifications", filter] as const,
    queryFn: ({ pageParam }) =>
      apiGet<NotificationPage>(
        `/notifications?filter=${filter}&limit=12${pageParam ? `&cursor=${pageParam}` : ""}`,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
