import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import type { Member, MemberId } from "@/lib/api/types";

// Reactivate a deactivated seat (Deactivated tab → "Reactivate").
export function useReactivateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: MemberId) => apiPost<Member>(`/members/${id}/reactivate`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}
