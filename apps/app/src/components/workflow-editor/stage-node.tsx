"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Eye, Flag, Paperclip, Trash2 } from "lucide-react";
import { AvatarDot, PersonPicker } from "@/components/ds/person-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePeople } from "@/hooks/usePeople";
import type { Person, PersonId } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { NODE_ICON, NODE_SELECTED_OUTLINE, NODE_SHELL } from "./node-theme";
import type { EditorNode } from "./types";

// The canvas stage node — the design-time twin of the runtime StepperPill. It
// reuses the pill's shell / icon-circle / performer-slot language so a node and
// a pill are visibly the same family. All edits mirror to local editor state.

export interface StageNodeData extends Record<string, unknown> {
  node: EditorNode;
  entering: boolean;
  onPerformerChange: (next: PersonId | "unassigned") => void;
  onToggleReview: () => void;
  onDelete: () => void;
}

export type StageFlowNode = Node<StageNodeData, "stage">;

export function StageNode({ data, selected }: NodeProps<StageFlowNode>) {
  const { node, entering } = data;
  const kind = node.kind;
  const isStart = kind === "start";
  const isReview = kind === "review";
  const attachCount =
    (node.templateFiles?.length ?? 0) + (node.components?.length ?? 0);

  return (
    <div
      data-kind={kind}
      className={cn(
        // Standard fixed size (NODE_W × NODE_H in constants.ts) so every node on
        // the canvas reads as one uniform unit; the label truncates inside it.
        "group/node relative flex h-[46px] w-[216px] items-center gap-[8px] rounded-md border pl-[6px] pr-[10px] font-sans shadow-sm transition-[box-shadow,border-color] duration-150",
        NODE_SHELL[kind],
        "hover:shadow-md",
        selected &&
          cn("outline outline-1 outline-offset-1", NODE_SELECTED_OUTLINE[kind]),
        entering && "animate-in fade-in zoom-in-95 duration-300",
      )}
    >
      {/* Target handle (incoming). Hidden on the start node — nothing precedes it. */}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-[9px] !w-[9px] !border-border-strong !bg-surface"
        />
      )}

      {/* Status icon — start shows a Flag, a review the orange Eye (clicking it
          toggles review off). Plain stages carry no icon. */}
      {kind !== "stage" && (
        <StatusIconButton
          kind={kind}
          onToggleReview={isStart ? undefined : data.onToggleReview}
        />
      )}

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col overflow-hidden",
          // Give the iconless plain stage a little left breathing room.
          kind === "stage" && "pl-[6px]",
        )}
      >
        <span
          title={node.label ?? undefined}
          className={cn(
            "truncate text-[12.5px] leading-none",
            isReview ? "font-semibold text-foreground" : "font-medium text-foreground",
          )}
        >
          {node.label ?? "Етап"}
        </span>
      </div>

      {attachCount > 0 && <AttachMarker count={attachCount} />}

      {!isStart && (
        <PerformerChip
          performerId={node.performerId}
          onChange={data.onPerformerChange}
        />
      )}

      {/* Source handle (outgoing). */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-[9px] !w-[9px] !border-border-strong !bg-surface"
      />

      {/* Hover delete — never on the start node. */}
      {!isStart && (
        <button
          type="button"
          aria-label="Видалити етап"
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete();
          }}
          className="nodrag nopan absolute -right-[9px] -top-[9px] hidden size-[18px] items-center justify-center rounded-full border border-border bg-surface text-zinc-400 shadow-sm transition-colors duration-150 hover:border-coral-ring hover:text-coral group-hover/node:flex"
        >
          <Trash2 className="size-[10px]" strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}

function StatusIconButton({
  kind,
  onToggleReview,
}: {
  kind: EditorNode["kind"];
  onToggleReview?: () => void;
}) {
  const glyph =
    kind === "start" ? (
      <Flag className="size-[10px]" strokeWidth={2} fill="currentColor" />
    ) : kind === "review" ? (
      <Eye className="size-[11px]" strokeWidth={2} />
    ) : null; // dashed ring is the marker itself

  const circle = (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold leading-none",
        NODE_ICON[kind],
      )}
    >
      {glyph}
    </span>
  );

  if (!onToggleReview) return <span className="ml-[2px]">{circle}</span>;

  return (
    <Tooltip delayDuration={400}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={
            kind === "review"
              ? "Зробити звичайним етапом"
              : "Позначити як перевірку"
          }
          onClick={(e) => {
            e.stopPropagation();
            onToggleReview();
          }}
          className="nodrag nopan ml-[2px] rounded-full outline-none transition-transform duration-150 hover:scale-110 focus-visible:ring-[2px] focus-visible:ring-accent-ring/70"
        >
          {circle}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {kind === "review" ? "Зняти позначку перевірки" : "Позначити як перевірку"}
      </TooltipContent>
    </Tooltip>
  );
}

function AttachMarker({ count }: { count: number }) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0 items-center gap-[2px] rounded-[4px] bg-surface-3 px-[4px] py-[2px] font-mono text-[9.5px] font-semibold text-zinc-500">
          <Paperclip className="size-[9px]" strokeWidth={2} />
          {count}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {count} прикріплених {count === 1 ? "файл" : "файлів"}
      </TooltipContent>
    </Tooltip>
  );
}

function PerformerChip({
  performerId,
  onChange,
}: {
  performerId?: PersonId | "unassigned";
  onChange: (next: PersonId | "unassigned") => void;
}) {
  const people = usePeople();
  const person =
    performerId && performerId !== "unassigned"
      ? people.data?.find((p) => p.id === performerId)
      : undefined;

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <span className="nodrag nopan inline-flex">
          <PersonPicker
            value={performerId ?? "unassigned"}
            onChange={onChange}
            align="end"
            side="bottom"
          >
            <PerformerTrigger person={person} />
          </PersonPicker>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {person ? person.name : "Не призначено"}
      </TooltipContent>
    </Tooltip>
  );
}

const PerformerTrigger = forwardRef<
  HTMLSpanElement,
  { person?: Person } & Omit<ComponentPropsWithoutRef<"span">, "children">
>(function PerformerTrigger({ person, className, onClick, ...rest }, ref) {
  return (
    <span
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={person ? `Виконавець: ${person.name}` : "Призначити виконавця"}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={cn(
        "group/avatar inline-flex size-[20px] shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-transform duration-150 hover:scale-110 focus-visible:ring-[2px] focus-visible:ring-accent-ring/70",
        className,
      )}
      {...rest}
    >
      {person ? (
        <AvatarDot person={person} size={20} />
      ) : (
        <span
          aria-hidden
          className="size-[20px] rounded-full border border-dashed border-border-strong bg-surface-3 transition-colors duration-150 group-hover/avatar:border-zinc-500 group-hover/avatar:bg-surface-2"
        />
      )}
    </span>
  );
});
