export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="p-7">
      <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">Product {id}</h1>
    </main>
  );
}
