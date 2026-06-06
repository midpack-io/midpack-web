"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Options = {
  min: number;
  maxFraction: number;
  storageKey: string;
  defaultWidth: number;
};

// Pointer-event-driven column resizer. Mirrors the inline script in
// design_handoff_midpack/prototypes/bundle-page/01-default-desktop.html
// (~lines 1560–1610): width = distance from cursor to container's right edge,
// clamped to [min, maxFraction × container width], persisted to localStorage,
// double-click resets to default. setPointerCapture keeps the drag alive when
// the cursor briefly leaves the 8px handle.
export function useColumnResize({
  min,
  maxFraction,
  storageKey,
  defaultWidth,
}: Options) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const [sideWidth, setSideWidth] = useState<number>(() => {
    if (typeof window === "undefined") return defaultWidth;
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? Number.parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) && parsed >= min ? parsed : defaultWidth;
  });
  const [isDragging, setIsDragging] = useState(false);

  // Clamp persisted width once the container has mounted and we know its size.
  // Without this, a stored 900px restores against an 800px container and the
  // left column collapses below zero before the user touches the handle.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const max = Math.max(min + 1, Math.floor(el.clientWidth * maxFraction));
    setSideWidth((w) => (w > max ? max : w < min ? min : w));
  }, [min, maxFraction]);

  const persist = useCallback(
    (w: number) => {
      try {
        window.localStorage.setItem(storageKey, String(w));
      } catch {
        // private mode / quota / SSR — fine to drop
      }
    },
    [storageKey],
  );

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.dataset.colResizing = "true";
    e.preventDefault();
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const raw = rect.right - e.clientX;
      const max = Math.max(min + 1, Math.floor(rect.width * maxFraction));
      const clamped = raw < min ? min : raw > max ? max : raw;
      setSideWidth(clamped);
    },
    [min, maxFraction],
  );

  const endDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    delete document.body.dataset.colResizing;
    setSideWidth((w) => {
      persist(w);
      return w;
    });
  }, [persist]);

  const onDoubleClick = useCallback(() => {
    setSideWidth(defaultWidth);
    persist(defaultWidth);
  }, [defaultWidth, persist]);

  return {
    containerRef,
    sideWidth,
    isDragging,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDoubleClick,
    },
  };
}
