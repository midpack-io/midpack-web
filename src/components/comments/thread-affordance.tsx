import { AVATAR_GRADIENT } from "@/components/ds/avatar-gradient";
import { cn } from "@/lib/utils";
import { formatHHMM } from "@/lib/time";
import type { Comment, Person, PersonId } from "@/lib/api/types";

type ThreadAffordanceProps = {
  replies: Comment[];
  peopleMap: Map<PersonId, Person>;
  onClick: () => void;
};

// Inline thread affordance shown under a parent message: stacked participant
// avatars + reply count + last-reply timestamp. Click to open thread view.
export function ThreadAffordance({
  replies,
  peopleMap,
  onClick,
}: ThreadAffordanceProps) {
  if (replies.length === 0) return null;

  // Unique participants in order of first reply.
  const seen = new Set<PersonId>();
  const participants: Person[] = [];
  for (const r of replies) {
    if (seen.has(r.authorId)) continue;
    seen.add(r.authorId);
    const p = peopleMap.get(r.authorId);
    if (p) participants.push(p);
  }

  const last = replies[replies.length - 1];
  if (!last) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group/aff mt-[6px] ml-[32px] inline-flex items-center gap-[8px] rounded-[14px] border border-transparent bg-transparent py-[4px] pr-[10px] pl-[4px] text-[12px] font-medium text-accent-strong transition-colors hover:border-accent-ring hover:bg-accent-soft"
    >
      <span className="inline-flex items-center">
        {participants.slice(0, 3).map((p, i) => (
          <span
            key={p.id}
            aria-hidden
            className={cn(
              "inline-flex size-[20px] items-center justify-center rounded-full text-[9px] font-bold text-white shadow-[0_0_0_2px_var(--color-surface)] group-hover/aff:shadow-[0_0_0_2px_var(--color-accent-soft)]",
              AVATAR_GRADIENT[p.avatarKey],
              i > 0 && "-ml-[7px]",
            )}
            style={{ zIndex: participants.length - i }}
          >
            {p.initial}
          </span>
        ))}
      </span>
      <span className="text-accent-strong">{replies.length} replies</span>
      <span className="text-muted group-hover/aff:text-accent-ink">
        · last reply {formatHHMM(last.createdAt)}
      </span>
    </button>
  );
}
