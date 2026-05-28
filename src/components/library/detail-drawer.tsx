"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLibraryUsage } from "@/hooks/useLibraryUsage";
import { useUpdateLibraryItem } from "@/hooks/useUpdateLibraryItem";
import { useDeleteLibraryItem } from "@/hooks/useDeleteLibraryItem";
import type {
  FileComponent,
  FileKind,
  FileTemplate,
  LibraryKind,
  WorkflowTemplate,
} from "@/lib/api/types";
import { extLabel, formatUpd, usageVerb } from "./lib";
import { BlueprintBadge, LiveBadge, WorkflowBadge } from "./type-badge";

type DetailItem = WorkflowTemplate | FileComponent | FileTemplate;

type DetailDrawerProps = {
  kind: LibraryKind | null;
  item: DetailItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DetailDrawer({ kind, item, open, onOpenChange }: DetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-[420px]">
        {kind && item ? (
          <DetailBody kind={kind} item={item} onClose={() => onOpenChange(false)} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function DetailBody({
  kind,
  item,
  onClose,
}: {
  kind: LibraryKind;
  item: DetailItem;
  onClose: () => void;
}) {
  const [name, setName] = useState(item.name);
  useEffect(() => setName(item.name), [item.id, item.name]);

  const update = useUpdateLibraryItem();
  const del = useDeleteLibraryItem();
  const usage = useLibraryUsage(kind, item.id);

  const usageCount =
    kind === "workflows"
      ? (item as WorkflowTemplate).usageActive
      : kind === "components"
        ? (item as FileComponent).usageReferenced
        : (item as FileTemplate).usageSeeded;
  const archived = item.status === "archived";
  const deleteBlocked = usageCount > 0;
  const isFile = kind !== "workflows";
  const versions = isFile ? (item as FileComponent | FileTemplate).versions : [];

  return (
    <>
      <SheetHeader className="gap-[10px] border-b border-border p-[20px]">
        <div className="flex items-center gap-[8px]">
          {kind === "workflows" && <WorkflowBadge />}
          {kind === "components" && <LiveBadge />}
          {kind === "templates" && <BlueprintBadge />}
          {isFile && (
            <>
              <span className="rounded-[3px] bg-surface-3 px-[5px] py-[1.5px] font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-zinc-700">
                {extLabel((item as FileComponent).kind as FileKind)}
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                {(item as FileComponent).version}
              </span>
            </>
          )}
        </div>
        <SheetTitle className="text-[16px]">{item.name}</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-[20px]">
        {/* Rename */}
        <section className="mb-[24px]">
          <h3 className="mb-[8px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em] text-zinc-400">
            Name
          </h3>
          <div className="flex items-center gap-[8px]">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[32px] text-[12.5px]"
            />
            <Button
              size="sm"
              disabled={!name.trim() || name.trim() === item.name || update.isPending}
              onClick={() =>
                update.mutate({ kind, id: item.id, patch: { name: name.trim() } })
              }
            >
              Save
            </Button>
          </div>
        </section>

        {/* Versions */}
        <section className="mb-[24px]">
          <h3 className="mb-[8px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em] text-zinc-400">
            Versions
          </h3>
          {kind === "workflows" ? (
            <p className="text-[12.5px] leading-[1.55] text-zinc-500">
              Workflow templates version by duplicate-to-fork — running products stay
              pinned to the template state they started with.
            </p>
          ) : (
            <ul className="flex flex-col gap-[2px]">
              {[...versions].reverse().map((v) => (
                <li
                  key={v.version}
                  className="flex items-center justify-between rounded-md px-[8px] py-[6px] hover:bg-surface-2"
                >
                  <span className="font-mono text-[12px] font-semibold text-foreground">
                    {v.version}
                  </span>
                  <span className="font-mono text-[10.5px] text-zinc-400">
                    {formatUpd(v.uploadedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Usage */}
        <section>
          <h3 className="mb-[8px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em] text-zinc-400">
            {usageCount} {usageVerb(kind)}
          </h3>
          {usage.isLoading && (
            <div className="flex flex-col gap-[6px]">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-[34px] w-full rounded-md" />
              ))}
            </div>
          )}
          {usage.isError && (
            <div className="flex flex-col items-start gap-[6px] text-[12px] text-zinc-500">
              <span>Couldn&apos;t load the usage list.</span>
              <button
                type="button"
                onClick={() => usage.refetch()}
                className="font-medium text-accent-strong hover:underline"
              >
                Retry
              </button>
            </div>
          )}
          {usage.data && usage.data.length === 0 && (
            <p className="text-[12.5px] text-zinc-500">No active products use this yet.</p>
          )}
          {usage.data?.map((ref) => (
            <div
              key={ref.productId}
              className="flex flex-col gap-[2px] rounded-md px-[8px] py-[6px] hover:bg-surface-2"
            >
              <span className="truncate text-[12.5px] font-medium text-foreground">
                {ref.productName}
              </span>
              <span className="truncate text-[11px] text-zinc-500">
                {ref.collectionName} · {ref.stage}
              </span>
            </div>
          ))}
          {usage.data && usage.data.length < usageCount && (
            <p className="px-[8px] py-[6px] text-[11px] text-zinc-400">
              Showing {usage.data.length} of {usageCount}.
            </p>
          )}
        </section>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[8px] border-t border-border bg-surface-2 p-[16px]">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            update.mutate({
              kind,
              id: item.id,
              patch: { status: archived ? "active" : "archived" },
            })
          }
        >
          {archived ? "Restore" : "Archive"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={deleteBlocked || del.isPending}
          title={deleteBlocked ? `In use by ${usageCount} — archive instead` : undefined}
          onClick={() =>
            del.mutate({ kind, id: item.id }, { onSuccess: onClose })
          }
        >
          Delete
        </Button>
        {deleteBlocked && (
          <span className="text-[11px] text-zinc-400">In use — archive instead.</span>
        )}
      </div>
    </>
  );
}
