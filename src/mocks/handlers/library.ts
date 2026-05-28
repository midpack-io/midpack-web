import { delay, http, HttpResponse } from "msw";
import type {
  FileComponent,
  FileKind,
  FileTemplate,
  LibraryItemStatus,
  LibraryKind,
  LibraryUsageRef,
  WorkflowTemplate,
} from "@/lib/api/types";
import {
  newWorkflowTemplateId,
  WORKFLOW_TEMPLATES,
  workflowTemplatesById,
  workflowUsage,
} from "../data/library-workflows";
import {
  FILE_COMPONENTS,
  fileComponentsById,
  fileComponentUsage,
  newFileComponentId,
} from "../data/library-components";
import {
  FILE_TEMPLATES,
  fileTemplatesById,
  fileTemplateUsage,
  newFileTemplateId,
} from "../data/library-templates";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

type LibRec = WorkflowTemplate | FileComponent | FileTemplate;

// The three library resources share one REST contract (/library/:kind), differing
// only in their store. A KindStore adapts each store to the generic handler so the
// route logic is written once. Stage-2 maps this to a /library/:kind controller.
interface KindStore {
  list(): LibRec[];
  get(id: string): LibRec | undefined;
  usage(id: string): LibraryUsageRef[];
  usageCount(id: string): number;
  create(name: string, kind: FileKind): LibRec;
  addVersion(id: string, note?: string): LibRec | null;
  rename(id: string, name: string): boolean;
  setStatus(id: string, status: LibraryItemStatus): boolean;
  remove(id: string): boolean;
}

function bumpVersion(current: string): string {
  const n = Number(current.replace(/\D/g, "")) || 0;
  return `v${n + 1}`;
}

const workflowsStore: KindStore = {
  list: () => WORKFLOW_TEMPLATES,
  get: (id) => workflowTemplatesById.get(id as never),
  usage: (id) => workflowUsage.get(id as never) ?? [],
  usageCount: (id) => workflowTemplatesById.get(id as never)?.usageActive ?? 0,
  create: (name) => {
    const now = new Date().toISOString();
    const item: WorkflowTemplate = {
      id: newWorkflowTemplateId(),
      name,
      status: "active",
      isDraft: true,
      stageCount: 2,
      reviewCount: 0,
      summary: "Draft",
      graph: {
        nodes: [
          { id: "s", x: 12, y: 32, kind: "start", label: "start" },
          { id: "e", x: 120, y: 32, kind: "stage", label: "end" },
        ],
        edges: [["s", "e"]],
      },
      usageActive: 0,
      updatedAt: now,
    };
    WORKFLOW_TEMPLATES.unshift(item);
    workflowTemplatesById.set(item.id, item);
    return item;
  },
  // Workflows use duplicate-to-fork, not a file-version chain.
  addVersion: () => null,
  rename: (id, name) => {
    const w = workflowTemplatesById.get(id as never);
    if (!w) return false;
    w.name = name;
    w.updatedAt = new Date().toISOString();
    return true;
  },
  setStatus: (id, status) => {
    const w = workflowTemplatesById.get(id as never);
    if (!w) return false;
    w.status = status;
    w.updatedAt = new Date().toISOString();
    return true;
  },
  remove: (id) => {
    const w = workflowTemplatesById.get(id as never);
    if (!w) return false;
    workflowTemplatesById.delete(id as never);
    const i = WORKFLOW_TEMPLATES.findIndex((x) => x.id === w.id);
    if (i !== -1) WORKFLOW_TEMPLATES.splice(i, 1);
    return true;
  },
};

const componentsStore: KindStore = {
  list: () => FILE_COMPONENTS,
  get: (id) => fileComponentsById.get(id as never),
  usage: (id) => fileComponentUsage.get(id as never) ?? [],
  usageCount: (id) => fileComponentsById.get(id as never)?.usageReferenced ?? 0,
  create: (name, kind) => {
    const now = new Date().toISOString();
    const item: FileComponent = {
      id: newFileComponentId(),
      name,
      kind,
      version: "v1",
      status: "active",
      usageReferenced: 0,
      versions: [{ version: "v1", uploadedAt: now, uploadedBy: "p-anna" as never, note: "Initial publish" }],
      updatedAt: now,
    };
    FILE_COMPONENTS.unshift(item);
    fileComponentsById.set(item.id, item);
    return item;
  },
  addVersion: (id, note) => {
    const c = fileComponentsById.get(id as never);
    if (!c) return null;
    const now = new Date().toISOString();
    c.version = bumpVersion(c.version);
    c.versions.push({ version: c.version, uploadedAt: now, uploadedBy: "p-anna" as never, note });
    c.updatedAt = now;
    return c;
  },
  rename: (id, name) => {
    const c = fileComponentsById.get(id as never);
    if (!c) return false;
    c.name = name;
    return true;
  },
  setStatus: (id, status) => {
    const c = fileComponentsById.get(id as never);
    if (!c) return false;
    c.status = status;
    c.updatedAt = new Date().toISOString();
    return true;
  },
  remove: (id) => {
    const c = fileComponentsById.get(id as never);
    if (!c) return false;
    fileComponentsById.delete(id as never);
    const i = FILE_COMPONENTS.findIndex((x) => x.id === c.id);
    if (i !== -1) FILE_COMPONENTS.splice(i, 1);
    return true;
  },
};

