type Invoice = {
  date: string;
  number: string;
  seats: number;
  amount: string;
  status: "paid" | "refunded" | "failed";
};

const INVOICES: Invoice[] = [
  { date: "May 12, 2026", number: "INV-2026-005", seats: 15, amount: "$735.00", status: "paid" },
  { date: "Apr 12, 2026", number: "INV-2026-004", seats: 13, amount: "$637.00", status: "paid" },
  { date: "Mar 12, 2026", number: "INV-2026-003", seats: 10, amount: "$490.00", status: "paid" },
  { date: "Feb 12, 2026", number: "INV-2026-002", seats: 8, amount: "$392.00", status: "paid" },
  { date: "Jan 12, 2026", number: "INV-2026-001", seats: 6, amount: "$294.00", status: "paid" },
];

export function InvoicesTable() {
  return (
    <table className="w-full border-collapse text-[12.5px]">
      <thead>
        <tr>
          <Th>Date</Th>
          <Th>Invoice</Th>
          <Th>Seats</Th>
          <Th align="right">Amount</Th>
          <Th>Status</Th>
          <Th />
        </tr>
      </thead>
      <tbody>
        {INVOICES.map((inv) => (
          <tr key={inv.number} className="transition-colors hover:bg-surface-2">
            <Td className="font-mono tabular-nums">{inv.date}</Td>
            <Td className="font-mono tabular-nums">{inv.number}</Td>
            <Td className="font-mono tabular-nums">{inv.seats}</Td>
            <Td className="text-right font-mono tabular-nums">{inv.amount}</Td>
            <Td>
              <StatusChip status={inv.status} />
            </Td>
            <Td className="text-right">
              <button
                type="button"
                className="inline-flex h-[22px] items-center gap-[5px] rounded-[5px] border border-transparent bg-transparent px-[7px] text-[11px] font-medium leading-none text-zinc-700 transition-colors hover:bg-surface-3 hover:text-foreground"
              >
                PDF ↓
              </button>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Th({
  children,
  align = "left",
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`border-b border-border bg-surface-2 px-[18px] py-[10px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em] text-zinc-400 ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`border-b border-border px-[18px] py-[12px] align-middle text-foreground last:border-b-0 ${className}`}
    >
      {children}
    </td>
  );
}

function StatusChip({ status }: { status: Invoice["status"] }) {
  const config = {
    paid: { label: "Paid", className: "bg-ok-soft text-ok shadow-[inset_0_0_0_1px_rgba(47,122,74,0.18)]" },
    refunded: { label: "Refunded", className: "bg-surface-3 text-zinc-700 shadow-[inset_0_0_0_1px_var(--color-border)]" },
    failed: { label: "Failed", className: "bg-coral-soft text-coral shadow-[inset_0_0_0_1px_var(--color-coral-ring)]" },
  }[status];
  return (
    <span
      className={`inline-flex items-center gap-[5px] rounded-[6px] px-[7px] py-[2.5px] font-mono text-[11px] font-semibold leading-none ${config.className}`}
    >
      <span aria-hidden className="size-[5px] rounded-full bg-current" />
      {config.label}
    </span>
  );
}
