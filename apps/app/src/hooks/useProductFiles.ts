import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { ProductFile, ProductId } from "@/lib/api/types";

export function useProductFiles(productId: ProductId | undefined) {
  return useQuery({
    queryKey: ["products", productId, "files"] as const,
    queryFn: () => apiGet<ProductFile[]>(`/products/${productId}/files`),
    enabled: !!productId,
  });
}
