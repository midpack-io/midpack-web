import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { FileTemplate } from "@/lib/api/types";

// File templates catalog — backs the /library File templates tab.
export function useFileTemplates() {
  return useQuery({
    queryKey: ["library", "templates"] as const,
    queryFn: () => apiGet<FileTemplate[]>("/library/templates"),
  });
}
