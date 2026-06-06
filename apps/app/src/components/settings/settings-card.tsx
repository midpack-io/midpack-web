import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  variant?: "default" | "danger";
  className?: string;
  children: ReactNode;
};

export function SettingsCard({ variant = "default", className, children }: CardProps) {
  return (
    <div
      className={cn(
        "mb-[18px] overflow-hidden rounded-[12px] border bg-surface shadow-sm",
        variant === "danger"
          ? "border-coral-ring [background-image:linear-gradient(180deg,rgba(253,236,234,0.45)_0%,var(--color-surface)_70%)]"
          : "border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

type HeaderProps = {
  title: string;
  sub?: ReactNode;
  actions?: ReactNode;
  variant?: "default" | "danger";
};

export function SettingsCardHeader({ title, sub, actions, variant = "default" }: HeaderProps) {
  return (
    <div className="flex items-center gap-[12px] border-b border-border px-[18px] py-[12px] pt-[14px]">
      {variant === "danger" ? (
        <span aria-hidden className="inline-block size-[5px] rounded-full bg-coral" />
      ) : null}
      <h2
        className={cn(
          "m-0 text-[14px] font-semibold tracking-[-0.005em]",
          variant === "danger" ? "text-coral" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {sub ? <span className="ml-[4px] text-[12px] text-zinc-500">{sub}</span> : null}
      {actions ? (
        <div className="ml-auto inline-flex items-center gap-[6px]">{actions}</div>
      ) : null}
    </div>
  );
}

export function SettingsCardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("py-[4px]", className)}>{children}</div>;
}
