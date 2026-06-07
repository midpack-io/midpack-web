"use client";

import * as React from "react";
import Image, { type StaticImageData } from "next/image";

import { cn } from "../../lib/utils";
import moodboard from "../../assets/auth-design-moodboard.jpg";
import tailoring from "../../assets/auth-tailoring-tools.jpg";
import atelier from "../../assets/auth-atelier-sewing.jpg";

// Apparel design-making imagery — one is shown at random per visit.
const DEFAULT_IMAGES: StaticImageData[] = [moodboard, tailoring, atelier];

// Stage labels echoed as a quiet rail — restates "through every stage" and ties
// the auth screen to the product's core motif.
const STAGES = ["Idea", "Tech-pack", "Patterns", "Sample", "Production"];

export interface HeroPanelProps {
  /** Candidate images; one is chosen at random on mount. */
  images?: (StaticImageData | string)[];
  imageAlt?: string;
  eyebrow?: string;
  quote?: string;
  className?: string;
}

// Image-led side panel for the auth split screen (mirrors the Start-Craft
// template-1-web organization): a full-bleed apparel design-making photo with
// the brand + product motif overlaid. Hidden below `lg`. Pure presentation.
export function HeroPanel({
  images = DEFAULT_IMAGES,
  imageAlt = "Apparel design in the making",
  eyebrow = "Product workflow",
  quote = "Every bundle, through every stage.",
  className,
}: HeroPanelProps) {
  // Render images[0] on the server and first client paint so hydration matches,
  // then pick a random image after mount for variety on each visit.
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    if (images.length > 1) setIndex(Math.floor(Math.random() * images.length));
  }, [images.length]);

  const src = images[index] ?? images[0];
  if (!src) return null;

  return (
    <div
      className={cn(
        "relative hidden flex-1 overflow-hidden rounded-xl bg-surface-3 lg:flex lg:flex-col",
        className,
      )}
    >
      <Image
        src={src}
        alt={imageAlt}
        fill
        sizes="50vw"
        className="object-cover"
        priority
      />

      {/* Legibility scrims: a soft overall tint plus gradients top and bottom. */}
      <div aria-hidden className="absolute inset-0 bg-black/15" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-end p-12">
        {/* Quote + stage rail. */}
        <div className="max-w-md space-y-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            {eyebrow}
          </p>
          <h2 className="text-[1.95rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white">
            {quote}
          </h2>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-white/60">
                  {stage}
                </span>
                {i < STAGES.length - 1 && (
                  <span aria-hidden className="text-white/40">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
