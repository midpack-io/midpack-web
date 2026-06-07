import * as React from "react";
import { Badge } from "../ui/badge";
import { cn } from "../lib/utils";

type CfChipProps = {
  k: string;
  v: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function CfChip({ k, v, onClick, className }: CfChipProps) {
  const interactive = !!onClick;
  return (
    <Badge
      asChild={interactive}
      variant="ghost"
      className={cn(
        "gap-[6px] overflow-visible whitespace-nowrap rounded-sm border border-border bg-surface px-2 py-[3px] text-[12.5px] font-normal text-foreground transition-colors hover:border-border-strong hover:bg-surface-2",
        interactive && "cursor-pointer",
        className,
      )}
    >
      {interactive ? (
        <button type="button" onClick={onClick}>
          <span className="font-mono text-[12.5px] uppercase tracking-[0.04em] text-zinc-400">{k}</span>
          <span className="font-mono text-[12.5px] font-medium text-foreground">{v}</span>
        </button>
      ) : (
        <>
          <span className="font-mono text-[12.5px] uppercase tracking-[0.04em] text-zinc-400">{k}</span>
          <span className="font-mono text-[12.5px] font-medium text-foreground">{v}</span>
        </>
      )}
    </Badge>
  );
}

type CfChipAddProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function CfChipAdd({ children = "+ ПОЛЕ", onClick, className }: CfChipAddProps) {
  return (
    <Badge
      asChild
      variant="ghost"
      className={cn(
        "gap-[6px] rounded-sm border border-dashed border-border-strong bg-transparent px-2 py-[3px] font-mono text-[12.5px] uppercase tracking-[0.04em] text-zinc-500 transition-colors hover:bg-surface-3 hover:border-zinc-400 hover:text-foreground",
        className,
      )}
    >
      <button type="button" onClick={onClick}>
        {children}
      </button>
    </Badge>
  );
}
