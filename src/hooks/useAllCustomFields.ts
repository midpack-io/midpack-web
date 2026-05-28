import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { CustomFieldDef } from "@/lib/api/types";

// Custom-field schema merged across all collections — backs the Worklist
// "+ Filter" menu.
export function useAllCustomFields() {
  return useQuery({
    queryKey: ["custom-fields", "all"] as const,
    queryFn: () => apiGet<CustomFieldDef[]>("/custom-fields"),
  });
}
