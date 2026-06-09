import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import type { Member, MemberId } from "@/lib/api/types";

// Resend a pending invite — refreshes the 7-day expiry window.
export function useResendInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: MemberId) => apiPost<Member>(`/members/${id}/resend`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}
