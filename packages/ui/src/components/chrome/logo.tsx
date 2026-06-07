import Link from "next/link";
import { cn } from "../../lib/utils";

// `default` = on a light surface; `inverted` = on a dark/photo surface (white mark).
export type LogoTone = "default" | "inverted";

export type LogoProps = {
  tone?: LogoTone;
  // When set, the logo is a link (renders next/link). Otherwise a plain element.
  href?: string;
  className?: string;
};

// The single Midpack logo — the "Midpack" wordmark. Used everywhere (app top bar,
// admin header, landing, auth screens). Pass `tone="inverted"` on a dark/photo
// surface and `href` to make it a link.
export function Logo({ tone = "default", href, className }: LogoProps) {
  const mark = (
    <span className="inline-flex items-baseline text-lg tracking-tight">
      <span className={cn("font-semibold", tone === "inverted" ? "text-white" : "text-foreground")}>
        Mid
      </span>
      <span className={cn("font-normal", tone === "inverted" ? "text-white/70" : "text-zinc-500")}>
        pack
      </span>
    </span>
  );
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "relative inline-flex cursor-pointer items-center rounded-[4px] outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring",
          className,
        )}
      >
        {mark}
      </Link>
    );
  }
  return <span className={cn("inline-flex items-center", className)}>{mark}</span>;
}
