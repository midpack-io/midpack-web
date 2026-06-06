import {
  AlarmClock,
  ArrowRight,
  AtSign,
  Check,
  ListChecks,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { AVATAR_GRADIENT } from "@/components/ds/avatar-gradient";
import { cn } from "@/lib/utils";
import type { NotificationKind, Person } from "@/lib/api/types";

// Corner kind-badge color + glyph, keyed by event kind. Colors reuse the
// existing status tokens; the system gray (#3d3d44) has no token so it's inline.
const KIND_BADGE: Record<NotificationKind, { bg: string; Icon: LucideIcon }> = {
  mention: { bg: "bg-accent-strong", Icon: AtSign },
  review: { bg: "bg-warn", Icon: ListChecks },
  approve: { bg: "bg-ok", Icon: Check },
  stage: { bg: "bg-linked", Icon: ArrowRight },
  deadline: { bg: "bg-coral", Icon: AlarmClock },
  system: { bg: "bg-[#3d3d44]", Icon: Settings },
};

// Dark gradient for system-generated events (no person actor), mirroring the
// handoff's .av-sys.
const SYSTEM_GRADIENT = "bg-gradient-to-br from-[#2a2a30] to-[#16161a]";

type Props = {
  // The actor; undefined ⇒ a system-generated event (gear glyph).
  person: Person | undefined;
  kind: NotificationKind;
};

export function NotificationAvatar({ person, kind }: Props) {
  const { bg, Icon } = KIND_BADGE[kind];
  return (
    <Avatar className="size-[30px]">
      <AvatarFallback
        className={cn(
          "text-[11.5px] font-semibold tracking-tight text-white",
          person ? AVATAR_GRADIENT[person.avatarKey] : SYSTEM_GRADIENT,
        )}
      >
        {person ? person.initial : <Settings className="size-[13px]" strokeWidth={1.5} />}
      </AvatarFallback>
      <AvatarBadge className={cn("size-[15px] ring-surface", bg)}>
        <Icon className="size-[9px] text-white" strokeWidth={2} />
      </AvatarBadge>
    </Avatar>
  );
}
