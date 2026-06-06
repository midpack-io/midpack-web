// Canvas geometry. One placement CELL drives the drag step, the no-overlap
// rule, and the auto-layout spacing — so a node moves a whole cell at a time,
// every cell holds exactly one node, and laid-out nodes already sit on the same
// grid the drag snaps to (no jump on first drag).
//
// The cell is the node's footprint plus its lane spacing. Keep stage-node's
// `w-[216px] h-[46px]` in sync with NODE_W / NODE_H.

export const NODE_W = 216;
export const NODE_H = 46;

// One node slot. CELL_W = NODE_W + a horizontal lane gap; CELL_H = NODE_H + a
// vertical lane gap. This is the snap step and the column/row spacing. Both are
// multiples of 24 so the background dots land on the cell boundaries.
export const CELL_W = 264;
export const CELL_H = 96;

// True when two nodes would share a cell — i.e. overlap. Because positions snap
// to the cell grid, this is only ever true for the exact same cell, so adjacent
// cells are always allowed and nodes can never stack.
export function nodesCollide(
  a: { x: number; y: number },
  b: { x: number; y: number },
): boolean {
  return Math.abs(a.x - b.x) < CELL_W && Math.abs(a.y - b.y) < CELL_H;
}
