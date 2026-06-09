// Stage-1 in-memory data for the Members settings page. Reset on full reload.
// Roster mirrors the design handoff prototype (handoffs/design_handoff_members):
// 3 pending invites, 12 active members, 2 deactivated. Identity (name/avatar) is
// the nested `user` projection; pending seats have `user: null`.
//
// Role is flags-only: `is_owner` + `is_admin`. The prototype's Manager/Performer
// tiers collapse to "Member" (handoffs/members-implementation-plan.md §6.1).

import type {
  Member,
  MemberId,
  MemberUser,
  ProductId,
  ReassignTarget,
  UserId,
} from "@/lib/api/types";

// The signed-in viewer (matches the mock auth user in handlers/auth.ts) — Anna,
// the workspace owner. Aligning the id makes `is_you` light up on her row.
// The seat cap lives on the workspace (data/workspace.ts → seats_limit).
export const CURRENT_USER_ID = "00000000-0000-0000-0000-000000000001" as UserId;

function user(id: string, name: string, avatarKey: MemberUser["avatar_key"]): MemberUser {
  const initial = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return { id: id as UserId, name, initial, avatar_key: avatarKey, avatar_url: null };
}

const anna = user(CURRENT_USER_ID, "Anna Kovalenko", "anna");
const marta = user("u-marta", "Marta Bondar", "marta");

export const MEMBERS: Member[] = [
  // ── Pending invitations ───────────────────────────────────────────────────
  {
    id: "m-valeriy" as MemberId,
    status: "pending",
    is_owner: false,
    is_admin: false,
    email: "valeriy@freelance.example",
    user: null,
    last_activity_at: null,
    open_work_count: 0,
    invited_by_id: anna.id,
    invited_at: "2026-05-17T15:00:00.000Z", // 5 days ago — earliest
    expires_at: "2026-05-24T19:00:00.000Z", // ~2d 4h — at-risk
  },
  {
    id: "m-daria" as MemberId,
    status: "pending",
    is_owner: false,
    is_admin: false,
    email: "daria.tk@gmail.com",
    user: null,
    last_activity_at: null,
    open_work_count: 0,
    invited_by_id: anna.id,
    invited_at: "2026-05-21T15:00:00.000Z", // yesterday
    expires_at: "2026-05-28T16:00:00.000Z",
  },
  {
    id: "m-vika" as MemberId,
    status: "pending",
    is_owner: false,
    is_admin: false,
    email: "vika@studio-partner.example",
    user: null,
    last_activity_at: null,
    open_work_count: 0,
    invited_by_id: marta.id,
    invited_at: "2026-05-22T13:00:00.000Z", // 2h ago
    expires_at: "2026-05-29T13:00:00.000Z",
  },

  // ── Active members ──────────────────────────────────────────────────────────
  {
    id: "m-anna" as MemberId,
    status: "active",
    is_owner: true,
    is_admin: true,
    email: "anna.kovalenko@igstudio.example",
    user: anna,
    last_activity_at: "2026-05-22T14:55:00.000Z", // 5 min ago
    open_work_count: 6,
  },
  {
    id: "m-olena" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: true,
    email: "olena.kravchuk@igstudio.example",
    user: user("u-olena", "Olena Kravchuk", "olena"),
    last_activity_at: "2026-05-22T13:00:00.000Z", // 2 hours ago
    open_work_count: 3,
  },
  {
    id: "m-marta" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "marta.bondar@igstudio.example",
    user: marta,
    last_activity_at: "2026-05-21T15:00:00.000Z", // yesterday
    open_work_count: 1,
  },
  {
    id: "m-lina" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "lina.hrytsenko@igstudio.example",
    user: user("u-lina", "Lina Hrytsenko", "lina"),
    last_activity_at: "2026-05-19T15:00:00.000Z", // 3 days ago
    open_work_count: 2,
  },
  {
    id: "m-pavlo" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "pavlo.shevchuk@igstudio.example",
    user: user("u-pavlo", "Pavlo Shevchuk", "pavlo"),
    last_activity_at: "2026-05-22T14:48:00.000Z", // 12 min ago
    open_work_count: 3, // see PAVLO_OPEN_WORK — the deactivate gate target
  },
  {
    id: "m-yuri" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "yuri.tkachenko@igstudio.example",
    user: user("u-yuri", "Yuri Tkachenko", "yuri"),
    last_activity_at: "2026-05-22T14:32:00.000Z", // 28 min ago
    open_work_count: 5,
  },
  {
    id: "m-roma" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "roma.petrenko@igstudio.example",
    user: user("u-roma", "Roma Petrenko", "roma"),
    last_activity_at: "2026-05-22T14:00:00.000Z", // 1 hour ago
    open_work_count: 7,
  },
  {
    id: "m-yulia" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "yulia.melnyk@igstudio.example",
    user: user("u-yulia", "Yulia Melnyk", "yulia"),
    last_activity_at: "2026-05-22T12:00:00.000Z", // 3 hours ago
    open_work_count: 2,
  },
  {
    id: "m-andriy" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "andriy.ivanov@igstudio.example",
    user: user("u-andriy", "Andriy Ivanov", "andriy"),
    last_activity_at: "2026-05-22T09:42:00.000Z", // today, 09:42
    open_work_count: 1,
  },
  {
    id: "m-sasha" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "sasha.volkov@igstudio.example",
    user: user("u-sasha", "Sasha Volkov", "sasha"),
    last_activity_at: "2026-05-20T15:00:00.000Z", // 2 days ago
    open_work_count: 3,
  },
  {
    id: "m-kostya" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "kostya.lysenko@igstudio.example",
    user: user("u-kostya", "Kostya Lysenko", "kostya"),
    last_activity_at: "2026-05-17T15:00:00.000Z", // 5 days ago — dormant 5d
    open_work_count: 0,
  },
  {
    id: "m-maryna" as MemberId,
    status: "active",
    is_owner: false,
    is_admin: false,
    email: "maryna.boyko@igstudio.example",
    user: user("u-maryna", "Maryna Boyko", "maryna"),
    last_activity_at: "2026-04-30T12:00:00.000Z", // Apr 30 — dormant 3w
    open_work_count: 0,
  },

  // ── Deactivated ───────────────────────────────────────────────────────────
  {
    id: "m-tetyana" as MemberId,
    status: "deactivated",
    is_owner: false,
    is_admin: false,
    email: "tetyana.romanenko@igstudio.example",
    user: user("u-tetyana", "Tetyana Romanenko", "tetyana"),
    last_activity_at: "2026-03-22T15:00:00.000Z", // 2 months ago
    open_work_count: 0,
    deactivated_by_id: anna.id,
    deactivated_at: "2026-03-12T00:00:00.000Z",
  },
  {
    id: "m-igor" as MemberId,
    status: "deactivated",
    is_owner: false,
    is_admin: false,
    email: "igor.bondarchuk@igstudio.example",
    user: user("u-igor", "Igor Bondarchuk", "igor"),
    last_activity_at: "2026-01-22T15:00:00.000Z", // 4 months ago
    open_work_count: 0,
    deactivated_by_id: anna.id,
    deactivated_at: "2026-01-28T00:00:00.000Z",
  },
];

