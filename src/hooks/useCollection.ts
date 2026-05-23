import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Collection, CollectionId } from "@/lib/api/types";

export function useCollection(id: CollectionId | undefined) {
  return useQuery({
    queryKey: ["collections", "detail", id] as const,
    queryFn: () => apiGet<Collection>(`/collections/${id}`),
    enabled: !!id,
  });
}
