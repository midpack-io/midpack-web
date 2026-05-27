import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PillColor =
  | "default"
  | "indigo"
  | "green"
  | "amber"
  | "pink"
  | "slate"
  | "teal";

const COLOR_STYLES: Record<PillColor, string> = {
  default: "bg-surface-3 text-zinc-700 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]",
  indigo: "bg-accent-soft text-accent-ink shadow-[inset_0_0_0_1px_rgba(79,70,229,0.12)]",
  green: "bg-ok-soft text-ok shadow-[inset_0_0_0_1px_rgba(47,122,74,0.14)]",
  amber: "bg-warn-soft text-warn shadow-[inset_0_0_0_1px_rgba(180,83,9,0.16)]",
  pink: "bg-[#fbe7ef] text-[#9d2b5a] shadow-[inset_0_0_0_1px_rgba(157,43,90,0.14)]",
  slate: "bg-[#e6ebf2] text-[#334155] shadow-[inset_0_0_0_1px_rgba(51,65,85,0.12)]",
  teal: "bg-[#d8efed] text-[#0f6e6a] shadow-[inset_0_0_0_1px_rgba(15,110,106,0.14)]",
};

type PillInlineProps = {
  children: React.ReactNode;
  color?: PillColor;
  className?: string;
};

export function PillInline({ children, color = "default", className }: PillInlineProps) {
  return (
    <Badge
      variant="ghost"
      className={cn(
        "rounded-sm border-0 px-[7px] pt-[4px] pb-[3px] font-mono text-[12.5px] font-medium uppercase leading-none tracking-[0.04em] transition-[filter,box-shadow] duration-150 hover:brightness-[0.96]",
        COLOR_STYLES[color],
        className,
      )}
    >
      {children}
    </Badge>
  );
}

type PillInlineAddProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function PillInlineAdd({ children = "+ ТЕГ", onClick, className }: PillInlineAddProps) {
  return (
    <Badge
      asChild
      variant="ghost"
      className={cn(
        "gap-[3px] rounded-sm border border-dashed border-border-strong bg-transparent px-[7px] pt-[3px] pb-[2px] pl-[6px] font-mono text-[12.5px] font-medium uppercase leading-none tracking-[0.04em] text-zinc-500 transition-colors hover:bg-surface-3 hover:border-zinc-400 hover:text-foreground",
        className,
      )}
    >
      <button type="button" onClick={onClick}>
        {children}
      </button>
    </Badge>
  );
}
