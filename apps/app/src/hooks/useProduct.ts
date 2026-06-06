import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Product, ProductId } from "@/lib/api/types";

export function useProduct(id: ProductId | undefined) {
  return useQuery({
    queryKey: ["products", "detail", id] as const,
    queryFn: () => apiGet<Product>(`/products/${id}`),
    enabled: !!id,
  });
}
