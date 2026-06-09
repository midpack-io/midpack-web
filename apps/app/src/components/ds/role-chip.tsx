import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Workspace role pill, driven by the flags-only model (handoffs/
// members-implementation-plan.md §6.1): owner → admin → member precedence.
// owner = dark fill + gold star sigil · admin = indigo fill · member = neutral.
// The prototype's Manager/Performer tiers are intentionally collapsed to "Member".

function StarSigil() {
  return (
    <svg viewBox="0 0 14 14" width={10} height={10} fill="currentColor" aria-hidden>
      <path d="M7 1.6l1.55 3.14 3.47.5-2.51 2.45.59 3.45L7 9.97l-3.1 1.63.59-3.45L1.98 5.7l3.47-.5z" />
    </svg>
  );
}

const BASE =
  "h-[22px] gap-[5px] rounded-chip px-2 py-[3px] text-[11.5px] font-medium leading-none";

type Props = {
  isOwner: boolean;
  isAdmin: boolean;
  className?: string;
};

export function RoleChip({ isOwner, isAdmin, className }: Props) {
  if (isOwner) {
    return (
      <Badge variant="ghost" className={cn(BASE, "border-0 bg-foreground text-white", className)}>
        <span className="text-gold">
          <StarSigil />
        </span>
        Owner
      </Badge>
    );
  }
  if (isAdmin) {
    return (
      <Badge variant="ghost" className={cn(BASE, "border-0 bg-accent-strong text-white", className)}>
        <span className="inline-block size-[5px] rounded-full bg-white/80" />
        Admin
      </Badge>
    );
  }
  return (
    <Badge
      variant="ghost"
      className={cn(BASE, "border border-border bg-surface-3 text-foreground", className)}
    >
      <span className="inline-block size-[5px] rounded-full bg-zinc-400" />
      Member
    </Badge>
  );
}
