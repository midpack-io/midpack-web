import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { WorkflowTemplate } from "@/lib/api/types";

// Workflow templates catalog — backs the /library Workflow templates tab.
export function useWorkflowTemplates() {
  return useQuery({
    queryKey: ["library", "workflows"] as const,
    queryFn: () => apiGet<WorkflowTemplate[]>("/library/workflows"),
  });
}
