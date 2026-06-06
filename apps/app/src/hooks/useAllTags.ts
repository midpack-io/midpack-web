import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Tag } from "@/lib/api/types";

// Tag catalog unioned across all collections — backs the Worklist Tags filter.
export function useAllTags() {
  return useQuery({
    queryKey: ["tags", "all"] as const,
    queryFn: () => apiGet<Tag[]>("/tags"),
  });
}
