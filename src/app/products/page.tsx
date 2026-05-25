"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ProductsWorkspace } from "@/components/products/products-workspace";
import { TopBar } from "@/components/shell/top-bar";
import { useCollections } from "@/hooks/useCollections";
import type { CollectionId } from "@/lib/api/types";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collection") as CollectionId | null;

  if (collectionId) {
    return <ProductsWorkspace collectionId={collectionId} />;
  }
  return <ProductsRedirect />;
}

// Client-side default-collection redirect. MSW runs in the browser, so server
// fetch from page.tsx wouldn't be intercepted — keep the lookup in the client.
function ProductsRedirect() {
  const router = useRouter();
  const collections = useCollections("active");
  const first = collections.data?.[0];

  useEffect(() => {
    if (first) {
      router.replace(`/products?collection=${first.id}`);
    }
  }, [first, router]);

  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[
          { label: "Робочий простір", href: "/" },
          { label: "Колекції", href: "/collections" },
          { label: "…" },
        ]}
      />
      <div className="mx-auto max-w-page px-[24px] py-[40px]">
        {collections.isError ? (
          <p className="text-base text-coral">Не вдалося завантажити колекції.</p>
        ) : !collections.isLoading && !first ? (
          <p className="text-base text-zinc-500">
            Поки що немає активних колекцій. Створіть першу, щоб додавати продукти.
          </p>
        ) : null}
      </div>
    </main>
  );
}
