import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AVATAR_GRADIENT } from "@/components/ds/avatar-gradient";
import { cn } from "@/lib/utils";
import type { Member } from "@/lib/api/types";

// Seat avatar with three lifecycle treatments, mirroring the prototype's
// .av-pending / .av-deactivated / .av-* classes:
//   pending      — striped-amber tile + envelope sigil (no user yet)
//   deactivated  — desaturated grey, muted initial
//   active        — the joined user's per-person gradient (or real photo)

function EnvelopeSigil() {
  return (
    <svg
      viewBox="0 0 14 14"
      width={13}
      height={13}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="3.6" width="10" height="6.8" rx="1.2" />
      <path d="M2.4 4.3 7 7.7l4.6-3.4" />
    </svg>
  );
}

export function MemberAvatar({
  member,
  className,
}: {
  member: Member;
  className?: string;
}) {
  if (member.status === "pending") {
    return (
      <Avatar className={className} aria-label={`Pending invite to ${member.email}`}>
        <AvatarFallback
          className="text-warn"
          // A repeating diagonal stripe — a one-off decorative pattern, not a DS
          // token, so it can't resolve to a utility. Built on the warn-soft token.
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--color-warn-soft) 0 5px, #fff7d6 5px 10px)",
          }}
        >
          <EnvelopeSigil />
        </AvatarFallback>
      </Avatar>
    );
  }

  const user = member.user;
  const initial = user?.initial ?? member.email.slice(0, 1).toUpperCase();

  if (member.status === "deactivated") {
    return (
      <Avatar className={cn("grayscale", className)}>
        {user?.avatar_url ? <AvatarImage src={user.avatar_url} alt={user.name} /> : null}
        <AvatarFallback className="bg-surface-3 text-[11.5px] font-semibold text-muted-foreground">
          {initial}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={className}>
      {user?.avatar_url ? <AvatarImage src={user.avatar_url} alt={user.name} /> : null}
      <AvatarFallback
        className={cn(
          "text-[11.5px] font-semibold text-white",
          user?.avatar_key ? AVATAR_GRADIENT[user.avatar_key] : "bg-muted",
        )}
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}
