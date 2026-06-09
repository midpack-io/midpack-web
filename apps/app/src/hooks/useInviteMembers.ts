import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import type { Member } from "@/lib/api/types";

export interface InviteMembersInput {
  emails: string[];
  is_admin: boolean;
  welcome_note?: string;
}

// Batch invite (State B). Returns the created pending members; the server skips
// invalid/duplicate emails and 422s on an empty batch or seat-cap overflow.
export function useInviteMembers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: InviteMembersInput) => apiPost<Member[]>("/members/invitations", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}
