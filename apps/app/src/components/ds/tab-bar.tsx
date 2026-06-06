"use client";

import { cn } from "@/lib/utils";

export type TabItem<T extends string> = {
  id: T;
  label: string;
  count?: number;
  attention?: boolean;
};

type TabBarProps<T extends string> = {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
};

// Underline-style tabs with mono count chips and an optional coral attention
// dot. Used by the filter bars on /collections and /products.
export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: TabBarProps<T>) {
  return (
    <div className={cn("flex items-center gap-[2px]", className)}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          active={active === tab.id}
          count={tab.count}
          attention={tab.attention}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </TabButton>
      ))}
    </div>
  );
}

function TabButton({
  children,
  count,
  active,
  attention,
  onClick,
}: {
  children: React.ReactNode;
  count?: number;
  active: boolean;
  attention?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative -mb-px flex h-[44px] items-center gap-[7px] border-b-2 px-[12px] text-sm font-medium leading-none transition-colors",
        active
          ? "border-primary text-primary"
          : "border-transparent text-zinc-500 hover:text-foreground",
      )}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={cn(
            "rounded-sm px-[6px] py-[1.5px] font-mono text-[10.5px] font-medium leading-none tabular-nums",
            active ? "bg-primary text-primary-foreground" : "bg-surface-3 text-zinc-400",
          )}
        >
          {count}
        </span>
      )}
      {attention && (
        <span
          aria-hidden
          className="absolute right-[8px] top-[10px] size-[5px] rounded-full bg-coral"
        />
      )}
    </button>
  );
}
