"use client";

import {
  Check,
  CircleDashed,
  Eye,
  Inbox,
  Pause,
  Play,
  X,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode } from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import type { StageInstance, StageStatus } from "@/lib/api/types";

// Each row of the status menu. The optional `review*` fields carry the
// review-stage vocabulary + palette ("To Review" / "In Review"): same
// underlying StageStatus, different copy / glyph / colors. When `stage.isReview`
// is true on the to-do or in-progress row, the overrides take precedence over
// the base values.
type RowDef = {
  status: StageStatus;
  label: string;
  reviewLabel?: string;
  description: string;
  reviewDescription?: string;
  icon: LucideIcon;
  reviewIcon?: LucideIcon;
  // Strong text color — used for the label + the left color stripe.
  textClass: string;
  reviewTextClass?: string;
  stripeClass: string;
  reviewStripeClass?: string;
  // Tints used for hover and the currently-selected row, respectively.
  hoverBgClass: string;
  reviewHoverBgClass?: string;
  currentBgClass: string;
  reviewCurrentBgClass?: string;
};

// The five rows are always the same; review-stage tweaks happen per row via
// the `reviewLabel` / `reviewDescription` / `reviewIcon` overrides below.
const ROWS: RowDef[] = [
  {
    status: "to-do",
    label: "To Do",
    reviewLabel: "To Review",
    description: "Ready to start — no one's picked it up yet",
    reviewDescription: "Stage queued for the reviewer to begin",
    icon: CircleDashed,
    // Inbox conveys "queued for a reviewer to pick up" — distinct from the
    // active In Review row below, which keeps Eye.
    reviewIcon: Inbox,
    textClass: "text-todo",
    stripeClass: "bg-todo",
    hoverBgClass: "hover:bg-[#f6f8fb] data-[highlighted]:bg-[#f6f8fb]",
    currentBgClass: "bg-todo-soft",
    // To Review is the quietest row in the menu — paler taupe text, a near-
    // ivory stripe, and a barely-there cream background so it reads as
    // "waiting / not the live focus" next to the saturated In Review row.
    reviewTextClass: "text-[#b09a82]",
    reviewStripeClass: "bg-[#fde68a]",
    reviewHoverBgClass: "hover:bg-[#fffaee] data-[highlighted]:bg-[#fffaee]",
    reviewCurrentBgClass: "bg-[#fffaee]",
  },
  {
    status: "in-progress",
    label: "In Progress",
    reviewLabel: "In Review",
    description: "Work in flight — performer actively on it",
    reviewDescription: "Reviewer actively checking the deliverable",
    icon: Play,
    reviewIcon: Eye,
    textClass: "text-accent-ink",
    stripeClass: "bg-accent-strong",
    hoverBgClass: "hover:bg-[#f4f5fb] data-[highlighted]:bg-[#f4f5fb]",
    currentBgClass: "bg-accent-soft",
    // In Review uses the saturated warn (amber) family — matches the
    // in-review chip's bg/text exactly so the menu's selected row visually
    // echoes the chip the user clicked to open it.
    reviewTextClass: "text-warn",
    reviewStripeClass: "bg-warn",
    reviewHoverBgClass: "hover:bg-[#fdf8e4] data-[highlighted]:bg-[#fdf8e4]",
    reviewCurrentBgClass: "bg-warn-soft",
  },
  {
    status: "blocked",
    label: "Blocked",
    description: "Stuck on an external dependency",
    icon: Pause,
    textClass: "text-coral",
    stripeClass: "bg-coral",
    hoverBgClass: "hover:bg-[#fdf6f5] data-[highlighted]:bg-[#fdf6f5]",
    currentBgClass: "bg-coral-soft",
  },
  {
    status: "done",
    label: "Done",
    description: "Stage approved by the gatekeeper",
    icon: Check,
    textClass: "text-ok",
    stripeClass: "bg-ok",
    hoverBgClass: "hover:bg-[#f4faf6] data-[highlighted]:bg-[#f4faf6]",
    currentBgClass: "bg-ok-soft",
  },
  {
    status: "canceled",
    label: "Canceled",
    description: "Skipped — won't be completed in this run",
    icon: X,
    textClass: "text-muted",
    stripeClass: "bg-muted",
    hoverBgClass: "hover:bg-[#f7f7f5] data-[highlighted]:bg-[#f7f7f5]",
    currentBgClass: "bg-muted-soft",
  },
];

