import type { Stage } from "@/lib/api/types";

// Visual theming for workflow stages — split into two orthogonal axes (color
// and pattern) so adding a new stage is one row in STAGE_THEMES rather than
// a hand-written gradient.

export type PatternId =
  | "solid"
  | "dots"
  | "dots-light"
  | "hatch-45"
  | "hatch-neg-45"
  | "stripes-vertical"
  | "stripes-horizontal"
  | "crosshatch"
  | "diagonals-thick";

// Overlay tints. Dark sits on light/mid base colors; light flips for darker
// bases where a dark overlay would disappear into the fill.
const DARK_LINE = "rgba(0,0,0,0.2)";
const LIGHT_LINE = "rgba(255,255,255,0.35)";

export const PATTERNS: Record<PatternId, (color: string) => string> = {
  solid: (color) => color,
  dots: (color) =>
    `radial-gradient(circle, ${DARK_LINE} 1.6px, transparent 2.4px) 0 0/7px 7px, ${color}`,
  "dots-light": (color) =>
    `radial-gradient(circle, ${LIGHT_LINE} 1.8px, transparent 2.6px) 0 0/6px 6px, ${color}`,
  "hatch-45": (color) =>
    `repeating-linear-gradient(45deg, ${DARK_LINE} 0 2px, transparent 2px 6px), ${color}`,
  "hatch-neg-45": (color) =>
    `repeating-linear-gradient(-45deg, ${DARK_LINE} 0 2px, transparent 2px 6px), ${color}`,
  "stripes-vertical": (color) =>
    `repeating-linear-gradient(90deg, ${DARK_LINE} 0 2px, transparent 2px 6px), ${color}`,
  "stripes-horizontal": (color) =>
    `repeating-linear-gradient(0deg, ${DARK_LINE} 0 2px, transparent 2px 6px), ${color}`,
  crosshatch: (color) =>
    `repeating-linear-gradient(45deg, ${DARK_LINE} 0 2px, transparent 2px 7px), repeating-linear-gradient(-45deg, ${DARK_LINE} 0 2px, transparent 2px 7px), ${color}`,
  "diagonals-thick": (color) =>
    `repeating-linear-gradient(45deg, rgba(0,0,0,0.3) 0 3px, transparent 3px 9px), ${color}`,
};

type StageTheme = { color: string; pattern: PatternId };

export const STAGE_THEMES: Record<Stage, StageTheme> = {
  idea: { color: "var(--color-st-idea)", pattern: "dots" },
  sketch: { color: "var(--color-st-sketch)", pattern: "hatch-45" },
  techpack: { color: "var(--color-st-techpack)", pattern: "stripes-vertical" },
  procurement: { color: "var(--color-st-procurement)", pattern: "crosshatch" },
  patterns: { color: "var(--color-st-patterns)", pattern: "hatch-neg-45" },
  "pattern-review": { color: "var(--color-st-review)", pattern: "diagonals-thick" },
  sample: { color: "var(--color-st-sample)", pattern: "solid" },
  fitting: { color: "var(--color-st-fitting)", pattern: "stripes-horizontal" },
  grading: { color: "var(--color-st-grading)", pattern: "dots-light" },
  production: { color: "var(--color-st-production)", pattern: "solid" },
};

export function getStageBackground(stage: Stage): string {
  const { color, pattern } = STAGE_THEMES[stage];
  return PATTERNS[pattern](color);
}

export function getStageColor(stage: Stage): string {
  return STAGE_THEMES[stage].color;
}
