"use client";

import { PublicRoute } from "@midpack/auth";
import { BrandLink, HeroPanel, LanguageSwitcher } from "@midpack/ui";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicRoute redirectTo="/collections">
      <div className="flex min-h-dvh bg-bg">
        {/* Form column */}
        <div className="relative flex flex-1 flex-col">
          {/* Top bar — same placement as the landing header. */}
          <header className="flex items-center justify-between px-8 py-6 lg:px-12">
            <BrandLink />
            <LanguageSwitcher />
          </header>
          <div className="flex flex-1 items-center justify-center px-8 pb-16">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>

        {/* Apparel design-making imagery — inset rounded card; the form column
            stays flush so its header lines up with the landing header. */}
        <HeroPanel className="lg:m-4" />
      </div>
    </PublicRoute>
  );
}
