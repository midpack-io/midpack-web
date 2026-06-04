import type { EditorNode } from "./types";

// Visual tokens for the canvas stage node, lifted verbatim from
// bundle-stepper/stepper-pill.tsx so a design-time node and a runtime stepper
// pill read as the same family. `isReview` (kind:"review") wins over
// everything, exactly as in the pill and stages-and-statuses.md.

export type NodeKind = EditorNode["kind"];

// Shell border + fill. The review kind keeps the pill's orange border but adds a
// warm amber→white gradient so a gate reads as distinctly yellow on the canvas;
// start is a quiet dark-keyed entry chip; a plain stage is the neutral shell.
export const NODE_SHELL: Record<NodeKind, string> = {
  review: "border-[#decfc0] bg-gradient-to-b from-warn-soft to-surface",
  start: "border-border bg-surface-2",
  stage: "border-border bg-surface",
};

// The small status-icon circle on the left — same tones the pill uses for the
// orange accent / the dashed to-do marker / a filled entry dot.
export const NODE_ICON: Record<NodeKind, string> = {
  review: "bg-warn text-white",
  start: "bg-foreground text-white",
  stage: "border border-dashed border-zinc-300 bg-transparent text-zinc-500",
};

// Selected hairline halo — matches the pill's status-tinted outline language
// (warm taupe for review, cool slate for everything else).
export const NODE_SELECTED_OUTLINE: Record<NodeKind, string> = {
  review: "outline-[#decfc0]",
  start: "outline-[#ced0cf]",
  stage: "outline-[#ced0cf]",
};
