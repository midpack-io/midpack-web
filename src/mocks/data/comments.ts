import type {
  Comment,
  CommentId,
  PersonId,
  ProductId,
} from "@/lib/api/types";

// Seeded comments per product. The bundle-page prototype shows ~3 comments
// for Style 247 — those are reproduced verbatim. The other products get
// realistic threads tied to their lifecycle state (e.g., Style 249 has the
// return reason that the row prototype shows; Style 248 has reviewer notes).

export const COMMENTS: Comment[] = [
  // ─── Style 247 — Navy blazer (the prototype bundle page) ────────────────────
  {
    id: "cm-247-1" as CommentId,
    productId: "prod-247" as ProductId,
    authorId: "p-olena" as PersonId,
    body: "the cuff width needs to be 6.5cm, not 6cm",
    createdAt: "2026-05-21T16:42:00.000Z",
    anchor: {
      kind: "file",
      fileName: "TP_001_dress.pdf",
      version: "v2",
    },
    status: "still_open_from_prev_version",
    mentions: [],
  },
  {
    id: "cm-247-2" as CommentId,
    productId: "prod-247" as ProductId,
    authorId: "p-marta" as PersonId,
    body: "тканина — supplier №2, артикул 4501",
    createdAt: "2026-05-20T11:08:00.000Z",
    anchor: { kind: "file", fileName: "front.pdf", version: "v1" },
    status: "open",
    mentions: [],
  },
  {
    id: "cm-247-3" as CommentId,
    productId: "prod-247" as ProductId,
    authorId: "p-founder" as PersonId,
    body: "коли запускаємо?",
    createdAt: "2026-05-19T09:30:00.000Z",
    anchor: { kind: "bundle" },
    status: "open",
    mentions: [],
  },
  {
    id: "cm-247-4" as CommentId,
    productId: "prod-247" as ProductId,
    authorId: "p-marta" as PersonId,
    body: "@p-olena cuff fixed in v3 — pls re-review",
    createdAt: "2026-05-22T08:15:00.000Z",
    anchor: { kind: "file", fileName: "TP_001_dress.pdf", version: "v3" },
    status: "open",
    parentId: "cm-247-1" as CommentId,
    mentions: ["p-olena" as PersonId],
  },

  // ─── Style 248 — Silk midi dress (in-review at procurement) ────────────────
  {
    id: "cm-248-1" as CommentId,
    productId: "prod-248" as ProductId,
    authorId: "p-olena" as PersonId,
    body: "Sent to @p-anna for sign-off on the supplier choice. MOQ at 80 looks tight — flagging.",
    createdAt: "2026-05-22T13:00:00.000Z",
    anchor: { kind: "stage", stage: "procurement" },
    status: "open",
    mentions: ["p-anna" as PersonId],
  },
  {
    id: "cm-248-2" as CommentId,
    productId: "prod-248" as ProductId,
    authorId: "p-anna" as PersonId,
    body: "Looking. Let's hold for 24h on MOQ — checking with supplier #2.",
    createdAt: "2026-05-22T13:30:00.000Z",
    anchor: { kind: "stage", stage: "procurement" },
    status: "open",
    parentId: "cm-248-1" as CommentId,
    mentions: [],
  },

  // ─── Style 249 — Linen wrap dress (returned, iter 2) ────────────────────────
  {
    id: "cm-249-1" as CommentId,
    productId: "prod-249" as ProductId,
    authorId: "p-olena" as PersonId,
    body: "Cuff width on page 4 should be 6.5 cm, not 6.0 cm. Also need a callout for stitch density on the collar.",
    createdAt: "2026-05-22T14:46:00.000Z",
    anchor: { kind: "stage", stage: "techpack" },
    status: "open",
    mentions: [],
  },

  // ─── Style 251 — Tweed mini skirt (parallel sourcing) ───────────────────────
  {
    id: "cm-251-1" as CommentId,
    productId: "prod-251" as ProductId,
    authorId: "p-yulia" as PersonId,
    body: "Tweed sample arrived from supplier #1 — color match is off. Trying supplier #3 in parallel.",
    createdAt: "2026-05-22T11:00:00.000Z",
    anchor: { kind: "stage", stage: "procurement" },
    status: "open",
    mentions: [],
  },
  {
    id: "cm-251-2" as CommentId,
    productId: "prod-251" as ProductId,
    authorId: "p-roma" as PersonId,
    body: "Pearl buttons ×6 confirmed with @p-olena — ordering 200 pcs to cover sampling.",
    createdAt: "2026-05-22T10:30:00.000Z",
    anchor: { kind: "stage", stage: "procurement" },
    status: "open",
    mentions: ["p-olena" as PersonId],
  },

  // ─── Style 255 — Tailored shirt (reopened at techpack) ──────────────────────
  {
    id: "cm-255-1" as CommentId,
    productId: "prod-255" as ProductId,
    authorId: "p-olena" as PersonId,
    body: "Reopened — pocket placement needs to move 1cm lower per fitting feedback.",
    createdAt: "2026-05-22T07:00:00.000Z",
    anchor: { kind: "stage", stage: "techpack" },
    status: "open",
    mentions: [],
  },
];

export const commentsById = new Map<CommentId, Comment>(
  COMMENTS.map((c) => [c.id, c]),
);
