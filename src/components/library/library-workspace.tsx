"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownToLine, FileText, Link2, Plus, Workflow } from "lucide-react";
import { TopBar } from "@/components/shell/top-bar";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkflowTemplates } from "@/hooks/useWorkflowTemplates";
import { useFileComponents } from "@/hooks/useFileComponents";
import { useFileTemplates } from "@/hooks/useFileTemplates";
import { useCreateLibraryItem } from "@/hooks/useCreateLibraryItem";
import type {
  FileComponent,
  FileTemplate,
  LibraryKind,
  LibrarySort,
  WorkflowTemplate,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { DetailDrawer } from "./detail-drawer";
import { LibrarySection } from "./library-section";
import type { StatusFilter } from "./library-toolbar";

type TabState = { search: string; filter: StatusFilter; sort: LibrarySort };
const DEFAULT_TAB_STATE: TabState = { search: "", filter: "active", sort: "updated_desc" };

function isLibraryKind(v: string | null): v is LibraryKind {
  return v === "workflows" || v === "components" || v === "templates";
}

export function LibraryWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab: LibraryKind = isLibraryKind(searchParams.get("tab"))
    ? (searchParams.get("tab") as LibraryKind)
    : "workflows";

  const workflows = useWorkflowTemplates();
  const components = useFileComponents();
  const templates = useFileTemplates();
  const create = useCreateLibraryItem();

  const [tabState, setTabState] = useState<Record<LibraryKind, TabState>>({
    workflows: { ...DEFAULT_TAB_STATE },
    components: { ...DEFAULT_TAB_STATE },
    templates: { ...DEFAULT_TAB_STATE },
  });
  const [detail, setDetail] = useState<{ kind: LibraryKind; id: string } | null>(null);

  const setTab = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0 });
  };

  const patchTabState = (kind: LibraryKind, patch: Partial<TabState>) =>
    setTabState((s) => ({ ...s, [kind]: { ...s[kind], ...patch } }));

  const activeCount = (data: { status: string }[] | undefined) =>
    (data ?? []).filter((i) => i.status === "active").length;

  const detailItem = useMemo(() => {
    if (!detail) return null;
    const lists: Record<LibraryKind, (WorkflowTemplate | FileComponent | FileTemplate)[]> = {
      workflows: workflows.data ?? [],
      components: components.data ?? [],
      templates: templates.data ?? [],
    };
    return lists[detail.kind].find((i) => i.id === detail.id) ?? null;
  }, [detail, workflows.data, components.data, templates.data]);

  const newInActiveTab = () => create.mutate({ kind: tab, name: "Untitled" });

  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[{ label: "Library" }]}
      />
      <div className="mx-auto max-w-page px-[24px]">
        <PageHeader
          title="Library"
          subline="Reusable building blocks every product is assembled from — pipelines you run, files you share live, and starter files you seed from."
          actions={
            <>
              <Button variant="outline" size="sm">
                <ArrowDownToLine className="size-[13px]" strokeWidth={1.6} />
                Import
              </Button>
              <Button size="sm" onClick={newInActiveTab}>
                <Plus className="size-[13px]" strokeWidth={1.8} />
                New
              </Button>
            </>
          }
        />

        <Tabs value={tab} onValueChange={setTab} className="pb-[64px]">
          <TabsList className="mb-[20px] gap-[2px] rounded-[9px] border border-border bg-surface-3 p-[3px] group-data-[orientation=horizontal]/tabs:h-[36px]">
            <LibTabTrigger value="workflows" icon={<Workflow className="size-[13px]" />} label="Workflow templates" count={activeCount(workflows.data)} />
            <LibTabTrigger value="components" icon={<Link2 className="size-[13px]" />} label="File components" count={activeCount(components.data)} />
            <LibTabTrigger value="templates" icon={<FileText className="size-[13px]" />} label="File templates" count={activeCount(templates.data)} />
          </TabsList>

          <TabsContent value="workflows">
            <LibrarySection
              kind="workflows"
              query={workflows}
              search={tabState.workflows.search}
              onSearchChange={(v) => patchTabState("workflows", { search: v })}
              filter={tabState.workflows.filter}
              onFilterChange={(f) => patchTabState("workflows", { filter: f })}
              sort={tabState.workflows.sort}
              onSortChange={(s) => patchTabState("workflows", { sort: s })}
              onOpenDetail={(id) => setDetail({ kind: "workflows", id })}
            />
          </TabsContent>

          <TabsContent value="components">
            <LibrarySection
              kind="components"
              query={components}
              search={tabState.components.search}
              onSearchChange={(v) => patchTabState("components", { search: v })}
              filter={tabState.components.filter}
              onFilterChange={(f) => patchTabState("components", { filter: f })}
              sort={tabState.components.sort}
              onSortChange={(s) => patchTabState("components", { sort: s })}
              onOpenDetail={(id) => setDetail({ kind: "components", id })}
            />
          </TabsContent>

          <TabsContent value="templates">
            <LibrarySection
              kind="templates"
              query={templates}
              search={tabState.templates.search}
              onSearchChange={(v) => patchTabState("templates", { search: v })}
              filter={tabState.templates.filter}
              onFilterChange={(f) => patchTabState("templates", { filter: f })}
              sort={tabState.templates.sort}
              onSortChange={(s) => patchTabState("templates", { sort: s })}
              onOpenDetail={(id) => setDetail({ kind: "templates", id })}
            />
          </TabsContent>
        </Tabs>
      </div>

      <DetailDrawer
        kind={detail?.kind ?? null}
        item={detailItem}
        open={!!detail}
        onOpenChange={(o) => {
          if (!o) setDetail(null);
        }}
      />
    </main>
  );
}

function LibTabTrigger({
  value,
  icon,
  label,
  count,
}: {
  value: LibraryKind;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <TabsTrigger
      value={value}
      className="group/tab h-[30px] flex-none gap-[7px] rounded-[7px] px-[12px] py-0 text-[12.5px] font-medium text-zinc-500 data-[state=active]:border-border data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm"
    >
      {icon}
      {label}
      <span
        className={cn(
          "rounded-[3px] px-[5px] py-[1px] font-mono text-[10.5px] font-semibold tabular-nums",
          "bg-black/[0.04] text-zinc-400 group-data-[state=active]/tab:bg-surface-3 group-data-[state=active]/tab:text-zinc-700",
        )}
      >
        {count}
      </span>
    </TabsTrigger>
  );
}
