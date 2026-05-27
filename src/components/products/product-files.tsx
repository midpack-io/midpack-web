"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Folder as FolderIcon,
  Info,
  Link2,
  MessageSquare,
  MoreHorizontal,
  Play,
  Plus,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import type {
  Comment,
  FileId,
  FileKind,
  Person,
  PersonId,
  Product,
  ProductFile,
  Stage,
  StageInstance,
  StageStatus,
} from "@/lib/api/types";

type ProductFilesProps = {
  files: ProductFile[];
  product: Product | undefined;
  comments: Comment[];
  peopleMap: Map<PersonId, Person>;
  // Stage `n` to render as visually selected — force-opens its section and
  // tints it by the stage's status. Falls back to `product.currentStageN`.
  selectedStageN?: string;
  onOpenFile: (id: FileId) => void;
};

// Display label for stages — falls back when product hasn't loaded yet and
// we want to render section skeletons. The product's StageInstance.label is
// the source of truth when present.
const STAGE_LABEL_FALLBACK: Record<Stage, string> = {
  idea: "Ідея колекції",
  sketch: "Ескізи й вибір тканин",
  techpack: "Тех-пак",
  procurement: "Закупівля матеріалів",
  patterns: "Лекала",
  "pattern-review": "Перевірка лекал",
  sample: "Перший зразок",
  fitting: "Примірка",
  grading: "Градація розмірів",
  production: "Підготовка до виробництва",
};

// Per-kind ink colors — match the prototype's --ft-* swatches verbatim. These
// don't map to design tokens (per [[feedback_design_tokens]] — prefer arbitrary
// values like the rest of the DS does).
const FILE_KIND_COLOR: Record<FileKind, string> = {
  pdf: "#d24f3a",
  xlsx: "#2f8a4f",
  docx: "#3a6dd2",
  psd: "#7a5cd1",
  svg: "#6a7494",
  jpg: "#6a7494",
  png: "#6a7494",
  figma: "#b8336a",
  link: "#6b6b73",
};

export function ProductFiles({
  files,
  product,
  comments,
  peopleMap,
  selectedStageN,
  onOpenFile,
}: ProductFilesProps) {
  const { linked, byStage } = useMemo(() => groupFiles(files), [files]);
  const commentCountByFile = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of comments) {
      if (c.kind !== "msg") continue;
      if (c.anchor.kind === "file") {
        map.set(c.anchor.fileName, (map.get(c.anchor.fileName) ?? 0) + 1);
      }
    }
    return map;
  }, [comments]);

  const stages: StageInstance[] = product?.stages ?? [];
  // Selected stage drives the visual highlight + force-open behaviour below.
  // Falls back to the product's canonical current stage so call sites that
  // don't pass `selectedStageN` keep the prior behaviour.
  const effectiveSelectedN = selectedStageN ?? product?.currentStageN;
  const stagesWithOwnedFiles = useMemo(
    () => new Set([...byStage.entries()].filter(([, fs]) => fs.length > 0).map(([s]) => s)),
    [byStage],
  );

  // Single overrides map — `undefined` means "use the default". Defaults: linked
  // section open when it has rows; the active stage open; folders open; others
  // collapsed. Toggling writes the inverse of the current effective state.
  const [overrides, setOverrides] = useState<Map<string, boolean>>(new Map());
  const isOpen = (key: string, fallback: boolean): boolean =>
    overrides.get(key) ?? fallback;
  const toggle = (key: string, fallback: boolean) => {
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(key, !(prev.get(key) ?? fallback));
      return next;
    });
  };

  return (
    <div className="flex min-w-0 flex-col border-r border-border bg-[#fdfdfc]">
      <FilesToolbar
        count={files.length}
        stageCount={stagesWithOwnedFiles.size}
      />
      <ScrollArea className="min-h-0 flex-1">
        <div className="px-[12px] pt-[8px] pb-[32px]">
          {linked.length > 0 && (
            <LinkedSection
              files={linked}
              open={isOpen("linked", true)}
              onToggle={() => toggle("linked", true)}
            />
          )}

          {stages.map((s) => {
            const stageFiles = byStage.get(s.stage) ?? [];
            const isSelected = s.n === effectiveSelectedN;
            const key = `stage:${s.n}`;
            // Selection force-opens the section: ignore any prior collapse
            // override so clicking a tab always reveals its files.
            const open = isSelected ? true : isOpen(key, false);
            return (
              <StageSection
                key={s.n}
                stage={s}
                files={stageFiles}
                isSelected={isSelected}
                open={open}
                onToggle={() => toggle(key, isSelected)}
                isFolderOpen={(folderPath) =>
                  isOpen(`folder:${s.n}:${folderPath}`, true)
                }
                onToggleFolder={(folderPath) =>
                  toggle(`folder:${s.n}:${folderPath}`, true)
                }
                commentCountByFile={commentCountByFile}
                peopleMap={peopleMap}
                onOpenFile={onOpenFile}
              />
            );
          })}

          {files.length === 0 && stages.length === 0 && (
            <p className="px-[12px] py-[24px] text-center text-sm text-zinc-500">
              Жодних файлів ще немає для цього стилю.
            </p>
          )}
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
    <div className="sticky top-0 z-[5] flex items-center gap-[8px] border-b border-border bg-[#fdfdfc] px-[12px] py-[9px]">
      <ToolbarStub label="Group by" value="Stage" />
      <ToolbarStub label="Sort" value="Position" />
      <ToolbarStub label="Filter" value="All" />
      <div className="ml-auto font-mono text-[11.5px] text-zinc-400 tabular-nums">
        {count} items · {stageCount} stages with files
      </div>
    </div>
  );
}

