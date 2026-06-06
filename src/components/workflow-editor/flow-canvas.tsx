"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { LayoutGrid, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CELL_H, CELL_W, nodesCollide } from "./constants";
import { StageNode, type StageFlowNode } from "./stage-node";
import type { WorkflowEditor } from "./use-workflow-editor";
import "./canvas.css";

const NODE_TYPES = { stage: StageNode };

const EDGE_MARKER = {
  type: MarkerType.ArrowClosed,
  width: 14,
  height: 14,
  color: "#d4d4cf",
} as const;

export function FlowCanvas({ editor }: { editor: WorkflowEditor }) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner editor={editor} />
    </ReactFlowProvider>
  );
}

function FlowCanvasInner({ editor }: { editor: WorkflowEditor }) {
  const rf = useReactFlow();
  const { state } = editor;

  // React Flow owns the live node/edge objects so dragging is smooth without
  // writing to the editor on every pointer move. The editor stays the source of
  // truth for structure + data; these two effects push editor → RF whenever the
  // graph, selection, or entering flag changes (never mid-drag, since a drag
  // commits only on stop). The drag's final position flows RF → editor in
  // onNodeDragStop — a single state update per drag.
  const buildNodes = useCallback(
    (): StageFlowNode[] =>
      state.graph.nodes.map((node) => ({
        id: node.id,
        type: "stage",
        position: { x: node.x, y: node.y },
        selected: node.id === state.selectedId,
        // The start node anchors the spine — never draggable, never deletable.
        draggable: node.kind !== "start",
        deletable: node.kind !== "start",
        data: {
          node,
          entering: node.id === state.enteringId,
          onPerformerChange: (next) => editor.setPerformer(node.id, next),
          onToggleReview: () => editor.toggleReview(node.id),
          onDelete: () => editor.deleteNode(node.id),
        },
      })),
    [state.graph.nodes, state.selectedId, state.enteringId, editor],
  );

  const buildEdges = useCallback(
    (): Edge[] =>
      state.graph.edges.map(([from, to]) => ({
        id: `${from}->${to}`,
        source: from,
        target: to,
        markerEnd: EDGE_MARKER,
      })),
    [state.graph.edges],
  );

  // Seed RF state once from the editor; effects keep it in sync thereafter.
  const seeded = useRef(false);
  const seed = useRef<{ nodes: StageFlowNode[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
  });
  if (!seeded.current) {
    seed.current = { nodes: buildNodes(), edges: buildEdges() };
    seeded.current = true;
  }

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<StageFlowNode>(seed.current.nodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<Edge>(seed.current.edges);

  useEffect(() => {
    setRfNodes(buildNodes());
  }, [buildNodes, setRfNodes]);

  useEffect(() => {
    setRfEdges(buildEdges());
  }, [buildEdges, setRfEdges]);

  const onConnect = useCallback<OnConnect>(
    (conn) => {
      if (conn.source && conn.target) editor.connect(conn.source, conn.target);
    },
    [editor],
  );

  const handleRelayout = useCallback(() => {
    editor.relayout();
    // Let the controlled nodes settle at their new positions, then ease the
    // viewport to frame the spine. minZoom keeps the framing readable rather
    // than fitting the whole wide pipeline down to a tiny scale.
    window.setTimeout(
      () => rf.fitView({ duration: 420, padding: 0.14, minZoom: 0.66 }),
      40,
    );
  }, [editor, rf]);

  return (
    <div className="wf-canvas h-full w-full">
      <ReactFlow<StageFlowNode, Edge>
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // Commit the dragged node's final (grid-snapped) position once, on drop.
        // If the spot collides with another node, reject the move and snap the
        // node back to where it was — nodes can never stack.
        onNodeDragStop={(_, node) => {
          const collides = state.graph.nodes.some(
            (n) => n.id !== node.id && nodesCollide(node.position, n),
          );
          if (collides) {
            setRfNodes(buildNodes());
            editor.notify("Тут уже є етап — оберіть вільне місце");
          } else {
            editor.moveNode(node.id, node.position.x, node.position.y);
          }
        }}
        onNodesDelete={(deleted) => deleted.forEach((n) => editor.deleteNode(n.id))}
        onEdgesDelete={(deleted) =>
          deleted.forEach((e) => editor.deleteEdge([e.source, e.target]))
        }
        onNodeClick={(_, node) => editor.selectNode(node.id)}
        onPaneClick={() => editor.selectNode(null)}
        selectNodesOnDrag={false}
        // One drag step = one node cell, so nodes land only on the cell grid.
        snapToGrid
        snapGrid={[CELL_W, CELL_H]}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        // Default to a closer, readable scale instead of fitting the whole wide
        // pipeline down to a tiny zoom; the user pans/zooms from there.
        fitViewOptions={{ padding: 0.14, minZoom: 0.66 }}
        minZoom={0.3}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        className="bg-surface"
      >
        {/* White base + visible dots, both painted by the Background layer (so
            the dots aren't hidden under the pane). 24px dots fall on the cell
            boundaries (CELL_W/CELL_H are multiples of 24). */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.8}
          color="#c4c4be"
          bgColor="#f5f5f3"
        />
        <Controls
          showInteractive={false}
          position="bottom-left"
          className="!shadow-none"
        />
        {/* Hide the minimap while the inspector is open — it lives in the same
            bottom-right corner the panel slides over. */}
        {!state.selectedId && (
          <MiniMap
            pannable
            zoomable
            position="bottom-right"
            nodeColor={miniMapNodeColor}
            nodeStrokeWidth={0}
            maskColor="rgba(247,247,245,0.7)"
          />
        )}

        {/* Canvas toolbar — quiet, top-left, the only chrome over the nodes. */}
        <div className="absolute left-[12px] top-[12px] z-10 flex items-center gap-[6px]">
          <ToolbarButton onClick={editor.addNode} icon={<Plus className="size-[13px]" strokeWidth={2} />}>
            Додати етап
          </ToolbarButton>
          <ToolbarButton onClick={handleRelayout} icon={<LayoutGrid className="size-[13px]" strokeWidth={1.8} />}>
            Перебудувати
          </ToolbarButton>
        </div>
      </ReactFlow>
    </div>
  );
}

function ToolbarButton({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-[30px] items-center gap-[6px] rounded-md border border-border bg-surface px-[10px] text-[12px] font-medium leading-none text-foreground shadow-sm outline-none transition-colors duration-150",
        "hover:border-zinc-400 hover:bg-surface-2 focus-visible:ring-[3px] focus-visible:ring-accent-ring",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function miniMapNodeColor(node: Node): string {
  const kind = (node.data as StageFlowNode["data"] | undefined)?.node?.kind;
  if (kind === "review") return "#b45309";
  if (kind === "start") return "#16161a";
  return "#d4d4cf";
}
