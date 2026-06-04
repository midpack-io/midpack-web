"use client";

import { useMemo, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import type { UseQueryResult } from "@tanstack/react-query";
import { useCreateLibraryItem } from "@/hooks/useCreateLibraryItem";
import { useAddLibraryVersion } from "@/hooks/useAddLibraryVersion";
import { useUpdateLibraryItem } from "@/hooks/useUpdateLibraryItem";
import { useDeleteLibraryItem } from "@/hooks/useDeleteLibraryItem";
import type {
  FileComponent,
  FileTemplate,
  LibraryItemStatus,
  LibraryKind,
  LibrarySort,
  WorkflowTemplate,
} from "@/lib/api/types";
import { LibraryCard } from "./library-card";
import { LibraryDropZone } from "./library-drop-zone";
import { LibraryIntroCards } from "./library-intro-cards";
import {
  LibraryEmpty,
  LibraryError,
  LibraryGridSkeleton,
  LibraryNoResults,
} from "./library-states";
import { LibraryToolbar, type StatusFilter } from "./library-toolbar";
import { NewCard } from "./new-card";
import { kindFromFilename, MAX_UPLOAD_BYTES, nameWithoutExt } from "./lib";

type LibraryRecord = WorkflowTemplate | FileComponent | FileTemplate;

type LibrarySectionProps<T extends LibraryRecord> = {
  kind: LibraryKind;
  query: UseQueryResult<T[]>;
  search: string;
  onSearchChange: (v: string) => void;
  filter: StatusFilter;
  onFilterChange: (f: StatusFilter) => void;
  sort: LibrarySort;
  onSortChange: (s: LibrarySort) => void;
  onOpenDetail: (id: string) => void;
};

const SEARCH_PLACEHOLDER: Record<LibraryKind, string> = {
  workflows: "Search workflow templates…",
  components: "Search components…",
  templates: "Search templates…",
};

function usageOf(kind: LibraryKind, item: LibraryRecord): number {
  if (kind === "workflows") return (item as WorkflowTemplate).usageActive;
  if (kind === "components") return (item as FileComponent).usageReferenced;
  return (item as FileTemplate).usageSeeded;
}

export function LibrarySection<T extends LibraryRecord>({
  kind,
  query,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onOpenDetail,
}: LibrarySectionProps<T>) {
  const router = useRouter();
  const create = useCreateLibraryItem();
  const addVersion = useAddLibraryVersion();
  const update = useUpdateLibraryItem();
  const del = useDeleteLibraryItem();

  const [createError, setCreateError] = useState<string | null>(null);
  const [versionState, setVersionState] = useState<
    Record<string, { uploading: boolean; error: string | null }>
  >({});
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const all = query.data ?? [];

  const counts: Record<StatusFilter, number> = useMemo(
    () => ({
      active: all.filter((i) => i.status === "active").length,
      archived: all.filter((i) => i.status === "archived").length,
      all: all.length,
    }),
    [all],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = all.filter((item) => {
      const statusOk = filter === "all" ? true : item.status === filter;
      const searchOk = q === "" ? true : item.name.toLowerCase().includes(q);
      return statusOk && searchOk;
    });
    const sorted = [...filtered];
    if (sort === "name_asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "usage_desc") {
      sorted.sort((a, b) => usageOf(kind, b) - usageOf(kind, a));
    } else {
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    return sorted;
  }, [all, filter, search, sort, kind]);

  // ── Upload helpers ──────────────────────────────────────────────────────
  function validate(file: File): string | null {
    if (file.size > MAX_UPLOAD_BYTES) return "File is too large (max 25 MB).";
    if (!kindFromFilename(file.name)) return "Unsupported file type.";
    return null;
  }

  function createFromFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    const err = validate(file);
    if (err) {
      setCreateError(err);
      return;
    }
    setCreateError(null);
    create.mutate(
      {
        kind,
        name: nameWithoutExt(file.name),
        fileKind: kindFromFilename(file.name) ?? undefined,
        file,
      },
      { onError: () => setCreateError("Upload failed. Try again.") },
    );
  }

  function pasteLink(url: string) {
    setCreateError(null);
    const name = url.replace(/^https?:\/\//, "").slice(0, 48);
    create.mutate(
      { kind, name, fileKind: url.includes("figma") ? "figma" : "link" },
      { onError: () => setCreateError("Couldn't add link. Try again.") },
    );
  }

  function addVersionToCard(id: string, file: File) {
    const err = validate(file);
    if (err) {
      setVersionState((s) => ({ ...s, [id]: { uploading: false, error: err } }));
      return;
    }
    setVersionState((s) => ({ ...s, [id]: { uploading: true, error: null } }));
    addVersion.mutate(
      { kind, id, file },
      {
        onSuccess: () =>
          setVersionState((s) => ({ ...s, [id]: { uploading: false, error: null } })),
        onError: () =>
          setVersionState((s) => ({
            ...s,
            [id]: { uploading: false, error: "Upload failed." },
          })),
      },
    );
  }

  function cardDropHandlers(id: string) {
    return {
      onDragOver: (e: DragEvent) => {
        e.preventDefault();
        setDropTargetId(id);
      },
      onDragLeave: () => setDropTargetId((cur) => (cur === id ? null : cur)),
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        setDropTargetId(null);
        const file = Array.from(e.dataTransfer.files)[0];
        if (file) addVersionToCard(id, file);
      },
    };
  }

  const newItemName = kind === "workflows" ? "Untitled workflow" : "Untitled";
  const createNew = () => {
    setCreateError(null);
    create.mutate({ kind, name: newItemName });
  };

  // ── Render ─────────────────────────────────────────────────────────────
  const isFile = kind !== "workflows";

  return (
    <div>
      {isFile && (
        <LibraryIntroCards active={kind === "components" ? "components" : "templates"} />
      )}

      <LibraryToolbar
        searchPlaceholder={SEARCH_PLACEHOLDER[kind]}
        search={search}
        onSearchChange={onSearchChange}
        filter={filter}
        onFilterChange={onFilterChange}
        counts={counts}
        sort={sort}
        onSortChange={onSortChange}
      />

      {isFile && (
        <LibraryDropZone
          variant={kind === "components" ? "components" : "templates"}
          creating={create.isPending}
          createError={createError}
          onCreateFiles={createFromFiles}
          onPasteLink={kind === "components" ? pasteLink : undefined}
          onRetry={() => setCreateError(null)}
        />
      )}

      {query.isLoading ? (
        <LibraryGridSkeleton kind={kind} />
      ) : query.isError ? (
        <LibraryError onRetry={() => query.refetch()} />
      ) : all.length === 0 ? (
        <LibraryEmpty kind={kind} />
      ) : visible.length === 0 && !(kind === "workflows" && filter !== "archived") ? (
        <LibraryNoResults />
      ) : (
        <div
          className="grid gap-[12px]"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${isFile ? 280 : 360}px, 1fr))`,
          }}
        >
          {visible.map((item) => {
            const common = {
              onOpen: () => onOpenDetail(item.id),
              onRename: () => onOpenDetail(item.id),
              onDuplicate: () =>
                create.mutate({
                  kind,
                  name: `${item.name} copy`,
                  fileKind: isFile ? (item as FileComponent).kind : undefined,
                }),
              onArchiveToggle: () =>
                update.mutate({
                  kind,
                  id: item.id,
                  patch: {
                    status: (item.status === "archived"
                      ? "active"
                      : "archived") as LibraryItemStatus,
                  },
                }),
              onDelete: () => del.mutate({ kind, id: item.id }),
            };

            if (kind === "workflows") {
              return (
                <LibraryCard
                  key={item.id}
                  kind="workflows"
                  item={item as WorkflowTemplate}
                  {...common}
                  // Workflow cards open the canvas editor (per specs/library.md
                  // §4); the detail drawer stays for component/template cards.
                  onOpen={() => router.push(`/library/workflows/${item.id}`)}
                />
              );
            }

            const vs = versionState[item.id];
            const droppable = {
              dropActive: dropTargetId === item.id,
              uploading: vs?.uploading,
              uploadError: vs?.error ?? null,
              onRetry: () =>
                setVersionState((s) => ({
                  ...s,
                  [item.id]: { uploading: false, error: null },
                })),
              ...cardDropHandlers(item.id),
            };

            if (kind === "components") {
              return (
                <LibraryCard
                  key={item.id}
                  kind="components"
                  item={item as FileComponent}
                  {...droppable}
                  {...common}
                />
              );
            }
            return (
              <LibraryCard
                key={item.id}
                kind="templates"
                item={item as FileTemplate}
                {...droppable}
                {...common}
              />
            );
          })}

          {kind === "workflows" && filter !== "archived" && (
            <NewCard
              title="New workflow template"
              sub="Start blank or duplicate an existing one"
              onClick={createNew}
            />
          )}
        </div>
      )}
    </div>
  );
}
