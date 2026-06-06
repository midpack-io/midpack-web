"use client";

import { redirect } from "next/navigation";
import { useAuth } from "./use-auth";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const defaultFallback = (
  <div className="flex h-dvh items-center justify-center bg-background">
    <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
  </div>
);

export function PublicRoute({
  children,
  redirectTo = "/",
  fallback = defaultFallback,
}: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <>{fallback}</>;

  if (isAuthenticated) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
