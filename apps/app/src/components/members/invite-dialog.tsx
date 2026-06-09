"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { EMAIL_RE } from "./lib";

interface Invitee {
  email: string;
  valid: boolean;
}

const DEFAULT_NOTE =
  "Welcome to the team — you've been added to the workspace. Click the link to sign in with your Google account.";

const ROLES = [
  {
    value: false,
    title: "Member",
    desc: "Works inside assigned bundles. No member or workflow management.",
  },
  {
    value: true,
    title: "Admin",
    desc: "Everything a member can, plus invites, billing, integrations, and audit log.",
  },
] as const;

export interface InvitePayload {
  emails: string[];
  is_admin: boolean;
  welcome_note?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName: string;
  seatsUsed: number;
  seatsLimit: number | null;
  pending: boolean;
  onSubmit: (payload: InvitePayload) => Promise<void>;
}

export function InviteDialog({
  open,
  onOpenChange,
  workspaceName,
  seatsUsed,
  seatsLimit,
  pending,
  onSubmit,
}: Props) {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [draft, setDraft] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [sendNote, setSendNote] = useState(true);
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [error, setError] = useState<string | null>(null);

  const validCount = invitees.filter((i) => i.valid).length;
  const invalidCount = invitees.length - validCount;
  const overCap = seatsLimit != null && seatsUsed + validCount > seatsLimit;
  const canSend = validCount > 0 && !overCap && !pending;

  function reset() {
    setInvitees([]);
    setDraft("");
    setIsAdmin(false);
    setSendNote(true);
    setNote(DEFAULT_NOTE);
    setError(null);
  }

  function commit(raw: string) {
    const parts = raw
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    setInvitees((prev) => {
      const seen = new Set(prev.map((i) => i.email.toLowerCase()));
      const next = [...prev];
      for (const email of parts) {
        const key = email.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        next.push({ email, valid: EMAIL_RE.test(email) });
      }
      return next;
    });
    setDraft("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === ";") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && draft === "" && invitees.length > 0) {
      setInvitees((prev) => prev.slice(0, -1));
    }
  }

  async function handleSend() {
    if (!canSend) return;
    setError(null);
    try {
      await onSubmit({
        emails: invitees.filter((i) => i.valid).map((i) => i.email),
        is_admin: isAdmin,
        welcome_note: sendNote ? note : undefined,
      });
      reset();
      onOpenChange(false);
    } catch {
      setError("Could not send invitations. Please try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {workspaceName}</DialogTitle>
          <DialogDescription>
            They'll get an email to sign in with Google. Invitations expire in 7 days.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {/* Email addresses */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[12.5px] font-medium text-foreground">Email addresses</label>
            <div className="flex flex-wrap items-center gap-[6px] rounded-lg border border-border bg-surface px-[10px] py-[8px] focus-within:border-accent-ring focus-within:ring-2 focus-within:ring-accent-ring/40">
              {invitees.map((inv, i) => (
                <span
                  key={`${inv.email}-${i}`}
                  className={cn(
                    "inline-flex items-center gap-[5px] rounded-md px-[7px] py-[3px] font-mono text-[11.5px]",
                    inv.valid
                      ? "bg-surface-3 text-foreground"
                      : "bg-coral-soft text-coral",
                  )}
                >
                  {!inv.valid ? <span className="inline-block size-[5px] rounded-full bg-coral" /> : null}
                  {inv.email}
                  <button
                    type="button"
                    aria-label={`Remove ${inv.email}`}
                    onClick={() => setInvitees((prev) => prev.filter((_, idx) => idx !== i))}
                    className="opacity-60 transition-opacity hover:opacity-100"
                  >
                    <X className="size-[11px]" />
                  </button>
                </span>
              ))}
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={() => commit(draft)}
                onPaste={(e) => {
                  e.preventDefault();
                  commit(e.clipboardData.getData("text"));
                }}
                placeholder={invitees.length ? "" : "Paste or type an email, then Enter…"}
                className="min-w-[160px] flex-1 bg-transparent text-[13px] outline-none placeholder:text-zinc-400"
              />
            </div>
            <p className="text-[11.5px] text-muted-foreground">
              Paste a comma- or newline-separated list to invite several at once.
              {invalidCount > 0 ? (
                <span className="text-coral">
                  {" "}
                  {invalidCount} invalid {invalidCount === 1 ? "address" : "addresses"} will be skipped.
                </span>
              ) : null}
            </p>
          </div>

          {/* Role for the batch */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[12.5px] font-medium text-foreground">
              Role for everyone in this batch
            </label>
            <div role="radiogroup" className="grid grid-cols-2 gap-[8px]">
              {ROLES.map((r) => {
                const selected = isAdmin === r.value;
                return (
                  <button
                    key={r.title}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setIsAdmin(r.value)}
                    className={cn(
                      "flex flex-col gap-[3px] rounded-lg border px-[12px] py-[10px] text-left transition-colors",
                      selected
                        ? "border-accent-ring bg-surface ring-2 ring-accent-ring/40"
                        : "border-border bg-surface-2 hover:bg-surface",
                    )}
                  >
                    <span className="flex items-center gap-[6px] text-[12.5px] font-semibold text-foreground">
                      {selected ? (
                        <span className="inline-block size-[6px] rounded-full bg-accent-strong" />
                      ) : null}
                      {r.title}
                    </span>
                    <span className="text-[11.5px] leading-[1.4] text-muted-foreground">{r.desc}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11.5px] text-muted-foreground">
              Owner is a single seat — transferred, never invited.
            </p>
          </div>

          {/* Welcome note */}
          <div className="flex flex-col gap-[8px]">
            <label className="flex items-center gap-[8px] text-[12.5px] font-medium text-foreground">
              <Switch checked={sendNote} onCheckedChange={setSendNote} />
              Send a custom welcome note
            </label>
            {sendNote ? (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="resize-none rounded-lg border border-border bg-surface px-[10px] py-[8px] text-[12.5px] leading-[1.5] outline-none focus:border-accent-ring focus:ring-2 focus:ring-accent-ring/40"
              />
            ) : null}
          </div>

          {error ? <p className="text-[12px] text-coral">{error}</p> : null}
        </DialogBody>

        <DialogFooter>
          <span className="font-mono text-[11px] text-muted-foreground">
            {validCount} valid · {invalidCount} invalid · seat usage {seatsUsed}/{seatsLimit ?? "∞"}
            {overCap ? <span className="text-coral"> · not enough seats</span> : null}
          </span>
          <div className="flex items-center gap-[8px]">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" disabled={!canSend} onClick={handleSend}>
              <Mail className="size-[14px]" />
              {pending ? "Sending…" : `Send ${validCount || ""} ${validCount === 1 ? "invitation" : "invitations"}`.trim()}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
