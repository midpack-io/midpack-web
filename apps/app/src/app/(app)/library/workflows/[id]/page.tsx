import { WorkflowEditor } from "@/components/workflow-editor/workflow-editor";

// The workflow-template canvas editor. URL noun stays `workflows`; the product
// noun is "workflow template". The editor opens on the reference collection
// flow (sample-data.ts) — wiring to live data by `id` is a later, drop-in step.
export default async function WorkflowEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowEditor templateId={id} />;
}
