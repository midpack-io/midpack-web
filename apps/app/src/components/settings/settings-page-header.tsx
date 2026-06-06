import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  sub?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/** Page header inside the settings pane — distinct from the shell's PageHeader
 *  because this one sits inside a max-width scroll column, lighter and quieter
 *  than the collection / products page headers. */
export function SettingsPageHeader({
  eyebrow,
  title,
  sub,
  actions,
  className,
}: Props) {
  return (
    <div className={cn("mb-[24px] flex items-end gap-[24px]", className)}>
      <div className="min-w-0 flex-1">
        <div className="mb-[6px] font-mono text-[10.5px] uppercase tracking-[0.08em] text-zinc-400">
          {eyebrow}
        </div>
        <h1 className="text-[22px] font-semibold leading-[1.1] tracking-[-0.01em] text-foreground">
          {title}
        </h1>
        {sub ? (
          <p className="mt-[6px] max-w-[580px] text-[13px] text-zinc-500">{sub}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="inline-flex shrink-0 items-center gap-[8px]">{actions}</div>
      ) : null}
    </div>
  );
}
