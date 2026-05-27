import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  hint?: ReactNode;
  control: ReactNode;
  help?: ReactNode;
  className?: string;
};

export function SettingsRow({ label, hint, control, help, className }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-[220px_1fr] items-start gap-[18px] border-b border-border px-[18px] py-[16px] last:border-b-0",
        className,
      )}
    >
      <div>
        <div className="text-[12.5px] font-medium text-foreground">{label}</div>
        {hint ? (
          <div className="mt-[4px] text-[11.5px] leading-[1.5] text-zinc-500">{hint}</div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col gap-[6px]">
        {control}
        {help ? (
          <div className="mt-[2px] text-[11.5px] text-zinc-400">{help}</div>
        ) : null}
      </div>
    </div>
  );
}
