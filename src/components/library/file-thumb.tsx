import type { FileKind } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { EXT_TAG_COLOR } from "./lib";

// Palette swatches for ASE colour-component thumbnails (data-driven, not tokens).
const PALETTE_SWATCHES = ["#e8d4c4", "#c89a7a", "#8a5a48", "#3d4a52", "#7a8a72", "#b8c4a8"];

const FIGMA_FILLS = ["#F24E1E", "#A259FF", "#1ABCFE", "#0ACF83", "#FF7262"];

function ExtTag({ kind, label }: { kind: FileKind; label: string }) {
  return (
    <span
      className="absolute bottom-[5px] left-[6px] z-[2] rounded-[2px] px-[3px] py-[1px] font-mono text-[8px] font-bold uppercase leading-none tracking-[0.04em] text-white"
      style={{ backgroundColor: EXT_TAG_COLOR[kind] }}
    >
      {label}
    </span>
  );
}

// CSS file thumbnail: a paper "sheet" with a folded corner + faint lines and a
// colored extension tag. ASE renders a palette swatch row; Figma a framed logo.
export function FileThumb({ kind }: { kind: FileKind }) {
  if (kind === "ase") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[56px] w-[78px] flex-row overflow-hidden rounded-[6px] border border-border-strong shadow-[0_4px_10px_-4px_rgba(20,20,28,0.1)]">
          {PALETTE_SWATCHES.map((c) => (
            <span key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
          ))}
          <ExtTag kind={kind} label="ASE" />
        </div>
      </div>
    );
  }

  if (kind === "figma") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative flex h-[56px] w-[78px] items-center justify-center overflow-hidden rounded-[6px] border border-border-strong"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-surface) 0 7px, var(--color-surface-3) 7px 8px)",
          }}
        >
          <svg viewBox="0 0 24 36" width="20" height="30" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="6" fill={FIGMA_FILLS[0]} />
            <path d="M0 18a6 6 0 016-6h6v12H6a6 6 0 01-6-6z" fill={FIGMA_FILLS[1]} />
            <path d="M12 0h6a6 6 0 110 12h-6V0z" fill={FIGMA_FILLS[2]} />
            <path d="M12 12h6a6 6 0 110 12h-6V12z" fill={FIGMA_FILLS[3]} />
            <path d="M0 30a6 6 0 016-6h6v6a6 6 0 11-12 0z" fill={FIGMA_FILLS[4]} />
          </svg>
          <ExtTag kind={kind} label="FIGMA" />
        </div>
      </div>
    );
  }

  // Generic paper sheet (pdf / xlsx / docx / svg / psd / png / jpg / link).
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[70px] w-[56px] overflow-hidden rounded-[4px] border border-border-strong bg-surface shadow-[0_4px_10px_-4px_rgba(20,20,28,0.1)]">
        {/* folded top-right corner */}
        <span
          className="absolute right-0 top-0 size-[14px] border-b border-l border-border"
          style={{
            backgroundImage:
              "linear-gradient(225deg, var(--color-surface-3) 0 50%, transparent 50%)",
          }}
        />
        <div className="absolute left-[6px] right-[6px] top-[22px] flex flex-col gap-[4px]">
          {["80%", "60%", "75%", "40%"].map((w, i) => (
            <span
              key={i}
              className="h-[2px] rounded-[1px] bg-zinc-300/70"
              style={{ width: w }}
            />
          ))}
        </div>
        <ExtTag kind={kind} label={kind.toUpperCase()} />
      </div>
    </div>
  );
}

// Standalone wrapper used inside a card preview area.
export function FilePreview({ kind, className }: { kind: FileKind; className?: string }) {
  return (
    <div
      className={cn(
        "relative h-[88px] overflow-hidden border-b border-border bg-surface-2",
        className,
      )}
    >
      <FileThumb kind={kind} />
    </div>
  );
}
