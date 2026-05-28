import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiDelete } from "@/lib/api";
import type { LibraryKind } from "@/lib/api/types";

type DeleteLibraryItemInput = {
  kind: LibraryKind;
  id: string;
};

// Hard delete — only succeeds when active usage is zero; otherwise the handler
// returns 409 (ApiError) and the UI steers the user to Archive instead.
export function useDeleteLibraryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kind, id }: DeleteLibraryItemInput) =>
      apiDelete<void>(`/library/${kind}/${id}`),
    onSuccess: (_data, { kind }) => {
      qc.invalidateQueries({ queryKey: ["library", kind] });
    },
  });
}
