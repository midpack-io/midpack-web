import { Fragment, type ReactNode } from "react";
import type { Person, PersonId } from "@/lib/api/types";
import { FileChip, ImgCard, MentionChip, StageTag } from "./tokens";
import type { FileLookup } from "./utils";

// Splits a comment body on inline tokens and emits React nodes.
//   @p-<personId>            → <MentionChip>
//   #stage:<n>               → <StageTag>
//   [file:<name>@<version>]  → <FileChip>
//   [img:<label>@<variant>]  → <ImgCard>
//   **<text>**               → <strong>
//   \n                       → <br>
const TOKEN_RE =
  /(@p-[a-z0-9-]+|#stage:[a-z0-9-]+|\[file:[^\]]+\]|\[img:[^\]]+\]|\*\*[^*]+\*\*|\n)/g;

type RenderBodyArgs = {
  body: string;
  peopleMap: Map<PersonId, Person>;
  files: FileLookup;
};

export function renderBody({ body, peopleMap, files }: RenderBodyArgs): ReactNode[] {
  const parts = body.split(TOKEN_RE);
  return parts.map((part, i) => {
    if (!part) return null;

    // Mention: @p-id
    if (part.startsWith("@p-")) {
      const id = part.slice(1) as PersonId;
      return <MentionChip key={i} person={peopleMap.get(id)} />;
    }

    // Stage reference: #stage:n
    if (part.startsWith("#stage:")) {
      const stage = part.slice("#stage:".length);
      return <StageTag key={i} stage={stage} />;
    }

    // File chip: [file:name(@version)?]
    if (part.startsWith("[file:")) {
      const inner = part.slice("[file:".length, -1);
      const at = inner.lastIndexOf("@");
      const fileName = at >= 0 ? inner.slice(0, at) : inner;
      const version = at >= 0 ? inner.slice(at + 1) : undefined;
      const info = files.get(fileName);
      return (
        <FileChip
          key={i}
          fileName={fileName}
          version={version}
          kind={info?.kind}
          linked={info?.linked}
        />
      );
    }

    // Image placeholder: [img:label@variant]
    if (part.startsWith("[img:")) {
      const inner = part.slice("[img:".length, -1);
      const at = inner.lastIndexOf("@");
      const label = at >= 0 ? inner.slice(0, at) : inner;
      const variant = at >= 0 ? inner.slice(at + 1) : "a";
      return <ImgCard key={i} label={label} variant={variant} />;
    }

    // Bold run: **text**
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Soft break
    if (part === "\n") return <br key={i} />;

    // Plain text — wrap to give every chunk a key without rendering a span.
    return <Fragment key={i}>{part}</Fragment>;
  });
}
