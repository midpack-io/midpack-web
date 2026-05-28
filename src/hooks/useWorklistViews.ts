import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { SavedView } from "@/lib/api/types";

export function useWorklistViews() {
  return useQuery({
    queryKey: ["worklist-views"] as const,
    queryFn: () => apiGet<SavedView[]>("/worklist/views"),
  });
}
