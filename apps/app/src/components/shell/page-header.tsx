import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: string;
  subline?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, subline, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-[24px] pt-[28px] pb-[16px]", className)}>
      <div className="flex flex-col gap-[10px]">
        {eyebrow && (
          <div className="flex items-center gap-[8px] font-mono text-xs uppercase tracking-[0.07em] text-zinc-500">
            <span className="h-[4px] w-[4px] rounded-[1px] bg-accent-strong" aria-hidden />
            {eyebrow}
          </div>
        )}
        <h1 className="text-h1 font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">{title}</h1>
        {subline && (
          <p className="text-base text-zinc-500 tabular-nums">{subline}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-[10px]">{actions}</div>}
    </div>
  );
}
