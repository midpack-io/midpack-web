import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPatch } from "@/lib/api";
import type { Collection, CollectionId } from "@/lib/api/types";

type UpdateCollectionInput = {
  id: CollectionId;
  patch: Partial<Pick<Collection, "name" | "description" | "dueDate">>;
};

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: UpdateCollectionInput) =>
      apiPatch<Collection>(`/collections/${id}`, patch),
    onSuccess: (next) => {
      qc.setQueryData(["collections", "detail", next.id], next);
      qc.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}
