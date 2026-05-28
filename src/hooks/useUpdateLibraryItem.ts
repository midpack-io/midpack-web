import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPatch } from "@/lib/api";
import type {
  FileComponent,
  FileTemplate,
  LibraryItemStatus,
  LibraryKind,
  WorkflowTemplate,
} from "@/lib/api/types";

type UpdateLibraryItemInput = {
  kind: LibraryKind;
  id: string;
  patch: { name?: string; status?: LibraryItemStatus };
};

type LibraryItemRecord = WorkflowTemplate | FileComponent | FileTemplate;

// Rename, archive, or restore a library item. Renaming changes the display name
// only — it doesn't fork the version chain or break references.
export function useUpdateLibraryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kind, id, patch }: UpdateLibraryItemInput) =>
      apiPatch<LibraryItemRecord>(`/library/${kind}/${id}`, patch),
    onSuccess: (_data, { kind }) => {
      qc.invalidateQueries({ queryKey: ["library", kind] });
    },
  });
}
