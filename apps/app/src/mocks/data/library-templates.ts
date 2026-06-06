import type {
  CollectionId,
  FileKind,
  FileTemplate,
  FileTemplateId,
  FileVersion,
  LibraryUsageRef,
  PersonId,
  ProductId,
} from "@/lib/api/types";

// File templates curated on /library — starter / blueprint files. Copy-on-use:
// when a product enters a stage the template seeds a starting file; later edits
// to the template don't flow into products already using it. Mutated in place
// by the handlers; state resets on full page reload.

const SPRING = "col-spring-2026" as CollectionId;
const UPLOADERS = ["p-marta", "p-olena", "p-anna"] as const;

function usageRef(id: string, name: string, stage: string): LibraryUsageRef {
  return {
    productId: id as ProductId,
    productName: name,
    collectionId: SPRING,
    collectionName: "Spring 2026 Launch",
    stage,
  };
}

const REFS: LibraryUsageRef[] = [
  usageRef("prod-247", "Style 247 · Navy blazer", "Tech-pack"),
  usageRef("prod-248", "Style 248 · Silk midi dress", "Sample"),
  usageRef("prod-252", "Style 252 · Cropped cardigan", "Idea"),
  usageRef("prod-253", "Style 253 · Pleated trousers", "Procurement"),
  usageRef("prod-250", "Style 250 · Wool overcoat", "Grading"),
  usageRef("prod-251", "Style 251 · Tweed mini skirt", "Production"),
];

function buildVersions(current: string, updatedAt: string): FileVersion[] {
  const n = Number(current.replace(/\D/g, "")) || 1;
  const end = new Date(updatedAt).getTime();
  const day = 24 * 60 * 60 * 1000;
  return Array.from({ length: n }, (_, i) => ({
    version: `v${i + 1}`,
    uploadedAt: new Date(end - (n - 1 - i) * 12 * day).toISOString(),
    uploadedBy: UPLOADERS[i % UPLOADERS.length] as PersonId,
    note: i === 0 ? "Initial draft" : undefined,
  }));
}

type Seed = {
  id: string;
  name: string;
  kind: FileKind;
  version: string;
  usageSeeded: number;
  updatedAt: string;
};

const ACTIVE_SEEDS: Seed[] = [
  { id: "ft-tech-pack", name: "Tech-pack template", kind: "xlsx", version: "v4", usageSeeded: 102, updatedAt: "2026-05-23T10:00:00.000Z" },
  { id: "ft-bom", name: "BOM template", kind: "xlsx", version: "v2", usageSeeded: 89, updatedAt: "2026-05-14T09:00:00.000Z" },
  { id: "ft-moodboard", name: "Mood-board skeleton", kind: "figma", version: "v3", usageSeeded: 47, updatedAt: "2026-05-07T11:00:00.000Z" },
  { id: "ft-sample-request", name: "Sample request form", kind: "pdf", version: "v1", usageSeeded: 64, updatedAt: "2026-04-16T08:00:00.000Z" },
  { id: "ft-lab-dip-log", name: "Lab-dip log", kind: "xlsx", version: "v2", usageSeeded: 28, updatedAt: "2026-05-19T13:00:00.000Z" },
  { id: "ft-cost-sheet", name: "Cost sheet template", kind: "xlsx", version: "v1", usageSeeded: 71, updatedAt: "2026-04-30T10:00:00.000Z" },
];

const ARCHIVED_SEEDS: Seed[] = [
  { id: "ft-arch-old-techpack", name: "Tech-pack (2024)", kind: "xlsx", version: "v7", usageSeeded: 0, updatedAt: "2025-06-02T09:00:00.000Z" },
  { id: "ft-arch-old-costsheet", name: "Cost sheet (legacy)", kind: "xlsx", version: "v3", usageSeeded: 0, updatedAt: "2025-05-18T09:00:00.000Z" },
];

function toTemplate(seed: Seed, status: "active" | "archived"): FileTemplate {
  return {
    id: seed.id as FileTemplateId,
    name: seed.name,
    kind: seed.kind,
    version: seed.version,
    status,
    usageSeeded: seed.usageSeeded,
    versions: buildVersions(seed.version, seed.updatedAt),
    updatedAt: seed.updatedAt,
  };
}

export const FILE_TEMPLATES: FileTemplate[] = [
  ...ACTIVE_SEEDS.map((s) => toTemplate(s, "active")),
  ...ARCHIVED_SEEDS.map((s) => toTemplate(s, "archived")),
];

export const fileTemplatesById = new Map<FileTemplateId, FileTemplate>(
  FILE_TEMPLATES.map((t) => [t.id, t]),
);

export const fileTemplateUsage = new Map<FileTemplateId, LibraryUsageRef[]>([
  ["ft-tech-pack" as FileTemplateId, REFS],
  ["ft-bom" as FileTemplateId, REFS.slice(0, 5)],
  ["ft-moodboard" as FileTemplateId, REFS.slice(0, 4)],
  ["ft-sample-request" as FileTemplateId, REFS.slice(0, 5)],
  ["ft-lab-dip-log" as FileTemplateId, REFS.slice(0, 3)],
  ["ft-cost-sheet" as FileTemplateId, REFS.slice(0, 5)],
]);

export function newFileTemplateId(): FileTemplateId {
  return `ft-${crypto.randomUUID()}` as FileTemplateId;
}
