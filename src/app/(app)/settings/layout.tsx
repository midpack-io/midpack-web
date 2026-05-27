"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { TopBar } from "@/components/shell/top-bar";

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

  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[
          { label: "Робочий простір", href: "/" },
          { label: "Налаштування", href: "/settings/general" },
          ...(section ? [{ label: section }] : []),
        ]}
      />
      <div className="mx-auto w-full max-w-[880px] px-[40px] pt-[28px] pb-[64px]">
        {children}
      </div>
    </main>
  );
}
