import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPatch } from "@/lib/api";
import type { ProductsQuery, SavedView, ViewId } from "@/lib/api/types";

type UpdateWorklistViewInput = {
  viewId: ViewId;
  patch: Partial<{ name: string; query: ProductsQuery }>;
};

export function useUpdateWorklistView() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ viewId, patch }: UpdateWorklistViewInput) =>
      apiPatch<SavedView>(`/worklist/views/${viewId}`, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["worklist-views"] });
    },
  });
}
