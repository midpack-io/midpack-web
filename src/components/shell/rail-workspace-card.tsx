"use client";

/** Workspace selector at the top of the Workspace rail.
 *  Click opens a workspace switcher popover — out of scope per the brief,
 *  so the button is a no-op for now. */
export function RailWorkspaceCard() {
  return (
    <button
      type="button"
      title="Switch workspace"
      className="flex w-full items-center gap-[8px] rounded-[7px] p-[8px] text-left transition-colors hover:bg-black/[0.05]"
    >
      <span
        aria-hidden
        className="relative inline-flex size-[28px] shrink-0 items-center justify-center overflow-hidden rounded-[6px] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #2a2a30 0%, #16161a 100%)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 5px, rgba(255,255,255,0.06) 5px 6px)",
          }}
        />
        <span className="relative font-mono text-[9.5px] font-bold tracking-[0.03em] leading-none">
          C17
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[2px] leading-tight">
        <span className="truncate text-[12.5px] font-medium tracking-[-0.005em] text-foreground">
          CHER&apos;17
        </span>
        <span className="truncate text-[11px] leading-tight text-zinc-500">
          25 members · 230 products
        </span>
      </span>
      <span className="shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-700" aria-hidden>
        <svg viewBox="0 0 11 11" fill="none" className="size-[12px]">
          <path
            d="M2.5 4l3-3 3 3M2.5 7l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
