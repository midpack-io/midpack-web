"use client";

import { ProtectedRoute, useAuth } from "@midpack/auth";
import { Logo, UserMenu } from "@midpack/ui";

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
        <Logo href="/" />
        <UserMenu
          name={user?.name ?? undefined}
          email={user?.email ?? undefined}
          onSignOut={() => void logout()}
        />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
