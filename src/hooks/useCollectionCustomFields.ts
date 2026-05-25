import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { CollectionId, CustomFieldDef } from "@/lib/api/types";

export function useCollectionCustomFields(collectionId: CollectionId | undefined) {
  return useQuery({
    queryKey: ["collection-custom-fields", collectionId] as const,
    queryFn: () =>
      apiGet<CustomFieldDef[]>(`/collections/${collectionId}/custom-fields`),
    enabled: !!collectionId,
  });
}
