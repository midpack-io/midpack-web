import { Trash2 } from "lucide-react";
import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import {
  SettingsCard,
  SettingsCardBody,
  SettingsCardHeader,
} from "@/components/settings/settings-card";
import { SettingsRow } from "@/components/settings/settings-row";
import { OnboardingChecklist } from "@/components/settings/onboarding-checklist";

export default function SettingsGeneralPage() {
  return (
    <>
      <SettingsPageHeader
        eyebrow="Workspace"
        title="General"
        sub="Identity, defaults, and ownership for the Midpack workspace."
        actions={
          <>
            <button
              type="button"
              className="inline-flex h-[26px] items-center gap-[6px] rounded-[6px] border border-transparent bg-transparent px-[9px] text-[12px] font-medium leading-none text-zinc-700 transition-colors hover:bg-surface-3 hover:text-foreground"
            >
              Discard
            </button>
            <button
              type="button"
              className="inline-flex h-[26px] items-center gap-[6px] rounded-[6px] border border-foreground bg-foreground px-[9px] text-[12px] font-medium leading-none text-white shadow-sm transition-colors hover:bg-black"
            >
              Save changes
            </button>
          </>
        }
      />

      <OnboardingChecklist />

      <SettingsCard>
        <SettingsCardHeader
          title="Brand identity"
          sub="Shows in the top-left chrome and in exported handoff packets."
        />
        <SettingsCardBody>
          <SettingsRow
            label="Workspace name"
            hint="The legal or display name of the brand."
            control={
              <input
                type="text"
                defaultValue="Midpack"
                className="h-[32px] w-full max-w-[360px] rounded-[6px] border border-border bg-surface px-[10px] text-[12.5px] text-foreground outline-none transition-colors focus:border-accent-strong focus:ring-[3px] focus:ring-accent-ring/50"
              />
            }
          />
          <SettingsRow
            label="Workspace handle"
            hint="Used in URLs, MCP endpoints, and webhook payloads. Lowercase, no spaces."
            control={
              <div className="flex max-w-[460px]">
                <input
                  type="text"
                  defaultValue="midpack"
                  className="h-[32px] w-full rounded-[6px] border border-border bg-surface px-[10px] font-mono text-[12px] text-foreground outline-none transition-colors focus:border-accent-strong focus:ring-[3px] focus:ring-accent-ring/50"
                />
              </div>
            }
            help={
              <span className="font-mono">
                app.midpack.so/
                <b className="font-semibold text-zinc-700">midpack</b>
              </span>
            }
          />
          <SettingsRow
            label="Logo"
            hint="Square PNG or SVG, at least 256×256. Used on collection covers as a watermark."
            control={
              <div className="flex items-center gap-[14px]">
                <span
                  aria-hidden
                  className="inline-flex size-[64px] items-center justify-center rounded-[10px] border border-border font-mono text-[22px] font-bold tracking-[-0.02em] text-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #2a2a30, #16161a)",
                  }}
                >
                  MP
                </span>
                <div className="inline-flex gap-[6px]">
                  <button
                    type="button"
                    className="inline-flex h-[26px] items-center gap-[6px] rounded-[6px] border border-border-strong bg-surface px-[9px] text-[12px] font-medium leading-none text-foreground shadow-sm transition-colors hover:border-zinc-400 hover:bg-surface-3"
                  >
                    Upload new
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-[26px] items-center gap-[6px] rounded-[6px] border border-transparent bg-transparent px-[9px] text-[12px] font-medium leading-none text-zinc-700 transition-colors hover:bg-surface-3 hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              </div>
            }
          />
        </SettingsCardBody>
      </SettingsCard>

      <SettingsCard>
        <SettingsCardHeader
          title="Defaults"
          sub="Apply to new collections and stage calculations."
        />
        <SettingsCardBody>
          <SettingsRow
            label="Default timezone"
            hint='Used for deadline calculations and "stuck > 7 days" rules. Each member’s display still shows their local time.'
            control={<Select defaultValue="Europe/Kyiv · UTC+2" options={[
              "Europe/Kyiv · UTC+2",
              "Europe/London · UTC+0",
              "America/New_York · UTC−5",
              "America/Los_Angeles · UTC−8",
              "Asia/Tokyo · UTC+9",
            ]} />}
          />
          <SettingsRow
            label="Default workflow template"
            hint="New collections inherit this. You can override per collection."
            control={<Select defaultValue="9-stage classic (Ідея → Виробництво)" options={[
              "9-stage classic (Ідея → Виробництво)",
              "Capsule / fast-track (6-stage)",
              "Sampling only (3-stage)",
              "Brand campaign (no production)",
            ]} />}
            help={
              <>
                Currently used by{" "}
                <b className="font-medium text-zinc-700">3 of 4</b> active
                collections.
              </>
            }
          />
          <SettingsRow
            label="Week starts on"
            hint="Affects calendar views and weekly digest emails."
            control={
              <div className="inline-flex items-center gap-[8px]">
                <Radio name="weekstart" label="Monday" defaultChecked />
                <Radio name="weekstart" label="Sunday" />
              </div>
            }
          />
        </SettingsCardBody>
      </SettingsCard>

      <SettingsCard variant="danger">
        <SettingsCardHeader
          variant="danger"
          title="Danger zone"
          sub="Irreversible. Type the workspace name to confirm."
        />
        <SettingsCardBody>
          <SettingsRow
            label="Delete workspace"
            hint={
              <>
                Permanently delete{" "}
                <b className="font-medium text-foreground">Midpack</b>, all
                4 collections, all 39 products, and all comment history.
                Members will lose access immediately. This cannot be undone.
              </>
            }
            control={
              <>
                <input
                  type="text"
                  placeholder='Type "Midpack" to confirm'
                  className="h-[32px] w-full max-w-[360px] rounded-[6px] border border-border bg-surface px-[10px] text-[12.5px] text-foreground outline-none transition-colors focus:border-accent-strong focus:ring-[3px] focus:ring-accent-ring/50"
                />
                <button
                  type="button"
                  className="inline-flex h-[32px] w-max items-center gap-[6px] rounded-[7px] border border-coral-ring bg-surface px-[12px] text-[12.5px] font-medium leading-none text-coral shadow-sm transition-colors hover:border-coral hover:bg-coral-soft"
                >
                  <Trash2 className="size-[13px]" strokeWidth={1.5} />
                  Delete workspace permanently
                </button>
              </>
            }
          />
        </SettingsCardBody>
      </SettingsCard>
    </>
  );
}

function Select({
  defaultValue,
  options,
}: {
  defaultValue: string;
  options: string[];
}) {
  return (
    <select
      defaultValue={defaultValue}
      className="h-[32px] w-full max-w-[360px] appearance-none rounded-[6px] border border-border bg-surface bg-[length:9px] bg-[right_9px_center] bg-no-repeat py-0 pl-[10px] pr-[28px] text-[12.5px] text-foreground outline-none transition-colors focus:border-accent-strong focus:ring-[3px] focus:ring-accent-ring/50"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='none'><path d='M2.5 4l2.5 2.5L7.5 4' stroke='%239a9aa1' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function Radio({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-[8px] text-[12.5px] text-foreground">
      <input
        type="radio"
        name={name}
        defaultChecked={defaultChecked}
        className="size-[15px] appearance-none rounded-full border border-border-strong bg-surface transition-colors checked:border-foreground checked:after:absolute checked:after:inset-[3px] checked:after:rounded-full checked:after:bg-foreground relative"
      />
      {label}
    </label>
  );
}
