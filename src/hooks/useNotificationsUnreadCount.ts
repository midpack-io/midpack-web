import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

// Total unread count for the bell badge + "N НОВИХ" pill + Unread-tab chip.
// Its own query (never derived from loaded pages, which are filtered) so the
// badge stays correct regardless of what's loaded. On a failed refetch
// TanStack retains the last successful `data`, so the badge never blanks to a
// wrong 0 (spec §8) — consumers should treat `undefined` as "no badge", not 0.
export function useNotificationsUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"] as const,
    queryFn: () => apiGet<{ count: number }>("/notifications/unread-count"),
  });
}
