import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// 24px squared filter chip per design handoff. Active = dark fill. Clicking an
// active chip again clears the filter (handled by the parent).
export function FilterChip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-[24px] items-center gap-[5px] rounded-[5px] border px-[9px] text-[11.5px] leading-none whitespace-nowrap transition-colors",
        active
          ? "border-foreground bg-foreground text-white"
          : "border-border bg-surface text-zinc-700 hover:border-muted hover:text-foreground",
      )}
    >
      {children}
      {typeof count === "number" && (
        <span
          className={cn(
            "font-mono text-[10.5px]",
            active ? "opacity-85" : "opacity-70",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
