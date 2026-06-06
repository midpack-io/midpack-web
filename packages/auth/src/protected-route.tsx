"use client";

import { usePathname, redirect } from "next/navigation";
import { useAuth } from "./use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Midpack uses a single auth realm; gate the admin app on the user's is_admin
  // flag rather than a role enum.
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

const defaultFallback = (
  <div className="flex h-dvh items-center justify-center bg-background">
    <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
  </div>
);

export function ProtectedRoute({
  children,
  requireAdmin,
  fallback = defaultFallback,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (isLoading) return <>{fallback}</>;

  if (!isAuthenticated) {
    const loginUrl =
      pathname && pathname !== "/" && pathname !== "/login"
        ? `/login?returnUrl=${encodeURIComponent(pathname)}`
        : "/login";
    redirect(loginUrl);
  }

  if (requireAdmin && !user?.is_admin) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
