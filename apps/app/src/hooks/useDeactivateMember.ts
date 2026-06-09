import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import type { Member, MemberId, ReassignTarget } from "@/lib/api/types";

export interface DeactivateMemberInput {
  id: MemberId;
  reassignments: ReassignTarget[];
}

// Deactivate a seat (State C). The server 422s with `{ detail.code:
// "unresolved_reassignments" }` if any in-flight bundle lacks a replacement.
export function useDeactivateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reassignments }: DeactivateMemberInput) =>
      apiPost<Member>(`/members/${id}/deactivate`, { reassignments }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}
