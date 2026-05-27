"use client";

import { useMemo, useState } from "react";
import type {
  Comment,
  CommentId,
  Person,
  PersonId,
  ProductFile,
} from "@/lib/api/types";
import { Composer } from "./composer";
import { ControlsRow } from "./controls-row";
import { FeedView } from "./feed-view";
import { ThreadView } from "./thread-view";
import {
  buildFileLookup,
  filterByScope,
  filterByType,
  groupThreads,
  type ScopeFilter,
  type TypeFilter,
} from "./utils";

type CommentsPanelProps = {
  comments: Comment[];
  files: ProductFile[];
  peopleMap: Map<PersonId, Person>;
  // Current viewer for the "@ Me" scope filter. Pinned to the prototype's
  // demo viewer (Olena) until a real auth/session source lands.
  currentUserId?: PersonId;
  // Active stage label for the "Current stage" scope filter. Matches against
  // Comment.stage. Defaults to "Review" to match the prototype's FEED data.
  activeStage?: string;
};

const DEFAULT_VIEWER = "p-olena" as PersonId;
const DEFAULT_ACTIVE_STAGE = "Review";

export function CommentsPanel({
  comments,
  files,
  peopleMap,
  currentUserId = DEFAULT_VIEWER,
  activeStage = DEFAULT_ACTIVE_STAGE,
}: CommentsPanelProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [feedQuote, setFeedQuote] = useState<Comment | undefined>(undefined);
  const [threadQuote, setThreadQuote] = useState<Comment | undefined>(undefined);

  const fileLookup = useMemo(() => buildFileLookup(files), [files]);

  // Quote-of lookup: from comment id → quoted Comment. Resolves against the
  // full incoming `comments` list so quoted messages stay accessible even when
  // the current filter would hide them.
  const quoteOfMap = useMemo(() => {
    const byId = new Map<string, Comment>(comments.map((c) => [c.id, c]));
    const out = new Map<string, Comment>();
    for (const c of comments) {
      if (!c.quoteOfId) continue;
      const target = byId.get(c.quoteOfId);
      if (target) out.set(c.id, target);
    }
    return out;
  }, [comments]);

  // Thread groupings: replies only nest if we have their parent in scope.
  // We compute thread groups against the *full* comments list so the parent's
  // affordance reflects the true reply count even when filters hide siblings.
  const { repliesByParent } = useMemo(
    () => groupThreads(comments),
    [comments],
  );

  // Counts for the type switch (across all comments, ignoring scope).
  const typeCounts: Record<TypeFilter, number> = useMemo(() => {
    const roots = comments.filter((c) => !c.parentId);
    return {
      all: roots.length,
      msg: roots.filter((c) => c.kind === "msg").length,
      sys: roots.filter((c) => c.kind === "sys").length,
    };
  }, [comments]);

  // Apply filters in order: type → scope. Replies are excluded from the feed
  // (they live in threads); the feed renders root messages only.
  const visibleItems = useMemo(() => {
    const roots = comments.filter((c) => !c.parentId);
    const byType = filterByType(roots, typeFilter);
    return filterByScope(byType, scopeFilter, {
      activeStage,
      me: currentUserId,
    });
  }, [comments, typeFilter, scopeFilter, activeStage, currentUserId]);

  // Scope counts respect the current type filter so the chips show numbers
  // matching what clicking them will reveal.
  const scopeCounts = useMemo(() => {
    const roots = comments.filter((c) => !c.parentId);
    const byType = filterByType(roots, typeFilter);
    return {
      stage: filterByScope(byType, "stage", {
        activeStage,
        me: currentUserId,
      }).length,
      mentions: filterByScope(byType, "mentions", {
        activeStage,
        me: currentUserId,
      }).length,
    };
  }, [comments, typeFilter, activeStage, currentUserId]);

  const scopeLabel =
    scopeFilter === "stage"
      ? activeStage
      : scopeFilter === "mentions"
        ? `@${peopleMap.get(currentUserId)?.name ?? "Me"}`
        : "all";

  // Thread mode
  const threadParent = openThreadId
    ? comments.find((c) => c.id === openThreadId) ?? null
    : null;
  const threadReplies = threadParent
    ? repliesByParent.get(threadParent.id as CommentId) ?? []
    : [];

  return (
    <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden border-l border-border bg-surface">
      {threadParent ? (
        <ThreadView
          parent={threadParent}
          replies={threadReplies}
          quoteOf={quoteOfMap}
          peopleMap={peopleMap}
          files={fileLookup}
          onClose={() => {
            setOpenThreadId(null);
            setThreadQuote(undefined);
          }}
          onReplyInThread={(r) => setThreadQuote(r)}
          composerQuote={threadQuote}
          onClearComposerQuote={() => setThreadQuote(undefined)}
        />
      ) : (
        <>
          <ControlsRow
            typeFilter={typeFilter}
            onTypeChange={(next) => setTypeFilter(next)}
            scopeFilter={scopeFilter}
            onScopeChange={(next) => setScopeFilter(next)}
            typeCounts={typeCounts}
            stageCount={scopeCounts.stage}
            mentionsCount={scopeCounts.mentions}
            visibleCount={visibleItems.length}
            scopeLabel={scopeLabel}
          />
          <FeedView
            items={visibleItems}
            repliesByParent={repliesByParent}
            quoteOf={quoteOfMap}
            peopleMap={peopleMap}
            files={fileLookup}
            onReply={(m) => setFeedQuote(m)}
            onOpenThread={(parentId) => setOpenThreadId(parentId)}
          />
          <Composer
            placeholder="Add a comment… use @ to mention, # to cite a file"
            peopleMap={peopleMap}
            quote={feedQuote}
            onClearQuote={() => setFeedQuote(undefined)}
          />
        </>
      )}
    </aside>
  );
}
