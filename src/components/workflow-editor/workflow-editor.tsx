"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/shell/top-bar";
import { cn } from "@/lib/utils";
import { EditorHeader } from "./editor-header";
import { EditorError, EditorSkeleton } from "./editor-states";
import { FlowCanvas } from "./flow-canvas";
import { NodeInspector } from "./node-inspector";
import { useWorkflowEditor } from "./use-workflow-editor";

// The workflow-template canvas editor. All state is local (see
// use-workflow-editor.ts); a reload resets to the sample. `templateId` is
// threaded for breadcrumb/title parity and to be the obvious wiring point when
// the data layer lands — the page opens on the reference 9-stage flow regardless.
type Phase = "loading" | "ready" | "error";

export function WorkflowEditor({ templateId }: { templateId: string }) {
  const editor = useWorkflowEditor();
  const [phase, setPhase] = useState<Phase>("loading");

  // Simulate a brief load flash from local state so the skeleton is a real,
  // designed moment rather than something skipped.
  useEffect(() => {
    if (phase !== "loading") return;
    const t = window.setTimeout(() => setPhase("ready"), 620);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        breadcrumbs={[
          { label: "Library", href: "/library?tab=workflows" },
          { label: editor.state.name },
        ]}
      />

      <div className="relative flex min-h-0 flex-1 flex-col">
        {phase === "loading" ? (
          <EditorSkeleton />
        ) : phase === "error" ? (
          <EditorError onRetry={() => setPhase("loading")} />
        ) : (
          <>
            <EditorHeader editor={editor} />
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <FlowCanvas editor={editor} />
              <NodeInspector editor={editor} node={editor.selectedNode} />
              <FlashToast message={editor.flash} />
            </div>
          </>
        )}
      </div>

      {/* `templateId` is intentionally read so the prop is the documented wiring
          seam for the future data layer; it does not affect the sample render. */}
      <span hidden data-template-id={templateId} />
    </div>
  );
}

function FlashToast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-none absolute bottom-[22px] left-1/2 z-30 -translate-x-1/2",
        "inline-flex items-center gap-[8px] rounded-full border border-border bg-foreground px-[14px] py-[8px] text-[12px] font-medium text-white shadow-lg",
        "animate-in fade-in slide-in-from-bottom-2 duration-200",
      )}
    >
      <CheckCircle2 className="size-[14px] text-ok-soft" strokeWidth={2} />
      {message}
    </div>
  );
}
