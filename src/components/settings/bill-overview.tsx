/** Three-tile billing overview grid — Members used, Next invoice, Trial. */
export function BillOverview() {
  return (
    <div className="grid grid-cols-3 gap-0">
      <div className="border-r border-border px-[18px] py-[16px]">
        <div className="mb-[6px] font-mono text-[10.5px] uppercase tracking-[0.07em] text-zinc-400">
          Seats
        </div>
        <div className="inline-flex items-baseline gap-[7px] text-[22px] font-semibold leading-none tracking-[-0.01em] tabular-nums text-foreground">
          12
          <span className="text-[12px] font-medium text-zinc-500">of 15 paid</span>
        </div>
        <div className="relative mt-[8px] h-[6px] overflow-hidden rounded-[3px] bg-surface-3">
          <div
            className="h-full bg-foreground"
            style={{ width: "80%", borderRight: "1px dashed #fff" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0"
            style={{
              width: "20%",
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent 0 4px, rgba(0,0,0,0.04) 4px 5px)",
            }}
          />
        </div>
        <div className="mt-[4px] text-[11.5px] text-zinc-500">
          3 seats unused · invites won&apos;t trigger a charge until 16th
        </div>
      </div>

      <div className="border-r border-border px-[18px] py-[16px]">
        <div className="mb-[6px] font-mono text-[10.5px] uppercase tracking-[0.07em] text-zinc-400">
          Next invoice
        </div>
        <div className="text-[22px] font-semibold leading-none tracking-[-0.01em] tabular-nums text-foreground">
          $735.00
        </div>
        <div className="mt-[4px] text-[11.5px] text-zinc-500">
          15 seats × $49 · charged Jun 12, 2026
        </div>
      </div>

      <div className="px-[18px] py-[16px]">
        <div className="mb-[6px] font-mono text-[10.5px] uppercase tracking-[0.07em] text-zinc-400">
          Trial
        </div>
        <div className="font-mono text-[16px] font-semibold leading-none text-ok">
          Converted
        </div>
        <div className="mt-[4px] text-[11.5px] text-zinc-500">
          Started Apr 30, 2026 · converted May 14, 2026
        </div>
      </div>
    </div>
  );
}
