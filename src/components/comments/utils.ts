import type { Comment, CommentId, PersonId, ProductFile } from "@/lib/api/types";
import { formatDayLabel } from "@/lib/time";

export type TypeFilter = "all" | "msg" | "sys";
export type ScopeFilter = "all" | "stage" | "mentions";

// File registry the body renderer reads to decide icon kind + "is linked"
// styling. Keyed by file *name* (e.g. "brand-logo.svg") since the inline body
// tokens reference files by name, not by FileId.
export type FileLookup = Map<string, { kind: ProductFile["kind"]; linked: boolean }>;

export function buildFileLookup(files: ProductFile[]): FileLookup {
  const map: FileLookup = new Map();
  for (const f of files) {
    const fullName = f.ext ? `${f.name}${f.ext}` : f.name;
    map.set(fullName, { kind: f.kind, linked: Boolean(f.linkedFrom) });
  }
  return map;
}

// ─── Threads ────────────────────────────────────────────────────────────────

export interface ThreadGroups {
  roots: Comment[];
  // parentId → ordered replies
  repliesByParent: Map<CommentId, Comment[]>;
}

export function groupThreads(comments: Comment[]): ThreadGroups {
  const roots: Comment[] = [];
  const repliesByParent = new Map<CommentId, Comment[]>();
  for (const c of comments) {
    if (c.parentId) {
      const list = repliesByParent.get(c.parentId) ?? [];
      list.push(c);
      repliesByParent.set(c.parentId, list);
    } else {
      roots.push(c);
    }
  }
  for (const list of repliesByParent.values()) {
    list.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  }
  return { roots, repliesByParent };
}

// ─── Filters ────────────────────────────────────────────────────────────────

export function filterByType(list: Comment[], type: TypeFilter): Comment[] {
  if (type === "msg") return list.filter((c) => c.kind === "msg");
  if (type === "sys") return list.filter((c) => c.kind === "sys");
  return list;
}

export function filterByScope(
  list: Comment[],
  scope: ScopeFilter,
  ctx: { activeStage: string; me: PersonId },
): Comment[] {
  if (scope === "stage") {
    return list.filter((c) => c.stage === ctx.activeStage);
  }
  if (scope === "mentions") {
    return list.filter((c) => c.mentions.includes(ctx.me));
  }
  return list;
}

// ─── Day grouping ───────────────────────────────────────────────────────────

export interface DayGroup {
  label: string;
  items: Comment[];
}

// Groups feed items into day buckets in arrival order. Splits whenever
// `formatDayLabel(createdAt)` changes between adjacent items.
export function groupByDay(items: Comment[]): DayGroup[] {
  const groups: DayGroup[] = [];
  let current: DayGroup | null = null;
  for (const c of items) {
    const label = formatDayLabel(c.createdAt);
    if (!current || current.label !== label) {
      current = { label, items: [] };
      groups.push(current);
    }
    current.items.push(c);
  }
  return groups;
}

// ─── Quote previews ─────────────────────────────────────────────────────────

// Strip inline tokens out of a body so we can show a single-line preview in
// the quote-reply header. Mirrors `plainText` in the prototype's comments.js.
export function plainTextPreview(
  body: string,
  resolveMention: (id: PersonId) => string | undefined,
): string {
  return body
    .replace(/@p-[a-z0-9-]+/g, (m) => {
      const id = m.slice(1) as PersonId;
      const name = resolveMention(id);
      return name ? `@${name}` : m;
    })
    .replace(/#stage:([a-z0-9-]+)/g, "#stage·$1")
    .replace(/\[file:([^\]]+)\]/g, (_, inner) => `#${inner}`)
    .replace(/\[img:[^\]]+\]/g, "[image]")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
