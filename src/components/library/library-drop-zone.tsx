"use client";

import { useRef, useState, type DragEvent } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LibraryDropZoneProps = {
  variant: "components" | "templates";
  creating: boolean;
  createError: string | null;
  onCreateFiles: (files: File[]) => void;
  onPasteLink?: (url: string) => void;
  onRetry?: () => void;
};

const COPY = {
  components: {
    lead: "Drop a file here",
    rest: " to publish a new shared component, or drop onto an existing card to add a version.",
  },
  templates: {
    lead: "Drop a starter file here",
    rest: " to seed new products from it, or drop onto an existing card to add a version.",
  },
};

export function LibraryDropZone({
  variant,
  creating,
  createError,
  onCreateFiles,
  onPasteLink,
  onRetry,
}: LibraryDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const copy = COPY[variant];

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onCreateFiles(files);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "mb-[16px] flex items-center gap-[14px] rounded-[10px] border-[1.5px] border-dashed bg-surface-2 px-[20px] py-[16px] text-[12.5px] text-zinc-500 transition-colors",
        dragOver
          ? "border-accent-strong bg-surface"
          : "border-border-strong hover:border-zinc-400 hover:bg-surface",
      )}
    >
      <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] border border-border bg-surface text-zinc-500">
        <Upload className="size-[16px]" strokeWidth={1.4} />
      </span>

      <div className="min-w-0 flex-1">
        {createError ? (
          <span className="text-coral">
            {createError}{" "}
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="font-medium text-accent-strong hover:underline"
              >
                Retry
              </button>
            )}
          </span>
        ) : creating ? (
          <span className="text-foreground">Uploading…</span>
        ) : (
          <span>
            <b className="font-semibold text-foreground">{copy.lead}</b>
            {copy.rest}
          </span>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-[6px]">
        {variant === "components" && onPasteLink && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const url = window.prompt("Paste a link (e.g. a Figma file URL)");
              if (url?.trim()) onPasteLink(url.trim());
            }}
          >
            Paste link
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Choose file
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onCreateFiles(files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
