import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUpload } from "@/lib/api";
import type {
  FileComponent,
  FileTemplate,
  LibraryKind,
} from "@/lib/api/types";

type AddLibraryVersionInput = {
  kind: LibraryKind;
  id: string;
  note?: string;
  file?: File;
};

// Add a new version to an existing component/template by dropping a newer file
// onto its card. The version chain grows; references (by id) never break.
export function useAddLibraryVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kind, id, note, file }: AddLibraryVersionInput) => {
      const form = new FormData();
      if (note) form.set("note", note);
      if (file) form.set("file", file);
      return apiUpload<FileComponent | FileTemplate>(
        `/library/${kind}/${id}/versions`,
        form,
      );
    },
    onSuccess: (_data, { kind }) => {
      qc.invalidateQueries({ queryKey: ["library", kind] });
    },
  });
}
