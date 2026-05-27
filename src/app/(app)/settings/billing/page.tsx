import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import {
  SettingsCard,
  SettingsCardBody,
  SettingsCardHeader,
} from "@/components/settings/settings-card";
import { SettingsRow } from "@/components/settings/settings-row";
import { BillOverview } from "@/components/settings/bill-overview";
import { InvoicesTable } from "@/components/settings/invoices-table";

export default function SettingsBillingPage() {
  return (
    <>
      <SettingsPageHeader
        eyebrow="Workspace"
        title="Billing & plan"
        sub="Plan, payment, and invoices. Cancel or change seats any time — no sales call."
        actions={
          <>
            <button
              type="button"
              className="inline-flex h-[26px] items-center gap-[6px] rounded-[6px] border border-border-strong bg-surface px-[9px] text-[12px] font-medium leading-none text-foreground shadow-sm transition-colors hover:border-zinc-400 hover:bg-surface-3"
            >
              Tax info
            </button>
            <button
              type="button"
              className="inline-flex h-[26px] items-center gap-[6px] rounded-[6px] border border-foreground bg-foreground px-[9px] text-[12px] font-medium leading-none text-white shadow-sm transition-colors hover:bg-black"
            >
              Add seats
            </button>
          </>
        }
      />

      <SettingsCard>
        <SettingsCardHeader title="Current plan" sub="Updated nightly." />
        <SettingsCardBody>
          <div className="flex items-center gap-[18px] px-[18px] py-[16px]">
            <span
              aria-hidden
              className="inline-flex size-[50px] shrink-0 items-center justify-center rounded-[10px] font-mono text-[11px] font-bold tracking-[0.05em] text-white"
              style={{ backgroundImage: "linear-gradient(135deg, #4f46e5, #312e81)" }}
            >
              PRO
            </span>
            <div>
              <h3 className="m-0 text-[15px] font-semibold text-foreground">
                Midpack · Team plan
              </h3>
              <div className="mt-[3px] inline-flex items-center gap-[8px] text-[12px] text-zinc-500">
                <StatusChip>Active</StatusChip>
                <span className="text-zinc-400">·</span>
                <span>
                  <b className="font-semibold text-foreground">$49</b> per seat per month
                </span>
                <span className="text-zinc-400">·</span>
                <span>
                  Renews{" "}
                  <b className="font-medium text-foreground">Jun 12, 2026</b>
                </span>
              </div>
            </div>
            <div className="ml-auto inline-flex gap-[6px]">
              <button
                type="button"
                className="inline-flex h-[26px] items-center gap-[6px] rounded-[6px] border border-border-strong bg-surface px-[9px] text-[12px] font-medium leading-none text-foreground shadow-sm transition-colors hover:border-zinc-400 hover:bg-surface-3"
              >
                Change plan
              </button>
            </div>
          </div>

          <BillOverview />
        </SettingsCardBody>
      </SettingsCard>

      <SettingsCard>
        <SettingsCardHeader
          title="Payment method"
          actions={
            <button
              type="button"
              className="inline-flex h-[26px] items-center gap-[6px] rounded-[6px] border border-border-strong bg-surface px-[9px] text-[12px] font-medium leading-none text-foreground shadow-sm transition-colors hover:border-zinc-400 hover:bg-surface-3"
            >
              Update card
            </button>
          }
        />
        <SettingsCardBody>
          <div className="flex items-center gap-[12px] px-[18px] py-[14px]">
            <span
              aria-hidden
              className="inline-flex h-[24px] w-[36px] items-center justify-center rounded-[4px] font-mono text-[9px] font-bold tracking-[0.05em] text-white"
              style={{ backgroundImage: "linear-gradient(135deg, #1a1f71, #0a1452)" }}
            >
              VISA
            </span>
            <div className="text-[12.5px] text-foreground">
              <div>
                <span className="font-mono">•••• •••• •••• 4242</span> · expires{" "}
                <span className="font-mono">08 / 28</span>
              </div>
              <div className="mt-[2px] text-[11.5px] text-zinc-500">
                Anna Kovalenko · billing email{" "}
                <span className="font-mono">billing@midpack.app</span>
              </div>
            </div>
            <div className="ml-auto inline-flex gap-[6px]">
              <button
                type="button"
                className="inline-flex h-[22px] items-center gap-[5px] rounded-[5px] border border-transparent bg-transparent px-[7px] text-[11px] font-medium leading-none text-zinc-700 transition-colors hover:bg-surface-3 hover:text-foreground"
              >
                Remove
              </button>
            </div>
          </div>
        </SettingsCardBody>
      </SettingsCard>

      <SettingsCard>
        <SettingsCardHeader
          title="Invoices"
          sub="Last 6 months. Older invoices on request."
          actions={
            <button
              type="button"
              className="inline-flex h-[22px] items-center gap-[5px] rounded-[5px] border border-border-strong bg-surface px-[7px] text-[11px] font-medium leading-none text-foreground shadow-sm transition-colors hover:border-zinc-400 hover:bg-surface-3"
            >
              Download all (.zip)
            </button>
          }
        />
        <SettingsCardBody className="py-0">
          <InvoicesTable />
        </SettingsCardBody>
      </SettingsCard>

      <SettingsCard variant="danger">
        <SettingsCardHeader
          variant="danger"
          title="Cancel subscription"
          sub="Workspace data stays read-only until the end of the billing period."
        />
        <SettingsCardBody>
          <SettingsRow
            label="Cancel at period end"
            hint={
              <>
                You&apos;ll keep access through{" "}
                <b className="font-medium text-foreground">Jun 12, 2026</b>. After
                that, the workspace is read-only for 30 days, then archived.
              </>
            }
            control={
              <button
                type="button"
                className="inline-flex h-[32px] w-max items-center gap-[6px] rounded-[7px] border border-coral-ring bg-surface px-[12px] text-[12.5px] font-medium leading-none text-coral shadow-sm transition-colors hover:border-coral hover:bg-coral-soft"
              >
                Cancel subscription
              </button>
            }
          />
        </SettingsCardBody>
      </SettingsCard>
    </>
  );
}

function StatusChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[5px] rounded-[6px] bg-ok-soft px-[7px] py-[2.5px] font-mono text-[11px] font-semibold leading-none text-ok shadow-[inset_0_0_0_1px_rgba(47,122,74,0.18)]">
      <span aria-hidden className="size-[5px] rounded-full bg-current" />
      {children}
    </span>
  );
}
