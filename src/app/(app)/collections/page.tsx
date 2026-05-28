"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/shell/top-bar";
import { PageHeader } from "@/components/shell/page-header";
import { GroupHeader } from "@/components/ds/group-header";
import { CollectionsFilterBar } from "@/components/collections/collections-filter-bar";
import { CollectionsGrid } from "@/components/collections/collections-grid";
import { useCollections, useCollectionsCounts } from "@/hooks/useCollections";

type Tab = "active" | "archived";

export default function CollectionsPage() {
  const [tab, setTab] = useState<Tab>("active");
  const query = useCollections(tab);
  const counts = useCollectionsCounts();
  const totals = computeTotals(query.data);

  const archivedView = tab === "archived";
  const visibleCount = query.data?.length ?? 0;

  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[
          { label: "Колекції" },
        ]}
      />
      <div className="mx-auto max-w-page px-[24px]">
        <PageHeader
          title="Колекції"
          subline={
            archivedView ? (
              <>
                <b className="font-medium text-foreground">{counts.data?.archived ?? 0}</b> в архіві
                <span className="mx-[6px] text-zinc-300">·</span>
                лише для перегляду — історія минулих випусків
              </>
            ) : (
              <>
                <b className="font-medium text-foreground">{counts.data?.active ?? 0}</b> у роботі
                <span className="mx-[6px] text-zinc-300">·</span>
                <b className="font-medium text-foreground">{totals.products}</b> активних продуктів
                <span className="mx-[6px] text-zinc-300">·</span>
                <b className="font-medium text-foreground">{totals.mentions}</b> непрочитаних згадок
              </>
            )
          }
          actions={
            <Button className="h-[40px] px-[18px] text-base">
              <Plus className="h-[16px] w-[16px]" strokeWidth={2} />
              Нова колекція
            </Button>
          }
        />
      </div>
      <CollectionsFilterBar
        tab={tab}
        onTabChange={setTab}
        activeCount={counts.data?.active ?? 0}
        archivedCount={counts.data?.archived ?? 0}
      />
      <div className="mx-auto max-w-page px-[24px]">
        <GroupHeader
          label={archivedView ? "Архів" : "У роботі"}
          meta={
            archivedView
              ? `${visibleCount} колекцій · за датою закриття`
              : `${visibleCount} колекцій · за останньою активністю`
          }
        />
        <CollectionsGrid query={query} />
        <div className="h-[48px]" />
      </div>
    </main>
  );
}

function computeTotals(data: { productCount: number; unreadMentions: number }[] | undefined) {
  if (!data) return { collections: 0, products: 0, mentions: 0 };
  return data.reduce(
    (acc, c) => ({
      collections: acc.collections + 1,
      products: acc.products + c.productCount,
      mentions: acc.mentions + c.unreadMentions,
    }),
    { collections: 0, products: 0, mentions: 0 },
  );
}
