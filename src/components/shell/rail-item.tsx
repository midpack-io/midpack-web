"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type IconProps = { className?: string; strokeWidth?: number };

export type RailItemProps = {
  icon: ComponentType<IconProps>;
  label: string;
  href?: string;
  /** When set, the item is active if `pathname.startsWith(activeMatch)`.
   *  When omitted, falls back to exact-match on href. */
  activeMatch?: string;
  /** Force active state — used by Settings nav items where we want exact-page match. */
  active?: boolean;
  badge?: ReactNode;
  /** Coral dot at the right edge (e.g. unread mentions presence). */
  attentionDot?: boolean;
  /** Small mono kbd hint that shows on hover. */
  kbd?: string;
  onClick?: () => void;
  className?: string;
};

export function RailItem({
  icon: Icon,
  label,
  href,
  activeMatch,
  active: activeProp,
  badge,
  attentionDot,
  kbd,
  onClick,
  className,
}: RailItemProps) {
  const pathname = usePathname();
  const isActive =
    activeProp ??
    (href
      ? activeMatch
        ? pathname.startsWith(activeMatch)
        : pathname === href
      : false);

  const inner = (
    <>
      <Icon
        className={cn(
          "size-[15px] shrink-0 transition-colors",
          isActive ? "text-foreground" : "text-zinc-500",
        )}
        strokeWidth={1.3}
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge ? (
        <span className="ml-auto rounded-sm bg-surface-3 px-[6px] py-[1.5px] font-mono text-[10.5px] font-medium leading-none tabular-nums text-zinc-400">
          {badge}
        </span>
      ) : null}
      {attentionDot ? (
        <span
          aria-hidden
          className="ml-auto size-[6px] rounded-full bg-coral shadow-[0_0_0_2px_var(--color-surface)]"
        />
      ) : null}
      {kbd ? (
        <span className="ml-auto font-mono text-[10px] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
          {kbd}
        </span>
      ) : null}
    </>
  );

  const baseClass = cn(
    "group relative flex w-full items-center gap-[8px] rounded-[6px] px-[8px] py-[8px] text-left text-[12.5px] transition-colors",
    isActive
      ? "bg-surface-3 font-medium text-foreground"
      : "text-zinc-700 hover:bg-black/[0.05] hover:text-foreground",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClass}
        aria-current={isActive ? "page" : undefined}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClass}>
      {inner}
    </button>
  );
}
