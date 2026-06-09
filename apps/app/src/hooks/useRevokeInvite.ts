import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiDelete } from "@/lib/api";
import type { MemberId } from "@/lib/api/types";

// Revoke a pending invite (deletes the seat row). 204 on success.
export function useRevokeInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: MemberId) => apiDelete<void>(`/members/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}
