import type {
  CollectionId,
  Notification,
  NotificationId,
  PersonId,
  ProductId,
} from "@/lib/api/types";

// Per-recipient inbox behind the top-bar bell. Flat + global (not collection
// scoped) — mirrors the worklist-views resource. Mutated in place by the
// handlers (mark read / mark all read); state resets on full page reload.
//
// Timestamps are anchored to the pinned NOW (2026-05-22T15:00Z in src/lib/time.ts)
// so the time buckets ("Сьогодні" / "Вчора" / …) render deterministically.

const SPRING = "col-spring-2026" as CollectionId;
// Marker written onto rows that are already read. The exact value is cosmetic
// (the panel only checks read vs unread) — any time after createdAt works.
const READ_AT = "2026-05-22T15:00:00.000Z";

// ISO timestamp `daysBefore` the pinned reference date, at hh:mm UTC.
function at(daysBefore: number, hh: number, mm: number): string {
  const d = new Date("2026-05-22T00:00:00.000Z");
  d.setUTCDate(d.getUTCDate() - daysBefore);
  d.setUTCHours(hh, mm, 0, 0);
  return d.toISOString();
}

// The 12 canonical notification variants from the design handoff, translated
// to Ukrainian. Body is a typed segment array (the stage-2 backend composes
// these from type + actor + target FKs — spec §9 stores no body text).
type Template = Omit<Notification, "id" | "createdAt" | "readAt">;

const TEMPLATES = {
  mention: {
    kind: "mention",
    actorId: "p-olena" as PersonId,
    body: [
      { t: "actor", s: "Olena" },
      { t: "text", s: " згадала вас у " },
      { t: "ref", s: "Linen wrap dress" },
      { t: "text", s: " у " },
      { t: "linkedref", s: "Resort '25" },
    ],
    quote: "@anna підтвердиш довжину низу до ретуші?",
    pill: { tone: "linked", label: "RESORT '25" },
    action: "Відповісти",
    collectionId: SPRING,
    productId: "prod-247" as ProductId,
  },
  review: {
    kind: "review",
    actorId: "p-yuri" as PersonId,
    body: [
      { t: "actor", s: "Yuri" },
      { t: "text", s: " попросив вашого рев'ю для " },
      { t: "ref", s: "SS24 Lookbook — Press kit" },
    ],
    pill: { tone: "amber", label: "СЬОГОДНІ" },
    action: "Переглянути",
    productId: "prod-248" as ProductId,
  },
  stage: {
    kind: "stage",
    actorId: "p-lina" as PersonId,
    body: [
      { t: "actor", s: "Lina" },
      { t: "text", s: " перемістила " },
      { t: "strong", s: "6 продуктів" },
      { t: "text", s: " у Ретуш у " },
      { t: "linkedref", s: "Resort '25" },
    ],
    action: "Відкрити",
    collectionId: SPRING,
  },
  deadline: {
    kind: "deadline",
    actorId: null,
    urgent: true,
    body: [
      { t: "linkedref", s: "Resort '25" },
      { t: "text", s: " відвантажується за " },
      { t: "strong", s: "2 дні" },
      { t: "text", s: " — 6 продуктів ще в QA" },
    ],
    pill: { tone: "coral", label: "ПІД РИЗИКОМ" },
    action: "Відкрити",
    collectionId: SPRING,
  },
  approve: {
    kind: "approve",
    actorId: "p-marta" as PersonId,
    body: [
      { t: "actor", s: "Marta" },
      { t: "text", s: " схвалила ваші правки у " },
      { t: "ref", s: "Silk slip — Noir" },
    ],
    pill: { tone: "green", label: "СХВАЛЕНО" },
    action: "Переглянути",
    productId: "prod-249" as ProductId,
  },
  assign: {
    kind: "mention",
    actorId: "p-pavlo" as PersonId,
    body: [
      { t: "actor", s: "Pavlo" },
      { t: "text", s: " призначив вам " },
      { t: "strong", s: "5 продуктів" },
      { t: "text", s: " у " },
      { t: "linkedref", s: "Resort '25" },
    ],
    action: "До черги",
    collectionId: SPRING,
  },
  reply: {
    kind: "mention",
    actorId: "p-roma" as PersonId,
    body: [
      { t: "actor", s: "Roma" },
      { t: "text", s: " відповів у " },
      { t: "ref", s: "Wide-leg trouser — Sand" },
    ],
    quote: "Гарно підмітив — перезняв манжет зранку.",
    action: "Переглянути",
    productId: "prod-251" as ProductId,
  },
  export: {
    kind: "system",
    actorId: null,
    body: [
      { t: "text", s: "Експорт " },
      { t: "ref", s: "Resort25_web.zip" },
      { t: "text", s: " завершено — передачу в Shopify виконано" },
    ],
    pill: { tone: "green", label: "ГОТОВО" },
    action: "Завантажити",
  },
  shared: {
    kind: "system",
    actorId: "p-lina" as PersonId,
    body: [
      { t: "actor", s: "Lina" },
      { t: "text", s: " поділилася " },
      { t: "ref", s: "Resort '25 — on-figure" },
      { t: "text", s: " з вами" },
    ],
    action: "Відкрити",
  },
  bump: {
    kind: "review",
    actorId: "p-yuri" as PersonId,
    body: [
      { t: "actor", s: "Yuri" },
      { t: "text", s: " підняв застаріле рев'ю — " },
      { t: "ref", s: "SS24 Lookbook" },
    ],
    pill: { tone: "amber", label: "ОЧІКУЄ" },
    action: "Переглянути",
    productId: "prod-248" as ProductId,
  },
  member: {
    kind: "system",
    actorId: "p-roma" as PersonId,
    body: [
      { t: "actor", s: "Roma Petrenko" },
      { t: "text", s: " приєднався до простору як " },
      { t: "strong", s: "Ретушер" },
    ],
    action: "Переглянути",
  },
  bulk: {
    kind: "approve",
    actorId: "p-marta" as PersonId,
    body: [
      { t: "actor", s: "Marta" },
      { t: "text", s: " схвалила " },
      { t: "strong", s: "3 продукти" },
      { t: "text", s: " у " },
      { t: "linkedref", s: "Resort '25" },
    ],
    pill: { tone: "green", label: "СХВАЛЕНО" },
    action: "Переглянути",
    collectionId: SPRING,
  },
} satisfies Record<string, Template>;

