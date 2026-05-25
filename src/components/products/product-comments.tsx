"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AtSign, Paperclip, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AVATAR_GRADIENT } from "@/components/ds/avatar-gradient";
import { PillInline } from "@/components/ds/pill-inline";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Comment, Person, PersonId } from "@/lib/api/types";

type ProductCommentsProps = {
  comments: Comment[];
  peopleMap: Map<PersonId, Person>;
};

type CommentFilter = "all" | "open" | "resolved";

export function ProductComments({
  comments,
  peopleMap,
}: ProductCommentsProps) {
  const [filter, setFilter] = useState<CommentFilter>("all");

  const counts = useMemo(() => {
    let open = 0;
    let resolved = 0;
    for (const c of comments) {
      if (c.status === "resolved") resolved += 1;
      else open += 1;
    }
    return { open, resolved };
  }, [comments]);

  const visibleComments = useMemo(() => {
    if (filter === "all") return comments;
    if (filter === "open")
      return comments.filter((c) => c.status !== "resolved");
    return comments.filter((c) => c.status === "resolved");
  }, [comments, filter]);

  return (
    <aside className="flex min-w-0 flex-col border-l border-border bg-surface">
      <Tabs defaultValue="comments" className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-border px-[14px] pt-[10px]">
          <TabsList variant="line" className="h-auto">
            <TabsTrigger value="comments" className="gap-[6px] px-[6px] pb-[10px]">
              Comments
              <span className="font-mono text-[10.5px] font-semibold tabular-nums text-zinc-500">
                {comments.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="decisions" className="px-[6px] pb-[10px]">
              Decisions
            </TabsTrigger>
            <TabsTrigger value="activity" className="px-[6px] pb-[10px]">
              Action Log
            </TabsTrigger>
            <TabsTrigger value="members" className="px-[6px] pb-[10px]">
              Members
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="comments"
          className="flex min-h-0 flex-1 flex-col gap-0 outline-none"
        >
          <CommentsFilterRow
            filter={filter}
            onChange={setFilter}
            counts={counts}
          />
          <ScrollArea className="min-h-0 flex-1">
            <CommentsThread
              comments={visibleComments}
              peopleMap={peopleMap}
            />
          </ScrollArea>
          <Composer />
        </TabsContent>

        <TabsContent value="decisions" className="p-[24px] text-sm text-zinc-500">
          No decisions logged yet.
        </TabsContent>
        <TabsContent value="activity" className="p-[24px] text-sm text-zinc-500">
          Activity log coming soon.
        </TabsContent>
        <TabsContent value="members" className="p-[24px] text-sm text-zinc-500">
          Members panel coming soon.
        </TabsContent>
      </Tabs>
    </aside>
  );
}

// ─── Filter row ─────────────────────────────────────────────────────────────

function CommentsFilterRow({
  filter,
  onChange,
  counts,
}: {
  filter: CommentFilter;
  onChange: (next: CommentFilter) => void;
  counts: { open: number; resolved: number };
}) {
  return (
    <div className="flex items-center gap-[6px] border-b border-border px-[14px] py-[8px]">
      <FilterChip
        active={filter === "all"}
        onClick={() => onChange("all")}
      >
        All
      </FilterChip>
      <FilterChip
        active={filter === "open"}
        onClick={() => onChange("open")}
      >
        Open
        <span className="ml-[4px] font-mono text-[10.5px] tabular-nums text-zinc-500">
          {counts.open}
        </span>
      </FilterChip>
      <FilterChip
        active={filter === "resolved"}
        onClick={() => onChange("resolved")}
      >
        Resolved
        <span className="ml-[4px] font-mono text-[10.5px] tabular-nums text-zinc-500">
          {counts.resolved}
        </span>
      </FilterChip>
      <div className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.06em] text-zinc-400">
        scope: bundle
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-[24px] items-center rounded-md px-[8px] text-xs transition-colors",
        active
          ? "bg-foreground text-surface"
          : "text-zinc-700 hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}

// ─── Thread ─────────────────────────────────────────────────────────────────

function CommentsThread({
  comments,
  peopleMap,
}: {
  comments: Comment[];
  peopleMap: Map<PersonId, Person>;
}) {
  // Group by root: parents in time order, replies inset under their parent.
  const { roots, repliesByParent } = useMemo(
    () => groupCommentThreads(comments),
    [comments],
  );

  if (roots.length === 0) {
    return (
      <div className="px-[20px] py-[36px] text-center text-sm text-zinc-500">
        No comments to show.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-[12px] px-[14px] py-[14px]">
      {roots.map((root) => (
        <li key={root.id} className="flex flex-col gap-[8px]">
          <CommentCard comment={root} peopleMap={peopleMap} />
          {(repliesByParent.get(root.id) ?? []).map((reply) => (
            <div key={reply.id} className="ml-[28px]">
              <CommentCard comment={reply} peopleMap={peopleMap} reply />
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}

// ─── Card ───────────────────────────────────────────────────────────────────

function CommentCard({
  comment,
  peopleMap,
  reply,
}: {
  comment: Comment;
  peopleMap: Map<PersonId, Person>;
  reply?: boolean;
}) {
  const author = peopleMap.get(comment.authorId);
  const flagged = comment.status === "still_open_from_prev_version";

  return (
    <article
      className={cn(
        "rounded-lg border px-[12px] py-[10px] transition-colors",
        flagged
          ? "border-warn-ring bg-gradient-to-b from-warn-soft to-surface shadow-[inset_0_0_0_1px_var(--color-warn-ring)]"
          : "border-border bg-surface",
        reply && "bg-surface-2",
      )}
    >
      <header className="flex items-center gap-[8px]">
        {author ? (
          <AvatarBubble person={author} />
        ) : (
          <span className="size-[22px] shrink-0 rounded-full border border-dashed border-border-strong" />
        )}
        <span className="text-sm font-medium text-foreground">
          {author?.name ?? "Unknown"}
        </span>
        <span
          className="font-mono text-[11px] text-zinc-500 tabular-nums"
          title={comment.createdAt}
        >
          {timeAgo(comment.createdAt)}
        </span>
      </header>
      <p className="mt-[6px] whitespace-pre-wrap text-sm leading-snug text-zinc-700">
        {renderBody(comment.body, peopleMap)}
      </p>
      <footer className="mt-[8px] flex flex-wrap items-center gap-[6px]">
        <AnchorBadge comment={comment} />
        <StatusBadge status={comment.status} />
        <div className="ml-auto flex items-center gap-[2px]">
          <Button
            variant="ghost"
            size="sm"
            className="h-[24px] px-[8px] text-xs"
          >
            Reply
          </Button>
          {comment.status !== "resolved" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-[24px] px-[8px] text-xs"
            >
              Resolve
            </Button>
          )}
        </div>
      </footer>
    </article>
  );
}

function AvatarBubble({ person }: { person: Person }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",
        AVATAR_GRADIENT[person.avatarKey],
      )}
    >
      {person.initial}
    </span>
  );
}

function AnchorBadge({ comment }: { comment: Comment }) {
  const anchor = comment.anchor;
  let label: string;
  if (anchor.kind === "bundle") label = "On bundle";
  else if (anchor.kind === "file")
    label = `On ${anchor.fileName}${anchor.version ? ` · ${anchor.version}` : ""}`;
  else label = `On #stage:${anchor.stage}`;
  return (
    <PillInline color={anchor.kind === "file" ? "indigo" : "slate"}>
      {label}
    </PillInline>
  );
}

function StatusBadge({ status }: { status: Comment["status"] }) {
  if (status === "resolved") {
    return <PillInline color="green">Resolved</PillInline>;
  }
  if (status === "still_open_from_prev_version") {
    return <PillInline color="amber">Still open</PillInline>;
  }
  return <PillInline color="default">Open</PillInline>;
}

// ─── Body token parser ─────────────────────────────────────────────────────

// Splits comment body on inline tokens. The seed bodies carry three forms:
//   @<personId>            → mention pill
//   #stage:<n>             → stage pill
//   [file:<name>@<version>] → file pill
const TOKEN_RE =
  /(@p-[a-z0-9-]+|#stage:[a-z0-9-]+|\[file:[^\]]+\])/g;

function renderBody(
  body: string,
  peopleMap: Map<PersonId, Person>,
): ReactNode[] {
  const parts = body.split(TOKEN_RE);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("@p-")) {
      const id = part.slice(1) as PersonId;
      const person = peopleMap.get(id);
      return (
        <PillInline key={i} color="indigo">
          @{person?.name ?? id}
        </PillInline>
      );
    }
    if (part.startsWith("#stage:")) {
      const stage = part.slice("#stage:".length);
      return (
        <PillInline key={i} color="slate">
          #stage·{stage}
        </PillInline>
      );
    }
    if (part.startsWith("[file:")) {
      const inner = part.slice("[file:".length, -1);
      return (
        <PillInline key={i} color="teal">
          {inner}
        </PillInline>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Composer ──────────────────────────────────────────────────────────────

function Composer() {
  // Visual only. Wire to a mutation in a follow-up; for now the textarea grows
  // on focus and Send is decorative.
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div className="border-t border-border bg-surface px-[14px] py-[10px]">
      <div className="mb-[6px] flex items-center gap-[6px] font-mono text-[10.5px] uppercase tracking-[0.06em] text-zinc-400">
        Commenting on
        <span className="text-zinc-700">this bundle</span>
      </div>
      <div
        className={cn(
          "flex flex-col gap-[8px] rounded-lg border bg-surface-2 px-[10px] py-[8px] transition-colors",
          focused
            ? "border-accent shadow-[0_0_0_3px_var(--color-accent-ring)]"
            : "border-border",
        )}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Write a comment…"
          className={cn(
            "min-h-[36px] w-full resize-none border-0 bg-transparent text-sm leading-snug text-foreground placeholder:text-zinc-400 outline-none",
            focused && "min-h-[72px]",
          )}
        />
        <div className="flex items-center gap-[2px]">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Attach"
            className="size-[26px]"
          >
            <Paperclip className="size-[14px]" strokeWidth={1.8} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Mention"
            className="size-[26px]"
          >
            <AtSign className="size-[14px]" strokeWidth={1.8} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Emoji"
            className="size-[26px]"
          >
            <Smile className="size-[14px]" strokeWidth={1.8} />
          </Button>
          <Button
            size="sm"
            className="ml-auto h-[28px] gap-[6px] px-[12px] text-xs"
            disabled={!draft.trim()}
          >
            <Send className="size-[12px]" strokeWidth={1.8} />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

function groupCommentThreads(comments: Comment[]): {
  roots: Comment[];
  repliesByParent: Map<string, Comment[]>;
} {
  // Roots in createdAt-desc order so the freshest thread sits at the top.
  // Replies under each root in createdAt-asc order so the conversation reads
  // top-down within the thread.
  const roots: Comment[] = [];
  const repliesByParent = new Map<string, Comment[]>();
  for (const c of comments) {
    if (c.parentId) {
      const list = repliesByParent.get(c.parentId) ?? [];
      list.push(c);
      repliesByParent.set(c.parentId, list);
    } else {
      roots.push(c);
    }
  }
  roots.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  for (const list of repliesByParent.values()) {
    list.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  }
  return { roots, repliesByParent };
}
