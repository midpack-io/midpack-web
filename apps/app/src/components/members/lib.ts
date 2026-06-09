// Label/derivation helpers for the Members page. Everything here is rendered, not
// stored (handoffs/members-implementation-plan.md §3): role labels, relative
// activity, dormancy, invite expiry, and the header/section aggregate counts.
//
// The rest of the app renders relative time in Ukrainian via product-ui/lib/time.ts;
// the Members screen follows the (English) design handoff, so it carries its own
// English formatters, pinned to the same stage-1 "now" so seeded ISO strings render
// stable labels.

import type { Member, MemberStatus, MemberUser, UserId } from "@/lib/api/types";

const NOW_ISO = "2026-05-22T15:00:00.000Z"; // mirrors product-ui/lib/time.ts NOW_ISO
const NOW = new Date(NOW_ISO).getTime();
const DAY = 86_400_000;

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// "just now" / "5 min ago" / "1 hour ago" / "today, 09:42" / "yesterday" /
// "3 days ago" / "Apr 30, 2026". Null = a pending seat that never signed in.
export function lastActivityLabel(iso: string | null): string {
  if (!iso) return "Never signed in";
  const then = new Date(iso).getTime();
  const min = Math.round((NOW - then) / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  const sameDay = iso.slice(0, 10) === NOW_ISO.slice(0, 10);
  if (sameDay && hr >= 4) {
    const d = new Date(iso);
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    return `today, ${hh}:${mm}`;
  }
  if (hr < 24) return `${hr} ${hr === 1 ? "hour" : "hours"} ago`;
  const days = Math.round(hr / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return fmtDate(iso);
}

// "dormant 5d" / "dormant 3w" for an active member idle ≥ 5 days; null otherwise.
export function dormancy(iso: string | null): string | null {
  if (!iso) return null;
  const days = Math.floor((NOW - new Date(iso).getTime()) / DAY);
  if (days < 5) return null;
  if (days < 14) return `dormant ${days}d`;
  return `dormant ${Math.round(days / 7)}w`;
}

// "Expires in 2d 4h" — at-risk (amber) under 72h, "Expired" once past.
export function inviteExpiry(
  iso: string | undefined,
): { text: string; atRisk: boolean } | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - NOW;
  if (diff <= 0) return { text: "Expired", atRisk: true };
  const totalHr = Math.floor(diff / 3_600_000);
  const d = Math.floor(totalHr / 24);
  const h = totalHr % 24;
  return { text: d > 0 ? `Expires in ${d}d ${h}h` : `Expires in ${h}h`, atRisk: diff < 3 * DAY };
}

// "Invited by Anna · 5 days ago" — name resolved from the members roster.
export function invitedByLine(name: string | undefined, invitedAt: string | undefined): string {
  const who = name ?? "someone";
  return invitedAt ? `Invited by ${who} · ${lastActivityLabel(invitedAt)}` : `Invited by ${who}`;
}

// "by Anna · Mar 12, 2026" deactivation subline.
export function deactivatedMeta(name: string | undefined, iso: string | undefined): string {
  const who = name ?? "an admin";
  return iso ? `by ${who} · ${fmtDate(iso)}` : `by ${who}`;
}

// Role label/precedence is derived from the flags (flags-only model): owner → admin
// → member. Manager/Performer tiers are intentionally collapsed to "Member".
export type RoleLabel = "Owner" | "Admin" | "Member";
export function roleLabel(m: Pick<Member, "is_owner" | "is_admin">): RoleLabel {
  if (m.is_owner) return "Owner";
  if (m.is_admin) return "Admin";
  return "Member";
}

// A user-id → joined-user lookup, so a row can resolve its inviter / deactivator
// name from the same list (both are themselves members).
export function usersById(members: Member[]): Map<UserId, MemberUser> {
  const map = new Map<UserId, MemberUser>();
  for (const m of members) if (m.user) map.set(m.user.id, m.user);
  return map;
}

export interface MemberCounts {
  active: number;
  owner: number;
  admin: number;
  member: number;
  pending: number;
  deactivated: number;
}

export function countMembers(members: Member[]): MemberCounts {
  const c: MemberCounts = { active: 0, owner: 0, admin: 0, member: 0, pending: 0, deactivated: 0 };
  for (const m of members) {
    if (m.status === "pending") c.pending++;
    else if (m.status === "deactivated") c.deactivated++;
    else {
      c.active++;
      if (m.is_owner) c.owner++;
      else if (m.is_admin) c.admin++;
      else c.member++;
    }
  }
  return c;
}

export const STATUS_TAB_ORDER: MemberStatus[] = ["pending", "active", "deactivated"];

// Basic RFC-lite email check, mirrored by the MSW invite handler.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
