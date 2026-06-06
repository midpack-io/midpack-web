import * as React from "react";

export interface HeroPanelProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

// Branded side panel for the auth split-screen layout. Pure presentation.
export function HeroPanel({
  title = "Midpack",
  subtitle = "Move every product bundle through approver-gated stages, together.",
  children,
}: HeroPanelProps) {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(255,255,255,0.12),transparent_60%)]" />
      <div className="relative flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span className="grid size-7 place-items-center rounded-md bg-primary-foreground text-primary">MP</span>
        Midpack
      </div>
      <div className="relative space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-sm text-sm text-primary-foreground/80">{subtitle}</p>
        {children}
      </div>
      <div className="relative text-xs text-primary-foreground/60">© Midpack</div>
    </div>
  );
}
