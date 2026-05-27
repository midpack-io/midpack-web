"use client";

import { ArrowLeft, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Comment, Person, PersonId } from "@/lib/api/types";
import { MessageRow } from "./message-row";
import { Composer } from "./composer";
import type { FileLookup } from "./utils";

type ThreadViewProps = {
  parent: Comment;
  replies: Comment[];
  quoteOf: Map<string, Comment>;
  peopleMap: Map<PersonId, Person>;
  files: FileLookup;
  onClose: () => void;
  onReplyInThread: (reply: Comment) => void;
  composerQuote?: Comment;
  onClearComposerQuote?: () => void;
};

export function ThreadView({
  parent,
  replies,
  quoteOf,
  peopleMap,
  files,
  onClose,
  onReplyInThread,
  composerQuote,
  onClearComposerQuote,
}: ThreadViewProps) {
  const stageSubtitle = parent.stage
    ? `${replies.length} replies · ${parent.stage}`
    : `${replies.length} replies`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-[10px] border-b border-border bg-surface px-[16px] py-[10px]">
        <button
          type="button"
          onClick={onClose}
          title="Back to feed"
          className="inline-flex size-[26px] items-center justify-center rounded-[6px] border border-border text-muted hover:bg-surface-3 hover:text-foreground"
        >
          <ArrowLeft className="size-[14px]" strokeWidth={1.6} />
        </button>
        <div>
          <div className="text-[13px] font-semibold text-foreground">Thread</div>
          <div className="font-mono text-[11.5px] text-muted">{stageSubtitle}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          title="Close"
          className="ml-auto inline-flex size-[24px] items-center justify-center rounded-[5px] text-muted hover:bg-surface-3 hover:text-foreground"
        >
          <X className="size-[14px]" strokeWidth={1.6} />
        </button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="relative border-b border-border bg-surface-2">
          <span
            aria-hidden
            className="absolute top-[6px] right-[16px] font-mono text-[9.5px] tracking-[0.08em] uppercase text-muted"
          >
            Parent message
          </span>
          <MessageRow
            message={parent}
            peopleMap={peopleMap}
            files={files}
            quoteOf={quoteOf.get(parent.id)}
            inThread
          />
        </div>

        <div className="flex items-center gap-[10px] px-[16px] pt-[10px] pb-[6px] font-mono text-[10.5px] tracking-[0.06em] uppercase text-muted">
          <span aria-hidden className="h-px flex-1 bg-border" />
          <span>{replies.length} replies</span>
          <span aria-hidden className="h-px flex-1 bg-border" />
        </div>

        <div className="pb-[8px]">
          {replies.map((r) => (
            <MessageRow
              key={r.id}
              message={r}
              peopleMap={peopleMap}
              files={files}
              quoteOf={quoteOf.get(r.id)}
              onReply={onReplyInThread}
            />
          ))}
        </div>
      </ScrollArea>

      <Composer
        placeholder="Reply…"
        peopleMap={peopleMap}
        anchorLabel="Replying in thread"
        sendLabel="Reply"
        quote={composerQuote}
        onClearQuote={onClearComposerQuote}
      />
    </div>
  );
}
