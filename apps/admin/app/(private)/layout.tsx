"use client";

import { ProtectedRoute, useAuth } from "@midpack/auth";
import { Button } from "@midpack/ui";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin>
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-dvh">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <span className="grid size-6 place-items-center rounded bg-primary text-xs text-primary-foreground">
            MP
          </span>
          Admin
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {user?.email ? <span>{user.email}</span> : null}
          <Button size="sm" variant="outline" onClick={() => logout()}>
            Sign out
          </Button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
