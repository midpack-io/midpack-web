"use client";

import { forwardRef, useEffect, useState, type ComponentPropsWithoutRef } from "react";
import {
  ChevronDown,
  FileText,
  Link2,
  Trash2,
  X,
} from "lucide-react";
import { AvatarDot, PersonPicker } from "@/components/ds/person-picker";
import { TextEditable } from "@/components/ds/text-editable";
import { Switch } from "@/components/ui/switch";
import { usePeople } from "@/hooks/usePeople";
import type { Person, PersonId } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { LibraryAttachPicker } from "./library-attach-picker";
import {
  SAMPLE_LIBRARY_COMPONENTS,
  SAMPLE_LIBRARY_TEMPLATES,
} from "./sample-data";
import type { AttachedTemplate, EditorNode } from "./types";
import type { WorkflowEditor } from "./use-workflow-editor";

// A non-modal slide-in inspector. The canvas stays visible and interactive on
// the left; every edit here mirrors the node and updates local state.
export function NodeInspector({
  editor,
  node,
}: {
  editor: WorkflowEditor;
  node: EditorNode | null;
}) {
  const open = !!node;
  // Retain the last node so the panel keeps its content while it slides out,
  // instead of blanking the instant the selection clears.
  const [shown, setShown] = useState<EditorNode | null>(node);
  useEffect(() => {
    if (node) setShown(node);
  }, [node]);
  return (
    <aside
      aria-hidden={!open}
      className={cn(
        "absolute inset-y-0 right-0 z-20 flex w-[348px] flex-col border-l border-border bg-surface shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        open ? "translate-x-0" : "pointer-events-none translate-x-full",
      )}
    >
      {shown && <InspectorBody key={shown.id} editor={editor} node={shown} />}
    </aside>
  );
}

