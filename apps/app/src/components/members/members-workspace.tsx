"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@midpack/auth";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Member, MemberStatus, UserId } from "@/lib/api/types";
import { useMembers } from "@/hooks/useMembers";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useInviteMembers } from "@/hooks/useInviteMembers";
import { useResendInvite } from "@/hooks/useResendInvite";
import { useRevokeInvite } from "@/hooks/useRevokeInvite";
import { useChangeRole } from "@/hooks/useChangeRole";
import { useDeactivateMember } from "@/hooks/useDeactivateMember";
import { useReactivateMember } from "@/hooks/useReactivateMember";
import { useMemberOpenWork } from "@/hooks/useMemberOpenWork";
import { MembersTable, type MemberSection } from "./members-table";
import { InviteDialog } from "./invite-dialog";
import { DeactivateDialog } from "./deactivate-dialog";
import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { countMembers, lastActivityLabel, roleLabel, usersById } from "./lib";

type Tab = "active" | "deactivated";
type StatusFilter = "all" | MemberStatus;
type RoleFilter = "all" | "owner" | "admin" | "member";
type Sort = "activity" | "name";

// Centers a section to the page's reading width. The sticky filter band lives
// OUTSIDE this so it can span the full content column when pinned.
const CENTER = "mx-auto w-full max-w-[1240px] px-[40px]";

// Detects when a sticky element is pinned: a zero-height sentinel placed just
// above it stops intersecting once it scrolls under the 48px top bar.
function useStuck() {
  const ref = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(entry ? !entry.isIntersecting : false),
      { rootMargin: "-48px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [stuck, ref] as const;
}

export function MembersWorkspace() {
  const { data: members, isLoading, isError, refetch } = useMembers();
  const { data: workspace } = useWorkspace();
  const { user } = useAuth();
  const currentUserId = (user?.id ?? "") as UserId;

  const [tab, setTab] = useState<Tab>("active");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [sort, setSort] = useState<Sort>("activity");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Member | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filtersStuck, filterSentinelRef] = useStuck();

  const invite = useInviteMembers();
  const resend = useResendInvite();
  const revoke = useRevokeInvite();
  const changeRole = useChangeRole();
  const deactivate = useDeactivateMember();
  const reactivate = useReactivateMember();
  const openWork = useMemberOpenWork(deactivateTarget?.id);

  const all = members ?? [];
  const counts = useMemo(() => countMembers(all), [all]);
  const lookup = useMemo(() => usersById(all), [all]);

  const sections = useMemo(
    () => buildSections({ all, tab, search, statusFilter, roleFilter, sort }),
    [all, tab, search, statusFilter, roleFilter, sort],
  );

  const candidates = useMemo(
    () =>
      all
        .filter((m) => m.status === "active" && m.user && m.id !== deactivateTarget?.id)
        .map((m) => m.user!),
    [all, deactivateTarget],
  );

  // Row actions — set a transient busy id so the row dims while the mutation runs.
  const actions = {
    onToggleAdmin: (m: Member) => {
      setBusyId(m.id);
      changeRole.mutate(
        { id: m.id, patch: { is_admin: !m.is_admin } },
        { onSettled: () => setBusyId(null) },
      );
    },
    onTransferOwnership: (m: Member) => {
      setBusyId(m.id);
      changeRole.mutate(
        { id: m.id, patch: { transfer_ownership: true } },
        { onSettled: () => setBusyId(null) },
      );
    },
    onDeactivate: (m: Member) => setDeactivateTarget(m),
    onResend: (m: Member) => {
      setBusyId(m.id);
      resend.mutate(m.id, { onSettled: () => setBusyId(null) });
    },
    onRevoke: (m: Member) => {
      setBusyId(m.id);
      revoke.mutate(m.id, { onSettled: () => setBusyId(null) });
    },
    onReactivate: (m: Member) => {
      setBusyId(m.id);
      reactivate.mutate(m.id, { onSettled: () => setBusyId(null) });
    },
  };

  return (
    <>
      <div className={CENTER}>
        <SettingsPageHeader
          eyebrow="Workspace"
          title="Members"
          sub={
            <>
              <Count n={counts.active} /> active · <Count n={counts.owner} /> Owner ·{" "}
              <Count n={counts.admin} /> Admin · <Count n={counts.member} /> Members ·{" "}
              <span className="text-warn">
                <Count n={counts.pending} /> pending
              </span>{" "}
              · <Count n={counts.deactivated} /> deactivated
            </>
          }
          actions={
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <Plus className="size-[14px]" />
              Invite people
            </Button>
          }
        />
      </div>

      {/* Sentinel: flips `filtersStuck` the moment the band pins under the top bar. */}
      <div ref={filterSentinelRef} aria-hidden className="h-0" />

      {/* Filter band — spans the full content column. It only paints white +
          border once stuck (otherwise it blends into the page). The table head
          pins right below it at top-[100px] (48px top bar + this band's 52px). */}
      <div
        className={cn(
          "sticky top-[48px] z-20 mb-[14px] border-b transition-colors duration-150",
          filtersStuck
            ? "border-border bg-surface shadow-sm"
            : "border-transparent bg-transparent",
        )}
      >
        <div className={cn(CENTER, "flex h-[52px] items-center justify-between gap-[12px]")}>
          <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
            <TabsList variant="line">
              <TabsTrigger value="active">
                Active <Count n={counts.active + counts.pending} />
              </TabsTrigger>
              <TabsTrigger value="deactivated">
                Deactivated <Count n={counts.deactivated} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap items-center gap-[8px]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or email…"
              className="h-8 w-[180px] text-[12.5px]"
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as StatusFilter)}
              options={[
                ["all", "All"],
                ["active", "Active"],
                ["pending", "Pending"],
                ["deactivated", "Deactivated"],
              ]}
            />
            <FilterSelect
              label="Role"
              value={roleFilter}
              onChange={(v) => setRoleFilter(v as RoleFilter)}
              options={[
                ["all", "All"],
                ["owner", "Owner"],
                ["admin", "Admin"],
                ["member", "Member"],
              ]}
            />
            <FilterSelect
              label="Sort"
              value={sort}
              onChange={(v) => setSort(v as Sort)}
              options={[
                ["activity", "Last activity"],
                ["name", "Name"],
              ]}
            />
          </div>
        </div>
      </div>

      <div className={CENTER}>
        {/* Table / states */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="rounded-xl border border-border bg-surface p-[24px] text-center">
            <p className="text-[13px] text-muted-foreground">Couldn't load members.</p>
            <Button size="sm" variant="outline" className="mt-[10px]" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <MembersTable
            sections={sections}
            currentUserId={currentUserId}
            usersById={lookup}
            busyId={busyId}
            {...actions}
          />
        )}

        <p className="mt-[14px] rounded-lg border border-dashed border-border px-[14px] py-[10px] text-[11.5px] text-muted-foreground">
          This page lists workspace seats only. External partners and one-off packet recipients are
          managed elsewhere.
        </p>
      </div>

      {/* Dialogs */}
      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        workspaceName={workspace?.name ?? "this workspace"}
        seatsUsed={counts.active}
        seatsLimit={workspace?.seats_limit ?? null}
        pending={invite.isPending}
        onSubmit={async (payload) => {
          await invite.mutateAsync(payload);
        }}
      />
      <DeactivateDialog
        open={deactivateTarget != null}
        onOpenChange={(o) => {
          if (!o) setDeactivateTarget(null);
        }}
        member={deactivateTarget}
        openWork={openWork.data ?? []}
        loadingWork={openWork.isLoading}
        candidates={candidates}
        pending={deactivate.isPending}
        onConfirm={async (reassignments) => {
          if (!deactivateTarget) return;
          await deactivate.mutateAsync({ id: deactivateTarget.id, reassignments });
          setDeactivateTarget(null);
        }}
      />
    </>
  );
}

