import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiDelete } from "@/lib/api";
import type { CollectionId, ViewId } from "@/lib/api/types";

type DeleteViewInput = {
  collectionId: CollectionId;
  viewId: ViewId;
};

export function useDeleteView() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, viewId }: DeleteViewInput) =>
      apiDelete<void>(`/collections/${collectionId}/views/${viewId}`),
    onSuccess: (_data, { collectionId }) => {
      qc.invalidateQueries({ queryKey: ["collection-views", collectionId] });
    },
  });
}
