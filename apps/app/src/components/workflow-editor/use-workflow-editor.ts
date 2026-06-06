"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PersonId } from "@/lib/api/types";
import { cloneGraph, layoutGraph } from "./layout";
import {
  SAMPLE_BASELINE_REVISION,
  SAMPLE_GRAPH,
  SAMPLE_TEMPLATE_NAME,
} from "./sample-data";
import type {
  AttachedComponent,
  AttachedTemplate,
  EditorGraph,
  EditorNode,
  EditorState,
} from "./types";

// All interactions mutate local React state. No fetch, no hooks, no
// persistence — a page reload resets to the sample (expected for this build).

function initialState(): EditorState {
  return {
    name: SAMPLE_TEMPLATE_NAME,
    graph: layoutGraph(SAMPLE_GRAPH),
    revisions: [SAMPLE_BASELINE_REVISION],
    dirty: false,
    hasUnpublishedChanges: false,
    selectedId: null,
    enteringId: null,
  };
}

export type WorkflowEditor = ReturnType<typeof useWorkflowEditor>;

export function useWorkflowEditor() {
  const [state, setState] = useState<EditorState>(initialState);
  const [flash, setFlash] = useState<string | null>(null);
  const idSeq = useRef(1);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reflowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const newId = () => `n-${idSeq.current++}`;

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
      if (enterTimer.current) clearTimeout(enterTimer.current);
      if (reflowTimer.current) clearTimeout(reflowTimer.current);
    },
    [],
  );

  // Re-run the layered layout on the next tick. Add/insert seed a node at an
  // off-column position first; this delayed reflow then lets the CSS transition
  // (.react-flow__node) ease it — and the nodes it displaces — into place.
  const scheduleReflow = useCallback(() => {
    if (reflowTimer.current) clearTimeout(reflowTimer.current);
    reflowTimer.current = setTimeout(() => {
      setState((s) => ({ ...s, graph: layoutGraph(s.graph) }));
    }, 30);
  }, []);

  const toast = useCallback((message: string) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlash(message);
    flashTimer.current = setTimeout(() => setFlash(null), 3200);
  }, []);

  // Any structural / config edit routes through here so the dirty +
  // unpublished flags stay honest across every mutation.
  const edit = useCallback(
    (fn: (g: EditorGraph) => EditorGraph, patch?: Partial<EditorState>) => {
      setState((s) => ({
        ...s,
        graph: fn(s.graph),
        dirty: true,
        hasUnpublishedChanges: true,
        ...patch,
      }));
    },
    [],
  );

  const markEntering = useCallback((id: string) => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    enterTimer.current = setTimeout(() => {
      setState((s) => (s.enteringId === id ? { ...s, enteringId: null } : s));
    }, 520);
  }, []);

  const patchNode = useCallback(
    (id: string, patch: Partial<EditorNode>) => {
      edit((g) => ({
        ...g,
        nodes: g.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      }));
    },
    [edit],
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectNode = useCallback((id: string | null) => {
    setState((s) => ({ ...s, selectedId: id }));
  }, []);

  // ── Position (free drag) ───────────────────────────────────────────────────
  const moveNode = useCallback(
    (id: string, x: number, y: number) => {
      edit((g) => ({
        ...g,
        nodes: g.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
      }));
    },
    [edit],
  );

  // ── Add / insert / connect / delete ───────────────────────────────────────
  const addNode = useCallback(() => {
    const id = newId();
    setState((s) => {
      const anchor =
        (s.selectedId && s.graph.nodes.find((n) => n.id === s.selectedId)) ||
        // else attach after a sink (a node with no outgoing edge)
        s.graph.nodes.find(
          (n) => !s.graph.edges.some((e) => e[0] === n.id),
        ) ||
        s.graph.nodes[s.graph.nodes.length - 1];
      const node: EditorNode = {
        id,
        kind: "stage",
        label: "Новий етап",
        // Seed slightly below/right of the anchor; scheduleReflow eases it home.
        x: (anchor?.x ?? 0) + 150,
        y: (anchor?.y ?? 220) + 70,
        isFilesExpected: true,
      };
      const edges = anchor
        ? [...s.graph.edges, [anchor.id, id] as [string, string]]
        : s.graph.edges;
      return {
        ...s,
        graph: { nodes: [...s.graph.nodes, node], edges },
        dirty: true,
        hasUnpublishedChanges: true,
        selectedId: id,
        enteringId: id,
      };
    });
    markEntering(id);
    scheduleReflow();
  }, [markEntering, scheduleReflow]);

  // Insert a node onto an edge [a,b]: rewrite to [a,n] + [n,b]. The new node is
  // seeded at the edge midpoint so the eased re-layout reads as it sliding into
  // its column ("add a lab-dip stage in 2 minutes").
  const insertBetween = useCallback(
    (edge: [string, string]) => {
      const id = newId();
      setState((s) => {
        const [a, b] = edge;
        const na = s.graph.nodes.find((n) => n.id === a);
        const nb = s.graph.nodes.find((n) => n.id === b);
        const node: EditorNode = {
          id,
          kind: "stage",
          label: "Новий етап",
          x: na && nb ? (na.x + nb.x) / 2 : (na?.x ?? 0) + 124,
          y: na && nb ? (na.y + nb.y) / 2 : na?.y ?? 220,
          isFilesExpected: true,
        };
        const edges = s.graph.edges
          .filter((e) => !(e[0] === a && e[1] === b))
          .concat([
            [a, id],
            [id, b],
          ] as [string, string][]);
        return {
          ...s,
          graph: { nodes: [...s.graph.nodes, node], edges },
          dirty: true,
          hasUnpublishedChanges: true,
          selectedId: id,
          enteringId: id,
        };
      });
      markEntering(id);
      scheduleReflow();
    },
    [markEntering, scheduleReflow],
  );

  const connect = useCallback(
    (from: string, to: string) => {
      if (from === to) return;
      edit((g) => {
        const exists = g.edges.some((e) => e[0] === from && e[1] === to);
        if (exists) return g;
        return { ...g, edges: [...g.edges, [from, to] as [string, string]] };
      });
    },
    [edit],
  );

  const deleteNode = useCallback(
    (id: string) => {
      setState((s) => {
        const node = s.graph.nodes.find((n) => n.id === id);
        if (!node || node.kind === "start") return s; // never drop the entry
        return {
          ...s,
          graph: {
            nodes: s.graph.nodes.filter((n) => n.id !== id),
            edges: s.graph.edges.filter((e) => e[0] !== id && e[1] !== id),
          },
          dirty: true,
          hasUnpublishedChanges: true,
          selectedId: s.selectedId === id ? null : s.selectedId,
        };
      });
    },
    [],
  );

  const deleteEdge = useCallback(
    (edge: [string, string]) => {
      edit((g) => ({
        ...g,
        edges: g.edges.filter((e) => !(e[0] === edge[0] && e[1] === edge[1])),
      }));
    },
    [edit],
  );

  // ── Node config ────────────────────────────────────────────────────────────
  const renameNode = useCallback(
    (id: string, label: string) => patchNode(id, { label }),
    [patchNode],
  );
  const setPerformer = useCallback(
    (id: string, performerId: PersonId | "unassigned") =>
      patchNode(id, { performerId }),
    [patchNode],
  );
  const setDescription = useCallback(
    (id: string, description: string) => patchNode(id, { description }),
    [patchNode],
  );
  const toggleReview = useCallback(
    (id: string) => {
      edit((g) => ({
        ...g,
        nodes: g.nodes.map((n) =>
          n.id === id && n.kind !== "start"
            ? { ...n, kind: n.kind === "review" ? "stage" : "review" }
            : n,
        ),
      }));
    },
    [edit],
  );
  const toggleFilesExpected = useCallback(
    (id: string) => {
      edit((g) => ({
        ...g,
        nodes: g.nodes.map((n) =>
          n.id === id ? { ...n, isFilesExpected: !n.isFilesExpected } : n,
        ),
      }));
    },
    [edit],
  );

  // ── File attachments ───────────────────────────────────────────────────────
  const attachTemplate = useCallback(
    (id: string, tpl: AttachedTemplate) => {
      edit((g) => ({
        ...g,
        nodes: g.nodes.map((n) =>
          n.id === id
            ? {
                ...n,
                templateFiles: (n.templateFiles ?? []).some((t) => t.id === tpl.id)
                  ? n.templateFiles
                  : [...(n.templateFiles ?? []), tpl],
              }
            : n,
        ),
      }));
    },
    [edit],
  );
  const detachTemplate = useCallback(
    (id: string, tplId: string) => {
      edit((g) => ({
        ...g,
        nodes: g.nodes.map((n) =>
          n.id === id
            ? { ...n, templateFiles: (n.templateFiles ?? []).filter((t) => t.id !== tplId) }
            : n,
        ),
      }));
    },
    [edit],
  );
  const attachComponent = useCallback(
    (id: string, comp: AttachedComponent) => {
      edit((g) => ({
        ...g,
        nodes: g.nodes.map((n) =>
          n.id === id
            ? {
                ...n,
                components: (n.components ?? []).some((c) => c.id === comp.id)
                  ? n.components
                  : [...(n.components ?? []), comp],
              }
            : n,
        ),
      }));
    },
    [edit],
  );
  const detachComponent = useCallback(
    (id: string, compId: string) => {
      edit((g) => ({
        ...g,
        nodes: g.nodes.map((n) =>
          n.id === id
            ? { ...n, components: (n.components ?? []).filter((c) => c.id !== compId) }
            : n,
        ),
      }));
    },
    [edit],
  );

  // ── Canvas ─────────────────────────────────────────────────────────────────
  const relayout = useCallback(() => {
    setState((s) => ({ ...s, graph: layoutGraph(s.graph) }));
  }, []);

  // ── Template-level ─────────────────────────────────────────────────────────
  const renameTemplate = useCallback((name: string) => {
    setState((s) => ({ ...s, name, dirty: true, hasUnpublishedChanges: true }));
  }, []);

  const save = useCallback(() => {
    setState((s) => (s.dirty ? { ...s, dirty: false } : s));
    toast("Чернетку збережено");
  }, [toast]);

  const publish = useCallback(() => {
    setState((s) => {
      if (!s.hasUnpublishedChanges) return s;
      const version = s.revisions.length + 1;
      const revision = {
        version,
        name: s.name,
        graph: cloneGraph(s.graph),
        publishedAt: new Date().toISOString(),
      };
      return {
        ...s,
        revisions: [...s.revisions, revision],
        dirty: false,
        hasUnpublishedChanges: false,
      };
    });
    toast("Опубліковано — продукти в роботі лишились на своїх ревізіях");
  }, [toast]);

  const rollback = useCallback(
    (version: number) => {
      setState((s) => {
        const rev = s.revisions.find((r) => r.version === version);
        if (!rev) return s;
        return {
          ...s,
          name: rev.name,
          graph: cloneGraph(rev.graph),
          // The user reviews the restored draft, then re-publishes.
          dirty: true,
          hasUnpublishedChanges: true,
          selectedId: null,
        };
      });
      toast(`Відновлено ревізію v${version} — перегляньте та опублікуйте знову`);
    },
    [toast],
  );

  const duplicate = useCallback(() => {
    // UI-only clone-to-fork: a copied draft would open in its own route once the
    // data layer exists. Here we acknowledge the fork without destroying state.
    toast(`Дубльовано «${state.name}» → «${state.name} copy» (чернетка)`);
  }, [state.name, toast]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const stageCount = useMemo(
    () => state.graph.nodes.filter((n) => n.kind !== "start").length,
    [state.graph.nodes],
  );
  const reviewCount = useMemo(
    () => state.graph.nodes.filter((n) => n.kind === "review").length,
    [state.graph.nodes],
  );
  const selectedNode = useMemo(
    () => state.graph.nodes.find((n) => n.id === state.selectedId) ?? null,
    [state.graph.nodes, state.selectedId],
  );

  return {
    state,
    flash,
    notify: toast,
    selectedNode,
    stageCount,
    reviewCount,
    canSave: state.dirty,
    canPublish: state.hasUnpublishedChanges,
    canRollback: state.revisions.length >= 2,
    // actions
    selectNode,
    moveNode,
    addNode,
    insertBetween,
    connect,
    deleteNode,
    deleteEdge,
    renameNode,
    setPerformer,
    setDescription,
    toggleReview,
    toggleFilesExpected,
    attachTemplate,
    detachTemplate,
    attachComponent,
    detachComponent,
    relayout,
    renameTemplate,
    save,
    publish,
    rollback,
    duplicate,
  };
}
