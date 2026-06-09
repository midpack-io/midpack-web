import type {
  Collection,
  CollectionId,
  ProgressTone,
  RiskLevel,
  Stage,
} from "@/lib/api/types";

// The cher17 FW2026 collections shown on the Collections screen, derived from the
// release calendar (Календар надходжень) in the FW2026 spec: one collection per
// in-store delivery wave. 15 active waves across 6 modules — women's main modules
// 1/2/3 (three waves each), the premium SPECIAL capsule, the men's CherMan line,
// and the single Новий рік drop — plus two archived past seasons.
//
// Only Module 1's waves (`col-spring-2026`/`col-summer-2026`/`col-brand-refresh`)
// have real Product rows seeded in src/mocks/data/products.ts and activity in
// activity.ts — Module 1 is the one in production right now. Those three keep
// their original IDs so all the product/activity/tag references stay attached.
// Every other wave is future work and renders from aggregates alone (productCount
// + stageDistribution), exactly like the archived seasons do.

// Seed records omit `recentActivity` — the list handler joins it on at
// response time from ACTIVITY. That keeps activity normalized in the seed.
type SeededCollection = Omit<Collection, "recentActivity">;

// Known-good cover photos, reused across waves of the same module/line.
const COVER = {
  women1: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=320&q=80",
  women2: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=320&q=80",
  women3: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=320&q=80",
  special: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=320&q=80",
  cherman: "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=320&q=80",
} as const;

const ZERO_STAGES: Record<Stage, number> = {
  idea: 0,
  sketch: 0,
  techpack: 0,
  procurement: 0,
  patterns: 0,
  "pattern-review": 0,
  sample: 0,
  fitting: 0,
  grading: 0,
  production: 0,
};

type WaveSpec = {
  id: string;
  code: string;
  name: string;
  description: string;
  dropType: string;
  due: string; // "YYYY-MM-DD" — first in-store date of the wave (the deadline)
  daysToDue: number; // relative to 2026-06-09
  productCount: number;
  progressPct: number;
  progressTone: ProgressTone;
  riskLevel: RiskLevel;
  stages: Partial<Record<Stage, number>>;
  cover: string;
  fabricTag: string;
  caption: string;
  unreadMentions?: number;
  updatedAt?: string;
};

// Build a full active collection from the variable bits — fills the 10-stage
// distribution from a partial, wraps the cover, and appends the ISO time suffix.
function wave(s: WaveSpec): SeededCollection {
  return {
    id: s.id as CollectionId,
    code: s.code,
    name: s.name,
    description: s.description,
    dropType: s.dropType,
    status: "active",
    dueDate: `${s.due}T00:00:00.000Z`,
    productCount: s.productCount,
    cover: { url: s.cover, fabricTag: s.fabricTag, caption: s.caption },
    progressPct: s.progressPct,
    progressTone: s.progressTone,
    stageDistribution: { ...ZERO_STAGES, ...s.stages },
    unreadMentions: s.unreadMentions ?? 0,
    updatedAt: s.updatedAt ?? "2026-06-08T09:00:00.000Z",
    riskLevel: s.riskLevel,
    daysToDue: s.daysToDue,
  };
}

