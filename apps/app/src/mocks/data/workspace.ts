import type { Workspace, WorkspaceId } from "@/lib/api/types";

// The single workspace this app instance belongs to. Stage 2 makes this a real
// per-tenant record; in stage 1 there's exactly one, read by the top-bar root
// crumb and the General settings form.
export const WORKSPACE: Workspace = {
  id: "ws-cher17" as WorkspaceId,
  name: "CHER'17",
  handle: "cher17",
};
