"use client";

import { Check, ChevronDown, Copy, History, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TextEditable } from "@/components/ds/text-editable";
import { cn } from "@/lib/utils";
import { ImpactPreview } from "./impact-preview";
import type { WorkflowEditor } from "./use-workflow-editor";

export function EditorHeader({ editor }: { editor: WorkflowEditor }) {
  const { state, stageCount, reviewCount, canSave, canPublish, canRollback } = editor;
  const latest = state.revisions[state.revisions.length - 1];

  return (
    <header className="flex h-[58px] shrink-0 items-center gap-[16px] border-b border-border bg-surface px-[20px]">
      <div className="flex min-w-0 flex-col gap-[2px]">
        <div className="flex min-w-0 items-center gap-[9px]">
          <TextEditable
            value={state.name}
            onChange={editor.renameTemplate}
            ariaLabel="Назва шаблону"
            className="truncate text-[17px] font-semibold tracking-[-0.01em] text-foreground"
          />
          <StatusPill canSave={canSave} canPublish={canPublish} version={latest?.version ?? 1} />
        </div>
        <span className="font-mono text-[10.5px] tracking-[0.02em] text-zinc-400">
          {stageCount} {plural(stageCount, "етап", "етапи", "етапів")} ·{" "}
          {reviewCount === 0
            ? "лінійний"
            : `${reviewCount} ${plural(reviewCount, "перевірка", "перевірки", "перевірок")}`}
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex shrink-0 items-center gap-[8px]">
        <ImpactPreview hasUnpublishedChanges={canPublish} />

        <RevisionMenu editor={editor} disabled={!canRollback} />

        <Button variant="ghost" size="sm" onClick={editor.duplicate} className="gap-[6px] text-zinc-600">
          <Copy className="size-[13px]" strokeWidth={1.7} />
          Дублювати
        </Button>

        <span className="mx-[1px] h-[22px] w-px bg-border" aria-hidden />

        <Button
          variant="outline"
          size="sm"
          onClick={editor.save}
          disabled={!canSave}
          className="gap-[6px]"
        >
          <Check className="size-[13px]" strokeWidth={2} />
          Зберегти
        </Button>

        <Button size="sm" onClick={editor.publish} disabled={!canPublish} className="gap-[6px]">
          <UploadCloud className="size-[14px]" strokeWidth={1.8} />
          Опублікувати
        </Button>
      </div>
    </header>
  );
}

function StatusPill({
  canSave,
  canPublish,
  version,
}: {
  canSave: boolean;
  canPublish: boolean;
  version: number;
}) {
  let dot = "bg-ok";
  let text = `Опубліковано · v${version}`;
  let cls = "text-zinc-500";
  if (canSave) {
    dot = "bg-warn";
    text = "Незбережені зміни";
    cls = "text-warn";
  } else if (canPublish) {
    dot = "bg-warn";
    text = "Збережено, не опубліковано";
    cls = "text-zinc-500";
  }
  return (
    <span className={cn("inline-flex items-center gap-[5px] text-[11px] font-medium leading-none", cls)}>
      <span className={cn("size-[6px] rounded-full", dot)} aria-hidden />
      {text}
    </span>
  );
}

function RevisionMenu({ editor, disabled }: { editor: WorkflowEditor; disabled: boolean }) {
  const revisions = [...editor.state.revisions].reverse();
  const latestVersion = editor.state.revisions[editor.state.revisions.length - 1]?.version;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="gap-[6px] text-zinc-600"
          title={disabled ? "Зʼявиться після другої публікації" : "Історія ревізій"}
        >
          <History className="size-[13px]" strokeWidth={1.7} />
          Ревізії
          <ChevronDown className="size-[12px] text-zinc-400" strokeWidth={1.8} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[268px]">
        <DropdownMenuLabel className="text-[11px] font-semibold text-zinc-500">
          Відновити ревізію
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {revisions.map((rev) => {
          const isLatest = rev.version === latestVersion;
          return (
            <DropdownMenuItem
              key={rev.version}
              onSelect={() => editor.rollback(rev.version)}
              className="flex items-start gap-[10px] py-[8px]"
            >
              <span className="mt-[1px] inline-flex h-[20px] min-w-[30px] items-center justify-center rounded-[5px] bg-surface-3 px-[6px] font-mono text-[10.5px] font-semibold text-zinc-700">
                v{rev.version}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-[12px] leading-tight text-foreground">
                  {formatRev(rev.publishedAt)}
                </span>
                <span className="truncate text-[10.5px] leading-tight text-zinc-400">
                  {rev.note ?? `${rev.graph.nodes.filter((n) => n.kind !== "start").length} етапів`}
                </span>
              </div>
              {isLatest && (
                <span className="mt-[2px] shrink-0 rounded-[4px] bg-ok-soft px-[5px] py-[1px] font-mono text-[8.5px] font-semibold uppercase tracking-[0.03em] text-ok">
                  поточна
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Russian/Ukrainian-style 3-form plural selector.
function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function formatRev(iso: string): string {
  // Deterministic dd.mm.yyyy · hh:mm — no locale dependency, no hydration drift.
  const d = new Date(iso);
  const p = (x: number) => String(x).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} · ${p(d.getHours())}:${p(d.getMinutes())}`;
}
