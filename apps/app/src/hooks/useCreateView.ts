import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import type { CollectionId, ProductsQuery, SavedView } from "@/lib/api/types";

type CreateViewInput = {
  collectionId: CollectionId;
  name: string;
  query: ProductsQuery;
};

export function useCreateView() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, name, query }: CreateViewInput) =>
      apiPost<SavedView>(`/collections/${collectionId}/views`, { name, query }),
    onSuccess: (view) => {
      qc.invalidateQueries({ queryKey: ["collection-views", view.collectionId] });
    },
  });
}
