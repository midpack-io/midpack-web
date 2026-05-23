"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  children: React.ReactNode;
  className?: string;
};

// Sticky shell shared by the filter bars on /collections and /products.
// Toggles bg from `bg-bg` to `bg-surface` once the page scrolls past the top
// bar (60px). Children render inside a max-page-width row with default gap.
export function FilterBar({ children, className }: FilterBarProps) {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-61px 0px 0px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <div
        className={cn(
          "sticky top-[60px] z-20 h-[46px] border-b border-border transition-colors duration-150",
          isStuck ? "bg-surface" : "bg-bg",
          className,
        )}
      >
        <div className="mx-auto flex h-full max-w-page items-center gap-[8px] px-[24px]">
          {children}
        </div>
      </div>
    </>
  );
}
