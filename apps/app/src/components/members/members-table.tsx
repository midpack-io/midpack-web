"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Member, MemberStatus, MemberUser, UserId } from "@/lib/api/types";
import { MemberAvatar } from "./member-avatar";
import { MemberStatusChip } from "@/components/ds/member-status-chip";
import { RoleChip } from "@/components/ds/role-chip";
import {
  deactivatedMeta,
  dormancy,
  inviteExpiry,
  invitedByLine,
  lastActivityLabel,
} from "./lib";

export interface MemberSection {
  key: MemberStatus;
  title: string;
  meta: string;
  rows: Member[];
}

export interface MemberRowActions {
  onToggleAdmin: (m: Member) => void;
  onTransferOwnership: (m: Member) => void;
  onDeactivate: (m: Member) => void;
  onResend: (m: Member) => void;
  onRevoke: (m: Member) => void;
  onReactivate: (m: Member) => void;
}

interface Props extends MemberRowActions {
  sections: MemberSection[];
  currentUserId: UserId;
  usersById: Map<UserId, MemberUser>;
  busyId: string | null;
}

const GRID = "grid grid-cols-[1fr_104px_150px_120px_64px_32px] items-center gap-[14px]";
const HEAD_CELL = "font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400";

export function MembersTable({
  sections,
  currentUserId,
  usersById,
  busyId,
  ...actions
}: Props) {
  return (
    // No overflow-hidden: it would make this a non-scrolling scroll-container and
    // break the sticky header. The header rounds its own top corners instead.
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      {/* Column header — sticks below the top bar (48px) + the members filter
          band (52px) = 100px, so it pins right under the sticky filters. */}
      <div
        className={cn(
          GRID,
          "sticky top-[100px] z-10 rounded-t-xl border-b border-border bg-surface-2 px-[18px] py-[9px]",
        )}
      >
        <span className={HEAD_CELL}>Person</span>
        <span className={HEAD_CELL}>Role</span>
        <span className={HEAD_CELL}>Status</span>
        <span className={HEAD_CELL}>Last activity</span>
        <span className={HEAD_CELL}>Open</span>
        <span className="sr-only">Actions</span>
      </div>

      {sections.map((section) => (
        <section key={section.key}>
          <div className="flex items-center justify-between border-b border-border bg-surface-2 px-[18px] py-[6px]">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              {section.title}
            </span>
            <span className="font-mono text-[10.5px] text-zinc-400">{section.meta}</span>
          </div>
          {section.rows.length === 0 ? (
            <p className="px-[18px] py-[18px] text-[12.5px] text-muted-foreground">
              {section.key === "pending"
                ? "No outstanding invitations."
                : `No ${section.key} members.`}
            </p>
          ) : (
            section.rows.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                isYou={m.user?.id === currentUserId}
                usersById={usersById}
                busy={busyId === m.id}
                {...actions}
              />
            ))
          )}
        </section>
      ))}
    </div>
  );
}

function MemberRow({
  member,
  isYou,
  usersById,
  busy,
  ...actions
}: { member: Member; isYou: boolean; usersById: Map<UserId, MemberUser>; busy: boolean } & MemberRowActions) {
  const { status } = member;
  const name = member.user?.name ?? member.email;

  // Status subline.
  let meta: string | null = null;
  let atRisk = false;
  if (status === "active") {
    meta = member.is_owner ? "workspace creator" : dormancy(member.last_activity_at);
  } else if (status === "pending") {
    const exp = inviteExpiry(member.expires_at);
    meta = exp?.text ?? null;
    atRisk = exp?.atRisk ?? false;
  } else {
    meta = deactivatedMeta(
      member.deactivated_by_id ? usersById.get(member.deactivated_by_id)?.name : undefined,
      member.deactivated_at,
    );
  }

  const deactivated = status === "deactivated";

  return (
    <div
      className={cn(
        GRID,
        "border-b border-border px-[18px] py-[14px] transition-colors last:border-b-0 hover:bg-surface-2",
        isYou && "bg-gradient-to-r from-accent-soft/60 to-transparent",
        busy && "opacity-50",
      )}
    >
      {/* Person */}
      <div className="flex min-w-0 items-center gap-[10px]">
        <MemberAvatar member={member} className="size-8 shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-[6px]">
            <span
              className={cn(
                "truncate text-[13.5px] font-medium tracking-[-0.005em]",
                deactivated ? "text-zinc-400" : "text-foreground",
                status === "pending" && "text-foreground",
              )}
            >
              {name}
            </span>
            {isYou ? (
              <span className="rounded-full bg-accent-soft px-[6px] py-[1px] font-mono text-[9.5px] font-semibold uppercase tracking-[0.04em] text-accent-ink">
                You
              </span>
            ) : null}
          </div>
          <div
            className={cn(
              "truncate font-mono text-[11.5px]",
              deactivated ? "text-zinc-300" : "text-muted-foreground",
            )}
          >
            {status === "pending"
              ? invitedByLine(
                  member.invited_by_id ? usersById.get(member.invited_by_id)?.name : undefined,
                  member.invited_at,
                )
              : member.email}
          </div>
        </div>
      </div>

      {/* Role */}
      <div>
        <RoleChip isOwner={member.is_owner} isAdmin={member.is_admin} />
      </div>

      {/* Status */}
      <MemberStatusChip status={status} meta={meta} atRisk={atRisk} />

      {/* Last activity */}
      <span
        className={cn(
          "font-mono text-[11.5px] tabular-nums",
          status === "pending" && "text-zinc-400 italic",
          deactivated ? "text-zinc-300" : "text-muted-foreground",
        )}
      >
        {lastActivityLabel(member.last_activity_at)}
      </span>

      {/* Open work */}
      <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
        {member.open_work_count > 0 ? member.open_work_count : "—"}
      </span>

      {/* Actions */}
      <RowMenu member={member} isYou={isYou} {...actions} />
    </div>
  );
}

function RowMenu({
  member,
  isYou,
  onToggleAdmin,
  onTransferOwnership,
  onDeactivate,
  onResend,
  onRevoke,
  onReactivate,
}: { member: Member; isYou: boolean } & MemberRowActions) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${member.user?.name ?? member.email}`}
        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {member.status === "pending" ? (
          <>
            <DropdownMenuItem onSelect={() => onResend(member)}>Resend invite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onRevoke(member)}>
              Revoke invite
            </DropdownMenuItem>
          </>
        ) : member.status === "deactivated" ? (
          <DropdownMenuItem onSelect={() => onReactivate(member)}>Reactivate</DropdownMenuItem>
        ) : (
          // active
          <>
            {!member.is_owner ? (
              <DropdownMenuItem onSelect={() => onToggleAdmin(member)}>
                {member.is_admin ? "Remove admin" : "Make admin"}
              </DropdownMenuItem>
            ) : null}
            {!isYou ? (
              <DropdownMenuItem onSelect={() => onTransferOwnership(member)}>
                Transfer ownership…
              </DropdownMenuItem>
            ) : null}
            {!member.is_owner ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => onDeactivate(member)}>
                  Deactivate…
                </DropdownMenuItem>
              </>
            ) : null}
            {member.is_owner ? (
              <DropdownMenuItem disabled>Owner — transfer to change</DropdownMenuItem>
            ) : null}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
