import * as React from "react";
import type { NotificationSegment } from "@/lib/api/types";

// Renders the composed notification sentence from typed segments as real
// elements (never dangerouslySetInnerHTML). Mirrors the handoff's
// .actor / .ref / .ref.linkedref / <b> spans.
export function NotificationBody({ body }: { body: NotificationSegment[] }) {
  return (
    <span className="text-[12.5px] leading-[1.45] text-zinc-700">
      {body.map((seg, i) => {
        switch (seg.t) {
          case "actor":
            return (
              <span key={i} className="font-semibold text-foreground">
                {seg.s}
              </span>
            );
          case "strong":
            return (
              <strong key={i} className="font-semibold text-foreground">
                {seg.s}
              </strong>
            );
          case "ref":
            return (
              <span
                key={i}
                className="border-b border-border-strong font-medium text-foreground"
              >
                {seg.s}
              </span>
            );
          case "linkedref":
            return (
              <span
                key={i}
                className="border-b border-linked-ring font-medium text-linked-ink"
              >
                {seg.s}
              </span>
            );
          default:
            return <React.Fragment key={i}>{seg.s}</React.Fragment>;
        }
      })}
    </span>
  );
}
