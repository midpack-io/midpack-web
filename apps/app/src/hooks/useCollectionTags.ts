import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { CollectionId, Tag } from "@/lib/api/types";

export function useCollectionTags(collectionId: CollectionId | undefined) {
  return useQuery({
    queryKey: ["collection-tags", collectionId] as const,
    queryFn: () => apiGet<Tag[]>(`/collections/${collectionId}/tags`),
    enabled: !!collectionId,
  });
}