function Count({ n }: { n: number }) {
  return <b className="font-mono font-semibold tabular-nums text-foreground">{n}</b>;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  const current = options.find(([v]) => v === value)?.[1] ?? "All";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 items-center gap-[6px] rounded-md border border-border bg-surface px-[10px] text-[12px] leading-none text-foreground transition-colors hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="text-muted-foreground">{label}:</span> {current}
        <ChevronDown className="size-[12px] text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map(([v, l]) => (
            <DropdownMenuRadioItem key={v} value={v}>
              {l}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-[12px] border-b border-border px-[18px] py-[14px] last:border-b-0">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex-1 space-y-[6px]">
            <Skeleton className="h-[12px] w-[160px]" />
            <Skeleton className="h-[10px] w-[220px]" />
          </div>
          <Skeleton className="h-[20px] w-[70px] rounded-full" />
          <Skeleton className="h-[20px] w-[100px] rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ── Filtering / grouping ────────────────────────────────────────────────────

function buildSections({
  all,
  tab,
  search,
  statusFilter,
  roleFilter,
  sort,
}: {
  all: Member[];
  tab: Tab;
  search: string;
  statusFilter: StatusFilter;
  roleFilter: RoleFilter;
  sort: Sort;
}): MemberSection[] {
  const q = search.trim().toLowerCase();
  const tabStatuses: MemberStatus[] = tab === "active" ? ["pending", "active"] : ["deactivated"];

  const matches = (m: Member) => {
    if (!tabStatuses.includes(m.status)) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (roleFilter !== "all" && roleLabel(m).toLowerCase() !== roleFilter) return false;
    if (q) {
      const hay = `${m.user?.name ?? ""} ${m.email}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  };

  const sortRows = (rows: Member[]) =>
    [...rows].sort((a, b) => {
      if (sort === "name") {
        return (a.user?.name ?? a.email).localeCompare(b.user?.name ?? b.email);
      }
      // activity — most recent first; nulls (never signed in) last
      const at = a.last_activity_at ? Date.parse(a.last_activity_at) : -Infinity;
      const bt = b.last_activity_at ? Date.parse(b.last_activity_at) : -Infinity;
      return bt - at;
    });

  const filtered = all.filter(matches);
  const by = (s: MemberStatus) => sortRows(filtered.filter((m) => m.status === s));

  const out: MemberSection[] = [];
  if (tab === "active") {
    const pending = by("pending");
    const earliest = pending.reduce<string | null>(
      (min, m) => (m.invited_at && (!min || m.invited_at < min) ? m.invited_at : min),
      null,
    );
    out.push({
      key: "pending",
      title: "Pending invitations",
      meta: pending.length
        ? `${pending.length} outstanding${earliest ? ` · earliest sent ${lastActivityLabel(earliest)}` : ""}`
        : "none outstanding",
      rows: pending,
    });
    const active = by("active");
    const c = countMembers(active);
    out.push({
      key: "active",
      title: "Active",
      meta: `${active.length} members · ${c.owner} Owner · ${c.admin} Admin · ${c.member} Members`,
      rows: active,
    });
  } else {
    const deactivated = by("deactivated");
    out.push({
      key: "deactivated",
      title: "Deactivated",
      meta: `${deactivated.length} members · history preserved · cannot sign in`,
      rows: deactivated,
    });
  }
  return out;
}
