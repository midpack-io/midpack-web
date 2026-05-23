export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="p-7">
      <h1 className="text-h1 font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">Collection {id}</h1>
    </main>
  );
}
