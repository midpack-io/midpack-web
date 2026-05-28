import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiDelete } from "@/lib/api";
import type { ViewId } from "@/lib/api/types";

export function useDeleteWorklistView() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (viewId: ViewId) => apiDelete<void>(`/worklist/views/${viewId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["worklist-views"] });
    },
  });
}
