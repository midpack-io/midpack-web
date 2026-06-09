import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { MemberId, ReassignTarget } from "@/lib/api/types";

// In-flight bundles that must be reassigned before a member can be deactivated.
// Feeds the State-C deactivate dialog; only fetched once a target is chosen.
export function useMemberOpenWork(id: MemberId | undefined) {
  return useQuery({
    queryKey: ["members", "open-work", id] as const,
    queryFn: () => apiGet<ReassignTarget[]>(`/members/${id}/open-work`),
    enabled: !!id,
  });
}