export const membersById = new Map<string, Member>(MEMBERS.map((m) => [m.id, m]));

// ── Open-work fixtures (deactivate gate) ────────────────────────────────────
// Pavlo's three in-flight bundles from the prototype. The first is pre-resolved
// (Yuri takes it over); the other two start unresolved.
const PAVLO_OPEN_WORK: ReassignTarget[] = [
  {
    product_id: "prod-247" as ProductId,
    product_name: "Style 247 — Navy blazer",
    stage_n: "03",
    stage_label: "Тех-пак",
    kind: "performer",
    replacement_id: "u-yuri" as UserId, // pre-resolved in the prototype
  },
  {
    product_id: "prod-248" as ProductId,
    product_name: "Style 248 — Linen suit",
    stage_n: "04",
    stage_label: "Закупівля",
    kind: "performer",
  },
  {
    product_id: "prod-251" as ProductId,
    product_name: "Style 251 — Slip dress",
    stage_n: "04a",
    stage_label: "Закупівля (тканина)",
    kind: "performer",
  },
];

const STYLE_POOL: Array<{ product_id: string; product_name: string; stage_n: string; stage_label: string }> = [
  { product_id: "prod-301", product_name: "Style 301 — Wool coat", stage_n: "02", stage_label: "Дизайн" },
  { product_id: "prod-312", product_name: "Style 312 — Knit dress", stage_n: "05", stage_label: "Лекала" },
  { product_id: "prod-318", product_name: "Style 318 — Cargo pants", stage_n: "03", stage_label: "Тех-пак" },
  { product_id: "prod-324", product_name: "Style 324 — Silk blouse", stage_n: "06", stage_label: "Зразок" },
  { product_id: "prod-330", product_name: "Style 330 — Denim jacket", stage_n: "04", stage_label: "Закупівля" },
  { product_id: "prod-337", product_name: "Style 337 — Trench coat", stage_n: "07", stage_label: "Примірка" },
  { product_id: "prod-345", product_name: "Style 345 — Pleated skirt", stage_n: "02", stage_label: "Дизайн" },
];

// In-flight bundles for a member's deactivate gate. Pavlo uses the named prototype
// set; everyone else gets `open_work_count` generated targets so the gate is
// always exercisable.
export function openWorkFor(memberId: string): ReassignTarget[] {
  if (memberId === "m-pavlo") return PAVLO_OPEN_WORK.map((t) => ({ ...t }));
  const m = membersById.get(memberId);
  if (!m) return [];
  return Array.from({ length: m.open_work_count }, (_, i) => {
    const s = STYLE_POOL[i % STYLE_POOL.length]!;
    return {
      product_id: s.product_id as ProductId,
      product_name: s.product_name,
      stage_n: s.stage_n,
      stage_label: s.stage_label,
      kind: "performer" as const,
    };
  });
}
