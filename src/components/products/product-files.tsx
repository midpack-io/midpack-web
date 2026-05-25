"use client";

import { useMemo } from "react";
import {
  ExternalLink,
  FileImage,
  FileSpreadsheet,
  FileText,
  Figma,
  Link as LinkIcon,
  MoreHorizontal,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import type {
  FileId,
  FileKind,
  Person,
  PersonId,
  ProductFile,
  Stage,
} from "@/lib/api/types";

type ProductFilesProps = {
  files: ProductFile[];
  peopleMap: Map<PersonId, Person>;
  onOpenFile: (id: FileId) => void;
};

// Canonical stage order matches the stepper. Hard-coded here to avoid
// reaching across the product fetch — the stage set is fixed.
const STAGE_ORDER: Stage[] = [
  "idea",
  "sketch",
  "techpack",
  "procurement",
  "patterns",
  "pattern-review",
  "sample",
  "fitting",
  "grading",
  "production",
];

const STAGE_LABEL: Record<Stage, string> = {
  idea: "01 · Ідея",
  sketch: "02 · Ескізи",
  techpack: "03 · Тех-пак",
  procurement: "04 · Закупівля",
  patterns: "05 · Лекала",
  "pattern-review": "06 · Перевірка лекал",
  sample: "07 · Перший зразок",
  fitting: "08 · Примірка",
  grading: "09 · Градація",
  production: "10 · Виробництво",
};

export function ProductFiles({
  files,
  peopleMap,
  onOpenFile,
}: ProductFilesProps) {
  const { linked, byStage } = useMemo(() => groupFiles(files), [files]);
  const stagesWithFiles = STAGE_ORDER.filter(
    (s) => (byStage.get(s)?.length ?? 0) > 0,
  );

  return (
    <div className="flex min-w-0 flex-col bg-surface">
      <FilesToolbar count={files.length} stageCount={stagesWithFiles.length} />
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-[18px] px-[20px] pb-[24px] pt-[12px]">
          {linked.length > 0 && (
            <LinkedSection
              files={linked}
              peopleMap={peopleMap}
              onOpenFile={onOpenFile}
            />
          )}
          {stagesWithFiles.map((stage) => (
            <StageSection
              key={stage}
              stage={stage}
              files={byStage.get(stage) ?? []}
              peopleMap={peopleMap}
              onOpenFile={onOpenFile}
            />
          ))}
          {files.length === 0 && <EmptyState />}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Toolbar ────────────────────────────────────────────────────────────────

function FilesToolbar({
  count,
  stageCount,
}: {
  count: number;
  stageCount: number;
}) {
  return (
    <div className="sticky top-0 z-[1] flex items-center gap-[10px] border-b border-border bg-surface px-[20px] py-[10px]">
      <ToolbarStub label="Group by" value="Stage" />
      <ToolbarStub label="Sort" value="Updated" />
      <ToolbarStub label="Filter" value="All" />
      <div className="ml-auto font-mono text-xs text-zinc-500 tabular-nums">
        {count} files · {stageCount} stages
      </div>
    </div>
  );
}

function ToolbarStub({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-[28px] items-center gap-[6px] rounded-md border border-border bg-surface px-[10px] text-xs text-zinc-700 transition-colors hover:bg-surface-2"
    >
      <span className="font-mono uppercase tracking-[0.07em] text-zinc-400">
        {label}
      </span>
      <span>{value}</span>
    </button>
  );
}

// ─── Linked section ─────────────────────────────────────────────────────────

function LinkedSection({
  files,
  peopleMap,
  onOpenFile,
}: {
  files: ProductFile[];
  peopleMap: Map<PersonId, Person>;
  onOpenFile: (id: FileId) => void;
}) {
  return (
    <section className="rounded-lg border border-linked-border bg-linked-tint">
      <header className="flex items-center gap-[8px] border-b border-linked-border px-[14px] py-[10px]">
        <LinkIcon className="size-[14px] text-linked" strokeWidth={1.8} />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.07em] text-linked-ink">
          Linked components · {files.length}
        </span>
        <span className="text-xs text-zinc-500">
          edited at source · auto-syncs
        </span>
      </header>
      <ul className="divide-y divide-linked-border/60">
        {files.map((file) => (
          <li key={file.id}>
            <FileRow
              file={file}
              linked
              peopleMap={peopleMap}
              onOpen={() => onOpenFile(file.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Stage section ──────────────────────────────────────────────────────────

function StageSection({
  stage,
  files,
  peopleMap,
  onOpenFile,
}: {
  stage: Stage;
  files: ProductFile[];
  peopleMap: Map<PersonId, Person>;
  onOpenFile: (id: FileId) => void;
}) {
  return (
    <section>
      <header className="mb-[6px] flex items-center gap-[8px]">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.07em] text-zinc-500">
          {STAGE_LABEL[stage]}
        </span>
        <span className="font-mono text-xs text-zinc-400 tabular-nums">
          {files.length}
        </span>
      </header>
      <ul className="overflow-hidden rounded-lg border border-border bg-surface">
        {files.map((file, i) => (
          <li
            key={file.id}
            className={cn(i > 0 && "border-t border-border")}
          >
            <FileRow
              file={file}
              peopleMap={peopleMap}
              onOpen={() => onOpenFile(file.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── File row ───────────────────────────────────────────────────────────────

function FileRow({
  file,
  linked,
  peopleMap,
  onOpen,
}: {
  file: ProductFile;
  linked?: boolean;
  peopleMap: Map<PersonId, Person>;
  onOpen: () => void;
}) {
  const latest = file.versions[file.versions.length - 1];
  const updater = peopleMap.get(file.updatedBy);
  const Icon = iconForKind(file.kind);

  return (
    <div className="group/file-row relative grid grid-cols-[18px_minmax(0,1fr)_auto_auto_auto] items-center gap-[12px] px-[14px] py-[8px] transition-colors hover:bg-surface-2">
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 cursor-pointer rounded-[inherit] focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-accent-ring focus-visible:ring-offset-1"
        aria-label={`Open ${file.name}${file.ext}`}
      />
      <Icon
        className={cn(
          "size-[16px] shrink-0",
          linked ? "text-linked" : "text-zinc-500",
        )}
        strokeWidth={1.6}
      />
      <span className="min-w-0 truncate text-sm text-foreground">
        {file.name}
        <span className="text-zinc-400">{file.ext}</span>
      </span>

      {linked && file.linkedFrom ? (
        <span className="z-[1] font-mono text-[10.5px] uppercase tracking-[0.06em] text-linked-ink">
          {file.linkedFrom.label}
        </span>
      ) : file.externalUrl ? (
        <span className="z-[1] inline-flex items-center gap-[4px] font-mono text-[10.5px] uppercase tracking-[0.06em] text-zinc-500">
          <ExternalLink className="size-[10px]" strokeWidth={1.8} />
          {file.externalDomain ?? "external"}
        </span>
      ) : latest ? (
        <span className="z-[1] inline-flex h-[20px] items-center gap-[5px] rounded-sm bg-surface-3 px-[6px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.04em] text-zinc-700">
          {latest.version}
          {file.versions.length > 1 && (
            <span className="text-zinc-400">· latest</span>
          )}
        </span>
      ) : (
        <span />
      )}

      <span className="z-[1] whitespace-nowrap font-mono text-xs text-zinc-500 tabular-nums">
        {timeAgo(file.updatedAt)}
        {updater && (
          <span className="text-zinc-400"> · {updater.name.split(" ")[0]}</span>
        )}
      </span>

      <div className="z-[1] flex items-center gap-[2px] opacity-0 transition-opacity group-hover/file-row:opacity-100 group-focus-within/file-row:opacity-100">
        {!linked && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Upload new version"
            className="size-[26px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Upload className="size-[14px]" strokeWidth={1.8} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="More file actions"
          className="size-[26px]"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-[14px]" strokeWidth={1.8} />
        </Button>
      </div>
    </div>
  );
}

// ─── Empty ──────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-2 px-[18px] py-[28px] text-center">
      <p className="text-sm text-zinc-500">No files yet for this product.</p>
      <p className="mt-[6px] text-xs text-zinc-400">
        Files attached to stages appear here grouped by stage.
      </p>
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

function groupFiles(files: ProductFile[]): {
  linked: ProductFile[];
  byStage: Map<Stage, ProductFile[]>;
} {
  const linked: ProductFile[] = [];
  const byStage = new Map<Stage, ProductFile[]>();
  for (const f of files) {
    if (f.linkedFrom) {
      linked.push(f);
    } else {
      const list = byStage.get(f.stage) ?? [];
      list.push(f);
      byStage.set(f.stage, list);
    }
  }
  return { linked, byStage };
}

function iconForKind(kind: FileKind) {
  switch (kind) {
    case "pdf":
    case "docx":
      return FileText;
    case "xlsx":
      return FileSpreadsheet;
    case "jpg":
    case "png":
    case "psd":
    case "svg":
      return FileImage;
    case "figma":
      return Figma;
    case "link":
    default:
      return ExternalLink;
  }
}
