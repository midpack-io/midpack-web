import { AlertTriangle } from "lucide-react";
import type { Product } from "@/lib/api/types";

type ReturnNoticeProps = {
  product: Product;
};

// Coral banner shown between the row head and the stepper when a product is
// returned. v1 derives only iteration from the product; the full
// "Returned by Olena · 14 min ago — {reason}" line needs activity feed data.
// TODO: hook up useProductReturnEvents(productId) once the resource exists.
export function ReturnNotice({ product }: ReturnNoticeProps) {
  return (
    <div className="flex items-start gap-[10px] rounded-md border border-coral-ring/40 bg-coral-soft px-[14px] py-[10px] text-sm text-foreground">
      <AlertTriangle className="mt-[2px] size-[14px] shrink-0 text-coral" strokeWidth={2} />
      <div className="min-w-0">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-coral">
          Повернуто · ітерація {product.iteration}
        </div>
        <p className="mt-[2px] text-[12.5px] leading-snug text-zinc-700">
          Перевірте останній коментар у бандлі — є питання до тех-паку.
        </p>
      </div>
    </div>
  );
}
