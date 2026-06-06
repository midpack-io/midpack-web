import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Workspace } from "@/lib/api/types";

// The current workspace. Backs the top-bar root crumb and settings identity.
export function useWorkspace() {
  return useQuery({
    queryKey: ["workspace"] as const,
    queryFn: () => apiGet<Workspace>("/workspace"),
  });
}
