import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPatch } from "@/lib/api";
import type { Member, MemberId } from "@/lib/api/types";

export interface ChangeRoleInput {
  id: MemberId;
  // Flags-only role model: toggle workspace admin, or transfer ownership (Owner is
  // a single seat that is transferred, never assigned as a flag).
  patch: { is_admin?: boolean; transfer_ownership?: boolean };
}

export function useChangeRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: ChangeRoleInput) => apiPatch<Member>(`/members/${id}`, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}
