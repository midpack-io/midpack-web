"use client";

import { useState } from "react";
import { MoreHorizontal, Undo2, ArrowRightToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateField } from "@/components/ds/date-field";
import { PersonField } from "@/components/ds/person-field";
import { cn } from "@/lib/utils";
import type {
  Person,
  PersonId,
  Product,
  StageInstance,
  StageStatus,
} from "@/lib/api/types";

type ProductDetailBarProps = {
  product: Product;
  stage: StageInstance;
  peopleMap: Map<PersonId, Person>;
};

// Pinned "now" matching src/lib/time.ts so derived day-counts stay stable
// across reloads in stage 1.
const NOW_ISO = "2026-05-22T15:00:00.000Z";
const DAY_MS = 86_400_000;

export function ProductDetailBar({ product, stage }: ProductDetailBarProps) {
  // Local state mirrors stage values until useUpdateProduct + PATCH lands.
  // Resets when the user picks a different pill because props change identity.
  const [performerId, setPerformerId] = useState<PersonId | "unassigned">(
    stage.performerId ?? "unassigned",
  );
  const [approverId, setApproverId] = useState<PersonId | "unassigned">(
    flattenApprover(stage.approverId),
  );
  const [dueDate, setDueDate] = useState<string>(
    stage.deadline?.date ? stage.deadline.date.slice(0, 10) : "",
  );

  // "In stage" wants days since the stage was entered. We don't track that
  // timestamp yet — product.updatedAt is the closest proxy. Flag for backend.
  const daysInStage = Math.max(
    0,
    Math.floor((Date.parse(NOW_ISO) - Date.parse(product.updatedAt)) / DAY_MS),
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-[14px] border-t border-border px-[16px] py-[10px]",
        toneForStatus(stage.status, stage.isReview),
      )}
    >
      <PersonField
        label="Performer"
        value={performerId}
        onChange={setPerformerId}
        ariaLabel="Edit stage performer"
      />
      <PersonField
        label="Approver"
        value={approverId}
        onChange={setApproverId}
        ariaLabel="Edit stage approver"
      />
      <DateField
        label="Due"
        value={dueDate}
        onChange={setDueDate}
        ariaLabel="Edit stage deadline"
      />

      <span className="inline-flex items-baseline gap-[8px] pl-[2px]">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.07em] text-zinc-400">
          In stage
        </span>
        <span className="inline-flex h-[22px] items-center rounded-sm bg-warn-soft px-[8px] font-mono text-[12px] font-semibold leading-none tabular-nums text-warn">
          {daysInStage} {daysInStage === 1 ? "day" : "days"}
        </span>
      </span>

      <div className="ml-auto flex items-center gap-[6px]">
        <Button
          variant="outline"
          className="h-[32px] gap-[6px] bg-surface px-[12px] text-base"
        >
          <Undo2 className="size-[14px]" strokeWidth={1.8} />
          Return…
        </Button>
        <Button
          variant="outline"
          className="h-[32px] gap-[6px] bg-surface px-[12px] text-base"
        >
          <ArrowRightToLine className="size-[14px]" strokeWidth={1.8} />
          Hand off
        </Button>
        <Button className="h-[32px] px-[14px] text-base">Submit for review</Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="More stage actions"
          className="size-[32px] bg-surface"
        >
          <MoreHorizontal className="size-[16px]" strokeWidth={1.8} />
        </Button>
      </div>
    </div>
  );
}

// Approver can be a single ID, an array (multi-approver), "unassigned", or
// "not_required". PersonField only models the single-or-unassigned case, so
// collapse arrays to the first entry for the demo. Multi-approver UI lands
// with the iteration-history work.
function flattenApprover(
  a: StageInstance["approverId"],
): PersonId | "unassigned" {
  if (!a || a === "unassigned" || a === "not_required") return "unassigned";
  if (Array.isArray(a)) return a[0] ?? "unassigned";
  return a;
}

// Vertical fade from the status-soft color into white — mirrors the handoff's
// `.stage-section.active.status-*` rules (linear-gradient 180deg, soft → near-
// white). Per status / review flag.
function toneForStatus(status: StageStatus, isReview: boolean): string {
  if (isReview && status === "in-progress") {
    return "bg-gradient-to-b from-warn-soft to-surface";
  }
  switch (status) {
    case "in-progress":
      return "bg-gradient-to-b from-accent-soft to-surface";
    case "done":
      return "bg-gradient-to-b from-ok-soft to-surface";
    case "blocked":
      return "bg-gradient-to-b from-coral-soft to-surface";
    case "canceled":
      return "bg-surface-3";
    case "to-do":
    default:
      return "bg-surface";
  }
}
