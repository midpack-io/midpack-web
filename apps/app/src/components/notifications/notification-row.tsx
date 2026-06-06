import { Button } from "@/components/ui/button";
import { PillInline } from "@/components/ds/pill-inline";
import { NotificationAvatar } from "@/components/ds/notification-avatar";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Notification, NotificationId, Person } from "@/lib/api/types";
import { NotificationBody } from "./notification-body";

type Props = {
  n: Notification;
  person: Person | undefined;
  onRead: (id: NotificationId) => void;
};

export function NotificationRow({ n, person, onRead }: Props) {
  const unread = n.readAt === null;
  return (
    <div
      onClick={() => onRead(n.id)}
      className={cn(
        "group/row grid cursor-pointer grid-cols-[auto_1fr_auto] items-start gap-[10px] border-b border-border px-[14px] py-[11px] transition-colors hover:bg-surface-2",
        unread && (n.urgent ? "bg-[rgba(181,53,39,0.035)]" : "bg-[rgba(79,70,229,0.03)]"),
      )}
    >
      <NotificationAvatar person={person} kind={n.kind} />

      <div className="min-w-0">
        <NotificationBody body={n.body} />
        {n.quote && (
          <div className="mt-[4px] truncate text-[11.5px] italic text-zinc-500">
            {`“${n.quote}”`}
          </div>
        )}
        <div className="mt-[5px] flex min-h-[21px] items-center gap-[7px]">
          <span className="text-[11px] text-zinc-400">{timeAgo(n.createdAt)}</span>
          {n.pill && (
            <PillInline color={n.pill.tone} className="px-[5px] pb-[1px] pt-[2px] text-[9.5px]">
              {n.pill.label}
            </PillInline>
          )}
          {n.action && (
            <Button
              variant="outline"
              size="xs"
              className="ml-auto h-[22px] opacity-0 transition-opacity group-hover/row:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onRead(n.id);
              }}
            >
              {n.action}
            </Button>
          )}
        </div>
      </div>

      <span
        className={cn(
          "mt-[5px] size-[7px] shrink-0 rounded-full transition-colors",
          unread ? (n.urgent ? "bg-coral" : "bg-accent-strong") : "bg-transparent",
        )}
      />
    </div>
  );
}
