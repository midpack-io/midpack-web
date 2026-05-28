import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import type { ProductsQuery, SavedView } from "@/lib/api/types";

type CreateWorklistViewInput = {
  name: string;
  query: ProductsQuery;
};

export function useCreateWorklistView() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, query }: CreateWorklistViewInput) =>
      apiPost<SavedView>("/worklist/views", { name, query }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["worklist-views"] });
    },
  });
}
