import { CrossAppLinks } from "./cross-app-links";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <div className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
        <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
          MP
        </span>
        Midpack
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Every product bundle, through every stage.
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Midpack moves bundled files through approver-gated stages so teams ship the right thing,
          in the right order, together.
        </p>
      </div>

      <CrossAppLinks />
    </main>
  );
}
