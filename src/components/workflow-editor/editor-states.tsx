"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Loading — a canvas skeleton (designed, not skipped). Mirrors the real layout:
// a header strip, a toolbar, then a laid-out spine of node-shaped placeholders.
export function EditorSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[58px] shrink-0 items-center gap-[14px] border-b border-border bg-surface px-[20px]">
        <div className="flex flex-col gap-[6px]">
          <Skeleton className="h-[18px] w-[220px]" />
          <Skeleton className="h-[10px] w-[120px]" />
        </div>
        <div className="flex-1" />
        <Skeleton className="h-[30px] w-[160px] rounded-md" />
        <Skeleton className="h-[30px] w-[92px] rounded-md" />
        <Skeleton className="h-[30px] w-[100px] rounded-md" />
      </div>

      <div
        className="relative flex-1"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e0e0db 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        <div className="absolute left-[12px] top-[12px] flex gap-[6px]">
          <Skeleton className="h-[30px] w-[120px] rounded-md" />
          <Skeleton className="h-[30px] w-[120px] rounded-md" />
        </div>

        <div className="flex h-full items-center gap-[40px] px-[64px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-[40px]">
              <div className="flex items-center gap-[8px] rounded-md border border-border bg-surface px-[10px] py-[10px] shadow-sm">
                <Skeleton className="size-[18px] rounded-full" />
                <Skeleton className="h-[12px] w-[96px]" />
                <Skeleton className="size-[20px] rounded-full" />
              </div>
              {i < 4 && <Skeleton className="h-[1.5px] w-[30px]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error — inline, retryable. Designed even though it is never triggered in this
// local-state build.
export function EditorError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[14px] px-[24px] text-center">
      <span className="inline-flex size-[44px] items-center justify-center rounded-full bg-coral-soft text-coral">
        <AlertTriangle className="size-[22px]" strokeWidth={1.8} />
      </span>
      <div className="flex flex-col gap-[4px]">
        <p className="text-[15px] font-semibold text-foreground">
          Не вдалося завантажити шаблон
        </p>
        <p className="max-w-[340px] text-[12.5px] leading-relaxed text-zinc-500">
          Сталася помилка під час відкриття полотна. Перевірте зʼєднання і
          спробуйте ще раз.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-[6px]">
        <RotateCcw className="size-[13px]" strokeWidth={1.8} />
        Спробувати знову
      </Button>
    </div>
  );
}
