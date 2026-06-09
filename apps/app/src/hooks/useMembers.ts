import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Member } from "@/lib/api/types";

// The full workspace roster — pending, active, and deactivated seats. Feeds the
// Members settings table; section/aggregate counts are derived client-side.
export function useMembers() {
  return useQuery({
    queryKey: ["members"] as const,
    queryFn: () => apiGet<Member[]>("/members"),
  });
}
