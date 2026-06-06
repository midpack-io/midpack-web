"use client";

import { PublicRoute } from "@midpack/auth";
import { HeroPanel } from "@midpack/ui";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicRoute redirectTo="/collections">
      <div className="grid min-h-dvh lg:grid-cols-2">
        <HeroPanel />
        <div className="flex items-center justify-center px-6 py-12">{children}</div>
      </div>
    </PublicRoute>
  );
}
