import { WelcomeFlow } from "@/components/onboarding/welcome-flow";

// New-account welcome flow. UI/UX prototype — local state only; the routing
// gate (no-workspace → here) and POST /onboarding land later per
// handoffs/onboarding-registration-flow.md. Lives in its own (onboarding)
// route group so it gets neither the (app) shell nor the (auth) split.
export default function WelcomePage() {
  return <WelcomeFlow />;
}
