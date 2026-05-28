import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { FileComponent } from "@/lib/api/types";

// File components catalog — backs the /library File components tab.
export function useFileComponents() {
  return useQuery({
    queryKey: ["library", "components"] as const,
    queryFn: () => apiGet<FileComponent[]>("/library/components"),
  });
}
