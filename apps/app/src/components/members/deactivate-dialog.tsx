"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronDown, Info } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AVATAR_GRADIENT } from "@/components/ds/avatar-gradient";
import { cn } from "@/lib/utils";
import type { Member, MemberUser, ReassignTarget, UserId } from "@/lib/api/types";
import { MemberAvatar } from "./member-avatar";
import { roleLabel } from "./lib";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  openWork: ReassignTarget[];
  loadingWork: boolean;
  candidates: MemberUser[];
  pending: boolean;
  onConfirm: (reassignments: ReassignTarget[]) => Promise<void>;
}

export function DeactivateDialog({
  open,
  onOpenChange,
  member,
  openWork,
  loadingWork,
  candidates,
  pending,
  onConfirm,
}: Props) {
  // targetIndex → chosen replacement user id (seeded from any pre-resolved item).
  const [chosen, setChosen] = useState<Record<number, UserId>>({});
  const [error, setError] = useState<string | null>(null);

  // Reset local choices whenever a different member's open-work loads.
  const seedKey = useMemo(() => openWork.map((t) => t.product_id).join("|"), [openWork]);
  const [seenKey, setSeenKey] = useState("");
  if (seedKey !== seenKey) {
    setSeenKey(seedKey);
    const seed: Record<number, UserId> = {};
    openWork.forEach((t, i) => {
      if (t.replacement_id) seed[i] = t.replacement_id;
    });
    setChosen(seed);
    setError(null);
  }

  const byId = useMemo(() => new Map(candidates.map((c) => [c.id, c])), [candidates]);
  const resolvedCount = openWork.filter((_, i) => chosen[i]).length;
  const remaining = openWork.length - resolvedCount;
  const canConfirm = remaining === 0 && !pending && !loadingWork && member != null;

  async function handleConfirm() {
    if (!canConfirm || !member) return;
    setError(null);
    try {
      await onConfirm(openWork.map((t, i) => ({ ...t, replacement_id: chosen[i] })));
      onOpenChange(false);
    } catch {
      setError("Could not deactivate. Please resolve all reassignments and try again.");
    }
  }

  const name = member?.user?.name ?? member?.email ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate {name}?</DialogTitle>
          <DialogDescription>
            They'll lose sign-in access immediately. Their comments, files, and audit-log entries stay
            intact.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {member ? (
            <div className="flex items-center gap-[10px] rounded-lg bg-surface-2 px-[12px] py-[10px]">
              <MemberAvatar member={member} className="size-8" />
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-foreground">{name}</div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">
                  {member.email} · {roleLabel(member)}
                </div>
              </div>
            </div>
          ) : null}

          {/* Reassign gate */}
          {loadingWork ? (
            <p className="text-[12.5px] text-muted-foreground">Checking in-flight bundles…</p>
          ) : openWork.length > 0 ? (
            <div className="flex flex-col gap-[10px] rounded-lg border border-coral-ring bg-coral-soft/50 p-[14px]">
              <div className="flex items-start gap-[8px]">
                <AlertTriangle className="mt-[1px] size-[15px] shrink-0 text-coral" />
                <div>
                  <p className="text-[12.5px] font-semibold text-coral">
                    Reassign {openWork.length} in-flight{" "}
                    {openWork.length === 1 ? "bundle" : "bundles"} before deactivating
                  </p>
                  <p className="text-[11.5px] text-muted-foreground">
                    Pick who takes over each bundle. You can't deactivate until every one is resolved.
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-[6px]">
                {openWork.map((t, i) => {
                  const replacement = chosen[i] ? byId.get(chosen[i]) : undefined;
                  const resolved = Boolean(replacement);
                  return (
                    <li
                      key={t.product_id}
                      className={cn(
                        "flex items-center gap-[10px] rounded-md border px-[10px] py-[8px]",
                        resolved
                          ? "border-ok-soft bg-ok-soft/60"
                          : "border-border bg-surface",
                      )}
                    >
                      {resolved ? (
                        <Check className="size-[14px] shrink-0 text-ok" />
                      ) : (
                        <Info className="size-[14px] shrink-0 text-muted-foreground" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] font-medium text-foreground">
                          {t.product_name}
                        </div>
                        <div className="truncate font-mono text-[10.5px] text-muted-foreground">
                          {t.stage_n} · {t.stage_label} · {t.kind}
                        </div>
                      </div>
                      <ReplacementPicker
                        candidates={candidates}
                        chosen={replacement}
                        onPick={(id) => setChosen((prev) => ({ ...prev, [i]: id }))}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="rounded-lg bg-surface-2 px-[12px] py-[10px] text-[12.5px] text-muted-foreground">
              No in-flight bundles to reassign.
            </p>
          )}

          {/* Preserve note */}
          <p className="rounded-lg bg-surface-2 px-[12px] py-[10px] text-[11.5px] leading-[1.5] text-muted-foreground">
            <span className="font-semibold text-foreground">Historical attribution is preserved.</span>{" "}
            {name}'s comments, file uploads, and audit-log entries remain attributed to them after
            deactivation. You can reactivate from the Deactivated tab any time.
          </p>

          {error ? <p className="text-[12px] text-coral">{error}</p> : null}
        </DialogBody>

        <DialogFooter>
          <span className="font-mono text-[11px] text-muted-foreground">
            {remaining > 0
              ? `${remaining} of ${openWork.length} reassignment${openWork.length === 1 ? "" : "s"} remaining`
              : "All bundles reassigned"}
          </span>
          <div className="flex items-center gap-[8px]">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" disabled={!canConfirm} onClick={handleConfirm}>
              {remaining > 0 ? "Deactivate (locked)" : pending ? "Deactivating…" : "Deactivate"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReplacementPicker({
  candidates,
  chosen,
  onPick,
}: {
  candidates: MemberUser[];
  chosen: MemberUser | undefined;
  onPick: (id: UserId) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex shrink-0 items-center gap-[6px] rounded-md border border-border bg-surface px-[8px] py-[5px] text-[11.5px] transition-colors hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          chosen ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {chosen ? (
          <>
            <span
              className={cn(
                "inline-flex size-[16px] items-center justify-center rounded-full text-[8px] font-semibold text-white",
                chosen.avatar_key ? AVATAR_GRADIENT[chosen.avatar_key] : "bg-muted",
              )}
            >
              {chosen.initial}
            </span>
            {chosen.name}
          </>
        ) : (
          "Choose performer…"
        )}
        <ChevronDown className="size-[12px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[260px] min-w-[200px] overflow-y-auto">
        {candidates.map((c) => (
          <DropdownMenuItem key={c.id} onSelect={() => onPick(c.id)}>
            <span
              className={cn(
                "inline-flex size-[18px] items-center justify-center rounded-full text-[9px] font-semibold text-white",
                c.avatar_key ? AVATAR_GRADIENT[c.avatar_key] : "bg-muted",
              )}
            >
              {c.initial}
            </span>
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
