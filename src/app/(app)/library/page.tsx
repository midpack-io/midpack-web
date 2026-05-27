import { TopBar } from "@/components/shell/top-bar";
import { PageHeader } from "@/components/shell/page-header";

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-bg">
      <TopBar
        breadcrumbs={[
          { label: "Робочий простір", href: "/" },
          { label: "Library" },
        ]}
      />
      <div className="mx-auto max-w-page px-[24px]">
        <PageHeader title="Library" />
      </div>
    </main>
  );
}
