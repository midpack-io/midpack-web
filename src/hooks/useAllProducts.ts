import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Product } from "@/lib/api/types";

// Products across every collection — backs the Worklist.
export function useAllProducts() {
  return useQuery({
    queryKey: ["products", "all"] as const,
    queryFn: () => apiGet<Product[]>("/products"),
  });
}
