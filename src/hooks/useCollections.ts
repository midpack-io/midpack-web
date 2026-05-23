import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Collection } from "@/lib/api/types";

export type CollectionsFilter = "active" | "archived";

export function useCollections(status?: CollectionsFilter) {
  return useQuery({
    queryKey: ["collections", status ?? "all"] as const,
    queryFn: () =>
      apiGet<Collection[]>(
        status ? `/collections?status=${status}` : "/collections",
      ),
  });
}

export function useCollectionsCounts() {
  return useQuery({
    queryKey: ["collections", "counts"] as const,
    queryFn: () => apiGet<{ active: number; archived: number }>("/collections/counts"),
  });
}
