import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { CollectionId, SavedView } from "@/lib/api/types";

export function useCollectionViews(collectionId: CollectionId | undefined) {
  return useQuery({
    queryKey: ["collection-views", collectionId] as const,
    queryFn: () => apiGet<SavedView[]>(`/collections/${collectionId}/views`),
    enabled: !!collectionId,
  });
}