function InspectorBody({
  editor,
  node,
}: {
  editor: WorkflowEditor;
  node: EditorNode;
}) {
  const isStart = node.kind === "start";
  const isReview = node.kind === "review";

  const attachedTemplateIds = new Set((node.templateFiles ?? []).map((t) => t.id));
  const attachedComponentIds = new Set((node.components ?? []).map((c) => c.id));
  const templateOptions = SAMPLE_LIBRARY_TEMPLATES.filter(
    (t) => !attachedTemplateIds.has(t.id),
  );
  const componentOptions = SAMPLE_LIBRARY_COMPONENTS.filter(
    (c) => !attachedComponentIds.has(c.id),
  );

  // On the start node, attached templates are general (seed every stage); on a
  // stage they follow the won't-seed / required / copy-on-use rules.
  const templateAnnotation = (t: AttachedTemplate): Annotation =>
    isStart
      ? { text: "загальний · усі етапи", tone: "neutral" }
      : !node.isFilesExpected
        ? { text: "не засіється", tone: "muted" }
        : t.required
          ? { text: "обовʼязковий", tone: "warn" }
          : { text: "blueprint · copy-on-use", tone: "neutral" };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-[8px] border-b border-border px-[16px] py-[12px]">
        <KindChip kind={node.kind} />
        <span className="flex-1" />
        <button
          type="button"
          aria-label="Закрити панель"
          onClick={() => editor.selectNode(null)}
          className="inline-flex size-[26px] items-center justify-center rounded-md text-zinc-500 outline-none transition-colors hover:bg-surface-3 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-accent-ring"
        >
          <X className="size-[15px]" strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-[16px] py-[16px]">
        {/* Name */}
        <Field label={isStart ? "Назва" : "Назва етапу"}>
          <TextEditable
            value={node.label ?? ""}
            onChange={(v) => editor.renameNode(node.id, v)}
            ariaLabel="Назва етапу"
            className="text-[15px] font-semibold text-foreground"
          />
        </Field>

        {isStart ? (
          <p className="rounded-md border border-border bg-surface-2 px-[12px] py-[10px] text-[12px] leading-relaxed text-zinc-500">
            Точка входу пайплайну. Прикріплені тут файли — загальні: шаблони й
            компоненти, доступні всім етапам. У старту немає виконавця.
          </p>
        ) : (
          <>
            {/* Performer */}
            <Field label="Виконавець">
              <PerformerRow
                performerId={node.performerId}
                onChange={(next) => editor.setPerformer(node.id, next)}
              />
            </Field>

            {/* Review toggle */}
            <ToggleRow
              label="Етап-перевірка"
              hint="Помаранчевий акцент — рев'ю/апрув, не звичайна робота."
              checked={isReview}
              onCheckedChange={() => editor.toggleReview(node.id)}
              accent="warn"
            />

            {/* Description */}
            <Field label="Опис">
              <DescriptionField
                value={node.description ?? ""}
                onCommit={(v) => editor.setDescription(node.id, v)}
              />
            </Field>

            {/* is_files_expected */}
            <ToggleRow
              label="Очікуються файли"
              hint="Коли продукт входить у цей етап, шаблони засівають слоти."
              checked={!!node.isFilesExpected}
              onCheckedChange={() => editor.toggleFilesExpected(node.id)}
            />
          </>
        )}

        {/* Templates — "expected files" per stage, or general/shared on start */}
        <section className="flex flex-col gap-[8px]">
          <SectionHead
            icon={<FileText className="size-[12px]" strokeWidth={1.8} />}
            title={isStart ? "Загальні шаблони" : "Очікувані файли"}
            sub={isStart ? "Засіваються в усі етапи" : "Шаблони — копіюються в продукт"}
          />
          {(node.templateFiles ?? []).length === 0 ? (
            <EmptyHint>
              {isStart
                ? "Жодного загального шаблону не прикріплено."
                : "Жодного шаблону не прикріплено."}
            </EmptyHint>
          ) : (
            <ul className="flex flex-col gap-[5px]">
              {(node.templateFiles ?? []).map((t) => (
                <AttachmentRow
                  key={t.id}
                  kind={t.kind ?? "pdf"}
                  name={t.name}
                  annotation={templateAnnotation(t)}
                  onRemove={() => editor.detachTemplate(node.id, t.id)}
                />
              ))}
            </ul>
          )}
          <LibraryAttachPicker
            label={isStart ? "Додати загальний шаблон" : "Додати з бібліотеки"}
            accent="indigo"
            items={templateOptions.map((t) => ({
              id: t.id,
              name: t.name,
              kind: t.kind,
              meta: t.required ? "обовʼязковий шаблон" : "шаблон",
            }))}
            onPick={(item) =>
              editor.attachTemplate(node.id, {
                id: item.id,
                name: item.name,
                kind: item.kind,
                required: SAMPLE_LIBRARY_TEMPLATES.find((s) => s.id === item.id)?.required,
              })
            }
          />
        </section>

        {/* Linked components — live shared references */}
        <section className="flex flex-col gap-[8px]">
          <SectionHead
            icon={<Link2 className="size-[12px]" strokeWidth={1.8} />}
            title={isStart ? "Загальні компоненти" : "Звʼязані компоненти"}
            sub={
              isStart
                ? "Живі посилання для всіх етапів"
                : "Живі посилання — редагуються у джерелі"
            }
          />
          {(node.components ?? []).length === 0 ? (
            <EmptyHint>
              {isStart
                ? "Жодного загального компонента не звʼязано."
                : "Жодного компонента не звʼязано."}
            </EmptyHint>
          ) : (
            <ul className="flex flex-col gap-[5px]">
              {(node.components ?? []).map((c) => (
                <AttachmentRow
                  key={c.id}
                  kind={c.kind ?? "pdf"}
                  name={c.name}
                  sub={c.sourceLabel}
                  annotation={{ text: "live · referenced", tone: "violet" }}
                  onRemove={() => editor.detachComponent(node.id, c.id)}
                />
              ))}
            </ul>
          )}
          <LibraryAttachPicker
            label={isStart ? "Звʼязати загальний компонент" : "Звʼязати компонент"}
            accent="violet"
            items={componentOptions.map((c) => ({
              id: c.id,
              name: c.name,
              kind: c.kind,
              meta: c.sourceLabel,
            }))}
            onPick={(item) => {
              const src = SAMPLE_LIBRARY_COMPONENTS.find((s) => s.id === item.id);
              editor.attachComponent(node.id, {
                id: item.id,
                name: item.name,
                kind: item.kind,
                sourceLabel: src?.sourceLabel ?? item.name,
              });
            }}
          />
        </section>
      </div>

      {/* Footer — delete */}
      {!isStart && (
        <div className="border-t border-border px-[16px] py-[12px]">
          <button
            type="button"
            onClick={() => editor.deleteNode(node.id)}
            className="inline-flex h-[32px] w-full items-center justify-center gap-[7px] rounded-md border border-border bg-surface text-[12.5px] font-medium text-coral outline-none transition-colors hover:border-coral-ring hover:bg-coral-soft focus-visible:ring-[3px] focus-visible:ring-coral-ring"
          >
            <Trash2 className="size-[13px]" strokeWidth={1.8} />
            Видалити етап
          </button>
          <p className="mt-[6px] text-center text-[10.5px] leading-relaxed text-zinc-400">
            Прикріплені файли відʼєднуються; самі елементи бібліотеки лишаються.
          </p>
        </div>
      )}
    </>
  );
}

// ── Pieces ───────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.07em] text-zinc-400">
      {children}
    </span>
  );
}

