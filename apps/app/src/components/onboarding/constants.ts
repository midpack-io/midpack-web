// Onboarding "welcome" flow — domain data (roles, team sizes, industries +
// their stage templates, pains). Mirrors handoffs/onboarding-registration-flow.md
// §2/§3. UI/UX prototype: this is the question content, not wired to a backend.

import {
  Armchair,
  Boxes,
  Clapperboard,
  Compass,
  Crown,
  Factory,
  FlaskConical,
  Gem,
  GraduationCap,
  Megaphone,
  MoreHorizontal,
  Package,
  PenTool,
  Ruler,
  Shapes,
  Shirt,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

// Identity supplied by auth before /welcome (email path collects it in
// SignUpView; OAuth returns it). The flow never asks for it — see spec §3.
export const SIGNED_IN = { name: "Olena", email: "olena@cher17.io" } as const;

export interface RoleDef {
  value: string;
  label: string;
  icon: LucideIcon;
  /** What this role approves/owns — shown on the preview's approver chip. */
  gate: string;
}

export const ROLES: RoleDef[] = [
  { value: "founder", label: "Founder", icon: Crown, gate: "final say" },
  { value: "head_of_design", label: "Head of design", icon: Compass, gate: "approves fit" },
  { value: "tech_designer", label: "Tech designer", icon: Ruler, gate: "owns the tech pack" },
  { value: "designer", label: "Designer", icon: PenTool, gate: "drafts styles" },
  { value: "production", label: "Production", icon: Factory, gate: "runs samples" },
  { value: "operations", label: "Operations", icon: SlidersHorizontal, gate: "keeps the calendar" },
  { value: "other", label: "Something else", icon: MoreHorizontal, gate: "on the team" },
];

export interface SizeDef {
  value: string;
  label: string;
  hint: string;
  seats: { dots: number; more: number; text: string };
}

export const SIZES: SizeDef[] = [
  { value: "1_5", label: "1–5", hint: "Just starting", seats: { dots: 3, more: 0, text: "3–5 people" } },
  { value: "6_15", label: "6–15", hint: "Small team", seats: { dots: 5, more: 5, text: "6–15 people" } },
  { value: "16_50", label: "16–50", hint: "Growing", seats: { dots: 6, more: 22, text: "16–50 people" } },
  { value: "50_plus", label: "50+", hint: "Established", seats: { dots: 6, more: 50, text: "50+ people" } },
];

// Per-industry workflow template — the general-purpose architecture from
// vision.md, shown not told: pick a non-fashion industry and the whole stepper
// + the noun ("style"/"module"/"cut") swaps. Stages are index-aligned so the
// pain→stage mapping below works across every template.
export interface TemplateDef {
  stages: string[];
  noun: string;
  chip: string;
}

export interface IndustryDef {
  value: string;
  label: string;
  icon: LucideIcon;
  template: TemplateDef;
}

export const INDUSTRIES: IndustryDef[] = [
  { value: "fashion", label: "Fashion & apparel", icon: Shirt,
    template: { stages: ["Sketch", "Tech-pack", "Sample", "Fit review", "Production"], noun: "style", chip: "Fashion" } },
  { value: "jewelry", label: "Jewelry", icon: Gem,
    template: { stages: ["Sketch", "CAD", "Cast", "Set", "Polish"], noun: "piece", chip: "Jewelry" } },
  { value: "furniture_homegoods", label: "Furniture & home", icon: Armchair,
    template: { stages: ["Concept", "CAD", "Prototype", "Review", "Production"], noun: "piece", chip: "Home goods" } },
  { value: "industrial_design", label: "Industrial / product design", icon: Boxes,
    template: { stages: ["Concept", "CAD", "Prototype", "Review", "Production"], noun: "design", chip: "Product" } },
  { value: "beauty_cosmetics", label: "Beauty & cosmetics", icon: FlaskConical,
    template: { stages: ["Concept", "Formulate", "Artwork", "Compliance", "Production"], noun: "product", chip: "Beauty" } },
  { value: "packaging", label: "Packaging", icon: Package,
    template: { stages: ["Concept", "Dieline", "Artwork", "Proof", "Print"], noun: "pack", chip: "Packaging" } },
  { value: "course_production", label: "Courses / e-learning", icon: GraduationCap,
    template: { stages: ["Outline", "Storyboard", "Script", "Record", "QA"], noun: "module", chip: "Course" } },
  { value: "video_agency", label: "Digital content", icon: Clapperboard,
    template: { stages: ["Brief", "Treatment", "Storyboard", "Rough cut", "Delivery"], noun: "cut", chip: "Content" } },
  { value: "marketing_campaigns", label: "Marketing", icon: Megaphone,
    template: { stages: ["Brief", "Concept", "Draft", "Review", "Launch"], noun: "asset", chip: "Campaign" } },
  { value: "other", label: "Something else", icon: Shapes,
    template: { stages: ["Draft", "Review", "Revise", "Approve", "Ship"], noun: "item", chip: "Project" } },
];

// Decorative stage-swatch colors (the product's stage palette), index-aligned
// to whatever 5-stage template is active. Resting nodes are neutral; a node
// only shows its color once a pain "lights" it.
export const STAGE_COLOR_VARS = [
  "--color-st-sketch",
  "--color-st-techpack",
  "--color-st-sample",
  "--color-st-fitting",
  "--color-st-production",
];

export interface PainDef {
  value: string;
  /** Stage index this pain maps to, or "bundle" (lights the whole card). */
  stage: number | "bundle";
  copy: string;
  fix: string; // may contain a single <b>…</b> emphasis
}

export const PAINS: PainDef[] = [
  { value: "fit_decisions_lost", stage: 3,
    copy: "Fit decisions get lost between the review and the factory",
    fix: "Fit-room decisions captured as <b>one artifact</b>." },
  { value: "version_drift", stage: 1,
    copy: "The wrong tech-pack version reaches the factory",
    fix: "<b>One current version</b> per stage — no wrong cut." },
  { value: "approval_status_unclear", stage: 4,
    copy: "“Is this approved?” takes forever to answer",
    fix: "“Approved?” answered in <b>a glance</b>." },
  { value: "stale_comments", stage: 2,
    copy: "Feedback lands on an old version",
    fix: "Comments <b>follow the style</b> across versions." },
  { value: "onboarding_slow", stage: 0,
    copy: "New team members take months to get up to speed",
    fix: "New hires read the <b>whole history</b> as a timeline." },
  { value: "scattered_files", stage: "bundle",
    copy: "Everything's spread across Drive, Slack & WhatsApp",
    fix: "Drive · Slack · WhatsApp → <b>one bundle</b>." },
];

const DEFAULT_INDUSTRY = INDUSTRIES[0]!; // fashion — the launch default

export function templateFor(industry: string): TemplateDef {
  return (INDUSTRIES.find((i) => i.value === industry) ?? DEFAULT_INDUSTRY).template;
}
