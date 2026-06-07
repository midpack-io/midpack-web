"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";

type Lang = "UA" | "EN";

// UI-only locale toggle (no i18n wiring yet — real translation lands later).
export function LanguageSwitcher() {
  const [lang, setLang] = useState<Lang>("UA");
  return (
    <div
      role="group"
      aria-label="Мова інтерфейсу"
      className="inline-flex h-[28px] items-center gap-[2px] rounded-md bg-surface-2 p-[2px]"
    >
      {(["UA", "EN"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLang(value)}
          aria-pressed={lang === value}
          className={cn(
            "inline-flex h-[24px] cursor-pointer items-center rounded-[5px] px-[8px] font-mono text-[11px] uppercase leading-none tracking-[0.04em] outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-accent-ring",
            lang === value
              ? "bg-surface text-foreground shadow-sm"
              : "text-zinc-500 hover:text-foreground",
          )}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
