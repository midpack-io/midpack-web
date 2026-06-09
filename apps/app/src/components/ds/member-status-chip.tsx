import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MemberStatus } from "@/lib/api/types";

// Seat-lifecycle chip + optional subline, mirroring the design handoff's
// status-chip vocabulary. A sibling of the shared ds/status-chip (stage statuses)
// — it lives in the app because member lifecycle is workspace-domain, not generic.
//
// active = green halo · pending = amber, animated pulse + ring · deactivated = grey.

const LABEL: Record<MemberStatus, string> = {
  active: "ACTIVE",
  pending: "INVITATION PENDING",
  deactivated: "DEACTIVATED",
};

const CHIP: Record<MemberStatus, string> = {
  active: "bg-ok-soft text-ok",
  pending: "bg-warn-soft text-warn shadow-[0_0_0_1px_var(--color-warn-ring)_inset]",
  deactivated: "bg-surface-3 text-muted-foreground",
};

const DOT: Record<MemberStatus, string> = {
  active: "bg-ok",
  pending: "bg-warn member-pulse",
  deactivated: "bg-zinc-400",
};

type Props = {
  status: MemberStatus;
  // Optional subline (e.g. "workspace creator", "dormant 5d", "Expires in 2d 4h",
  // "by Anna · Mar 12, 2026"). `atRisk` tints it amber (expiring soon).
  meta?: string | null;
  atRisk?: boolean;
  className?: string;
};

export function MemberStatusChip({ status, meta, atRisk, className }: Props) {
  return (
    <div className={cn("flex flex-col items-start gap-[4px]", className)}>
      <Badge
        variant="ghost"
        // overflow-visible so the pending dot's pulsing ring isn't clipped by the
        // Badge primitive's overflow-hidden.
        className={cn(
          "h-[22px] gap-[6px] overflow-visible rounded-chip border-0 px-2 pt-[3px] pb-[2px] font-mono text-[10.5px] font-semibold uppercase leading-none tracking-[0.04em]",
          CHIP[status],
        )}
      >
        <span className={cn("inline-block size-[6px] shrink-0 rounded-full", DOT[status])} />
        {LABEL[status]}
      </Badge>
      {meta ? (
        <span
          className={cn(
            "pl-[2px] font-mono text-[10.5px] leading-none tracking-[0.02em]",
            atRisk ? "text-warn" : "text-muted-foreground",
          )}
        >
          {meta}
        </span>
      ) : null}
    </div>
  );
}
