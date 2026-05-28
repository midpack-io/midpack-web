"use client";

import type { DragEvent } from "react";
import type {
  FileComponent,
  FileKind,
  FileTemplate,
  WorkflowTemplate,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { CardMenu } from "./card-menu";
import { FileThumb } from "./file-thumb";
import { extLabel, formatUpd, usageVerb } from "./lib";
import { BlueprintBadge, LiveBadge, WorkflowBadge } from "./type-badge";
import { UsageChip } from "./usage-popover";
import { WorkflowGraphView } from "./workflow-graph";

type CardCallbacks = {
  onOpen: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onArchiveToggle: () => void;
  onDelete: () => void;
};

type Droppable = {
  dropActive?: boolean;
  uploading?: boolean;
  uploadError?: string | null;
  onRetry?: () => void;
  onDragOver?: (e: DragEvent) => void;
  onDragLeave?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
};

type LibraryCardProps = CardCallbacks &
  (
    | { kind: "workflows"; item: WorkflowTemplate }
    | ({ kind: "components"; item: FileComponent } & Droppable)
    | ({ kind: "templates"; item: FileTemplate } & Droppable)
  );

export function LibraryCard(props: LibraryCardProps) {
  const { kind, item, onOpen, onRename, onDuplicate, onArchiveToggle, onDelete } = props;
  const isFile = kind !== "workflows";
  const drop = (isFile ? props : {}) as Droppable;

  const usageCount =
    kind === "workflows"
      ? item.usageActive
      : kind === "components"
        ? item.usageReferenced
        : item.usageSeeded;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      onDragOver={drop.onDragOver}
      onDragLeave={drop.onDragLeave}
      onDrop={drop.onDrop}
      className={cn(
        "group/card relative flex cursor-pointer flex-col overflow-hidden rounded-[11px] border bg-surface shadow-sm transition-[border-color,box-shadow,transform] duration-150 hover:shadow-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring",
        kind === "components" ? "border-linked-border" : "border-border",
        kind === "workflows" ? "hover:border-accent-ring" : "hover:border-zinc-400",
        drop.dropActive && "border-accent-strong ring-[3px] ring-accent-ring",
      )}
    >
      {/* Preview */}
      {kind === "workflows" ? (
        <div
          className="relative h-[110px] border-b border-border"
          style={{
            backgroundImage:
              "linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-2) 100%), linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)",
            backgroundSize: "auto, 14px 14px, 14px 14px",
            backgroundPosition: "0 0, -1px -1px, -1px -1px",
          }}
        >
          <WorkflowGraphView graph={item.graph} />
        </div>
      ) : (
        <div
          className={cn(
            "relative h-[88px] border-b border-border",
            kind === "components"
              ? "bg-gradient-to-b from-linked/4 to-surface-2"
              : "bg-surface-2",
          )}
        >
          <FileThumb kind={item.kind as FileKind} />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col gap-[8px] px-[14px] py-[12px]">
        <div className="flex items-start gap-[8px]">
          <div className="min-w-0 flex-1 truncate text-[13px] font-semibold tracking-[-0.005em] text-foreground">
            {item.name}
          </div>
          <CardMenu
            status={item.status}
            usageCount={usageCount}
            onRename={onRename}
            onDuplicate={onDuplicate}
            onArchiveToggle={onArchiveToggle}
            onDelete={onDelete}
          />
        </div>
        <div className="flex flex-wrap items-center gap-[8px] text-[11.5px] text-zinc-500">
          {kind === "workflows" && <WorkflowBadge />}
          {kind === "components" && <LiveBadge />}
          {kind === "templates" && <BlueprintBadge />}
          <span className="size-[3px] shrink-0 rounded-full bg-zinc-300" aria-hidden />
          {kind === "workflows" ? (
            item.isDraft ? (
              <span className="inline-flex items-center gap-[5px] rounded-[4px] bg-warn-soft px-[6px] py-[2px] font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-warn">
                <span className="size-[5px] rounded-full bg-current" aria-hidden />
                Draft
              </span>
            ) : (
              <span>{item.summary}</span>
            )
          ) : (
            <>
              <span className="rounded-[3px] bg-surface-3 px-[5px] py-[1.5px] font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-zinc-700">
                {extLabel(item.kind as FileKind)}
              </span>
              <span className="font-mono text-[11px] text-zinc-500">{item.version}</span>
            </>
          )}
        </div>
      </div>

      {/* Foot */}
      <div className="flex items-center gap-[8px] border-t border-border bg-surface-2 px-[14px] py-[10px]">
        <UsageChip kind={kind} id={item.id} count={usageCount} verb={usageVerb(kind)} />
        <span className="ml-auto font-mono text-[10.5px] text-zinc-400">
          UPD · {formatUpd(item.updatedAt)}
        </span>
      </div>

      {/* Upload overlay (file cards) */}
      {isFile && drop.uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[8px] bg-surface/85 backdrop-blur-[1px]">
          <span className="text-[12px] font-medium text-foreground">Adding version…</span>
          <span className="h-[3px] w-[60%] overflow-hidden rounded-full bg-surface-3">
            <span className="block h-full w-1/2 animate-pulse rounded-full bg-accent-strong" />
          </span>
        </div>
      )}
      {isFile && drop.uploadError && !drop.uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[6px] bg-surface/90 px-[14px] text-center">
          <span className="text-[12px] font-medium text-coral">{drop.uploadError}</span>
          {drop.onRetry && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                drop.onRetry?.();
              }}
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-accent-strong hover:underline"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </article>
  );
}
