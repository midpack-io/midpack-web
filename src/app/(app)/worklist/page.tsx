import { TopBar } from "@/components/shell/top-bar";
import { PageHeader } from "@/components/shell/page-header";

export default function WorklistPage() {
  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[
          { label: "Робочий простір", href: "/" },
          { label: "Worklist" },
        ]}
      />
      <div className="mx-auto max-w-page px-[24px]">
        <PageHeader title="Worklist" />
      </div>
    </main>
  );
}