function ToolbarStub({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-[28px] items-center gap-[6px] rounded-md border border-border bg-surface px-[10px] pr-[8px] text-xs text-zinc-700 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
    >
      <span className="text-zinc-500">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
      <ChevronDown className="size-[10px] text-zinc-400" strokeWidth={2} />
    </button>
  );
}

// ─── Linked section ─────────────────────────────────────────────────────────

function LinkedSection({
  files,
  open,
  onToggle,
}: {
  files: ProductFile[];
  open: boolean;
  onToggle: () => void;
}) {
  // Split into collection-sourced vs workflow-sourced groups, preserving order
  // by linkedFrom kind. Files inside each group keep their original order.
  const groups = useMemo(() => {
    const byKey = new Map<string, { source: ProductFile["linkedFrom"]; files: ProductFile[] }>();
    for (const f of files) {
      if (!f.linkedFrom) continue;
      const k =
        f.linkedFrom.kind === "collection"
          ? `c:${f.linkedFrom.collectionId}`
          : `w:${f.linkedFrom.workflowKey}`;
      const existing = byKey.get(k);
      if (existing) {
        existing.files.push(f);
      } else {
        byKey.set(k, { source: f.linkedFrom, files: [f] });
      }
    }
    // Stable ordering: collection groups before workflow groups
    return [...byKey.values()].sort((a, b) => {
      const order = (s: ProductFile["linkedFrom"]) =>
        s?.kind === "collection" ? 0 : 1;
      return order(a.source) - order(b.source);
    });
  }, [files]);

  return (
    <section
      className={cn(
        "mb-[8px] overflow-hidden rounded-[10px] border border-linked-border",
        "bg-gradient-to-b from-linked-soft to-linked-tint",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-[8px] px-[12px] pt-[9px] pb-[8px] transition-colors hover:bg-[rgba(124,58,237,0.04)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring",
          open && "border-b border-dashed border-linked-border",
        )}
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            "size-[14px] shrink-0 text-linked transition-transform duration-100",
            !open && "-rotate-90",
          )}
          strokeWidth={1.8}
        />
        <span className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-linked text-white">
          <Link2 className="size-[11px]" strokeWidth={2} />
        </span>
        <span className="text-[12.5px] font-semibold tracking-[0.01em] text-linked-ink">
          Linked components
        </span>
        <span className="ml-[2px] font-mono text-[11px] text-linked opacity-70">
          {files.length}
        </span>
        <span className="ml-auto inline-flex items-center gap-[5px] font-mono text-[11px] text-linked-ink opacity-70">
          <Info className="size-[11px]" strokeWidth={1.6} />
          edited at source · auto-syncs
        </span>
      </button>

      {open && (
        <div className="px-[6px] pt-[6px] pb-[8px]">
          {groups.map((g, i) => (
            <LinkedGroup
              key={(g.source?.kind ?? "x") + i}
              source={g.source}
              files={g.files}
              isFirst={i === 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function LinkedGroup({
  source,
  files,
  isFirst,
}: {
  source: ProductFile["linkedFrom"];
  files: ProductFile[];
  isFirst: boolean;
}) {
  if (!source) return null;
  const isCollection = source.kind === "collection";
  return (
    <div className={cn(!isFirst && "mt-[6px] border-t border-dashed border-linked-border pt-[8px]")}>
      <div className="flex items-center gap-[8px] px-[6px] pt-[4px] pb-[6px]">
        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-linked-ink opacity-70">
          {isCollection ? "From collection" : "From workflow"}
        </span>
        <span
          className="inline-flex h-[20px] items-center gap-[5px] rounded-[5px] bg-white/70 px-[6px] pr-[7px] text-[11px] text-linked-ink"
          style={{ boxShadow: "0 0 0 1px var(--color-linked-border) inset" }}
        >
          {isCollection ? (
            <CollectionGlyph />
          ) : (
            <WorkflowGlyph />
          )}
          <b className="font-semibold text-foreground">{source.label}</b>
        </span>
        <span className="flex-1" />
        <button
          type="button"
          className="inline-flex items-center gap-[4px] rounded-[4px] px-[6px] py-[2px] text-[11px] text-linked transition-colors hover:bg-[rgba(124,58,237,0.08)] hover:text-linked-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          Open source
          <ExternalLink className="size-[11px]" strokeWidth={1.8} />
        </button>
      </div>

      {files.map((f) => (
        <LinkedFileRow key={f.id} file={f} />
      ))}
    </div>
  );
}

function LinkedFileRow({ file }: { file: ProductFile }) {
  return (
    <div
      className={cn(
        "group/linked-row relative grid h-[34px] grid-cols-[18px_minmax(0,1fr)_auto_auto] items-center gap-[10px] rounded-[6px] px-[6px] py-[4px] cursor-pointer transition-colors",
        "hover:bg-white/75",
      )}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--color-linked-border)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <FileTypeIcon kind={file.kind} />
      <span className="inline-flex min-w-0 items-center gap-[8px] truncate text-[13px] text-foreground">
        {file.name}
        {file.ext && (
          <span className="font-mono text-[11px] text-zinc-400">{file.ext}</span>
        )}
      </span>
      <span
        className="inline-flex h-[18px] items-center gap-[4px] rounded-[4px] bg-linked-soft px-[5px] pr-[6px] font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-linked-ink"
        style={{ boxShadow: "0 0 0 1px var(--color-linked-border) inset" }}
        title="Linked instance — edit at source"
      >
        <Link2 className="size-[9px] text-linked" strokeWidth={2} />
        Linked
      </span>
      <span className="whitespace-nowrap text-right font-mono text-[11.5px] text-zinc-500 tabular-nums group-hover/linked-row:hidden">
        updated {timeAgo(file.updatedAt)}
      </span>
      <span className="hidden items-center gap-[2px] group-hover/linked-row:inline-flex">
        <LinkedIconButton label="Open in tab">
          <Upload className="size-[14px] -rotate-90" strokeWidth={1.6} />
        </LinkedIconButton>
        <LinkedIconButton label="Open source location">
          <ExternalLink className="size-[14px]" strokeWidth={1.6} />
        </LinkedIconButton>
        <LinkedIconButton label="More">
          <MoreHorizontal className="size-[14px]" strokeWidth={1.6} />
        </LinkedIconButton>
      </span>
    </div>
  );
}

function LinkedIconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex size-[22px] items-center justify-center rounded-[4px] text-linked transition-colors hover:bg-[rgba(124,58,237,0.1)] hover:text-linked-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </button>
  );
}

// ─── Stage section ──────────────────────────────────────────────────────────

function StageSection({
  stage,
  files,
  isSelected,
  open,
  onToggle,
  isFolderOpen,
  onToggleFolder,
  commentCountByFile,
  peopleMap,
  onOpenFile,
}: {
  stage: StageInstance;
  files: ProductFile[];
  isSelected: boolean;
  open: boolean;
  onToggle: () => void;
  isFolderOpen: (folderPath: string) => boolean;
  onToggleFolder: (folderPath: string) => void;
  commentCountByFile: Map<string, number>;
  peopleMap: Map<PersonId, Person>;
  onOpenFile: (id: FileId) => void;
}) {
  const pip = pipForStatus(stage.status);
  const label = stage.label || STAGE_LABEL_FALLBACK[stage.stage];
  const { folders, looseFiles } = useMemo(() => groupByFolder(files), [files]);
  const tint = selectedTintClasses(stage.status);

  return (
    <section
      className={cn(
        "mb-[4px] rounded-[9px]",
        isSelected &&
          "my-[4px] mb-[6px] border p-[4px] bg-gradient-to-b",
        isSelected && tint,
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-[8px] rounded-[6px] px-[10px] py-[8px] transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring",
          isSelected && "bg-transparent hover:bg-black/[0.03]",
        )}
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            "size-[14px] shrink-0 text-zinc-400 transition-transform duration-100",
            !open && "-rotate-90",
          )}
          strokeWidth={1.6}
        />
        <StatusPip variant={pip} />
        <span
          className={cn(
            "inline-flex items-center gap-[8px] text-[13px]",
            isSelected
              ? "font-semibold text-foreground"
              : pip === "passed"
                ? "font-medium text-zinc-700"
                : "font-medium text-zinc-500",
          )}
        >
          {label}
          <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
            {files.length}
          </span>
          {isSelected && (
            <StageStatusChip status={stage.status} />
          )}
        </span>
      </button>

      {open && (
        <div className="px-[6px] pt-[6px] pb-[8px] pl-[24px]">
          {files.length === 0 ? (
            <EmptyStageBody />
          ) : (
            <>
              {folders.map(({ folderPath, files: ff }) => (
                <Folder
                  key={folderPath}
                  folderPath={folderPath}
                  files={ff}
                  open={isFolderOpen(folderPath)}
                  onToggle={() => onToggleFolder(folderPath)}
                  commentCountByFile={commentCountByFile}
                  peopleMap={peopleMap}
                  onOpenFile={onOpenFile}
                />
              ))}
              {looseFiles.map((f) =>
                f.externalUrl ? (
                  <LinkRow
                    key={f.id}
                    file={f}
                    commentCount={commentCountByFile.get(f.name) ?? 0}
                    onOpen={() => onOpenFile(f.id)}
                  />
                ) : (
                  <FileRow
                    key={f.id}
                    file={f}
                    commentCount={commentCountByFile.get(f.name) ?? 0}
                    peopleMap={peopleMap}
                    onOpen={() => onOpenFile(f.id)}
                  />
                ),
              )}
              {isSelected && <AddRow />}
            </>
          )}
        </div>
      )}
    </section>
  );
}

type PipVariant = "passed" | "active" | "pending";

// Background gradient + border colour for the selected stage section, keyed
// by stage status. Mirrors the prototype's `.stage-section.active.status-*`
// CSS vocabulary verbatim. Inlined hex on the gradient stops because the
// small-delta surface tints don't map cleanly to existing tokens (the border
// colours that DO match the design system — accent-ring, coral-ring,
// border-strong — use their token utilities).
function selectedTintClasses(status: StageStatus): string {
  switch (status) {
    case "done":
      return "from-[#eef4ef] to-[#f7faf8] border-[#b6d6c1]";
    case "in-progress":
      return "from-accent-soft to-[#fbfbfd] border-accent-ring";
    case "blocked":
      return "from-coral-soft to-[#fef8f7] border-coral-ring";
    case "canceled":
      return "from-surface-3 to-surface-2 border-border opacity-70";
    case "to-do":
    default:
      return "from-surface to-surface border-border-strong";
  }
}

function pipForStatus(status: StageStatus): PipVariant {
  switch (status) {
    case "done":
      return "passed";
    case "in-progress":
      return "active";
    case "to-do":
    case "blocked":
    case "canceled":
    default:
      return "pending";
  }
}

function StatusPip({ variant }: { variant: PipVariant }) {
  if (variant === "passed") {
    return (
      <span className="inline-flex size-[14px] shrink-0 items-center justify-center rounded-full bg-ok-soft text-ok">
        <svg
          viewBox="0 0 12 12"
          className="size-[9px]"
          fill="none"
          aria-hidden
        >
          <path
            d="M2.8 6l2.2 2.2 4.2-4.4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (variant === "active") {
    return (
      <span className="inline-flex size-[14px] shrink-0 items-center justify-center rounded-full bg-accent-strong text-white">
        <Play className="size-[7px] fill-white" strokeWidth={0} />
      </span>
    );
  }
  return (
    <span
      className="inline-flex size-[14px] shrink-0 items-center justify-center rounded-full text-zinc-400"
      style={{ border: "1px dashed var(--color-border-strong)" }}
      aria-hidden
    />
  );
}

function StageStatusChip({ status }: { status: StageStatus }) {
  // Tone matches the stepper's status chip vocabulary — only shown on the
  // currently-active stage inside the files panel.
  if (status === "in-progress") {
    return (
      <span
        className="ml-[8px] inline-flex h-[20px] items-center gap-[5px] rounded-[5px] bg-accent-soft px-[7px] font-mono text-[10px] font-semibold uppercase tracking-[0.04em] text-accent-ink"
        style={{ boxShadow: "0 0 0 1px var(--color-accent-ring) inset" }}
      >
        <Play className="size-[8px] fill-current" strokeWidth={0} />
        In Progress
      </span>
    );
  }
  if (status === "done") {
    return (
      <span
        className="ml-[8px] inline-flex h-[20px] items-center gap-[5px] rounded-[5px] bg-ok-soft px-[7px] font-mono text-[10px] font-semibold uppercase tracking-[0.04em] text-ok"
        style={{ boxShadow: "0 0 0 1px #b8d8c2 inset" }}
      >
        Done
      </span>
    );
  }
  if (status === "blocked") {
    return (
      <span
        className="ml-[8px] inline-flex h-[20px] items-center gap-[5px] rounded-[5px] bg-warn-soft px-[7px] font-mono text-[10px] font-semibold uppercase tracking-[0.04em] text-warn"
        style={{ boxShadow: "0 0 0 1px var(--color-warn-ring) inset" }}
      >
        Blocked
      </span>
    );
  }
  return (
    <span
      className="ml-[8px] inline-flex h-[20px] items-center gap-[5px] rounded-[5px] bg-surface-3 px-[7px] font-mono text-[10px] font-semibold uppercase tracking-[0.04em] text-zinc-500"
      style={{ boxShadow: "0 0 0 1px var(--color-border) inset" }}
    >
      To Do
    </span>
  );
}

// ─── Folder ─────────────────────────────────────────────────────────────────

function Folder({
  folderPath,
  files,
  open,
  onToggle,
  commentCountByFile,
  peopleMap,
  onOpenFile,
}: {
  folderPath: string;
  files: ProductFile[];
  open: boolean;
  onToggle: () => void;
  commentCountByFile: Map<string, number>;
  peopleMap: Map<PersonId, Person>;
  onOpenFile: (id: FileId) => void;
}) {
  const latest = files
    .map((f) => f.updatedAt)
    .sort()
    .at(-1);
  // Trim trailing slash for display so it reads as "sketches/ 2 items".
  const displayName = folderPath.replace(/\/$/, "");
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-[10px] rounded-[6px] px-[8px] pr-[10px] py-[7px] text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--color-border)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "";
        }}
        aria-expanded={open}
      >
        <FolderIcon
          className="size-[14px] shrink-0 fill-[#b89a52] text-[#b89a52]"
          strokeWidth={0}
        />
        <span className="inline-flex min-w-0 items-center gap-[6px] truncate text-[13px] text-foreground">
          <span className="font-medium">{displayName}</span>
          <span className="font-mono text-[11px] text-zinc-400">
            / {files.length} items
          </span>
        </span>
        {latest && (
          <span className="whitespace-nowrap text-right font-mono text-[11.5px] text-zinc-500 tabular-nums">
            {timeAgo(latest)}
          </span>
        )}
      </button>
      {open && (
        <div className="ml-[14px] mt-[1px] border-l border-dashed border-border-strong pl-[8px]">
          {files.map((f) =>
            f.externalUrl ? (
              <LinkRow
                key={f.id}
                file={f}
                commentCount={commentCountByFile.get(f.name) ?? 0}
                onOpen={() => onOpenFile(f.id)}
              />
            ) : (
              <FileRow
                key={f.id}
                file={f}
                commentCount={commentCountByFile.get(f.name) ?? 0}
                peopleMap={peopleMap}
                onOpen={() => onOpenFile(f.id)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

// ─── File row ───────────────────────────────────────────────────────────────

function FileRow({
  file,
  commentCount,
  onOpen,
}: {
  file: ProductFile;
  commentCount: number;
  peopleMap: Map<PersonId, Person>;
  onOpen: () => void;
}) {
  const latest = file.versions.at(-1);
  const isLatestEmphasized = file.versions.length > 1;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "group/row relative grid min-h-[36px] grid-cols-[18px_minmax(0,1fr)_auto_auto_auto] items-center gap-[10px] rounded-[6px] px-[8px] pr-[10px] py-[5px] cursor-pointer transition-colors",
        "hover:bg-surface",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring",
      )}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--color-border)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <FileTypeIcon kind={file.kind} />
      <span className="inline-flex min-w-0 items-center gap-[8px] truncate text-[13px] text-foreground">
        <span className={cn(isLatestEmphasized && "font-medium")}>{file.name}</span>
        {file.ext && (
          <span className="font-mono text-[11px] text-zinc-400">{file.ext}</span>
        )}
      </span>
      <MsgCountChip count={commentCount} />
      {latest && (
        <span
          className={cn(
            "shrink-0 rounded-[4px] px-[6px] py-[1.5px] font-mono text-[10.5px] font-medium tabular-nums",
            isLatestEmphasized
              ? "bg-accent-soft text-accent-ink"
              : "bg-surface-3 text-zinc-700",
          )}
        >
          {latest.version}
        </span>
      )}
      <span className="whitespace-nowrap text-right font-mono text-[11.5px] text-zinc-500 tabular-nums group-hover/row:hidden">
        {timeAgo(file.updatedAt)}
      </span>
      <span className="hidden items-center gap-[2px] group-hover/row:inline-flex">
        <RowIconButton label="Upload new version">
          <Upload className="size-[14px]" strokeWidth={1.6} />
        </RowIconButton>
        <RowIconButton label="Open in tab">
          <ExternalLink className="size-[14px]" strokeWidth={1.6} />
        </RowIconButton>
        <RowIconButton label="More">
          <MoreHorizontal className="size-[14px]" strokeWidth={1.6} />
        </RowIconButton>
      </span>
    </div>
  );
}

function RowIconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex size-[24px] items-center justify-center rounded-[5px] text-zinc-500 transition-colors hover:bg-surface-3 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </button>
  );
}

function MsgCountChip({ count }: { count: number }) {
  const has = count > 0;
  return (
    <span
      className={cn(
        "inline-flex h-[20px] shrink-0 items-center gap-[4px] rounded-[5px] px-[5px] pr-[6px] font-mono text-[10.5px] font-medium tabular-nums transition-colors",
        has
          ? "cursor-pointer bg-accent-soft text-accent-ink hover:bg-[#e0e4ff] hover:text-accent-strong"
          : "cursor-default text-zinc-300",
      )}
      style={
        has ? { boxShadow: "0 0 0 1px var(--color-accent-ring) inset" } : undefined
      }
      onClick={(e) => e.stopPropagation()}
    >
      <MessageSquare className="size-[11px]" strokeWidth={1.8} />
      <span className="pt-[0.5px]">{count}</span>
    </span>
  );
}

// ─── Link row ───────────────────────────────────────────────────────────────

function LinkRow({
  file,
  commentCount,
  onOpen,
}: {
  file: ProductFile;
  commentCount: number;
  onOpen: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "group/row relative grid min-h-[36px] grid-cols-[18px_minmax(0,1fr)_auto_auto_auto] items-center gap-[10px] rounded-[6px] px-[8px] pr-[10px] py-[5px] cursor-pointer transition-colors",
        "hover:bg-surface",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring",
      )}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--color-border)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <FileTypeIcon kind={file.kind} />
      <span className="inline-flex min-w-0 items-center gap-[8px] truncate text-[13px] text-foreground">
        <span>{file.name}</span>
        {file.kind === "figma" && (
          <span className="rounded-[4px] bg-[#fdf0f4] px-[5px] py-[1px] font-mono text-[10px] uppercase tracking-[0.05em] text-[#b8336a]">
            figma
          </span>
        )}
        {file.externalDomain && (
          <span className="font-mono text-[11px] text-zinc-400">
            · {file.externalDomain}
          </span>
        )}
      </span>
      <MsgCountChip count={commentCount} />
      <span
        className="shrink-0 rounded-[4px] px-[6px] py-[1.5px] font-mono text-[10.5px] font-medium text-zinc-400"
        style={{ border: "1px dashed var(--color-border-strong)" }}
      >
        link
      </span>
      <span className="whitespace-nowrap text-right font-mono text-[11.5px] text-zinc-500 tabular-nums group-hover/row:hidden">
        {timeAgo(file.updatedAt)}
      </span>
      <span className="hidden items-center gap-[2px] group-hover/row:inline-flex">
        <RowIconButton label="Open link">
          <ExternalLink className="size-[14px]" strokeWidth={1.6} />
        </RowIconButton>
        <RowIconButton label="More">
          <MoreHorizontal className="size-[14px]" strokeWidth={1.6} />
        </RowIconButton>
      </span>
    </div>
  );
}

