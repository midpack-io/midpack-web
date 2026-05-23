"use client";

import Link from "next/link";
import {
  ArrowRight,
  MoreHorizontal,
  AlertTriangle,
  AtSign,
  Check,
  Plus,
  Undo2,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  CollectionProgress,
  progressValueText,
} from "@/components/ds/collection-progress";
import { StageDistribution } from "@/components/ds/stage-distribution";
import { usePeople, indexPeople } from "@/hooks/usePeople";
import { cn } from "@/lib/utils";
import type {
  ActivityItem,
  ActivityKind,
  Collection,
  Person,
  PersonId,
} from "@/lib/api/types";

type CollectionCardProps = {
  collection: Collection;
};

export function CollectionCard({ collection }: CollectionCardProps) {
  const peopleQuery = usePeople();
  const peopleMap = indexPeople(peopleQuery.data);
  const productsInFlow = Object.values(collection.stageDistribution).reduce(
    (sum, n) => sum + n,
    0,
  );
  const archived = collection.status === "archived";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[12px] border border-border bg-surface shadow-md transition-all duration-150 hover:-translate-y-[1px] hover:border-border-strong hover:shadow-lg focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent-ring">
      <Link
        href={`/products?collection=${collection.id}`}
        aria-label={`Відкрити ${collection.name}`}
        className="flex flex-1 flex-col rounded-[12px] focus:outline-none"
      >
        <CardTop collection={collection} />
        <div className="flex flex-col gap-[10px] border-t border-border px-[18px] py-[14px]">
          <CollectionProgress
            label="Прогрес"
            caption={progressValueText(collection.progressPct, "uk")}
            pct={collection.progressPct}
            tone={collection.progressTone}
          />
        </div>
        <Section
          label={archived ? "Потік етапів" : "Розподіл по етапах"}
          value={archived ? undefined : stageValueText(productsInFlow, collection.productCount)}
        >
          <StageDistribution
            distribution={collection.stageDistribution}
            hideLegend={archived}
          />
        </Section>
        {!archived && (
          <Section label="Остання активність">
            <Activity items={collection.recentActivity} peopleMap={peopleMap} />
          </Section>
        )}
        <CardFoot updatedAt={collection.updatedAt} />
      </Link>

      {/* Top-right interactive controls — sit outside the Link so they don't
          nest a <button> inside an <a>. Absolute over the card top. */}
      <div className="absolute right-[14px] top-[14px] z-10 flex items-center gap-[6px]">
        {collection.unreadMentions > 0 && (
          <MentionsBadge count={collection.unreadMentions} />
        )}
        <CardKebab />
      </div>
    </article>
  );
}

// ─── Card top ────────────────────────────────────────────────────────────────

