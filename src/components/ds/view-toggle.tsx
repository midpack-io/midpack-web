"use client";

import { type LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ViewToggleOption<T extends string> = {
  id: T;
  label: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

type ViewToggleProps<T extends string> = {
  options: ViewToggleOption<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
};

// Segmented icon-button group. Coming-soon options render disabled with a
// shadcn Tooltip explaining why. Supports 2–N options.
export function ViewToggle<T extends string>({
  options,
  active,
  onChange,
  className,
}: ViewToggleProps<T>) {
  return (
    <div
      className={cn(
        "flex h-[28px] items-center gap-[1px] rounded-md border border-border bg-surface-2 p-[2px]",
        className,
      )}
      role="group"
    >
      {options.map((opt) => (
        <ViewToggleButton
          key={opt.id}
          option={opt}
          active={active === opt.id}
          onClick={() => onChange(opt.id)}
        />
      ))}
    </div>
  );
}

function ViewToggleButton<T extends string>({
  option,
  active,
  onClick,
}: {
  option: ViewToggleOption<T>;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;
  const button = (
    <button
      type="button"
      onClick={option.comingSoon ? undefined : onClick}
      aria-label={option.label}
      aria-disabled={option.comingSoon}
      className={cn(
        "flex h-[22px] w-[30px] items-center justify-center rounded-sm transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-zinc-500 hover:text-foreground",
        option.comingSoon && "cursor-default opacity-50 hover:text-zinc-500",
      )}
    >
      <Icon className="size-[12px]" strokeWidth={1.8} />
    </button>
  );
  if (!option.comingSoon) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="bottom">{option.label} view — coming soon</TooltipContent>
    </Tooltip>
  );
}