export const COLLECTIONS: SeededCollection[] = [
  // ── Module 1 — women's main, in production now (real products + activity) ──
  wave({
    id: "col-spring-2026",
    code: "FW26-1.1",
    name: "FW26 - 1.1",
    description: "Жіночий основний модуль 1, перша хвиля — у магазини 15.06.",
    dropType: "Модуль 1 · хвиля 1",
    due: "2026-06-15",
    daysToDue: 6,
    productCount: 15,
    progressPct: 38,
    progressTone: "mid",
    riskLevel: "at_risk", // 6 days out
    stages: { idea: 2, sketch: 2, techpack: 3, procurement: 3, patterns: 2, sample: 1, fitting: 1, production: 1 },
    cover: COVER.women1,
    fabricTag: "FW26-1.1",
    caption: "Модуль 1 · 15.06",
    unreadMentions: 3,
    updatedAt: "2026-06-09T11:00:00.000Z",
  }),
  wave({
    id: "col-summer-2026",
    code: "FW26-1.2",
    name: "FW26 - 1.2",
    description: "Жіночий основний модуль 1, друга хвиля — у магазини 05.07.",
    dropType: "Модуль 1 · хвиля 2",
    due: "2026-07-05",
    daysToDue: 26,
    productCount: 12,
    progressPct: 22,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 6, sketch: 4, techpack: 2 },
    cover: COVER.women2,
    fabricTag: "FW26-1.2",
    caption: "Модуль 1 · 05.07",
    updatedAt: "2026-06-08T15:00:00.000Z",
  }),
  wave({
    id: "col-brand-refresh",
    code: "FW26-1.3",
    name: "FW26 - 1.3",
    description: "Жіночий основний модуль 1, третя хвиля — у магазини 20.07.",
    dropType: "Модуль 1 · хвиля 3",
    due: "2026-07-20",
    daysToDue: 41,
    productCount: 4,
    progressPct: 45,
    progressTone: "mid",
    riskLevel: "on_track",
    stages: { sketch: 1, techpack: 1, procurement: 1, patterns: 1 },
    cover: COVER.women3,
    fabricTag: "FW26-1.3",
    caption: "Модуль 1 · 20.07",
    updatedAt: "2026-06-07T12:00:00.000Z",
  }),

  // ── Module 2 — women's main ──
  wave({
    id: "col-fw2026-2-1",
    code: "FW26-2.1",
    name: "FW26 - 2.1",
    description: "Жіночий основний модуль 2, перша хвиля — у магазини 05.08.",
    dropType: "Модуль 2 · хвиля 1",
    due: "2026-08-05",
    daysToDue: 57,
    productCount: 22,
    progressPct: 12,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 8, sketch: 8, techpack: 4, procurement: 2 },
    cover: COVER.women1,
    fabricTag: "FW26-2.1",
    caption: "Модуль 2 · 05.08",
    unreadMentions: 1,
    updatedAt: "2026-06-08T10:00:00.000Z",
  }),
  // ── SPECIAL — premium capsule ──
  wave({
    id: "col-fw2026-sp-1",
    code: "FW26-SP.1",
    name: "FW26 - SPECIAL.1",
    description: "Преміумкапсула SPECIAL, перша хвиля — у магазини 15.08.",
    dropType: "SPECIAL · хвиля 1",
    due: "2026-08-15",
    daysToDue: 67,
    productCount: 16,
    progressPct: 18,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 5, sketch: 6, techpack: 3, procurement: 2 },
    cover: COVER.special,
    fabricTag: "FW26-SP.1",
    caption: "SPECIAL · 15.08",
    unreadMentions: 2,
    updatedAt: "2026-06-07T16:00:00.000Z",
  }),
  // ── CherMan — men's line ──
  wave({
    id: "col-fw2026-cm-1",
    code: "FW26-CM.1",
    name: "FW26 - CherMan.1",
    description: "Чоловіча лінія CherMan, перша хвиля — у магазини 15.08.",
    dropType: "CherMan · хвиля 1",
    due: "2026-08-15",
    daysToDue: 67,
    productCount: 10,
    progressPct: 6,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 7, sketch: 3 },
    cover: COVER.cherman,
    fabricTag: "FW26-CM.1",
    caption: "CherMan · 15.08",
    updatedAt: "2026-06-06T11:00:00.000Z",
  }),
  wave({
    id: "col-fw2026-2-2",
    code: "FW26-2.2",
    name: "FW26 - 2.2",
    description: "Жіночий основний модуль 2, друга хвиля — у магазини 20.08.",
    dropType: "Модуль 2 · хвиля 2",
    due: "2026-08-20",
    daysToDue: 72,
    productCount: 20,
    progressPct: 8,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 9, sketch: 7, techpack: 4 },
    cover: COVER.women2,
    fabricTag: "FW26-2.2",
    caption: "Модуль 2 · 20.08",
    updatedAt: "2026-06-08T10:00:00.000Z",
  }),
  wave({
    id: "col-fw2026-2-3",
    code: "FW26-2.3",
    name: "FW26 - 2.3",
    description: "Жіночий основний модуль 2, третя хвиля — у магазини 05.09.",
    dropType: "Модуль 2 · хвиля 3",
    due: "2026-09-05",
    daysToDue: 88,
    productCount: 18,
    progressPct: 5,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 11, sketch: 7 },
    cover: COVER.women3,
    fabricTag: "FW26-2.3",
    caption: "Модуль 2 · 05.09",
    updatedAt: "2026-06-08T10:00:00.000Z",
  }),
  wave({
    id: "col-fw2026-cm-2",
    code: "FW26-CM.2",
    name: "FW26 - CherMan.2",
    description: "Чоловіча лінія CherMan, друга хвиля — у магазини 05.09.",
    dropType: "CherMan · хвиля 2",
    due: "2026-09-05",
    daysToDue: 88,
    productCount: 8,
    progressPct: 4,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 6, sketch: 2 },
    cover: COVER.cherman,
    fabricTag: "FW26-CM.2",
    caption: "CherMan · 05.09",
    updatedAt: "2026-06-06T11:00:00.000Z",
  }),
  wave({
    id: "col-fw2026-sp-2",
    code: "FW26-SP.2",
    name: "FW26 - SPECIAL.2",
    description: "Преміумкапсула SPECIAL, друга хвиля — у магазини 10.09.",
    dropType: "SPECIAL · хвиля 2",
    due: "2026-09-10",
    daysToDue: 93,
    productCount: 12,
    progressPct: 10,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 5, sketch: 5, techpack: 2 },
    cover: COVER.special,
    fabricTag: "FW26-SP.2",
    caption: "SPECIAL · 10.09",
    updatedAt: "2026-06-07T16:00:00.000Z",
  }),
  // ── Module 3 — women's main ──
  wave({
    id: "col-fw2026-3-1",
    code: "FW26-3.1",
    name: "FW26 - 3.1",
    description: "Жіночий основний модуль 3, перша хвиля — у магазини 20.09.",
    dropType: "Модуль 3 · хвиля 1",
    due: "2026-09-20",
    daysToDue: 103,
    productCount: 24,
    progressPct: 3,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 16, sketch: 8 },
    cover: COVER.women1,
    fabricTag: "FW26-3.1",
    caption: "Модуль 3 · 20.09",
    updatedAt: "2026-06-05T13:00:00.000Z",
  }),
  wave({
    id: "col-fw2026-cm-3",
    code: "FW26-CM.3",
    name: "FW26 - CherMan.3",
    description: "Чоловіча лінія CherMan, третя хвиля — у магазини 20.09.",
    dropType: "CherMan · хвиля 3",
    due: "2026-09-20",
    daysToDue: 103,
    productCount: 8,
    progressPct: 2,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 8 },
    cover: COVER.cherman,
    fabricTag: "FW26-CM.3",
    caption: "CherMan · 20.09",
    updatedAt: "2026-06-06T11:00:00.000Z",
  }),
  wave({
    id: "col-fw2026-3-2",
    code: "FW26-3.2",
    name: "FW26 - 3.2",
    description: "Жіночий основний модуль 3, друга хвиля — у магазини 05.10.",
    dropType: "Модуль 3 · хвиля 2",
    due: "2026-10-05",
    daysToDue: 118,
    productCount: 20,
    progressPct: 2,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 15, sketch: 5 },
    cover: COVER.women2,
    fabricTag: "FW26-3.2",
    caption: "Модуль 3 · 05.10",
    updatedAt: "2026-06-05T13:00:00.000Z",
  }),
  wave({
    id: "col-fw2026-3-3",
    code: "FW26-3.3",
    name: "FW26 - 3.3",
    description: "Жіночий основний модуль 3, третя хвиля — у магазини 20.10.",
    dropType: "Модуль 3 · хвиля 3",
    due: "2026-10-20",
    daysToDue: 133,
    productCount: 18,
    progressPct: 1,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 18 },
    cover: COVER.women3,
    fabricTag: "FW26-3.3",
    caption: "Модуль 3 · 20.10",
    updatedAt: "2026-06-05T13:00:00.000Z",
  }),
  // ── Новий рік — single drop ──
  wave({
    id: "col-fw2026-ny",
    code: "FW26-NY",
    name: "FW26 - Новий рік",
    description: "Новорічний модуль FW2026 — у магазини 15.11.",
    dropType: "Новий рік",
    due: "2026-11-15",
    daysToDue: 159,
    productCount: 14,
    progressPct: 1,
    progressTone: "low",
    riskLevel: "on_track",
    stages: { idea: 10, sketch: 4 },
    cover: COVER.special,
    fabricTag: "FW26-NY",
    caption: "Новий рік · 15.11",
    updatedAt: "2026-06-04T10:00:00.000Z",
  }),

  // ── Archived past seasons (only on the Collections "Архівовані" tab) ──
  {
    id: "col-holiday-2025" as CollectionId,
    code: "HG-25",
    name: "Holiday Gift Box 2025",
    description: "Подарункова добірка — шарфи, ароматичні свічки колаборації, дрібна шкіргалантерея.",
    dropType: "Gifting",
    status: "archived",
    dueDate: "2025-11-15T00:00:00.000Z",
    productCount: 8,
    cover: {
      url: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=320&q=80",
      fabricTag: "HG-25",
      caption: "Gift box",
    },
    progressPct: 92,
    progressTone: "high",
    stageDistribution: {
      idea: 0,
      sketch: 0,
      techpack: 0,
      procurement: 0,
      patterns: 1,
      "pattern-review": 0,
      sample: 1,
      fitting: 1,
      grading: 2,
      production: 3,
    },
    unreadMentions: 1,
    updatedAt: "2026-05-22T10:00:00.000Z", // 5h ago
    riskLevel: "on_track",
    daysToDue: -188,
  },
  {
    id: "col-resort-2024" as CollectionId,
    code: "RS-24",
    name: "Resort 2024",
    description: "Колекція для відпочинку — кафтани, купальники, легкі бавовняні комплекти. Відвантажено у дві хвилі.",
    dropType: "Resort drop",
    status: "archived",
    dueDate: "2024-11-15T00:00:00.000Z",
    productCount: 11,
    cover: {
      url: "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=320&q=80",
      fabricTag: "RS-24",
      caption: "Resort",
    },
    progressPct: 100,
    progressTone: "high",
    stageDistribution: {
      idea: 0,
      sketch: 0,
      techpack: 0,
      procurement: 0,
      patterns: 0,
      "pattern-review": 0,
      sample: 0,
      fitting: 0,
      grading: 0,
      production: 11,
    },
    unreadMentions: 0,
    updatedAt: "2024-11-20T10:00:00.000Z",
    riskLevel: "on_track",
    daysToDue: -553,
  },
];

export const collectionsById = new Map<CollectionId, SeededCollection>(
  COLLECTIONS.map((c) => [c.id, c] as [CollectionId, SeededCollection]),
);
