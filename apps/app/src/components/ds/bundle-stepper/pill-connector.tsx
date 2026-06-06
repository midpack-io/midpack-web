import { cn } from "@/lib/utils";

type PillConnectorProps = {
  kind?: "linear" | "split" | "merge";
  className?: string;
};

// 1px horizontal line drawn between two adjacent stepper pills.
// `split` and `merge` add a short vertical segment to fork/join into a parallel
// group; pure CSS via pseudo-elements would suit, but spans here keep the markup
// component-explicit.
export function PillConnector({ kind = "linear", className }: PillConnectorProps) {
  if (kind === "linear") {
    return (
      <span
        aria-hidden
        className={cn("h-px w-[14px] shrink-0 bg-border-strong", className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn("relative h-[30px] w-[18px] shrink-0", className)}
    >
      <span className="absolute inset-x-0 top-1/2 h-px bg-border-strong" />
      <span
        className={cn(
          "absolute top-1/4 bottom-1/4 w-px bg-border-strong",
          kind === "split" ? "right-0" : "left-0",
        )}
      />
    </span>
  );
}
