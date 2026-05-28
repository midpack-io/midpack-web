import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { LibraryKind, LibraryUsageRef } from "@/lib/api/types";

// The products using a library item (name, collection, current stage). Fetched
// lazily — only enabled when a usage popover or the detail drawer opens.
export function useLibraryUsage(kind: LibraryKind, id: string | null) {
  return useQuery({
    queryKey: ["library", kind, id, "usage"] as const,
    queryFn: () => apiGet<LibraryUsageRef[]>(`/library/${kind}/${id}/usage`),
    enabled: !!id,
  });
}
