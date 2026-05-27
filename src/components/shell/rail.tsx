"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { RailResizeHandle } from "./rail-resize-handle";
import { RailWorkspaceMode } from "./rail-workspace-mode";
import { RailSettingsMode } from "./rail-settings-mode";

export function Rail() {
  const pathname = usePathname();
  const isSettings = pathname.startsWith("/settings");

  return (
    <aside
      aria-label="App navigation"
      className="sticky top-0 z-20 flex h-screen flex-col overflow-visible border-r border-border bg-surface"
    >
      <RailResizeHandle />

      <Mode active={!isSettings}>
        <RailWorkspaceMode />
      </Mode>
      <Mode active={isSettings}>
        <RailSettingsMode />
      </Mode>
    </aside>
  );
}

function Mode({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      data-active={active ? "true" : "false"}
      className={cn(
        "absolute inset-0 flex flex-col transition-opacity duration-150",
        active
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      {children}
    </div>
  );
}
