import type { FileKind, LibraryKind } from "@/lib/api/types";

// Pinned "now" for the Library demo so seeded `updatedAt` strings render stable
// "UPD · 2d" / "today" labels. Matches the dates seeded in src/mocks/data/library-*.
const LIBRARY_NOW = new Date("2026-05-28T12:00:00.000Z").getTime();

// Compact English "updated" label, e.g. "today", "yesterday", "2d", "1w", "2mo".
export function formatUpd(iso: string): string {
  const day = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((LIBRARY_NOW - new Date(iso).getTime()) / day);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d`;
  if (diffDays < 28) return `${Math.round(diffDays / 7)}w`;
  if (diffDays < 365) return `${Math.round(diffDays / 30)}mo`;
  return `${Math.round(diffDays / 365)}y`;
}

// Usage verb per catalog — the spec's core distinction: workflows are "active",
// components are "referenced" (live links), templates are "seeded" (copy-on-use).
export function usageVerb(kind: LibraryKind): string {
  if (kind === "workflows") return "active";
  if (kind === "components") return "referenced";
  return "seeded";
}

// Short uppercase extension chip for the card meta row (Figma keeps title-case).
export function extLabel(kind: FileKind): string {
  if (kind === "figma") return "Figma";
  if (kind === "link") return "Link";
  return kind.toUpperCase();
}

// Colored ext-tag on the file thumbnail. These are data-driven brand/file colors
// (not design tokens), so they live here and apply via inline style.
export const EXT_TAG_COLOR: Record<FileKind, string> = {
  pdf: "#b53527",
  xlsx: "#2f7a4a",
  docx: "#2a4fab",
  svg: "#8a4e64",
  psd: "#1e6aa6",
  figma: "#6b4ba1",
  ase: "#7a5a2f",
  png: "#87622f",
  jpg: "#87622f",
  link: "#6b6b73",
};

// Allowed upload kinds + a permissive ext→kind map for drag-and-drop. Unknown
// extensions surface an inline error on the drop target.
const EXT_TO_KIND: Record<string, FileKind> = {
  pdf: "pdf",
  xlsx: "xlsx",
  xls: "xlsx",
  docx: "docx",
  doc: "docx",
  psd: "psd",
  svg: "svg",
  jpg: "jpg",
  jpeg: "jpg",
  png: "png",
  ase: "ase",
  fig: "figma",
};

export function kindFromFilename(filename: string): FileKind | null {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_KIND[ext] ?? null;
}

export function nameWithoutExt(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i > 0 ? filename.slice(0, i) : filename;
}

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB
