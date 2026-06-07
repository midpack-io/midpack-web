import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Midpack",
  description: "What Midpack collects, why, and the control you keep over it.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 2026"
      intro="Midpack keeps the truth about a product in one place — which means we take what lives there seriously. This page explains what we collect, why, and the control you keep over it."
      sections={[
        {
          heading: "What we collect",
          body: "The essentials to run your workspace: your account details, the files and comments you add to products, and basic usage signals that tell us the service is healthy.",
        },
        {
          heading: "How we use it",
          body: "To operate Midpack, sync your work across the apps you sign in to, and keep your account secure. We don't sell your data, and we don't use your product content to train models.",
        },
        {
          heading: "Sharing",
          body: "Your content is visible only to the people you invite into a product. We rely on a small set of vetted infrastructure providers to host and deliver the service, nothing more.",
        },
        {
          heading: "Your control",
          body: "You can review, export, or delete your data whenever you like. Deleting a workspace removes its files and history from active systems on a defined schedule.",
        },
        {
          heading: "Contact",
          body: "Questions about privacy or a data request? Reach out through your workspace settings and we'll follow up.",
        },
      ]}
    />
  );
}
