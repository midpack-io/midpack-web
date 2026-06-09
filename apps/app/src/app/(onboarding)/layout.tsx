import type { ReactNode } from "react";

// Layout boundary for the onboarding flow. The (auth) and (app) groups each
// have their own layout; without one here, this route group has no layout
// segment of its own — which can render blank when the page is restored via
// browser back/forward navigation. Pass-through (no auth guard) so it doesn't
// change who can reach /welcome.
export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return children;
}