// Build schedule: [templateKey, daysBefore, hh, mm, unread]. The handler sorts
// by createdAt desc, so array order here is only for readability. Unread rows
// concentrate in the recent buckets (today / yesterday), matching the handoff.
type Row = [keyof typeof TEMPLATES, number, number, number, boolean];

const SCHEDULE: Row[] = [
  // Сьогодні
  ["mention", 0, 14, 42, true],
  ["review", 0, 14, 18, true],
  ["stage", 0, 13, 30, true],
  ["deadline", 0, 12, 5, true],
  ["assign", 0, 11, 20, true],
  ["reply", 0, 9, 48, true],
  ["approve", 0, 8, 15, false],
  ["bump", 0, 6, 30, true],
  ["export", 0, 3, 10, false],
  // Вчора
  ["shared", 1, 18, 40, true],
  ["member", 1, 16, 12, false],
  ["bulk", 1, 14, 5, true],
  ["mention", 1, 11, 30, false],
  ["stage", 1, 9, 10, false],
  // Раніше цього тижня
  ["review", 2, 17, 20, false],
  ["reply", 2, 13, 45, false],
  ["approve", 2, 10, 5, false],
  ["assign", 3, 16, 30, false],
  ["stage", 3, 12, 0, false],
  ["mention", 3, 9, 25, false],
  ["bump", 4, 15, 40, false],
  ["export", 4, 11, 15, false],
  ["shared", 4, 8, 50, false],
  ["bulk", 4, 16, 5, false],
  ["member", 4, 13, 20, false],
  // Минулого тижня
  ["mention", 7, 17, 0, false],
  ["review", 7, 14, 30, false],
  ["approve", 8, 11, 10, false],
  ["reply", 8, 9, 0, false],
  ["stage", 9, 16, 45, false],
  ["assign", 9, 12, 30, false],
  ["bulk", 10, 15, 0, false],
  ["bump", 10, 10, 20, false],
  ["shared", 11, 14, 15, false],
  ["export", 11, 9, 40, false],
  ["member", 12, 16, 0, false],
  ["mention", 12, 11, 5, false],
  ["review", 13, 15, 30, false],
  ["approve", 13, 9, 50, false],
];

export const NOTIFICATIONS: Notification[] = SCHEDULE.map(
  ([key, days, hh, mm, unread], i) => ({
    ...TEMPLATES[key],
    id: `ntf-${String(i + 1).padStart(3, "0")}` as NotificationId,
    createdAt: at(days, hh, mm),
    readAt: unread ? null : READ_AT,
  }),
);

export const notificationsById = new Map<NotificationId, Notification>(
  NOTIFICATIONS.map((n) => [n.id, n]),
);

export function newNotificationId(): NotificationId {
  return `ntf-${crypto.randomUUID()}` as NotificationId;
}
