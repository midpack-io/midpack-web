import type {
  CollectionId,
  FileComponent,
  FileComponentId,
  FileKind,
  FileVersion,
  LibraryUsageRef,
  PersonId,
  ProductId,
} from "@/lib/api/types";

// File components curated on /library — live, shared files. Publishing a new
// version propagates (or notifies) to every active product that references it.
// Mutated in place by the handlers; state resets on full page reload.

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
  usageRef("prod-249", "Style 249 · Linen wrap dress", "Fitting"),
  usageRef("prod-250", "Style 250 · Wool overcoat", "Grading"),
  usageRef("prod-246", "Style 246 · Cotton trench", "Review"),
  usageRef("prod-251", "Style 251 · Tweed mini skirt", "Production"),
];

// Build a v1…vN chain ending the day before `updatedAt`, oldest first.
function buildVersions(current: string, updatedAt: string): FileVersion[] {
  const n = Number(current.replace(/\D/g, "")) || 1;
  const end = new Date(updatedAt).getTime();
  const day = 24 * 60 * 60 * 1000;
  return Array.from({ length: n }, (_, i) => ({
    version: `v${i + 1}`,
    uploadedAt: new Date(end - (n - 1 - i) * 9 * day).toISOString(),
    uploadedBy: UPLOADERS[i % UPLOADERS.length] as PersonId,
    note: i === 0 ? "Initial publish" : undefined,
  }));
}

type Seed = {
  id: string;
  name: string;
  kind: FileKind;
  version: string;
  usageReferenced: number;
  updatedAt: string;
};

const ACTIVE_SEEDS: Seed[] = [
  { id: "fc-ss26-palette", name: "SS26 Colour palette", kind: "ase", version: "v3", usageReferenced: 47, updatedAt: "2026-05-26T10:00:00.000Z" },
  { id: "fc-care-label", name: "Brand care label", kind: "pdf", version: "v3", usageReferenced: 38, updatedAt: "2026-05-21T09:00:00.000Z" },
  { id: "fc-size-grading", name: "Size grading rules", kind: "xlsx", version: "v2", usageReferenced: 22, updatedAt: "2026-05-25T14:00:00.000Z" },
  { id: "fc-trim-spec", name: "Trim spec book", kind: "pdf", version: "v5", usageReferenced: 18, updatedAt: "2026-05-24T11:00:00.000Z" },
  { id: "fc-cher17-logo", name: "CHER'17 logo lockup", kind: "svg", version: "v2", usageReferenced: 64, updatedAt: "2026-04-16T08:00:00.000Z" },
  { id: "fc-linen-weight", name: "Linen weight chart", kind: "xlsx", version: "v1", usageReferenced: 9, updatedAt: "2026-05-14T10:00:00.000Z" },
  { id: "fc-library-tokens", name: "Library tokens", kind: "figma", version: "v4", usageReferenced: 14, updatedAt: "2026-05-28T09:30:00.000Z" },
  { id: "fc-sustain-hangtag", name: "Sustainability hangtag", kind: "pdf", version: "v2", usageReferenced: 31, updatedAt: "2026-05-17T13:00:00.000Z" },
];

const ARCHIVED_SEEDS: Seed[] = [
  { id: "fc-arch-aw24-palette", name: "AW24 Colour palette", kind: "ase", version: "v2", usageReferenced: 0, updatedAt: "2025-09-02T09:00:00.000Z" },
  { id: "fc-arch-old-caretag", name: "Care tag (pre-2025)", kind: "pdf", version: "v6", usageReferenced: 0, updatedAt: "2025-08-11T09:00:00.000Z" },
  { id: "fc-arch-legacy-grading", name: "Legacy grading rules", kind: "xlsx", version: "v3", usageReferenced: 0, updatedAt: "2025-07-20T09:00:00.000Z" },
];

function toComponent(seed: Seed, status: "active" | "archived"): FileComponent {
  return {
    id: seed.id as FileComponentId,
    name: seed.name,
    kind: seed.kind,
    version: seed.version,
    status,
    usageReferenced: seed.usageReferenced,
    versions: buildVersions(seed.version, seed.updatedAt),
    updatedAt: seed.updatedAt,
  };
}

export const FILE_COMPONENTS: FileComponent[] = [
  ...ACTIVE_SEEDS.map((s) => toComponent(s, "active")),
  ...ARCHIVED_SEEDS.map((s) => toComponent(s, "archived")),
];

export const fileComponentsById = new Map<FileComponentId, FileComponent>(
  FILE_COMPONENTS.map((c) => [c.id, c]),
);

export const fileComponentUsage = new Map<FileComponentId, LibraryUsageRef[]>([
  ["fc-ss26-palette" as FileComponentId, REFS],
  ["fc-care-label" as FileComponentId, REFS.slice(0, 5)],
  ["fc-size-grading" as FileComponentId, REFS.slice(0, 4)],
  ["fc-trim-spec" as FileComponentId, REFS.slice(0, 3)],
  ["fc-cher17-logo" as FileComponentId, REFS],
  ["fc-linen-weight" as FileComponentId, REFS.slice(0, 2)],
  ["fc-library-tokens" as FileComponentId, REFS.slice(0, 3)],
  ["fc-sustain-hangtag" as FileComponentId, REFS.slice(0, 5)],
]);

export function newFileComponentId(): FileComponentId {
  return `fc-${crypto.randomUUID()}` as FileComponentId;
}
