"use client";

import { useState } from "react";
import { ChevronDown, MessagesSquare, MoreHorizontal, Reply } from "lucide-react";
import { AVATAR_GRADIENT } from "@/components/ds/avatar-gradient";
import { cn } from "@/lib/utils";
import { formatHHMM } from "@/lib/time";
import type { Comment, Person, PersonId } from "@/lib/api/types";
import { renderBody } from "./body-renderer";
import { ThreadAffordance } from "./thread-affordance";
import { plainTextPreview, type FileLookup } from "./utils";

type MessageRowProps = {
  message: Comment;
  peopleMap: Map<PersonId, Person>;
  files: FileLookup;
  // Replies attached to this message in the *currently-visible* feed.
  // Drives the inline thread affordance. Empty array = no affordance.
  replies?: Comment[];
  // The message being quoted by this one, if any. Resolved by the panel.
  quoteOf?: Comment | undefined;
  onReply?: (message: Comment) => void;
  onOpenThread?: (parentId: string) => void;
  // When rendered inside the thread-mode view, the affordance/reply buttons
  // are suppressed (the parent is already "open" and replies are listed below).
  inThread?: boolean;
};

export function MessageRow({
  message,
  peopleMap,
  files,
  replies = [],
  quoteOf,
  onReply,
  onOpenThread,
  inThread = false,
}: MessageRowProps) {
  const author = peopleMap.get(message.authorId);

  return (
    <article
      className="group/msg relative px-[16px] py-[6px] pb-[8px] transition-colors hover:bg-surface-2"
      data-msgid={message.id}
    >
      <header className="mb-[4px] flex items-center gap-[8px]">
        {author ? (
          <span
            aria-hidden
            className={cn(
              "inline-flex size-[24px] items-center justify-center rounded-full text-[10.5px] font-semibold text-white",
              AVATAR_GRADIENT[author.avatarKey],
            )}
          >
            {author.initial}
          </span>
        ) : (
          <span className="inline-block size-[24px] rounded-full border border-dashed border-border-strong" />
        )}
        <span className="text-[13px] font-semibold text-foreground">
          {author?.name ?? "Unknown"}
        </span>
        <span
          className="ml-auto font-mono text-[11px] tabular-nums text-muted"
          title={message.createdAt}
        >
          {formatHHMM(message.createdAt)}
        </span>
      </header>

      {quoteOf && (
        <QuoteHeader quoteOf={quoteOf} peopleMap={peopleMap} />
      )}

      <div className="pl-[32px] text-[13px] leading-[1.55] break-words text-foreground [&>*]:align-middle">
        {renderBody({ body: message.body, peopleMap, files })}
      </div>

      {!inThread && replies.length > 0 && onOpenThread && (
        <ThreadAffordance
          replies={replies}
          peopleMap={peopleMap}
          onClick={() => onOpenThread(message.id)}
        />
      )}

      {!inThread && (
        <div className="absolute top-[4px] right-[16px] z-[2] hidden gap-0 rounded-[7px] border border-border bg-surface p-[2px] shadow-sm group-hover/msg:inline-flex">
          {onReply && (
            <button
              type="button"
              title="Reply"
              onClick={() => onReply(message)}
              className="inline-flex size-[26px] items-center justify-center rounded-[5px] text-muted hover:bg-surface-3 hover:text-foreground"
            >
              <Reply className="size-[14px]" strokeWidth={1.6} />
            </button>
          )}
          {onOpenThread && (
            <button
              type="button"
              title="Open thread"
              onClick={() => onOpenThread(message.id)}
              className="inline-flex size-[26px] items-center justify-center rounded-[5px] text-muted hover:bg-surface-3 hover:text-foreground"
            >
              <MessagesSquare className="size-[14px]" strokeWidth={1.6} />
            </button>
          )}
          <button
            type="button"
            title="More"
            className="inline-flex size-[26px] items-center justify-center rounded-[5px] text-muted hover:bg-surface-3 hover:text-foreground"
          >
            <MoreHorizontal className="size-[14px]" strokeWidth={1.6} />
          </button>
        </div>
      )}
    </article>
  );
}

// ─── Quote-reply header ─────────────────────────────────────────────────────

function QuoteHeader({
  quoteOf,
  peopleMap,
}: {
  quoteOf: Comment;
  peopleMap: Map<PersonId, Person>;
}) {
  const [expanded, setExpanded] = useState(false);
  const author = peopleMap.get(quoteOf.authorId);
  const snippet = plainTextPreview(quoteOf.body, (id) => peopleMap.get(id)?.name);

  return (
    <button
      type="button"
      onClick={() => setExpanded((x) => !x)}
      className="my-[2px] mb-[8px] ml-[32px] flex max-w-[calc(100%-32px)] items-center gap-[6px] border-l-2 border-border-strong py-[2px] pl-[8px] text-left text-[12px] text-muted hover:text-foreground"
    >
      <ChevronDown
        className={cn(
          "size-[10px] shrink-0 text-muted transition-transform duration-150",
          expanded && "rotate-180",
        )}
        strokeWidth={1.6}
      />
      <span className="shrink-0 text-[11.5px] font-semibold text-zinc-700">
        {author?.name ?? "Unknown"}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1",
          expanded ? "whitespace-normal" : "truncate",
        )}
      >
        {snippet}
      </span>
    </button>
  );
}
