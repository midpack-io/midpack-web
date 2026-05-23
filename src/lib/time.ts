// Time/date formatting helpers shared by product / collection components.
// Mirrors the inline `formatTimeAgo` in collection-card.tsx and pins "now" to
// a stage-1 demo date so seeded ISO strings produce consistent "Xh ago" labels.

// Current "now" for stage 1 — keeps "1h ago" / "2d ago" stable across reloads.
const NOW_ISO = "2026-05-22T15:00:00.000Z";

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = new Date(NOW_ISO).getTime();
  const diffMs = now - then;
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "щойно";
  if (min < 60) return `${min} хв тому`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} год тому`;
  const day = Math.round(hr / 24);
  if (day === 1) return "вчора";
  if (day < 7) return `${day} дн тому`;
  const week = Math.round(day / 7);
  if (week < 4) return `${week} тиж тому`;
  const month = Math.round(day / 30);
  if (month < 12) return `${month} міс тому`;
  return `${Math.round(day / 365)} р тому`;
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export type DeadlineVariant = "default" | "at-risk" | "overdue";

// Deadline label + state, relative to NOW_ISO so stage-1 demo data stays stable.
// Mirrors the handoff (`design_handoff_midpack/.../stepper.css`): within 2 days
// reads as "today/tomorrow·Mon DD" tinted warn; past reads as "Nd overdue"
// tinted coral; otherwise the neutral "Weekday·Mon DD".
export function formatDeadline(iso: string): { text: string; variant: DeadlineVariant } {
  const due = new Date(iso);
  const now = new Date(NOW_ISO);
  const dueMid = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
  const nowMid = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const days = Math.floor((dueMid - nowMid) / 86_400_000);

  const monthDay = due.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const weekday = due.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });

  if (days < 0) {
    const n = Math.abs(days);
    return { text: `${n}d overdue`, variant: "overdue" };
  }
  if (days === 0) return { text: `today·${monthDay}`, variant: "at-risk" };
  if (days === 1) return { text: `tomorrow·${monthDay}`, variant: "at-risk" };
  if (days === 2) return { text: `${weekday}·${monthDay}`, variant: "at-risk" };
  return { text: `${weekday}·${monthDay}`, variant: "default" };
}
