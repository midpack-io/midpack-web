"use client";

import {
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  Figma,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FileKind, Product, ProductFile } from "@/lib/api/types";

type ProductPreviewProps = {
  file: ProductFile;
  product: Product | undefined;
  onClose: () => void;
};

// Lightweight preview shell. Real per-file-type rendering (BOM table, figure,
// spec grid) is deferred — this shows enough chrome to verify the swap works
// and the version strip is reachable.
export function ProductPreview({ file, product, onClose }: ProductPreviewProps) {
  return (
    <div className="flex min-w-0 flex-col bg-surface">
      <PreviewHeader file={file} onClose={onClose} />
      <PreviewBody file={file} product={product} />
    </div>
  );
}

function PreviewHeader({
  file,
  onClose,
}: {
  file: ProductFile;
  onClose: () => void;
}) {
  const Icon = iconForKind(file.kind);
  const versions = file.versions;
  const latestVersion = versions[versions.length - 1]?.version;

  return (
    <header className="flex items-center gap-[12px] border-b border-border px-[16px] py-[10px]">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Close preview"
        className="size-[28px]"
        onClick={onClose}
      >
        <X className="size-[16px]" strokeWidth={1.8} />
      </Button>
      <Icon className="size-[16px] text-zinc-500" strokeWidth={1.6} />
      <span className="text-sm font-medium text-foreground">
        {file.name}
        <span className="text-zinc-400">{file.ext}</span>
      </span>
      <span aria-hidden className="h-[16px] w-px bg-border" />
      {versions.length > 0 ? (
        <div className="flex items-center gap-[3px]">
          {versions.map((v) => (
            <span
              key={v.version}
              className={cn(
                "inline-flex h-[22px] items-center gap-[4px] rounded-sm px-[8px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.04em]",
                v.version === latestVersion
                  ? "bg-foreground text-surface"
                  : "bg-surface-3 text-zinc-700",
              )}
            >
              {v.version}
              {v.version === latestVersion && (
                <span className="text-zinc-300">· latest</span>
              )}
            </span>
          ))}
        </div>
      ) : file.externalUrl ? (
        <span className="inline-flex items-center gap-[4px] font-mono text-[10.5px] uppercase tracking-[0.06em] text-zinc-500">
          <ExternalLink className="size-[10px]" strokeWidth={1.8} />
          {file.externalDomain ?? "external"}
        </span>
      ) : null}
      <div className="ml-auto flex items-center gap-[6px]">
        <Button
          variant="outline"
          size="sm"
          className="h-[28px] gap-[6px] bg-surface px-[10px] text-xs"
        >
          <Download className="size-[12px]" strokeWidth={1.8} />
          Download
        </Button>
        <Button size="sm" className="h-[28px] px-[10px] text-xs">
          New version
        </Button>
      </div>
    </header>
  );
}

function PreviewBody({
  file,
  product,
}: {
  file: ProductFile;
  product: Product | undefined;
}) {
  return (
    <div
      className="relative flex-1 overflow-auto bg-zinc-900"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 60%)",
      }}
    >
      <div className="mx-auto my-[40px] w-[600px] max-w-[calc(100%-48px)] rounded-md bg-white shadow-[0_12px_28px_-10px_rgba(0,0,0,0.5)]">
        <div className="border-b border-zinc-200 px-[28px] pb-[18px] pt-[24px]">
          <h2 className="m-0 text-lg font-semibold tracking-tight text-zinc-900">
            Tech Pack — {product?.styleNo ?? file.name}
          </h2>
          {product && (
            <p className="mt-[4px] text-sm text-zinc-500">
              {product.name} · {file.name}
              {file.ext}
            </p>
          )}
        </div>
        <div className="space-y-[14px] px-[28px] py-[20px]">
          <PlaceholderLines lines={3} />
          <PlaceholderLines lines={2} short />
          <PlaceholderLines lines={4} />
        </div>
      </div>
      <p className="mb-[24px] text-center font-mono text-xs text-zinc-500">
        PDF preview rendered via auth-gated proxy
      </p>
    </div>
  );
}

function PlaceholderLines({
  lines,
  short,
}: {
  lines: number;
  short?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-[8px] rounded-full bg-zinc-100"
          style={{ width: `${short ? 40 + i * 8 : 60 + i * 8}%` }}
        />
      ))}
    </div>
  );
}

function iconForKind(kind: FileKind) {
  switch (kind) {
    case "pdf":
    case "docx":
      return FileText;
    case "xlsx":
      return FileSpreadsheet;
    case "jpg":
    case "png":
    case "psd":
    case "svg":
      return FileImage;
    case "figma":
      return Figma;
    case "link":
    default:
      return ExternalLink;
  }
}
