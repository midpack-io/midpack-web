type GroupHeaderProps = {
  label: string;
  meta?: string;
};

// Small all-caps section heading above a list/grid. Pairs a uppercase label
// with optional meta (count, sort summary). Used at the top of the products
// list and the collections grid.
export function GroupHeader({ label, meta }: GroupHeaderProps) {
  return (
    <div className="flex items-baseline gap-[10px] py-[18px]">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </span>
      {meta && <span className="font-mono text-sm text-zinc-400">{meta}</span>}
    </div>
  );
}
