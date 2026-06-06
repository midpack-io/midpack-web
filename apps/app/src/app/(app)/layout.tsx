import type { ReactNode } from "react";
import { ProtectedRoute } from "@midpack/auth";
import { AppShell } from "@/components/shell/app-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
