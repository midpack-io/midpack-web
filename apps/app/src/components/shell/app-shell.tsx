import type { ReactNode } from "react";
import { Rail } from "./rail";

/** Outer shell — full-viewport grid with the rail on the left and the page
 *  column on the right. Each page still renders its own <TopBar> inside the
 *  right column; the column carries `min-w-0` so children can shrink past
 *  their intrinsic content width when the rail expands. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="grid min-h-screen items-stretch"
      style={{ gridTemplateColumns: "var(--rail-width, 256px) 1fr" }}
    >
      <Rail />
      <div className="flex min-w-0 flex-col">{children}</div>
    </div>
  );
}
