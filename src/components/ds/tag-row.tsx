import { PillInline, PillInlineAdd } from "@/components/ds/pill-inline";
import { cn } from "@/lib/utils";
import type { Tag, TagTone } from "@/lib/api/types";

type TagRowProps = {
  tags: Tag[];
  onAddTag?: () => void;
  className?: string;
};

// Inline list of tag pills followed by a persistent `+ TAG` button.
// The component is layout-light so it can sit next to other inline content
// (e.g. a "Updated by …" line) without wrapping.
export function TagRow({ tags, onAddTag, className }: TagRowProps) {
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-[4px]",
        className,
      )}
    >
      {tags.map((tag) => (
        <PillInline key={tag.label} color={toPillColor(tag.tone)}>
          {tag.label}
        </PillInline>
      ))}
      <PillInlineAdd onClick={onAddTag} />
    </span>
  );
}

function toPillColor(tone: TagTone) {
  switch (tone) {
    case "indigo":
      return "indigo" as const;
    case "green":
      return "green" as const;
    case "amber":
      return "amber" as const;
    case "pink":
      return "pink" as const;
    case "slate":
      return "slate" as const;
    case "teal":
      return "teal" as const;
    case "coral":
      return "pink" as const; // closest available; ds/pill-inline has no coral variant
  }
}
