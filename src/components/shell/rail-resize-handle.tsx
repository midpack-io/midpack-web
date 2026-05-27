"use client";

import { useCallback, useEffect, useRef } from "react";

const MIN_WIDTH = 220;
const MAX_WIDTH = 420;
const DEFAULT_WIDTH = 256;
const STORAGE_KEY = "rail-width";

export function RailResizeHandle() {
  const handleRef = useRef<HTMLDivElement>(null);

  // Hydrate the persisted width onto :root once, after mount.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const n = parseInt(saved, 10);
      if (Number.isFinite(n) && n >= MIN_WIDTH && n <= MAX_WIDTH) {
        document.documentElement.style.setProperty("--rail-width", `${n}px`);
      }
    } catch {
      // ignore
    }
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue("--rail-width")
      .trim();
    const startW = parseInt(computed || `${DEFAULT_WIDTH}`, 10) || DEFAULT_WIDTH;
    const handle = handleRef.current;
    handle?.setAttribute("data-dragging", "true");
    document.body.classList.add("rail-resizing");

    function onMove(ev: MouseEvent) {
      const next = Math.max(
        MIN_WIDTH,
        Math.min(MAX_WIDTH, startW + (ev.clientX - startX)),
      );
      document.documentElement.style.setProperty("--rail-width", `${next}px`);
    }
    function onUp() {
      handle?.removeAttribute("data-dragging");
      document.body.classList.remove("rail-resizing");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      try {
        const current = document.documentElement.style
          .getPropertyValue("--rail-width")
          .trim();
        if (current) window.localStorage.setItem(STORAGE_KEY, current.replace("px", ""));
      } catch {
        // ignore
      }
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  const onDoubleClick = useCallback(() => {
    document.documentElement.style.removeProperty("--rail-width");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div
      ref={handleRef}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      className="group absolute top-0 right-[-3px] z-[25] h-full w-[6px] cursor-col-resize"
    >
      <span
        aria-hidden
        className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-transparent transition-[background,width] duration-150 group-hover:w-[2px] group-hover:bg-accent-strong group-data-[dragging=true]:w-[2px] group-data-[dragging=true]:bg-accent-strong"
      />
    </div>
  );
}
