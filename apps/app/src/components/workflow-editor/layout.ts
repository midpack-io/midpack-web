import { CELL_H, CELL_W } from "./constants";
import type { EditorGraph, EditorNode } from "./types";

// Hand-rolled layered left→right layout. No graph-layout dependency.
//
// 1. Build adjacency + in-degree.
// 2. Topologically order (Kahn), then layer each node as max(pred layer)+1 so
//    a merge node sits to the right of both branches it joins.
// 3. One column per layer; siblings in a layer stack on the y-axis around a
//    shared midline.
//
// Every position is a multiple of the cell size (CELL_W × CELL_H) so laid-out
// nodes land on the exact same grid the drag-snap uses — one shared lattice.

const COL_W = CELL_W; // 240 — one cell per column
const ROW_H = CELL_H; // 96 — one cell per row
const ORIGIN_X = 0;
const MID_Y = 2 * CELL_H; // 192 — grid-aligned baseline the spine sits on

export function layoutGraph(graph: EditorGraph): EditorGraph {
  const { nodes, edges } = graph;
  if (nodes.length === 0) return graph;

  const adj = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  nodes.forEach((n) => {
    adj.set(n.id, []);
    indeg.set(n.id, 0);
  });
  edges.forEach(([a, b]) => {
    if (adj.has(a) && indeg.has(b)) {
      adj.get(a)!.push(b);
      indeg.set(b, (indeg.get(b) ?? 0) + 1);
    }
  });

  // Kahn topological order from the roots (in-degree 0); the start node, when
  // present, is forced first so layer 0 is always the entry point.
  const layer = new Map<string, number>();
  const queue = nodes
    .filter((n) => (indeg.get(n.id) ?? 0) === 0)
    .map((n) => n.id);
  queue.forEach((id) => layer.set(id, 0));
  const work = [...queue];
  const seen = new Set(work);
  while (work.length) {
    const id = work.shift()!;
    const base = layer.get(id) ?? 0;
    for (const next of adj.get(id) ?? []) {
      layer.set(next, Math.max(layer.get(next) ?? 0, base + 1));
      if (!seen.has(next)) {
        seen.add(next);
        work.push(next);
      }
    }
  }
  // Any node unreachable from a root (shouldn't happen in a DAG) lands at 0.
  nodes.forEach((n) => {
    if (!layer.has(n.id)) layer.set(n.id, 0);
  });

  // Bucket by layer, preserving each layer's prior visual order (by y, then the
  // original array order) so re-layout doesn't shuffle siblings arbitrarily.
  const byLayer = new Map<number, EditorNode[]>();
  nodes.forEach((n) => {
    const l = layer.get(n.id) ?? 0;
    if (!byLayer.has(l)) byLayer.set(l, []);
    byLayer.get(l)!.push(n);
  });

  const placed = new Map<string, { x: number; y: number }>();
  for (const [l, group] of byLayer) {
    group.sort((a, b) => a.y - b.y || nodes.indexOf(a) - nodes.indexOf(b));
    // Stack siblings whole-cell at a time around the midline (floor-offset, so
    // even-count branches stay on the grid instead of landing on half-rows).
    const mid = Math.floor((group.length - 1) / 2);
    group.forEach((n, i) => {
      placed.set(n.id, {
        x: ORIGIN_X + l * COL_W,
        y: MID_Y + (i - mid) * ROW_H,
      });
    });
  }

  return {
    edges,
    nodes: nodes.map((n) => ({ ...n, ...(placed.get(n.id) ?? { x: n.x, y: n.y }) })),
  };
}

// Structural deep clone of a graph (used for revision snapshots so a published
// revision never aliases the mutable working draft).
export function cloneGraph(graph: EditorGraph): EditorGraph {
  return {
    nodes: graph.nodes.map((n) => ({
      ...n,
      templateFiles: n.templateFiles?.map((t) => ({ ...t })),
      components: n.components?.map((c) => ({ ...c })),
    })),
    edges: graph.edges.map((e) => [e[0], e[1]] as [string, string]),
  };
}