// ─── Add row + empty state ──────────────────────────────────────────────────

function AddRow() {
  return (
    <button
      type="button"
      className="ml-[8px] mt-[4px] inline-flex items-center gap-[8px] rounded-[6px] border border-dashed border-transparent px-[10px] py-[7px] text-[12.5px] text-zinc-500 transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
    >
      <Plus className="size-[14px]" strokeWidth={1.6} />
      Add file / link / folder
    </button>
  );
}

function EmptyStageBody() {
  return (
    <div className="ml-[8px] mt-[4px] flex items-center justify-between gap-[10px] rounded-[7px] border border-dashed border-border-strong bg-surface-2 px-[12px] py-[10px]">
      <span className="text-[12px] text-zinc-500">No files yet</span>
      <Button
        type="button"
        variant="outline"
        size="xs"
        className="h-[24px] px-[8px] text-[11.5px]"
      >
        <Plus className="size-[12px]" strokeWidth={1.8} />
        Add file / link / folder
      </Button>
    </div>
  );
}

// ─── Glyphs + file icon ─────────────────────────────────────────────────────

function CollectionGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="size-[11px] shrink-0 text-linked" fill="none" aria-hidden>
      <rect
        x="1.5"
        y="2.5"
        width="9"
        height="7"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="M1.5 5h9" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function WorkflowGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="size-[11px] shrink-0 text-linked" fill="none" aria-hidden>
      <path
        d="M2 3h8M2 6h8M2 9h5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FileTypeIcon({ kind }: { kind: FileKind }) {
  const color = FILE_KIND_COLOR[kind] ?? "#6b6b73";

  if (kind === "figma") {
    return (
      <svg
        viewBox="0 0 16 16"
        className="size-[14px] shrink-0 justify-self-center"
        style={{ color }}
        fill="currentColor"
        aria-hidden
      >
        <circle cx="8" cy="8" r="2" fill="#b8336a" />
        <path
          d="M5 2.5h3v3H5a1.5 1.5 0 1 1 0-3zM8 2.5h3a1.5 1.5 0 1 1 0 3H8v-3zM8 5.5h3a1.5 1.5 0 1 1 0 3H8v-3zM5 5.5h3v3H5a1.5 1.5 0 1 1 0-3zM5 8.5h3v3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 0-3z"
          opacity="0.85"
        />
      </svg>
    );
  }

  if (kind === "link") {
    return (
      <Link2
        className="size-[14px] shrink-0 justify-self-center"
        strokeWidth={1.6}
        style={{ color }}
        aria-hidden
      />
    );
  }

  const label =
    kind === "pdf"
      ? "PDF"
      : kind === "xlsx"
        ? "XLS"
        : kind === "docx"
          ? "DOC"
          : kind === "psd"
            ? "PSD"
            : kind === "svg"
              ? "SVG"
              : kind === "jpg"
                ? "JPG"
                : kind === "png"
                  ? "PNG"
                  : "";
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-[14px] shrink-0 justify-self-center"
      style={{ color }}
      fill="none"
      aria-hidden
    >
      <path
        d="M4 1.5h5l3 3v9A1 1 0 0 1 11 14.5H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M9 1.5v3h3" stroke="currentColor" strokeWidth="1.2" />
      <text
        x="8"
        y="11.5"
        fontFamily="var(--font-mono)"
        fontSize={label.length === 3 ? "3.7" : "3"}
        fontWeight="700"
        fill="currentColor"
        textAnchor="middle"
      >
        {label}
      </text>
    </svg>
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
      continue;
    }
    const list = byStage.get(f.stage) ?? [];
    list.push(f);
    byStage.set(f.stage, list);
  }
  // Within each stage, sort by position so the bundle data's intent is honored.
  for (const list of byStage.values()) {
    list.sort((a, b) => a.position - b.position);
  }
  return { linked, byStage };
}

function groupByFolder(files: ProductFile[]): {
  folders: { folderPath: string; files: ProductFile[] }[];
  looseFiles: ProductFile[];
} {
  const folderMap = new Map<string, ProductFile[]>();
  const looseFiles: ProductFile[] = [];
  for (const f of files) {
    if (f.folderPath) {
      const list = folderMap.get(f.folderPath) ?? [];
      list.push(f);
      folderMap.set(f.folderPath, list);
    } else {
      looseFiles.push(f);
    }
  }
  const folders = [...folderMap.entries()]
    .map(([folderPath, fs]) => ({
      folderPath,
      files: fs.sort((a, b) => a.position - b.position),
    }))
    // Folders appear first, alphabetically by path.
    .sort((a, b) => a.folderPath.localeCompare(b.folderPath));
  return { folders, looseFiles };
}
