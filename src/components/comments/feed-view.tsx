"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Comment, CommentId, Person, PersonId } from "@/lib/api/types";
import { MessageRow } from "./message-row";
import { SystemRow } from "./system-row";
import { groupByDay, type FileLookup } from "./utils";

type FeedViewProps = {
  items: Comment[];
  // All replies in the loaded data, keyed by parent id. The feed only renders
  // root messages; replies appear behind the thread affordance.
  repliesByParent: Map<CommentId, Comment[]>;
  // Quote-of lookup (commentId → quotedCommentId). Resolved against the full
  // comments map so we can show a preview even if the quoted message is hidden.
  quoteOf: Map<string, Comment>;
  peopleMap: Map<PersonId, Person>;
  files: FileLookup;
  onReply: (message: Comment) => void;
  onOpenThread: (parentId: string) => void;
};

export function FeedView({
  items,
  repliesByParent,
  quoteOf,
  peopleMap,
  files,
  onReply,
  onOpenThread,
}: FeedViewProps) {
  if (items.length === 0) {
    return (
      <ScrollArea className="min-h-0 flex-1">
        <div className="px-[16px] py-[24px] text-center text-[12.5px] text-muted">
          No comments match this filter.
        </div>
      </ScrollArea>
    );
  }

  const dayGroups = groupByDay(items);

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="py-[4px] pb-[8px]">
        {dayGroups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-[8px] px-[16px] pt-[14px] pb-[6px] font-mono text-[10.5px] tracking-[0.06em] uppercase text-muted">
              <span>{group.label}</span>
              <span aria-hidden className="h-px flex-1 bg-border" />
            </div>
            {group.items.map((c) =>
              c.kind === "sys" ? (
                <SystemRow
                  key={c.id}
                  message={c}
                  peopleMap={peopleMap}
                  files={files}
                />
              ) : (
                <MessageRow
                  key={c.id}
                  message={c}
                  peopleMap={peopleMap}
                  files={files}
                  replies={repliesByParent.get(c.id)}
                  quoteOf={quoteOf.get(c.id)}
                  onReply={onReply}
                  onOpenThread={onOpenThread}
                />
              ),
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