function SectionHead({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-[7px]">
      <span className="inline-flex size-[20px] items-center justify-center rounded-[5px] bg-surface-3 text-zinc-500">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-[12px] font-semibold leading-tight text-foreground">
          {title}
        </span>
        <span className="text-[10.5px] leading-tight text-zinc-400">{sub}</span>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onCheckedChange,
  accent,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: () => void;
  accent?: "warn";
}) {
  return (
    <label className="flex cursor-pointer items-start gap-[10px]">
      <div className="flex flex-1 flex-col gap-[2px]">
        <span className="text-[12.5px] font-medium leading-none text-foreground">
          {label}
        </span>
        <span className="text-[10.5px] leading-snug text-zinc-400">{hint}</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          "mt-[1px]",
          accent === "warn" && "data-[state=checked]:bg-warn",
        )}
      />
    </label>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border bg-surface-2 px-[10px] py-[8px] text-[11px] text-zinc-400">
      {children}
    </p>
  );
}

type Annotation = {
  text: string;
  tone: "muted" | "warn" | "neutral" | "violet";
};

function AttachmentRow({
  kind,
  name,
  sub,
  annotation,
  onRemove,
}: {
  kind: string;
  name: string;
  sub?: string;
  annotation: Annotation;
  onRemove: () => void;
}) {
  const toneClass: Record<Annotation["tone"], string> = {
    muted: "bg-surface-3 text-zinc-400 line-through decoration-zinc-300",
    warn: "bg-warn-soft text-warn",
    neutral: "bg-surface-3 text-zinc-500",
    violet: "bg-linked-soft text-linked-ink",
  };
  return (
    <li className="group/att flex items-center gap-[8px] rounded-md border border-border bg-surface px-[8px] py-[7px]">
      <span className="inline-flex shrink-0 rounded-[3px] bg-surface-3 px-[5px] py-[2px] font-mono text-[9px] font-semibold uppercase tracking-[0.04em] text-zinc-600">
        {kind}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[12px] leading-tight text-foreground">{name}</span>
        {sub && <span className="truncate text-[10px] leading-tight text-zinc-400">{sub}</span>}
      </div>
      <span
        className={cn(
          "shrink-0 rounded-[4px] px-[5px] py-[2px] font-mono text-[8.5px] font-semibold uppercase tracking-[0.03em]",
          toneClass[annotation.tone],
        )}
      >
        {annotation.text}
      </span>
      <button
        type="button"
        aria-label={`Відʼєднати ${name}`}
        onClick={onRemove}
        className="inline-flex size-[20px] shrink-0 items-center justify-center rounded-[5px] text-zinc-300 outline-none transition-colors hover:bg-surface-3 hover:text-coral focus-visible:ring-[2px] focus-visible:ring-accent-ring/70"
      >
        <X className="size-[12px]" strokeWidth={2} />
      </button>
    </li>
  );
}

function KindChip({ kind }: { kind: EditorNode["kind"] }) {
  const map = {
    start: { label: "Старт", cls: "bg-surface-3 text-zinc-600" },
    stage: { label: "Етап", cls: "bg-todo-soft text-todo" },
    review: { label: "Перевірка", cls: "bg-warn-soft text-warn" },
  } as const;
  const { label, cls } = map[kind];
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-chip px-[8px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.04em]",
        cls,
      )}
    >
      {label}
    </span>
  );
}

function PerformerRow({
  performerId,
  onChange,
}: {
  performerId?: PersonId | "unassigned";
  onChange: (next: PersonId | "unassigned") => void;
}) {
  const people = usePeople();
  const person =
    performerId && performerId !== "unassigned"
      ? people.data?.find((p) => p.id === performerId)
      : undefined;
  return (
    <PersonPicker value={performerId ?? "unassigned"} onChange={onChange} align="start">
      <PerformerRowTrigger person={person} />
    </PersonPicker>
  );
}

const PerformerRowTrigger = forwardRef<
  HTMLButtonElement,
  { person?: Person } & ComponentPropsWithoutRef<"button">
>(function PerformerRowTrigger({ person, className, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-[36px] items-center gap-[8px] rounded-md border border-border bg-surface px-[8px] text-left outline-none transition-colors hover:border-zinc-400 hover:bg-surface-2 focus-visible:ring-[3px] focus-visible:ring-accent-ring",
        className,
      )}
      {...rest}
    >
      {person ? (
        <>
          <AvatarDot person={person} size={22} />
          <span className="flex-1 truncate text-[12.5px] text-foreground">{person.name}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-zinc-400">
            {person.role}
          </span>
        </>
      ) : (
        <>
          <span
            aria-hidden
            className="size-[22px] shrink-0 rounded-full border border-dashed border-border-strong bg-surface-3"
          />
          <span className="flex-1 text-[12.5px] text-zinc-400">Не призначено</span>
        </>
      )}
      <ChevronDown className="size-[14px] shrink-0 text-zinc-400" strokeWidth={1.8} />
    </button>
  );
});

function DescriptionField({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (v: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <textarea
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft.trim() !== value) onCommit(draft.trim());
      }}
      rows={2}
      placeholder="Коротко про етап (необовʼязково)…"
      className="resize-none rounded-md border border-border bg-surface px-[10px] py-[8px] text-[12px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-zinc-400 hover:border-zinc-400 focus:border-accent-ring focus:ring-[3px] focus:ring-accent-ring/40"
    />
  );
}
