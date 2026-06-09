"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { TopBar } from "@/components/shell/top-bar";
import { cn } from "@/lib/utils";

const SECTION_LABELS: Record<string, string> = {
  "/settings/general": "Загальні",
  "/settings/members": "Учасники",
  "/settings/billing": "Тариф і оплата",
  "/settings/workflows": "Шаблони процесів",
  "/settings/integrations": "Інтеграції",
  "/settings/transit-export": "Транзит і експорт",
  "/settings/profile": "Профіль",
  "/settings/notifications": "Сповіщення",
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const section = SECTION_LABELS[pathname];
  // Members manages its own width: it spans the full content column so the sticky
  // filter band can run edge-to-edge, then re-centers its header/table internally
  // (see CENTER in members-workspace). The form-style pages keep the 880px column.
  const fullBleed = pathname === "/settings/members";

  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[
          { label: "Налаштування", href: "/settings/general" },
          ...(section ? [{ label: section }] : []),
        ]}
      />
      <div
        className={cn(
          "mx-auto w-full pt-[28px] pb-[64px]",
          fullBleed ? "max-w-none px-0" : "max-w-[880px] px-[40px]",
        )}
      >
        {children}
      </div>
    </main>
  );
}
