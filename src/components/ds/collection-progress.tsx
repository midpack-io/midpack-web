import { ProgressTrack } from "@/components/ds/progress-track";
import { cn } from "@/lib/utils";
import type { ProgressTone } from "@/lib/api/types";

type CollectionProgressProps = {
  pct: number;
  tone: ProgressTone;
  label?: string;
  caption?: string;
  className?: string;
  trackClassName?: string;
};

export function CollectionProgress({
  pct,
  tone,
  label,
  caption,
  className,
  trackClassName,
}: CollectionProgressProps) {
  const hasHeader = !!label || !!caption;
  if (!hasHeader) {
    return (
      <ProgressTrack
        pct={pct}
        tone={tone}
        className={className}
        trackClassName={trackClassName}
      />
    );
  }
  return (
    <div className={cn("flex flex-col gap-[10px]", className)}>
      <div className="flex items-center justify-between gap-[10px]">
        {label && (
          <span className="font-mono text-xs font-medium uppercase tracking-[0.07em] text-zinc-400">
            {label}
          </span>
        )}
        {caption && <span className="text-base text-zinc-500">{caption}</span>}
      </div>
      <ProgressTrack pct={pct} tone={tone} trackClassName={trackClassName} />
    </div>
  );
}

const VALUE_TEXT: Record<"uk" | "en", (pct: number) => string> = {
  uk: (pct) => {
    if (pct === 0) return "не розпочато";
    if (pct >= 95) return "завершується";
    if (pct >= 50) return "за половиною";
    return "у роботі";
  },
  en: (pct) => {
    if (pct === 0) return "not started";
    if (pct >= 95) return "wrapping up";
    if (pct >= 50) return "past halfway";
    return "in progress";
  },
};

export function progressValueText(
  pct: number,
  locale: "uk" | "en" = "uk",
): string {
  return VALUE_TEXT[locale](pct);
}
