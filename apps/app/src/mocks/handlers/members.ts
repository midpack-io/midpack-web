import { delay, http, HttpResponse } from "msw";
import type { Member, MemberId, ReassignTarget } from "@/lib/api/types";
import { CURRENT_USER_ID, MEMBERS, membersById, openWorkFor } from "../data/members";
import { WORKSPACE } from "../data/workspace";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

// Stage-1 "now", pinned to the same clock as product-ui/lib/time.ts so freshly
// created invites read "just now" / "Expires in 7d".
const NOW_ISO = "2026-05-22T15:00:00.000Z";
const NOW = new Date(NOW_ISO).getTime();
const WEEK_MS = 7 * 86_400_000;

// The "backend" validates emails independently of the client chip input — a
// deliberate copy across the seam (stage-2 the server re-validates in Python).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const err = (status: number, code: string, message: string, extra?: Record<string, unknown>) =>
  HttpResponse.json({ detail: { code, message, ...extra } }, { status });

const notFound = () => new HttpResponse(null, { status: 404 });

// Seats consumed = active members (matches the "12/20" the prototype displays;
// pending invites don't hold a seat until accepted).
const seatsUsed = () => MEMBERS.filter((m) => m.status === "active").length;

interface InviteBody {
  emails: string[];
  is_admin?: boolean;
  welcome_note?: string;
}
interface PatchBody {
  is_admin?: boolean;
  transfer_ownership?: boolean;
}
interface DeactivateBody {
  reassignments?: ReassignTarget[];
}

export const membersHandlers = [
  // List — feeds the whole table.
  http.get(`${BASE}/members`, async () => {
    await delay(60);
    return HttpResponse.json(MEMBERS);
  }),

  // In-flight bundles for a member's deactivate gate.
  http.get(`${BASE}/members/:id/open-work`, ({ params }) => {
    const m = membersById.get(params.id as string);
    if (!m) return notFound();
    return HttpResponse.json(openWorkFor(m.id));
  }),

  // Batch invite (State B). Skips invalid / duplicate emails; enforces the seat cap.
  http.post(`${BASE}/members/invitations`, async ({ request }) => {
    const body = (await request.json()) as InviteBody;
    const existing = new Set(MEMBERS.map((m) => m.email.toLowerCase()));
    const seen = new Set<string>();
    const valid: string[] = [];
    for (const raw of body.emails ?? []) {
      const email = raw.trim().toLowerCase();
      if (!EMAIL_RE.test(email) || existing.has(email) || seen.has(email)) continue;
      seen.add(email);
      valid.push(email);
    }
    if (valid.length === 0) {
      return err(422, "no_valid_emails", "No valid, new email addresses to invite.");
    }
    const limit = WORKSPACE.seats_limit;
    if (limit != null && seatsUsed() + valid.length > limit) {
      return err(422, "seat_limit_exceeded", "Not enough seats for this invitation.", {
        used: seatsUsed(),
        limit,
        requested: valid.length,
      });
    }

    const created: Member[] = valid.map((email, i) => {
      const member: Member = {
        id: `m-inv-${NOW}-${i}` as MemberId,
        status: "pending",
        is_owner: false,
        is_admin: Boolean(body.is_admin),
        email,
        user: null,
        last_activity_at: null,
        open_work_count: 0,
        invited_by_id: CURRENT_USER_ID,
        invited_at: new Date(NOW).toISOString(),
        expires_at: new Date(NOW + WEEK_MS).toISOString(),
      };
      MEMBERS.push(member);
      membersById.set(member.id, member);
      return member;
    });
    return HttpResponse.json(created, { status: 201 });
  }),

  // Resend a pending invite — refreshes the 7-day window.
  http.post(`${BASE}/members/:id/resend`, ({ params }) => {
    const m = membersById.get(params.id as string);
    if (!m) return notFound();
    if (m.status !== "pending") return err(409, "not_pending", "Only pending invites can be resent.");
    m.invited_at = new Date(NOW).toISOString();
    m.expires_at = new Date(NOW + WEEK_MS).toISOString();
    return HttpResponse.json(m);
  }),

  // Change role flags (State A row menu). Optionally transfers ownership.
  http.patch(`${BASE}/members/:id`, async ({ params, request }) => {
    const m = membersById.get(params.id as string);
    if (!m) return notFound();
    const body = (await request.json()) as PatchBody;

    if (body.transfer_ownership) {
      if (!m.user) return err(409, "pending_owner", "Cannot transfer ownership to a pending invite.");
      for (const other of MEMBERS) if (other.is_owner) other.is_owner = false;
      m.is_owner = true;
      m.is_admin = true; // owner ⊇ admin
    }
    if (typeof body.is_admin === "boolean" && !m.is_owner) {
      m.is_admin = body.is_admin;
    }
    return HttpResponse.json(m);
  }),

  // Deactivate (State C). Gated: every in-flight bundle must have a replacement.
  http.post(`${BASE}/members/:id/deactivate`, async ({ params, request }) => {
    const m = membersById.get(params.id as string);
    if (!m) return notFound();
    if (m.is_owner) return err(409, "owner_locked", "Transfer ownership before deactivating the owner.");
    const body = (await request.json().catch(() => ({}))) as DeactivateBody;
    const reassignments = body.reassignments ?? [];
    const unresolved = openWorkFor(m.id).length - reassignments.filter((r) => r.replacement_id).length;
    if (unresolved > 0) {
      return err(422, "unresolved_reassignments", "Reassign every in-flight bundle first.", {
        remaining: unresolved,
      });
    }
    m.status = "deactivated";
    m.deactivated_by_id = CURRENT_USER_ID;
    m.deactivated_at = new Date(NOW).toISOString();
    m.open_work_count = 0;
    return HttpResponse.json(m);
  }),

  // Reactivate a deactivated seat.
  http.post(`${BASE}/members/:id/reactivate`, ({ params }) => {
    const m = membersById.get(params.id as string);
    if (!m) return notFound();
    m.status = "active";
    delete m.deactivated_by_id;
    delete m.deactivated_at;
    return HttpResponse.json(m);
  }),

  // Revoke a pending invite.
  http.delete(`${BASE}/members/:id`, ({ params }) => {
    const m = membersById.get(params.id as string);
    if (!m) return notFound();
    if (m.status !== "pending") return err(409, "not_pending", "Only pending invites can be revoked.");
    const idx = MEMBERS.findIndex((x) => x.id === m.id);
    if (idx >= 0) MEMBERS.splice(idx, 1);
    membersById.delete(m.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
