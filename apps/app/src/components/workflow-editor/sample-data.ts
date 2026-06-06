import type { PersonId } from "@/lib/api/types";
import type {
  EditorGraph,
  Revision,
  SampleLibraryComponent,
  SampleLibraryTemplate,
  SampleUsageRef,
} from "./types";

// Inline UI fixtures that seed the editor. NOT part of src/mocks/ — these exist
// only so the page renders without a data layer, and are replaced by library
// hooks when stage 2 lands. See midpack-product/processes/typical-collection-flow.md.

// The reference collection pipeline. A sequential spine with one fan-out/merge
// (fabric + trims sourcing run in parallel, per specs/library.md §5.2) and one
// orange review gate (fit review, where the creative director signs the final
// sample). Coordinates are placeholders — layoutGraph() reflows them on open.
const pid = (s: string) => s as PersonId;

export const SAMPLE_GRAPH: EditorGraph = {
  nodes: [
    {
      id: "start",
      kind: "start",
      label: "Старт",
      x: 0,
      y: 0,
      // The start node carries pipeline-wide files: general components /
      // templates available to every stage (workflow_stage_components on the
      // entry stage). Here, the brand care label every product references.
      components: [
        {
          id: "fc-care",
          name: "Brand care label",
          sourceLabel: "Brand care label · v7",
          kind: "pdf",
        },
      ],
    },
    {
      id: "s-idea",
      kind: "stage",
      label: "Ідея колекції",
      x: 0,
      y: 0,
      performerId: pid("p-olena"),
      description: "Мудборд, план колекції та палітра сезону.",
      isFilesExpected: true,
      templateFiles: [
        { id: "ft-moodboard", name: "Moodboard skeleton", kind: "pdf" },
        { id: "ft-plan", name: "Collection plan", kind: "xlsx", required: true },
      ],
      components: [
        {
          id: "fc-palette",
          name: "SS26 Colour Palette",
          sourceLabel: "SS26 Colour Palette · v3",
          kind: "ase",
        },
      ],
    },
    {
      id: "s-sketch",
      kind: "stage",
      label: "Ескізи й тканини",
      x: 0,
      y: 0,
      performerId: pid("p-lina"),
      isFilesExpected: true,
      templateFiles: [
        { id: "ft-swatches", name: "Fabric swatch sheet", kind: "xlsx" },
      ],
    },
    {
      id: "s-techpack",
      kind: "stage",
      label: "Тех-пак",
      x: 0,
      y: 0,
      performerId: pid("p-marta"),
      description: "Креслення з замірами, типи швів, точки контролю.",
      isFilesExpected: true,
      templateFiles: [
        { id: "ft-techpack", name: "Tech-pack template", kind: "pdf", required: true },
        { id: "ft-bom", name: "BOM template", kind: "xlsx", required: true },
      ],
    },
    {
      id: "s-fabric",
      kind: "stage",
      label: "Закупівля тканин",
      x: 0,
      y: 0,
      performerId: pid("p-pavlo"),
    },
    {
      id: "s-trims",
      kind: "stage",
      label: "Закупівля фурнітури",
      x: 0,
      y: 0,
      performerId: pid("p-pavlo"),
    },
    {
      id: "s-patterns",
      kind: "stage",
      label: "Лекала",
      x: 0,
      y: 0,
      performerId: pid("p-yuri"),
      isFilesExpected: true,
    },
    {
      id: "s-sample",
      kind: "stage",
      label: "Перший зразок",
      x: 0,
      y: 0,
      performerId: pid("p-yulia"),
    },
    {
      id: "s-fitting",
      kind: "stage",
      label: "Примірка",
      x: 0,
      y: 0,
      performerId: pid("p-lina"),
    },
    {
      id: "s-fit-review",
      kind: "review",
      label: "Фіт-рев'ю",
      x: 0,
      y: 0,
      performerId: pid("p-anna"),
      description: "Креативний директор підписує фінальний зразок-еталон.",
    },
    {
      id: "s-grading",
      kind: "stage",
      label: "Градація розмірів",
      x: 0,
      y: 0,
      performerId: pid("p-yuri"),
    },
    {
      id: "s-production",
      kind: "stage",
      label: "Передвиробництво",
      x: 0,
      y: 0,
      performerId: pid("p-roma"),
      isFilesExpected: true,
      templateFiles: [
        { id: "ft-marker", name: "Marker / consumption sheet", kind: "xlsx" },
      ],
    },
  ],
  edges: [
    ["start", "s-idea"],
    ["s-idea", "s-sketch"],
    ["s-sketch", "s-techpack"],
    ["s-techpack", "s-fabric"],
    ["s-techpack", "s-trims"],
    ["s-fabric", "s-patterns"],
    ["s-trims", "s-patterns"],
    ["s-patterns", "s-sample"],
    ["s-sample", "s-fitting"],
    ["s-fitting", "s-fit-review"],
    ["s-fit-review", "s-grading"],
    ["s-grading", "s-production"],
  ],
};

