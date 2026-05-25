"use client";

import { useMemo, useState, type PointerEventHandler } from "react";
import { ProductComments } from "@/components/products/product-comments";
import { ProductFiles } from "@/components/products/product-files";
import { ProductPreview } from "@/components/products/product-preview";
import { useColumnResize } from "@/hooks/useColumnResize";
import { indexPeople, usePeople } from "@/hooks/usePeople";
import { useProduct } from "@/hooks/useProduct";
import { useProductComments } from "@/hooks/useProductComments";
import { useProductFiles } from "@/hooks/useProductFiles";
import { cn } from "@/lib/utils";
import type { FileId, ProductId } from "@/lib/api/types";

type ProductWorkspacePaneProps = {
  productId: ProductId;
};

// Two-column workspace below the stepper. Left = Files (or PDF preview when a
// row is open). Right = Comments side panel. Vertical drag handle between
// columns persists width to localStorage; double-click resets to default.
export function ProductWorkspacePane({ productId }: ProductWorkspacePaneProps) {
  const productQuery = useProduct(productId);
  const filesQuery = useProductFiles(productId);
  const commentsQuery = useProductComments(productId);
  const peopleQuery = usePeople();
  const peopleMap = useMemo(
    () => indexPeople(peopleQuery.data),
    [peopleQuery.data],
  );

  const { containerRef, sideWidth, isDragging, handleProps } = useColumnResize({
    min: 320,
    maxFraction: 0.7,
    storageKey: "bundle.sideWidth",
    defaultWidth: 460,
  });

  const [previewFileId, setPreviewFileId] = useState<FileId | null>(null);
  const previewFile = useMemo(
    () => filesQuery.data?.find((f) => f.id === previewFileId) ?? null,
    [filesQuery.data, previewFileId],
  );

  const files = filesQuery.data ?? [];
  const comments = commentsQuery.data ?? [];

  return (
    <section
      ref={containerRef}
      className="relative grid min-h-0 flex-1 overflow-hidden border-t border-border"
      style={{ gridTemplateColumns: `minmax(0, 1fr) ${sideWidth}px` }}
    >
      {previewFile ? (
        <ProductPreview
          file={previewFile}
          product={productQuery.data}
          onClose={() => setPreviewFileId(null)}
        />
      ) : (
        <ProductFiles
          files={files}
          peopleMap={peopleMap}
          onOpenFile={setPreviewFileId}
        />
      )}

      <ResizeHandle
        sideWidth={sideWidth}
        isDragging={isDragging}
        handleProps={handleProps}
      />

      <ProductComments comments={comments} peopleMap={peopleMap} />
    </section>
  );
}

// 8px hit area with a 1px center hairline. Hairline thickens to 2px and
// switches to accent on hover/drag. Sits absolutely between the two columns
// rather than as its own grid track so it can overhang without shifting the
// layout.
function ResizeHandle({
  sideWidth,
  isDragging,
  handleProps,
}: {
  sideWidth: number;
  isDragging: boolean;
  handleProps: {
    onPointerDown: PointerEventHandler<HTMLDivElement>;
    onPointerMove: PointerEventHandler<HTMLDivElement>;
    onPointerUp: PointerEventHandler<HTMLDivElement>;
    onPointerCancel: PointerEventHandler<HTMLDivElement>;
    onDoubleClick: () => void;
  };
}) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize columns"
      style={{ right: sideWidth, transform: "translateX(4px)" }}
      className="group/resize absolute top-0 bottom-0 z-20 w-[8px] cursor-col-resize touch-none select-none"
      {...handleProps}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0 bottom-0 left-1/2 -translate-x-1/2 transition-[background-color,width] duration-100",
          isDragging
            ? "w-[2px] bg-accent"
            : "w-px bg-border group-hover/resize:w-[2px] group-hover/resize:bg-accent",
        )}
      />
    </div>
  );
}