type StatusSelectorProps = {
  stage: StageInstance;
  onSelect: (status: StageStatus) => void;
  // Notifier for the parent — fires whenever Radix toggles the dropdown
  // open/closed. The stepper pill uses this to keep its hover-preview alive
  // while the dropdown is open and to coordinate the post-selection retreat.
  onOpenChange?: (open: boolean) => void;
  // The trigger element. Forwarded into Radix via `asChild`, so it must accept
  // a ref and arbitrary DOM props — a `forwardRef`'d span works well here.
  children: ReactNode;
};

export function StatusSelector({
  stage,
  onSelect,
  onOpenChange,
  children,
}: StatusSelectorProps) {
  return (
    // `modal={false}` — Radix' default modal mode locks body scroll while the
    // menu is open, which kills `position: sticky` on the top bar / breadcrumb
    // strip (sticky elements need a scrollable ancestor; lock the scroll and
    // they collapse to their natural position). The picker doesn't need a
    // focus trap or background pointer-event blocking, so non-modal is the
    // right shape here.
    <DropdownMenuPrimitive.Root modal={false} onOpenChange={onOpenChange}>
      <DropdownMenuPrimitive.Trigger asChild>
        {children}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="start"
          sideOffset={8}
          collisionPadding={12}
          // After a status pick, Radix' default is to restore focus to the
          // trigger (the chip inside the pill) — which then paints its
          // focus-visible ring. That ring lingers and reads as "the pill is
          // still selected" even though the user has already committed. We
          // suppress focus restoration here so the page returns to a neutral
          // state once the menu closes, mirroring how a click-driven action
          // feels in the rest of the UI.
          onCloseAutoFocus={(event) => event.preventDefault()}
          // Radix portals this Content to the document root, but React events
          // still bubble through the *React tree* — so a click on a menu item
          // would otherwise reach the surrounding row's onClick and trigger
          // navigation. Stop bubbling at the Content so every child click
          // (item picks, scrollwheel, etc.) is contained to the selector.
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          // The popover surface itself: bone-white, hairline border, soft drop
          // shadow that's just enough to lift it off the row underneath.
          className="z-50 w-[320px] overflow-hidden rounded-[10px] border border-border bg-surface text-foreground shadow-[0_8px_28px_-12px_rgba(22,22,26,0.18),0_2px_6px_-2px_rgba(22,22,26,0.06)] outline-none"
        >
          <div className="flex flex-col py-[4px]">
            {ROWS.filter((row) => row.status !== stage.status).map((row) => (
              <Row
                key={row.status}
                row={row}
                stage={stage}
                onSelect={onSelect}
              />
            ))}
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

function Row({
  row,
  stage,
  onSelect,
}: {
  row: RowDef;
  stage: StageInstance;
  onSelect: (status: StageStatus) => void;
}) {
  const useReview =
    stage.isReview && (row.status === "to-do" || row.status === "in-progress");
  const label = useReview && row.reviewLabel ? row.reviewLabel : row.label;
  const description =
    useReview && row.reviewDescription
      ? row.reviewDescription
      : row.description;
  const Icon = useReview && row.reviewIcon ? row.reviewIcon : row.icon;
  const textClass =
    useReview && row.reviewTextClass ? row.reviewTextClass : row.textClass;
  const stripeClass =
    useReview && row.reviewStripeClass
      ? row.reviewStripeClass
      : row.stripeClass;
  const hoverBgClass =
    useReview && row.reviewHoverBgClass
      ? row.reviewHoverBgClass
      : row.hoverBgClass;
  const currentBgClass =
    useReview && row.reviewCurrentBgClass
      ? row.reviewCurrentBgClass
      : row.currentBgClass;
  const isCurrent = stage.status === row.status;

  return (
    <DropdownMenuPrimitive.Item
      onSelect={() => onSelect(row.status)}
      // Radix' default `outline-none` + `data-[highlighted]` is how arrow-key
      // focus is exposed; we re-skin both states to match the rest of the menu.
      className={cn(
        "group relative flex items-center py-[10px] pl-[14px] pr-[14px] outline-none transition-[background-color] duration-75",
        // Current row reads as "you're already here" — no cursor change, no
        // bg hover. Other rows are pickable, so they get the pointer + tint.
        isCurrent
          ? cn("cursor-default", currentBgClass)
          : cn("cursor-pointer bg-transparent", hoverBgClass),
      )}
    >
      {/* Vertical color stripe — full status color. Positioned absolutely
          (not in the flex flow) so animating its `width` doesn't reflow the
          row each frame. The row content is shifted via a GPU-composited
          `translateX` below — that combo gives the same "stripe grows and
          pushes content over" effect without the per-frame layout/paint
          thrash that made the icon's SVG strokes flicker. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-[10px] bottom-[10px] rounded-r-full transition-[width,opacity] duration-100",
          stripeClass,
          // The currently-selected row is non-reactive — its stripe stays at
          // the resting width regardless of hover/highlight so the row reads
          // as "you're already here" rather than another pickable option.
          isCurrent
            ? "w-[3px] opacity-100"
            : "w-[3px] opacity-70 group-hover:w-[7px] group-hover:opacity-100 group-data-[highlighted]:w-[7px] group-data-[highlighted]:opacity-100",
        )}
      />

      {/* Content runner — icon, label, dot/arrow. Slides right via a
          composited transform when the stripe grows, so the icon never lands
          on fractional pixel positions and the SVG strokes stay crisp. */}
      <div
        className={cn(
          "flex flex-1 items-center gap-[10px] transition-transform duration-100 will-change-transform",
          isCurrent
            ? ""
            : "group-hover:translate-x-[4px] group-data-[highlighted]:translate-x-[4px]",
        )}
      >
        {/* Status glyph — vertically centered against the label + description
            column thanks to `items-center` on the runner. */}
        <span
          className={cn(
            "inline-flex size-[18px] shrink-0 items-center justify-center rounded-[4px]",
            textClass,
          )}
          aria-hidden
        >
          <Icon className="size-[13px]" strokeWidth={2} />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span
            className={cn(
              "font-mono text-[10.5px] font-semibold uppercase leading-none tracking-[0.06em]",
              textClass,
            )}
          >
            {label}
          </span>
          <span className="text-[11px] leading-[1.35] text-zinc-500">
            {description}
          </span>
        </span>

        {isCurrent ? (
          // A small filled dot in the row's own color marks "this is the
          // current status" without needing extra copy.
          <span
            aria-hidden
            className={cn(
              "size-[6px] shrink-0 rounded-full",
              stripeClass,
            )}
          />
        ) : (
          // A faint right-side arrow that materializes on hover/highlight as a
          // tactile "you're picking this" hint. Always reserved space so the
          // row layout doesn't shift.
          <span
            aria-hidden
            className={cn(
              "inline-flex size-[10px] shrink-0 items-center justify-center text-zinc-400 opacity-0 transition-opacity duration-75",
              "group-hover:opacity-100 group-data-[highlighted]:opacity-100",
            )}
          >
            <Arrow />
          </span>
        )}
      </div>
    </DropdownMenuPrimitive.Item>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 10 10"
      className="size-[10px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 5h6" />
      <path d="m5.5 2.5 2.5 2.5-2.5 2.5" />
    </svg>
  );
}

