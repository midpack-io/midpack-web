"use client";

import { Badge } from "@/components/ui/badge";
import { AvatarDot, PersonPicker } from "@/components/ds/person-picker";
import { usePeople } from "@/hooks/usePeople";
import type { PersonId } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type PersonFieldProps = {
  value: PersonId | "unassigned";
  onChange: (next: PersonId | "unassigned") => void;
  label?: string;
  className?: string;
  ariaLabel?: string;
};

// Sibling of DateField. The trigger shell — Badge + Popover, rounded chip,
// optional mono uppercase label prefix — mirrors date-field.tsx so the two
// controls read as one family when sat next to each other in the detail bar.
// The picker UI itself lives in `person-picker.tsx` so the stepper-pill's
// compact avatar trigger can render the same listbox.
export function PersonField({
  value,
  onChange,
  label,
  className,
  ariaLabel,
}: PersonFieldProps) {
  const people = usePeople();
  const selected =
    value === "unassigned"
      ? undefined
      : people.data?.find((p) => p.id === value);

  const isSet = !!selected;
  const text = selected?.name ?? "Assign…";

  return (
    <PersonPicker value={value} onChange={onChange} align="end">
      <Badge
        asChild
        variant="ghost"
        className={cn(
          "items-baseline gap-[10px] rounded-[14px] border border-transparent bg-transparent px-3 py-[3px]",
          "font-mono text-[12.5px] font-normal leading-none",
          "transition-[background-color,border-color,box-shadow] duration-100",
          "hover:bg-surface hover:border-border-strong hover:shadow-sm",
          "focus-visible:bg-surface focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-ring",
          "data-[state=open]:bg-surface data-[state=open]:border-border-strong data-[state=open]:shadow-sm",
          !isSet && "text-zinc-400",
          isSet && "text-zinc-700",
          className,
        )}
      >
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label={
            ariaLabel ??
            (isSet ? `Edit assignment, currently ${text}` : "Assign person")
          }
        >
          {label && (
            <span className="font-mono text-xs font-medium uppercase tracking-[0.07em] text-zinc-400">
              {label}
            </span>
          )}
          <span className="inline-flex items-center gap-[6px] self-center">
            {selected ? (
              <AvatarDot person={selected} />
            ) : (
              <span
                aria-hidden
                className="size-[18px] rounded-full border border-dashed border-border-strong"
              />
            )}
            <span>{text}</span>
          </span>
        </button>
      </Badge>
    </PersonPicker>
  );
}