export const SAMPLE_TEMPLATE_NAME = "Колекційний пайплайн SS26";

// The published baseline (v1). Fixed ISO so SSR + client agree on first paint;
// later publishes stamp `new Date().toISOString()` inside event handlers.
export const SAMPLE_BASELINE_REVISION: Revision = {
  version: 1,
  name: SAMPLE_TEMPLATE_NAME,
  graph: SAMPLE_GRAPH,
  publishedAt: "2026-04-18T09:00:00.000Z",
  note: "Базовий сезонний пайплайн",
};

// The 2-node start → end seed used for a fresh blank draft (empty state).
export const EMPTY_GRAPH: EditorGraph = {
  nodes: [
    { id: "start", kind: "start", label: "Старт", x: 0, y: 0 },
    { id: "end", kind: "stage", label: "Новий етап", x: 0, y: 0 },
  ],
  edges: [["start", "end"]],
};

// Library items the "Add from library" pickers offer. Already-attached ids are
// filtered out per-stage at the call site.
export const SAMPLE_LIBRARY_TEMPLATES: SampleLibraryTemplate[] = [
  { id: "ft-techpack", name: "Tech-pack template", kind: "pdf", required: true },
  { id: "ft-bom", name: "BOM template", kind: "xlsx", required: true },
  { id: "ft-moodboard", name: "Moodboard skeleton", kind: "pdf" },
  { id: "ft-plan", name: "Collection plan", kind: "xlsx" },
  { id: "ft-swatches", name: "Fabric swatch sheet", kind: "xlsx" },
  { id: "ft-labdip", name: "Lab-dip report", kind: "pdf" },
  { id: "ft-grading", name: "Size chart template", kind: "xlsx" },
  { id: "ft-marker", name: "Marker / consumption sheet", kind: "xlsx" },
  { id: "ft-fitting", name: "Fitting comments sheet", kind: "pdf" },
];

export const SAMPLE_LIBRARY_COMPONENTS: SampleLibraryComponent[] = [
  { id: "fc-palette", name: "SS26 Colour Palette", sourceLabel: "SS26 Colour Palette · v3", kind: "ase" },
  { id: "fc-care", name: "Brand care label", sourceLabel: "Brand care label · v7", kind: "pdf" },
  { id: "fc-grading", name: "Size-grading rules", sourceLabel: "Size-grading rules · v2", kind: "xlsx" },
  { id: "fc-suppliers", name: "Approved suppliers", sourceLabel: "Approved suppliers · v5", kind: "xlsx" },
  { id: "fc-logo", name: "Woven logo artwork", sourceLabel: "Woven logo artwork · v1", kind: "svg" },
];

// Active products running this template — the impact preview's blast radius.
export const SAMPLE_USAGE: SampleUsageRef[] = [
  { productId: "prod-247", productName: "Style 247 · Navy blazer", collectionName: "Spring 2026", stage: "Тех-пак", pinnedRevision: 1 },
  { productId: "prod-251", productName: "Style 251 · Linen dress", collectionName: "Spring 2026", stage: "Лекала", pinnedRevision: 1 },
  { productId: "prod-263", productName: "Style 263 · Cropped jacket", collectionName: "Spring 2026", stage: "Перший зразок", pinnedRevision: 1 },
  { productId: "prod-288", productName: "Style 288 · Wide trousers", collectionName: "Spring 2026", stage: "Примірка", pinnedRevision: 1 },
  { productId: "prod-294", productName: "Style 294 · Silk blouse", collectionName: "Resort 2026", stage: "Ескізи й тканини", pinnedRevision: 1 },
  { productId: "prod-301", productName: "Style 301 · Knit cardigan", collectionName: "Resort 2026", stage: "Закупівля тканин", pinnedRevision: 1 },
];
