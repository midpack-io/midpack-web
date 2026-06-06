import {
  ArrowRight,
  AtSign,
  Check,
  Plus,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/time";
import type {
  ActivityItem,
  ActivityKind,
  Person,
  PersonId,
} from "@/lib/api/types";

type ActivityPreviewProps = {
  items: ActivityItem[];
  peopleMap: Map<PersonId, Person>;
  // Max items shown — anything beyond is dropped. "Preview" because this is
  // the truncated teaser variant; a full feed would scroll/paginate.
  limit?: number;
};

const DEFAULT_LIMIT = 3;

const ACTIVITY_ICON_BG: Record<ActivityKind, string> = {
  move: "bg-accent-soft text-accent",
  approve: "bg-ok-soft text-ok",
  return: "bg-coral-soft text-coral",
  mention: "bg-coral-soft text-coral",
  create: "bg-surface-3 text-zinc-500",
};

const ACTIVITY_ICON_GLYPH: Record<ActivityKind, LucideIcon> = {
  move: ArrowRight,
  approve: Check,
  return: Undo2,
  mention: AtSign,
  create: Plus,
};

export function ActivityPreview({
  items,
  peopleMap,
  limit = DEFAULT_LIMIT,
}: ActivityPreviewProps) {
  if (items.length === 0) {
    return <p className="text-sm italic text-zinc-400">Поки немає активності</p>;
  }
  return (
    <ul className="-mx-[8px] flex flex-col gap-[2px]">
      {items.slice(0, limit).map((it) => {
        const actor = peopleMap.get(it.actorId);
        return (
          <li
            key={it.id}
            className="grid grid-cols-[18px_76px_1fr] items-start gap-[10px] rounded-[6px] px-[8px] py-[5px] transition-colors hover:bg-surface-2"
          >
            <ActivityIcon kind={it.kind} />
            <span className="pt-[1px] font-mono text-xs text-zinc-400 tabular-nums">
              {timeAgo(it.time)}
            </span>
            <p className="text-sm leading-snug text-zinc-700">
              <b className="font-medium text-foreground">{it.entityName}</b>
              <span> {activityText(it)}</span>
              {actor && (
                <>
                  <span className="text-zinc-400"> · </span>
                  <span className="text-zinc-400">{actor.name}</span>
                </>
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function ActivityIcon({ kind }: { kind: ActivityKind }) {
  const Icon = ACTIVITY_ICON_GLYPH[kind];
  return (
    <span
      className={cn(
        "flex h-[18px] w-[18px] items-center justify-center rounded-[4px]",
        ACTIVITY_ICON_BG[kind],
      )}
      aria-hidden
    >
      <Icon className="h-[11px] w-[11px]" strokeWidth={2.2} />
    </span>
  );
}

function activityText(it: ActivityItem): string {
  switch (it.kind) {
    case "move":
      return `переміщено ${it.fromStage ? `з ${it.fromStage} ` : ""}до ${it.toStage ?? "наступного"}`;
    case "approve":
      return `схвалено на ${it.fromStage ?? ""}`;
    case "return":
      return `повернуто на ${it.toStage ?? "попередній етап"}`;
    case "mention":
      return `згадав(-ла) вас`;
    case "create":
      return `створено`;
  }
}
