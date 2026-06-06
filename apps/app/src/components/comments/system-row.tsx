import { CheckCircle2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatHHMM } from "@/lib/time";
import type { Comment, Person, PersonId } from "@/lib/api/types";
import { renderBody } from "./body-renderer";
import type { FileLookup } from "./utils";

type SystemRowProps = {
  message: Comment;
  peopleMap: Map<PersonId, Person>;
  files: FileLookup;
};

// System events surface inline in the feed: linked-file updates (purple link
// icon) and stage transitions (green check icon).
export function SystemRow({ message, peopleMap, files }: SystemRowProps) {
  const linked = message.sysFlavor === "linked";
  return (
    <div className="my-[2px] flex items-center gap-[10px] px-[16px] py-[8px]">
      <span
        className={cn(
          "inline-flex size-[22px] shrink-0 items-center justify-center rounded-full",
          linked
            ? "bg-[rgba(124,58,237,0.1)] text-linked"
            : "bg-ok-soft text-ok",
        )}
      >
        {linked ? (
          <Link2 className="size-[12px]" strokeWidth={1.6} />
        ) : (
          <CheckCircle2 className="size-[12px]" strokeWidth={1.6} />
        )}
      </span>
      <span className="flex-1 text-[12px] leading-[1.4] text-muted [&>*]:align-middle [&_strong]:font-medium [&_strong]:text-zinc-700">
        {renderBody({ body: message.body, peopleMap, files })}
      </span>
      <span className="shrink-0 font-mono text-[10.5px] text-muted">
        {formatHHMM(message.createdAt)}
      </span>
    </div>
  );
}
