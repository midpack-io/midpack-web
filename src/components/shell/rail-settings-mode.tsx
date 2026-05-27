"use client";

import { useRouter } from "next/navigation";
import { RailItem, type RailItemProps } from "./rail-item";
import { RailUserChip } from "./rail-user-chip";

type IconProps = { className?: string; strokeWidth?: number };

function ShieldIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M7 1.5l5 2.5v3.5c0 3-2 4.5-5 5.5-3-1-5-2.5-5-5.5V4l5-2.5z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MembersIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="5" cy="5.5" r="2" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M9.5 6a1.5 1.5 0 1 0 0-3M2 12c0-2 1.5-3 3-3s3 1 3 3M9.5 12c0-1.4-.9-2.4-2-2.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function BillingIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <rect x="1.5" y="3.5" width="11" height="7.5" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M1.5 6h11M4 9h2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

function WorkflowsIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <rect x="1.5" y="2" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="8.5" y="8" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M5.5 4h2.5a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IntegrationsIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M5 3v8M9 3v8M2 6h10M2 9h10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function TransitIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M2 7h8m0 0L7.5 4.5M10 7L7.5 9.5M12 3v8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="7" cy="5" r="2.3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M2 12c0-2.5 2.2-4 5-4s5 1.5 5 4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function NotificationsIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M3 10.5h8M4 10.5V7a3 3 0 0 1 6 0v3.5M5.5 11.5a1.5 1.5 0 0 0 3 0"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

const WORKSPACE_ITEMS: ReadonlyArray<Pick<RailItemProps, "icon" | "label" | "href" | "badge">> = [
  { icon: ShieldIcon, label: "General", href: "/settings/general" },
  { icon: MembersIcon, label: "Members", href: "/settings/members", badge: "12" },
  { icon: BillingIcon, label: "Billing & plan", href: "/settings/billing" },
  { icon: WorkflowsIcon, label: "Workflows", href: "/settings/workflows", badge: "4" },
  { icon: IntegrationsIcon, label: "Integrations", href: "/settings/integrations" },
  { icon: TransitIcon, label: "Transit & export", href: "/settings/transit-export" },
];

const ACCOUNT_ITEMS: ReadonlyArray<Pick<RailItemProps, "icon" | "label" | "href">> = [
  { icon: ProfileIcon, label: "Profile", href: "/settings/profile" },
  { icon: NotificationsIcon, label: "Notifications", href: "/settings/notifications" },
];

export function RailSettingsMode() {
  const router = useRouter();
  return (
    <>
      <div className="shrink-0 px-[8px]">
        <div className="flex h-[60px] items-center border-b border-border">
          <button
            type="button"
            onClick={() => router.push("/collections")}
            className="inline-flex w-full items-center gap-[8px] rounded-[6px] px-[8px] py-[8px] text-left text-[12.5px] font-medium leading-none text-zinc-700 transition-colors hover:bg-black/[0.05] hover:text-foreground"
          >
            <svg viewBox="0 0 14 14" fill="none" className="size-[13px]">
              <path
                d="M8.5 3L4.5 7l4 4M4.5 7H12"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to workspace
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-px overflow-y-auto px-[8px] pt-[8px] pb-[8px]">
        <div className="px-[8px] pb-[4px] pt-[4px] text-[13px] font-semibold tracking-[-0.005em] text-foreground">
          Settings
        </div>

        <div className="px-[8px] pt-[6px] pb-[6px] font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
          Workspace
        </div>
        {WORKSPACE_ITEMS.map((item) => (
          <RailItem key={item.href} {...item} />
        ))}

        <div className="px-[8px] pt-[14px] pb-[6px] font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
          Account
        </div>
        {ACCOUNT_ITEMS.map((item) => (
          <RailItem key={item.href} {...item} />
        ))}
      </div>

      <div className="px-[8px] pb-[8px]">
        <RailUserChip />
      </div>
    </>
  );
}
