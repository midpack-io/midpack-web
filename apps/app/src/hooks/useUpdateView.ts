import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPatch } from "@/lib/api";
import type { CollectionId, ProductsQuery, SavedView, ViewId } from "@/lib/api/types";

type UpdateViewInput = {
  collectionId: CollectionId;
  viewId: ViewId;
  patch: Partial<{ name: string; query: ProductsQuery }>;
};

export function useUpdateView() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, viewId, patch }: UpdateViewInput) =>
      apiPatch<SavedView>(`/collections/${collectionId}/views/${viewId}`, patch),
    onSuccess: (view) => {
      qc.invalidateQueries({ queryKey: ["collection-views", view.collectionId] });
    },
  });
}
