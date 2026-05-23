import * as React from "react";
import { CfChip, CfChipAdd } from "@/components/ds/cf-chip";
import { PillInline, PillInlineAdd } from "@/components/ds/pill-inline";
import { StatusChip, type StatusValue } from "@/components/ds/status-chip";

export const metadata = {
  title: "Components · Midpack",
  description: "Midpack design system reference page.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card-lg border border-border bg-surface p-5 shadow-sm">
      <div className="mb-[10px] font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {title}
      </div>
      {children}
    </section>
  );
}

const STATUSES: StatusValue[] = [
  "todo",
  "in-progress",
  "in-review",
  "done",
  "canceled",
  "reopened",
];

export default function ComponentsPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-[24px] p-[24px]">
      <header>
        <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">Components</h1>
        <p className="text-[12px] leading-[1.4] text-zinc-500">Midpack design system reference.</p>
      </header>

      <Section title="Status chips">
        <div className="flex flex-wrap gap-[6px]">
          {STATUSES.map((s) => (
            <StatusChip key={s} status={s} />
          ))}
        </div>
        <div className="mt-[8px] grid grid-cols-3 gap-x-[14px] gap-y-[6px] text-[11px] text-zinc-500">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-foreground">TO DO</span>{" "}
            Slate · queued, no performer yet
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-foreground">IN PROGRESS</span>{" "}
            Info-blue · performer working
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-foreground">IN REVIEW</span>{" "}
            Amber · awaiting approver
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-foreground">DONE</span>{" "}
            Green · approved
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-foreground">CANCELED</span>{" "}
            Muted · removed from flow
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-foreground">REOPENED</span>{" "}
            Coral · restarted
          </div>
        </div>
      </Section>

      <Section title="Pill-inline">
        <div className="flex flex-wrap items-center gap-[4px]">
          <PillInline>DRAFT</PillInline>
          <PillInline color="indigo">CARDIGAN</PillInline>
          <PillInline color="green">CAMEL</PillInline>
          <PillInline color="amber">FW25</PillInline>
          <PillInline color="pink">CAPSULE</PillInline>
          <PillInline color="slate">EVENT</PillInline>
          <PillInline color="teal">SUSTAIN</PillInline>
          <PillInlineAdd />
        </div>
      </Section>

      <Section title="CF-chips · KEY · VALUE">
        <div className="flex flex-wrap items-center gap-[6px]">
          <CfChip k="SKU" v="A047-CRM" />
          <CfChip k="FABRIC" v="Wool-cashmere" />
          <CfChip k="MOQ" v="120" />
          <CfChip k="COST" v="€82" />
          <CfChip k="SHIP" v="Sep 10" />
          <CfChipAdd />
        </div>
      </Section>
    </main>
  );
}