const templatesStore: KindStore = {
  list: () => FILE_TEMPLATES,
  get: (id) => fileTemplatesById.get(id as never),
  usage: (id) => fileTemplateUsage.get(id as never) ?? [],
  usageCount: (id) => fileTemplatesById.get(id as never)?.usageSeeded ?? 0,
  create: (name, kind) => {
    const now = new Date().toISOString();
    const item: FileTemplate = {
      id: newFileTemplateId(),
      name,
      kind,
      version: "v1",
      status: "active",
      usageSeeded: 0,
      versions: [{ version: "v1", uploadedAt: now, uploadedBy: "p-anna" as never, note: "Initial draft" }],
      updatedAt: now,
    };
    FILE_TEMPLATES.unshift(item);
    fileTemplatesById.set(item.id, item);
    return item;
  },
  addVersion: (id, note) => {
    const t = fileTemplatesById.get(id as never);
    if (!t) return null;
    const now = new Date().toISOString();
    t.version = bumpVersion(t.version);
    t.versions.push({ version: t.version, uploadedAt: now, uploadedBy: "p-anna" as never, note });
    t.updatedAt = now;
    return t;
  },
  rename: (id, name) => {
    const t = fileTemplatesById.get(id as never);
    if (!t) return false;
    t.name = name;
    return true;
  },
  setStatus: (id, status) => {
    const t = fileTemplatesById.get(id as never);
    if (!t) return false;
    t.status = status;
    t.updatedAt = new Date().toISOString();
    return true;
  },
  remove: (id) => {
    const t = fileTemplatesById.get(id as never);
    if (!t) return false;
    fileTemplatesById.delete(id as never);
    const i = FILE_TEMPLATES.findIndex((x) => x.id === t.id);
    if (i !== -1) FILE_TEMPLATES.splice(i, 1);
    return true;
  },
};

const STORES: Record<LibraryKind, KindStore> = {
  workflows: workflowsStore,
  components: componentsStore,
  templates: templatesStore,
};

function resolveStore(kind: string): KindStore | null {
  return (STORES as Record<string, KindStore>)[kind] ?? null;
}

const ALLOWED_KINDS: FileKind[] = ["pdf", "xlsx", "docx", "psd", "svg", "jpg", "png", "figma", "ase", "link"];

export const libraryHandlers = [
  http.get(`${BASE}/library/:kind`, async ({ params }) => {
    await delay(600);
    const store = resolveStore(params.kind as string);
    if (!store) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(store.list());
  }),

  http.get(`${BASE}/library/:kind/:id/usage`, async ({ params }) => {
    await delay(400);
    const store = resolveStore(params.kind as string);
    if (!store) return new HttpResponse(null, { status: 404 });
    if (!store.get(params.id as string)) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(store.usage(params.id as string));
  }),

  http.post(`${BASE}/library/:kind`, async ({ params, request }) => {
    await delay(900);
    const store = resolveStore(params.kind as string);
    if (!store) return new HttpResponse(null, { status: 404 });

    const form = await request.formData();
    const name = String(form.get("name") ?? "").trim();
    if (!name) return HttpResponse.json({ error: "name required" }, { status: 400 });
    const rawKind = String(form.get("kind") ?? "pdf");
    const kind = (ALLOWED_KINDS.includes(rawKind as FileKind) ? rawKind : "pdf") as FileKind;

    return HttpResponse.json(store.create(name, kind), { status: 201 });
  }),

  http.post(`${BASE}/library/:kind/:id/versions`, async ({ params, request }) => {
    await delay(900);
    const store = resolveStore(params.kind as string);
    if (!store) return new HttpResponse(null, { status: 404 });
    if (!store.get(params.id as string)) return new HttpResponse(null, { status: 404 });

    const form = await request.formData();
    const note = form.get("note") ? String(form.get("note")) : undefined;
    const updated = store.addVersion(params.id as string, note);
    if (!updated) {
      return HttpResponse.json(
        { error: "this resource does not support versions" },
        { status: 409 },
      );
    }
    return HttpResponse.json(updated, { status: 201 });
  }),

  http.patch(`${BASE}/library/:kind/:id`, async ({ params, request }) => {
    await delay(300);
    const store = resolveStore(params.kind as string);
    if (!store) return new HttpResponse(null, { status: 404 });
    const item = store.get(params.id as string);
    if (!item) return new HttpResponse(null, { status: 404 });

    const patch = (await request.json()) as {
      name?: string;
      status?: LibraryItemStatus;
    };
    if (typeof patch.name === "string") {
      const next = patch.name.trim();
      if (!next) return HttpResponse.json({ error: "name required" }, { status: 400 });
      store.rename(params.id as string, next);
    }
    if (patch.status === "active" || patch.status === "archived") {
      store.setStatus(params.id as string, patch.status);
    }
    // `item` is mutated in place by rename/setStatus, so it reflects the patch.
    return HttpResponse.json(item);
  }),

  http.delete(`${BASE}/library/:kind/:id`, async ({ params }) => {
    await delay(300);
    const store = resolveStore(params.kind as string);
    if (!store) return new HttpResponse(null, { status: 404 });
    const id = params.id as string;
    if (!store.get(id)) return new HttpResponse(null, { status: 404 });

    // Hard delete is guarded — only allowed when active usage is zero. Otherwise
    // the client is steered to Archive, with the usage list shown as the reason.
    if (store.usageCount(id) > 0) {
      return HttpResponse.json(
        { error: "in use — archive instead", usage: store.usage(id) },
        { status: 409 },
      );
    }
    store.remove(id);
    return new HttpResponse(null, { status: 204 });
  }),
];
