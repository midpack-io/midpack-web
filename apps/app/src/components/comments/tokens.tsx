import { FileText, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AVATAR_GRADIENT } from "@/components/ds/avatar-gradient";
import { useFileCite } from "@/components/products/file-cite-context";
import { cn } from "@/lib/utils";
import type { Person, ProductFile } from "@/lib/api/types";

// ─── Mention chip ───────────────────────────────────────────────────────────

export function MentionChip({ person }: { person: Person | undefined }) {
  if (!person) {
    return (
      <Badge variant="ghost" className="rounded-[11px] bg-accent-soft px-[7px] py-[1px] align-baseline text-[12.5px] font-medium leading-tight text-accent-ink">
        @unknown
      </Badge>
    );
  }
  return (
    <Badge
      asChild
      variant="ghost"
      className="m-0 inline-flex h-auto items-center gap-[4px] rounded-[11px] bg-accent-soft px-[7px] py-[1px] pl-[2px] align-baseline text-[12.5px] font-medium leading-tight text-accent-ink hover:bg-accent-ring/60"
    >
      <button type="button" title={person.role}>
        <span
          aria-hidden
          className={cn(
            "inline-flex size-[16px] items-center justify-center rounded-full text-[8.5px] font-bold text-white",
            AVATAR_GRADIENT[person.avatarKey],
          )}
        >
          {person.initial}
        </span>
        {person.name}
      </button>
    </Badge>
  );
}

// ─── File chip ──────────────────────────────────────────────────────────────

type FileChipProps = {
  fileName: string; // "hero-banner.psd"
  version?: string; // "v3"
  kind?: ProductFile["kind"];
  linked?: boolean;
};

export function FileChip({ fileName, version, linked }: FileChipProps) {
  const cite = useFileCite();
  const dot = fileName.lastIndexOf(".");
  const base = dot >= 0 ? fileName.slice(0, dot) : fileName;
  const ext = dot >= 0 ? fileName.slice(dot) : "";
  return (
    <Badge
      asChild
      variant="ghost"
      className={cn(
        "inline-flex h-auto items-center gap-[5px] rounded-[5px] border px-[5px] py-[1px] align-baseline font-sans text-[12.5px] font-normal leading-tight whitespace-nowrap normal-case tracking-normal text-foreground transition-colors",
        linked
          ? "border-linked-border bg-linked-soft hover:bg-linked-tint"
          : "border-border bg-surface-3 hover:border-border-strong hover:bg-surface",
      )}
    >
      <button
        type="button"
        title={`Open ${fileName}${version ? ` ${version}` : ""}`}
        onClick={() => cite(fileName)}
      >
        <FileText className="size-[12px] shrink-0 text-muted" strokeWidth={1.6} />
        <span>{base}</span>
        <span className="font-mono text-[11px] text-muted">{ext}</span>
        {version && (
          <span
            className={cn(
              "ml-[1px] rounded-[3px] px-[4px] py-[1px] font-mono text-[10px] font-semibold tracking-[0.02em] text-white",
              linked ? "bg-linked" : "bg-foreground",
            )}
          >
            {version}
          </span>
        )}
      </button>
    </Badge>
  );
}

// ─── Inline image card ──────────────────────────────────────────────────────

const IMG_VARIANTS: Record<string, string> = {
  a: "bg-gradient-to-br from-[#f0e9dd] to-[#c9b89b]",
  b: "bg-gradient-to-br from-[#e8e4f0] to-[#b8a8d4]",
  c: "bg-gradient-to-br from-[#e0e8df] to-[#9bb59c]",
  d: "bg-gradient-to-br from-[#f0e0e0] to-[#c9a8a8]",
  e: "bg-gradient-to-br from-[#e0e8f0] to-[#9bafc9]",
};

export function ImgCard({ label, variant }: { label: string; variant?: string }) {
  const v = variant && IMG_VARIANTS[variant] ? variant : "a";
  return (
    <span
      className={cn(
        "relative my-[6px] flex h-[130px] max-w-full cursor-zoom-in items-end overflow-hidden rounded-[7px] border border-border shadow-sm",
        IMG_VARIANTS[v],
      )}
      role="img"
      aria-label={label}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 24px)",
        }}
      />
      <span className="absolute top-[8px] right-[8px] inline-flex size-[18px] items-center justify-center rounded-[4px] bg-white/85 text-muted">
        <ImageIcon className="size-[10px]" strokeWidth={1.6} />
      </span>
      <span className="absolute bottom-[10px] left-[10px] rounded-[4px] bg-foreground/70 px-[7px] py-[3px] font-mono text-[10.5px] tracking-[0.02em] text-white">
        {label}
      </span>
    </span>
  );
}

// ─── Stage tag (inline) ─────────────────────────────────────────────────────

const STAGE_TAG_STYLES: Record<string, string> = {
  brief: "bg-[#eef2f7] text-[#3d5d86]",
  design: "bg-[#f4ecf9] text-[#6b4ba1]",
  copy: "bg-[#e9f3ec] text-[#2f7a4a]",
  review: "bg-accent-soft text-accent-ink",
  approval: "bg-[#fdf0e6] text-[#a3501f]",
  production: "bg-surface-3 text-muted",
  bundle: "bg-surface-3 text-muted",
};

export function StageTag({ stage }: { stage: string }) {
  const key = stage.toLowerCase();
  return (
    <Badge
      variant="ghost"
      className={cn(
        "inline-flex h-auto items-center rounded-[4px] px-[6px] py-[1.5px] align-baseline font-mono text-[10px] font-semibold uppercase tracking-[0.05em] leading-tight whitespace-nowrap",
        STAGE_TAG_STYLES[key] ?? "bg-surface-3 text-muted",
      )}
    >
      {stage}
    </Badge>
  );
}
