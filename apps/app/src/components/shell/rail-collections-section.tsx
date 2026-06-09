"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollections } from "@/hooks/useCollections";
import type { Collection } from "@/lib/api/types";

const COLLAPSED_KEY = "rail-collections-collapsed";

export function RailCollectionsSection() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collections = useCollections("active");
  const items = collections.data ?? [];

  // The active collection — when the user is inside /collections/[id] or on
  // /products?collection=[id]. Used to auto-expand the section so the row
  // is visible.
  const activeCollectionId = useMemo(() => {
    const detailMatch = pathname.match(/^\/collections\/([^/]+)/);
    if (detailMatch) return detailMatch[1];
    if (pathname.startsWith("/products")) {
      return searchParams.get("collection");
    }
    return null;
  }, [pathname, searchParams]);

  const [collapsed, setCollapsed] = useState(false);

  // Hydrate persisted collapsed state, then auto-expand when the user is
  // deep inside a collection.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      const saved = window.localStorage.getItem(COLLAPSED_KEY);
      if (saved === "1") setCollapsed(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (activeCollectionId) setCollapsed(false);
  }, [activeCollectionId]);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <div className={cn("mt-[8px] flex flex-col", !collapsed && "min-h-0 flex-1")}>
      <button
        type="button"
        onClick={toggle}
        className="group flex w-full shrink-0 items-center gap-[8px] rounded-[6px] px-[8px] py-[8px] text-left font-mono text-[11px] font-semibold uppercase leading-none tracking-[0.07em] text-zinc-500 transition-colors hover:text-foreground"
      >
        <svg
          viewBox="0 0 10 10"
          fill="none"
          className={cn(
            "size-[10px] shrink-0 text-zinc-400 transition-transform duration-200",
            collapsed && "-rotate-90",
          )}
        >
          <path
            d="M3 2l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(90 5 5)"
          />
        </svg>
        <span>Collections</span>
        <span className="ml-[4px] rounded-[3px] bg-black/[0.06] px-[5px] py-px font-mono text-[9.5px] tabular-nums text-zinc-400">
          {items.length}
        </span>
        <span
          role="button"
          aria-label="New collection"
          onClick={(e) => e.stopPropagation()}
          className="ml-auto inline-flex size-[18px] items-center justify-center rounded-[4px] text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/[0.08] hover:text-foreground"
        >
          <Plus className="size-[10px]" strokeWidth={1.6} />
        </span>
      </button>

      {!collapsed && (
        <div className="mt-[2px] flex min-h-0 flex-1 flex-col gap-px overflow-y-auto">
          {items.map((c) => (
            <CollectionRow
              key={c.id}
              collection={c}
              active={activeCollectionId === c.id}
            />
          ))}

          <AllCollectionsLink />
        </div>
      )}
    </div>
  );
}

function AllCollectionsLink() {
  const pathname = usePathname();
  const active = pathname === "/collections";
  return (
    <Link
      href="/collections"
      aria-current={active ? "page" : undefined}
      className={cn(
        "mt-[2px] flex items-center gap-[8px] rounded-[6px] px-[8px] py-[8px] text-[11.5px] transition-colors",
        active
          ? "bg-surface-3 font-medium text-foreground"
          : "text-zinc-400 hover:bg-black/[0.04] hover:text-zinc-700",
      )}
    >
      All collections
      <svg viewBox="0 0 10 10" fill="none" className="size-[10px]">
        <path
          d="M2 5h6M6 2.5L8.5 5 6 7.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

function CollectionRow({
  collection,
  active,
}: {
  collection: Collection;
  active: boolean;
}) {
  const atRisk = collection.riskLevel === "at_risk" || collection.riskLevel === "overdue";
  return (
    <Link
      href={`/products?collection=${collection.id}`}
      className={cn(
        "grid grid-cols-[36px_1fr_auto] items-center gap-[8px] rounded-[6px] px-[8px] py-[8px] transition-colors",
        active ? "bg-surface-3" : "hover:bg-black/[0.04]",
      )}
    >
      <span
        aria-hidden
        className="relative size-[36px] shrink-0 overflow-hidden rounded-[6px] bg-surface-3 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
      >
        {collection.cover.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={collection.cover.url}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center font-mono text-[11px] font-semibold text-zinc-500">
            {collection.name.slice(0, 1)}
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-[4px]">
        <span
          className={cn(
            "min-w-0 truncate text-[12.5px] leading-tight text-foreground",
            active && "font-medium",
          )}
        >
          {collection.name}
        </span>
        <span className="block h-[3px] overflow-hidden rounded-[2px] bg-black/[0.07]">
          <span
            className={cn(
              "block h-full rounded-[2px]",
              atRisk
                ? "bg-coral"
                : active
                  ? "bg-foreground"
                  : "bg-zinc-700",
            )}
            style={{ width: `${Math.max(2, Math.min(100, collection.progressPct))}%` }}
          />
        </span>
      </span>
      <span className="flex shrink-0 items-center justify-end">
        {collection.unreadMentions > 0 ? (
          <span
            title={`${collection.unreadMentions} unread mention${collection.unreadMentions === 1 ? "" : "s"}`}
            className="rounded-sm bg-coral px-[6px] py-[1.5px] font-mono text-[10.5px] font-medium leading-none tabular-nums text-white"
          >
            {collection.unreadMentions}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
