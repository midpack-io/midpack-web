"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { getAppUrls } from "../../lib/app-urls";
import { Logo, type LogoTone } from "./logo";

export type BrandLinkProps = {
  tone?: LogoTone;
  className?: string;
};

// The Midpack logo as a link to the marketing landing (the root-domain `web`
// app) — used in the app/admin chrome so the brand always leads "home" to the
// landing, never to an in-app route. Plain <a> for a full cross-app navigation
// that carries the shared SSO cookie; the target is resolved after mount
// (getAppUrls reads window), with "/" as the pre-mount fallback, to avoid a
// hydration mismatch.
export function BrandLink({ tone, className }: BrandLinkProps) {
  const [href, setHref] = useState("/");
  useEffect(() => setHref(getAppUrls().web), []);
  return (
    <a
      href={href}
      aria-label="Midpack"
      className={cn(
        "relative inline-flex cursor-pointer items-center rounded-[4px] outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring",
        className,
      )}
    >
      <Logo tone={tone} />
    </a>
  );
}
