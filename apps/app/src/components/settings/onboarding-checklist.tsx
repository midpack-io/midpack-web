import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  done: boolean;
  /** Right-aligned trailing chip text (e.g. "12 members", "Open →"). */
  trailing: string;
};

const ITEMS: Item[] = [
  { label: "Invite your team", done: true, trailing: "12 members" },
  { label: "Pick a default workflow template", done: true, trailing: "9-stage" },
  { label: "Attach a payment method", done: false, trailing: "Open →" },
  {
    label: "Connect transit destination (Drive / Dropbox)",
    done: false,
    trailing: "Open →",
  },
];

export function OnboardingChecklist() {
  const doneCount = ITEMS.filter((i) => i.done).length;
  const pct = (doneCount / ITEMS.length) * 100;

  return (
    <div
      className="mb-[22px] rounded-[12px] border border-border p-[18px] pb-[16px]"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #fffaf0 0%, var(--color-surface) 60%)",
      }}
    >
      <div className="flex items-start gap-[14px]">
        <span className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-[8px] bg-foreground font-mono text-[12px] font-semibold text-white">
          {doneCount}
        </span>
        <div className="flex-1">
          <h2 className="m-0 text-[15px] font-semibold tracking-[-0.005em] text-foreground">
            Finish setting up your workspace
          </h2>
          <div className="mt-[3px] text-[12px] text-zinc-500">
            A few configuration steps before your first collection ships.
          </div>
        </div>
        <div className="ml-auto font-mono text-[11px] text-zinc-500">
          <b className="font-semibold tabular-nums text-foreground">{doneCount}</b> of{" "}
          <b className="font-semibold tabular-nums text-foreground">{ITEMS.length}</b> done
        </div>
      </div>

      <div className="mt-[14px] h-[5px] overflow-hidden rounded-[3px] bg-surface-3">
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            backgroundImage: "linear-gradient(90deg, var(--color-foreground), #444)",
          }}
        />
      </div>

      <ul className="mt-[14px] grid list-none grid-cols-2 gap-x-[14px] gap-y-[8px] p-0">
        {ITEMS.map((item, i) => (
          <li
            key={i}
            className={cn(
              "flex items-center gap-[10px] rounded-[8px] border border-border bg-surface px-[12px] py-[10px] text-[12.5px]",
              item.done ? "text-zinc-500" : "text-foreground",
            )}
          >
            <span
              className={cn(
                "inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px]",
                item.done
                  ? "border-ok bg-ok text-white"
                  : "border-border-strong bg-surface",
              )}
            >
              {item.done ? <Check className="size-[11px]" strokeWidth={2.4} /> : null}
            </span>
            <span
              className={cn(
                "flex-1",
                item.done && "text-zinc-500 [text-decoration:line-through] [text-decoration-color:var(--color-border-strong)]",
              )}
            >
              {item.label}
            </span>
            {!item.done ? (
              <span className="rounded-[4px] bg-surface-3 px-[5px] py-[2px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.05em] text-zinc-500">
                {item.trailing}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
