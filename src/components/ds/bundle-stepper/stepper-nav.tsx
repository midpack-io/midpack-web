"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StepperNavProps = {
  direction: "prev" | "next";
  disabled?: boolean;
  onClick: () => void;
};

// Edge-anchored scroll arrow for the stepper row.
// Hidden via opacity-0 + pointer-events-none when at the edge; staying mounted
// keeps the absolute position stable.
export function StepperNav({ direction, disabled, onClick }: StepperNavProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Прокрутити ліворуч" : "Прокрутити праворуч"}
      tabIndex={disabled ? -1 : 0}
      data-direction={direction}
      className={cn(
        "absolute top-[14px] z-10 flex size-[28px] -translate-y-1/2 items-center justify-center rounded-md border border-border-strong bg-surface text-zinc-700 shadow-sm transition-opacity duration-150 hover:bg-surface-3 hover:border-zinc-400 hover:text-foreground",
        direction === "prev" ? "left-[10px]" : "right-[10px]",
        disabled && "pointer-events-none opacity-0",
      )}
      style={{ top: "29px" }}
    >
      {direction === "prev" ? (
        <ChevronLeft className="size-[14px]" strokeWidth={2} />
      ) : (
        <ChevronRight className="size-[14px]" strokeWidth={2} />
      )}
    </button>
  );
}
