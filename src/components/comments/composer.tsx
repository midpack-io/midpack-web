"use client";

import { useState } from "react";
import { AtSign, Hash, Image as ImageIcon, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Comment, Person, PersonId } from "@/lib/api/types";
import { plainTextPreview } from "./utils";

type ComposerProps = {
  placeholder: string;
  // Visible-only quote header on the composer (Reply prefill). The parent
  // owns this state so it survives focus events; pass undefined to hide.
  quote?: Comment;
  onClearQuote?: () => void;
  peopleMap: Map<PersonId, Person>;
  // Replying-in-thread anchor row above the box (thread mode only).
  anchorLabel?: string;
  // Send button label ("Send" / "Reply").
  sendLabel?: string;
};

export function Composer({
  placeholder,
  quote,
  onClearQuote,
  peopleMap,
  anchorLabel,
  sendLabel = "Send",
}: ComposerProps) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);

  const quoteAuthor = quote ? peopleMap.get(quote.authorId) : undefined;
  const quoteText = quote
    ? plainTextPreview(quote.body, (id) => peopleMap.get(id)?.name)
    : "";

  return (
    <div className="shrink-0 border-t border-border bg-surface p-[12px]">
      {anchorLabel && (
        <div className="mb-[6px] inline-flex items-center gap-[5px] font-mono text-[11px] text-muted">
          <span className="text-zinc-400">{anchorLabel}</span>
        </div>
      )}
      <div
        className={cn(
          "rounded-[9px] border bg-surface px-[12px] py-[10px] transition-[border,box-shadow]",
          focused
            ? "border-accent-strong shadow-[0_0_0_3px_var(--color-accent-ring)]"
            : "border-border-strong",
        )}
      >
        {quote && (
          <div className="mb-[8px] flex items-center gap-[6px] rounded-[3px] border-l-2 border-accent-strong bg-surface-2 px-[8px] py-[4px] text-[11.5px] text-muted">
            <span className="shrink-0 font-semibold text-zinc-700">
              {quoteAuthor?.name ?? "Unknown"}
            </span>
            <span className="min-w-0 flex-1 truncate">{quoteText}</span>
            <button
              type="button"
              onClick={onClearQuote}
              className="px-[4px] text-muted hover:text-foreground"
              aria-label="Clear quoted message"
            >
              <X className="size-[12px]" strokeWidth={1.8} />
            </button>
          </div>
        )}
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={2}
          className="min-h-[36px] w-full resize-none border-0 bg-transparent text-[13px] leading-[1.4] text-foreground outline-none placeholder:text-zinc-400"
        />
        <div className="mt-[8px] flex items-center gap-[2px]">
          <ToolButton title="Mention">
            <AtSign className="size-[14px]" strokeWidth={1.6} />
          </ToolButton>
          <ToolButton title="Reference a file">
            <Hash className="size-[14px]" strokeWidth={1.6} />
          </ToolButton>
          <ToolButton title="Attach image">
            <ImageIcon className="size-[14px]" strokeWidth={1.6} />
          </ToolButton>
          <Button
            type="button"
            size="sm"
            disabled={!draft.trim()}
            className="ml-auto h-[28px] gap-[6px] bg-accent-strong px-[12px] text-[12.5px] text-white hover:bg-accent-strong/90 disabled:bg-accent-strong/50"
          >
            {sendLabel}
            <Send className="size-[12px]" strokeWidth={1.8} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToolButton({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className="inline-flex size-[26px] items-center justify-center rounded-[5px] text-muted hover:bg-surface-3 hover:text-foreground"
    >
      {children}
    </button>
  );
}
