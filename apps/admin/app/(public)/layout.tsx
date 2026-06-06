"use client";

import { PublicRoute } from "@midpack/auth";
import { HeroPanel } from "@midpack/ui";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicRoute>
      <div className="grid min-h-dvh lg:grid-cols-2">
        <HeroPanel subtitle="Manage the Midpack platform." />
        <div className="flex items-center justify-center px-6 py-12">{children}</div>
      </div>
    </PublicRoute>
  );
}
