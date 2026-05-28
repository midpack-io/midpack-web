import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUpload } from "@/lib/api";
import type {
  FileComponent,
  FileKind,
  FileTemplate,
  LibraryKind,
  WorkflowTemplate,
} from "@/lib/api/types";

type CreateLibraryItemInput = {
  kind: LibraryKind;
  name: string;
  fileKind?: FileKind;
  file?: File;
};

type LibraryItemRecord = WorkflowTemplate | FileComponent | FileTemplate;

// Create a new library item by dropping a file into a section (or "New" /
// "Choose file" / "Paste link"). Multipart so stage 2 carries the real bytes.
export function useCreateLibraryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kind, name, fileKind, file }: CreateLibraryItemInput) => {
      const form = new FormData();
      form.set("name", name);
      if (fileKind) form.set("kind", fileKind);
      if (file) form.set("file", file);
      return apiUpload<LibraryItemRecord>(`/library/${kind}`, form);
    },
    onSuccess: (_data, { kind }) => {
      qc.invalidateQueries({ queryKey: ["library", kind] });
    },
  });
}
