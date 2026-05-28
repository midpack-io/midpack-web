import type { WorkflowGraph, WorkflowGraphNode } from "@/lib/api/types";

// Renders a workflow template's stage graph as a small node-and-edge diagram,
// drawn into the same 0..280 × 0..80 space the seed coordinates use. Start node
// is filled, review stages are indigo-tinted, regular stages are outlined.
export function WorkflowGraphView({ graph }: { graph: WorkflowGraph }) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));

  return (
    <div className="absolute inset-0 flex items-center justify-center px-[16px] py-[12px]">
      <svg viewBox="0 0 280 80" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
        {graph.edges.map(([from, to], i) => {
          const a = byId.get(from);
          const b = byId.get(to);
          if (!a || !b) return null;
          return (
            <path
              key={i}
              d={`M${a.x + 16} ${a.y + 8} L${b.x} ${b.y + 8}`}
              className="fill-none stroke-zinc-400"
              strokeWidth={1}
            />
          );
        })}
        {graph.nodes.map((n) => (
          <rect
            key={n.id}
            x={n.x}
            y={n.y}
            width={16}
            height={16}
            rx={3}
            className={nodeClass(n)}
            strokeWidth={1.2}
          />
        ))}
        {graph.nodes.map((n) =>
          n.label ? (
            <text
              key={`${n.id}-label`}
              x={n.x + 8}
              y={n.y > 28 ? n.y + 16 + 9 : n.y - 4}
              textAnchor="middle"
              className="fill-zinc-500 font-mono text-[7px]"
            >
              {n.label}
            </text>
          ) : null,
        )}
        {graph.moreLabel && (
          <text
            x={140}
            y={78}
            textAnchor="middle"
            className="fill-zinc-500 font-mono text-[9px] font-semibold"
          >
            {graph.moreLabel}
          </text>
        )}
      </svg>
    </div>
  );
}

function nodeClass(n: WorkflowGraphNode): string {
  if (n.kind === "start") return "fill-foreground stroke-foreground";
  if (n.kind === "review") return "fill-accent-soft stroke-accent-strong";
  return "fill-surface stroke-zinc-700";
}
