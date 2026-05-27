"use client";

import { RailWorkspaceCard } from "./rail-workspace-card";
import { RailCollectionsSection } from "./rail-collections-section";
import { RailUserChip } from "./rail-user-chip";
import { RailItem } from "./rail-item";

function WorklistIcon({ className, strokeWidth = 1.3 }: { className?: string; strokeWidth?: number }) {
  // KanbanSquare-style: rounded square frame with three columns of varying heights.
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <rect
        x="1.5"
        y="1.5"
        width="11"
        height="11"
        rx="1.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M4.7 4.2v4M7 4.2v2.4M9.3 4.2v5.2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function LibraryIcon({ className, strokeWidth = 1.3 }: { className?: string; strokeWidth?: number }) {
  // Open book — same "library / content collection" semantic as the previous
  // shelf-of-books glyph, but a visually distinct silhouette.
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M7 3.5C5.8 2.7 4.2 2.5 2.5 2.5v8c1.7 0 3.3.2 4.5 1M7 3.5c1.2-.8 2.8-1 4.5-1v8c-1.7 0-3.3.2-4.5 1M7 3.5v8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon({ className, strokeWidth = 1.3 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M7 1.5v1.6M7 10.9v1.6M2.5 7H1M13 7h-1.5M3.7 3.7l-1-1M11.3 11.3l-1-1M3.7 10.3l-1 1M11.3 2.7l-1 1"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RailWorkspaceMode() {
  return (
    <>
      <div className="shrink-0 px-[8px]">
        <div className="flex h-[60px] items-center border-b border-border">
          <RailWorkspaceCard />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-px overflow-y-auto px-[8px] pt-[8px] pb-[8px]">
        <RailItem icon={WorklistIcon} label="Worklist" href="/worklist" activeMatch="/worklist" />
        <RailCollectionsSection />
        <RailItem
          icon={LibraryIcon}
          label="Library"
          href="/library"
          activeMatch="/library"
          className="mt-[8px]"
        />
      </div>

      <div className="px-[8px] py-[4px]">
        <RailItem icon={SettingsIcon} label="Settings" href="/settings" activeMatch="/settings" />
      </div>

      <div className="px-[8px] pb-[8px]">
        <RailUserChip />
      </div>
    </>
  );
}
