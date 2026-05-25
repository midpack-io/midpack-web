"use client";

import Link from "next/link";
import {
  ArrowRight,
  MoreHorizontal,
  AlertTriangle,
  AtSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ActivityPreview } from "@/components/ds/activity-preview";
import {
  CollectionProgress,
  progressValueText,
} from "@/components/ds/collection-progress";
import { StageDistribution } from "@/components/ds/stage-distribution";
import { usePeople, indexPeople } from "@/hooks/usePeople";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Collection } from "@/lib/api/types";

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
            <ActivityPreview items={collection.recentActivity} peopleMap={peopleMap} />
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
    <span className="inline-flex h-[24px] items-center gap-[4px] rounded-[14px] bg-coral-soft px-[9px] font-mono text-xs font-medium text-coral shadow-[inset_0_0_0_1px_var(--color-coral-ring)]">
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

// ─── Card foot ───────────────────────────────────────────────────────────────

function CardFoot({ updatedAt }: { updatedAt: string }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-border bg-surface-2 px-[18px] py-[12px]">
      <span className="font-mono text-sm text-zinc-500">
        Оновлено <b className="font-medium text-zinc-700">{timeAgo(updatedAt)}</b>
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
