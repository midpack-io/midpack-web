import { cn } from "@/lib/utils";

function LiveIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="size-[14px]" aria-hidden>
      <path
        d="M5 9l-2 2a2.1 2.1 0 0 1-3-3l3-3a2.1 2.1 0 0 1 3 0M9 5l2-2a2.1 2.1 0 0 1 3 3l-3 3a2.1 2.1 0 0 1-3 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BlueprintIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="size-[14px]" aria-hidden>
      <path d="M3 1.5h5l3 3v8H3v-11z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 1.5v3h3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IntroCard({
  variant,
  icon,
  title,
  children,
}: {
  variant: "live" | "blueprint";
  icon: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-[12px] rounded-[10px] border border-border bg-surface px-[16px] py-[14px]">
      <span
        className={cn(
          "flex size-[28px] shrink-0 items-center justify-center rounded-[7px]",
          variant === "live" ? "bg-linked/10 text-linked-ink" : "bg-surface-3 text-foreground",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h4 className="flex items-center gap-[8px] text-[12.5px] font-semibold tracking-[-0.005em] text-foreground">
          {title}
        </h4>
        <p className="mt-[4px] text-[11.5px] leading-[1.55] text-zinc-500">{children}</p>
      </div>
    </div>
  );
}

function Keyword({ variant, children }: { variant: "live" | "blueprint"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-[3px] px-[5px] py-[1.5px] font-mono text-[10px] font-semibold uppercase tracking-[0.05em]",
        variant === "live" ? "bg-linked/8 text-linked-ink" : "bg-surface-3 text-zinc-700",
      )}
    >
      {children}
    </span>
  );
}

// The two-card explainer above the file sections. The order flips per tab so the
// active concept leads and the contrast is always visible (spec §"vocabulary").
export function LibraryIntroCards({ active }: { active: "components" | "templates" }) {
  const liveCard = (
    <IntroCard
      key="live"
      variant="live"
      icon={<LiveIcon />}
      title={
        active === "components" ? (
          <>
            Components are <Keyword variant="live">live links</Keyword>
          </>
        ) : (
          <>
            Need it to propagate? Use a <Keyword variant="live">Component</Keyword>
          </>
        )
      }
    >
      {active === "components"
        ? "Publish a new version here and every active product referencing it picks it up — or gets notified to bump. Edit once, every bundle sees it."
        : "If editing the file should retroactively update every product that pulls it, that's a component — not a template."}
    </IntroCard>
  );

  const blueprintCard = (
    <IntroCard
      key="blueprint"
      variant="blueprint"
      icon={<BlueprintIcon />}
      title={
        <>
          Templates are <Keyword variant="blueprint">copies on use</Keyword>
        </>
      }
    >
      {active === "templates"
        ? "Attach to a stage. When a product enters that stage, the template seeds a starting file — the product's copy is independent thereafter."
        : "Seeded into a product when it enters a stage. The product's copy is independent — improving the template never disturbs in-flight work."}
    </IntroCard>
  );

  return (
    <div className="mb-[18px] grid grid-cols-1 gap-[12px] md:grid-cols-2">
      {active === "components" ? [liveCard, blueprintCard] : [blueprintCard, liveCard]}
    </div>
  );
}