function CardTop({ collection }: { collection: Collection }) {
  const { cover, name, description, productCount, dueDate, riskLevel, status, unreadMentions } = collection;
  const archived = status === "archived";
  const dueTone =
    riskLevel === "overdue" ? "text-coral" : riskLevel === "at_risk" ? "text-warn" : null;
  // Reserve space on the right for the absolute mentions badge + kebab when present.
  const reserveRight = unreadMentions > 0 ? "pr-[120px]" : "pr-[44px]";
  return (
    <div className={cn("grid grid-cols-[96px_1fr] gap-[14px] p-[18px]", reserveRight)}>
      {/* Cover */}
      <div className="relative h-[96px] w-[96px] overflow-hidden rounded-[8px] border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover.url}
          alt=""
          className={cn(
            "h-full w-full object-cover transition-[filter] duration-200",
            archived && "grayscale opacity-75",
          )}
          loading="lazy"
        />
      </div>

      {/* Title block */}
      <div className="flex min-w-0 flex-col gap-[6px]">
        <h2 className="truncate text-xl font-semibold leading-tight tracking-[-0.01em] text-foreground">
          {name}
        </h2>
        <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px] text-base text-zinc-500">
          <span>
            <b className="font-medium tabular-nums text-foreground">{productCount}</b> продуктів
          </span>
          <span className="text-zinc-300">·</span>
          <span className={cn("inline-flex items-center gap-[5px]", dueTone)}>
            {dueTone && <AlertTriangle className="h-[13px] w-[13px]" strokeWidth={2.2} />}
            <span>
              Дедлайн{" "}
              <b className={cn("font-semibold tabular-nums", !dueTone && "text-foreground")}>
                {formatDueDate(dueDate)}
              </b>
            </span>
          </span>
          {status === "wrapping_up" && (
            <>
              <span className="text-zinc-300">·</span>
              <span className="text-ok">завершується</span>
            </>
          )}
        </div>
        <p className="line-clamp-2 text-base leading-snug text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

function MentionsBadge({ count }: { count: number }) {
  return (
    <span
      className="inline-flex h-[24px] items-center gap-[4px] rounded-[14px] bg-coral-soft px-[9px] font-mono text-xs font-medium text-coral"
      style={{ boxShadow: "inset 0 0 0 1px var(--color-coral-ring)" }}
    >
      <AtSign className="h-[11px] w-[11px]" strokeWidth={2.2} />
      <span className="tabular-nums">вас {count}</span>
    </span>
  );
}

function CardKebab() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Відкрити меню колекції"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] text-zinc-500 outline-none transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-accent-ring data-[state=open]:ring-0"
        >
          <MoreHorizontal className="h-[16px] w-[16px]" strokeWidth={1.8} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Перейменувати</DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Дублювати</DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Архівувати</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({
  label,
  value,
  children,
}: {
  label: string;
  value?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[10px] border-t border-border px-[18px] py-[14px]">
      <div className="flex items-center justify-between gap-[10px]">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.07em] text-zinc-400">
          {label}
        </span>
        {value && <span className="text-base text-zinc-500">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── Activity ────────────────────────────────────────────────────────────────

function Activity({
  items,
  peopleMap,
}: {
  items: ActivityItem[];
  peopleMap: Map<PersonId, Person>;
}) {
  if (items.length === 0) {
    return <p className="text-sm italic text-zinc-400">Поки немає активності</p>;
  }
  return (
    <ul className="-mx-[8px] flex flex-col gap-[2px]">
      {items.slice(0, 3).map((it) => {
        const actor = peopleMap.get(it.actorId);
        return (
          <li
            key={it.id}
            className="grid grid-cols-[18px_76px_1fr] items-start gap-[10px] rounded-[6px] px-[8px] py-[5px] transition-colors hover:bg-surface-2"
          >
            <ActivityIcon kind={it.kind} />
            <span className="pt-[1px] font-mono text-xs text-zinc-400 tabular-nums">
              {formatTimeAgo(it.time)}
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

// ─── Card foot ───────────────────────────────────────────────────────────────

function CardFoot({ updatedAt }: { updatedAt: string }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-border bg-surface-2 px-[18px] py-[12px]">
      <span className="font-mono text-sm text-zinc-500">
        Оновлено <b className="font-medium text-zinc-700">{formatTimeAgo(updatedAt)}</b>
      </span>
      <span className="flex items-center gap-[5px] text-base font-semibold text-zinc-700 opacity-60 -translate-x-[3px] transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
        <span>Відкрити колекцію</span>
        <ArrowRight className="h-[12px] w-[12px]" strokeWidth={1.8} />
      </span>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stageValueText(inFlow: number, total: number): string {
  if (inFlow === 0) return "немає в роботі";
  if (inFlow === total) return `${total} продуктів`;
  return `${inFlow} з ${total} продуктів`;
}

function formatDueDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("uk-UA", { month: "short", day: "numeric", year: "numeric" });
}

// Current "now" — pinned for stage 1 demo so seeded ISO strings produce
// consistent "Xh ago" labels regardless of when the page is opened.
const NOW_ISO = "2026-05-22T15:00:00.000Z";

function formatTimeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = new Date(NOW_ISO).getTime();
  const diffMs = now - then;
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "щойно";
  if (min < 60) return `${min} хв тому`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} год тому`;
  const day = Math.round(hr / 24);
  if (day === 1) return "вчора";
  if (day < 7) return `${day} дн тому`;
  const week = Math.round(day / 7);
  if (week < 4) return `${week} тиж тому`;
  const month = Math.round(day / 30);
  if (month < 12) return `${month} міс тому`;
  return `${Math.round(day / 365)} р тому`;
}
