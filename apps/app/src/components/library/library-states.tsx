import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryKind } from "@/lib/api/types";

const EMPTY_COPY: Record<LibraryKind, { title: string; sub: string }> = {
  workflows: {
    title: "No workflow templates yet",
    sub: "Create one or duplicate the starter to stand up your first pipeline.",
  },
  components: {
    title: "No components yet",
    sub: "Drag a shared file here to publish it once and let every bundle reference it live.",
  },
  templates: {
    title: "No templates yet",
    sub: "Drag a starter file here to seed new products from a consistent blueprint.",
  },
};

export function LibraryGridSkeleton({ kind }: { kind: LibraryKind }) {
  const file = kind !== "workflows";
  return (
    <div
      className="grid gap-[12px]"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${file ? 280 : 360}px, 1fr))`,
      }}
    >
      {Array.from({ length: file ? 6 : 4 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-[11px] border border-border bg-surface">
          <Skeleton className={file ? "h-[88px] rounded-none" : "h-[110px] rounded-none"} />
          <div className="flex flex-col gap-[8px] px-[14px] py-[12px]">
            <Skeleton className="h-[14px] w-2/3" />
            <Skeleton className="h-[12px] w-1/2" />
          </div>
          <div className="border-t border-border bg-surface-2 px-[14px] py-[10px]">
            <Skeleton className="h-[18px] w-[80px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LibraryEmpty({ kind }: { kind: LibraryKind }) {
  const copy = EMPTY_COPY[kind];
  return (
    <div className="flex flex-col items-center justify-center gap-[6px] rounded-[12px] border border-dashed border-border-strong bg-surface-2 px-[24px] py-[56px] text-center">
      <h3 className="text-[14px] font-semibold text-foreground">{copy.title}</h3>
      <p className="max-w-[420px] text-[12.5px] text-zinc-500">{copy.sub}</p>
    </div>
  );
}

export function LibraryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[8px] rounded-[12px] border border-border bg-surface px-[24px] py-[48px] text-center">
      <p className="text-[13px] text-zinc-700">Couldn&apos;t load the library.</p>
      <button
        type="button"
        onClick={onRetry}
        className="font-mono text-[12px] font-semibold uppercase tracking-[0.05em] text-accent-strong hover:underline"
      >
        Retry
      </button>
    </div>
  );
}

export function LibraryNoResults() {
  return (
    <div className="rounded-[12px] border border-dashed border-border-strong bg-surface-2 px-[24px] py-[40px] text-center text-[12.5px] text-zinc-500">
      No matches. Try a different search or filter.
    </div>
  );
}
