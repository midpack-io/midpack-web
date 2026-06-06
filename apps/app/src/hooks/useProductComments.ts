import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Comment, ProductId } from "@/lib/api/types";

export function useProductComments(productId: ProductId | undefined) {
  return useQuery({
    queryKey: ["products", productId, "comments"] as const,
    queryFn: () => apiGet<Comment[]>(`/products/${productId}/comments`),
    enabled: !!productId,
  });
}
