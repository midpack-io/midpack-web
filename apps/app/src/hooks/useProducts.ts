import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { CollectionId, Product } from "@/lib/api/types";

export function useProducts(collectionId: CollectionId | undefined) {
  return useQuery({
    queryKey: ["products", "by-collection", collectionId] as const,
    queryFn: () => apiGet<Product[]>(`/collections/${collectionId}/products`),
    enabled: !!collectionId,
  });
}
