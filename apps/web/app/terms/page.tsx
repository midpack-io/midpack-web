import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — Midpack",
  description: "The terms that govern your use of Midpack.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 2026"
      intro="These terms describe how you may use Midpack — the workspace where a product moves, file by file, from sketch to final. By creating an account you agree to the points below."
      sections={[
        {
          heading: "Your account",
          body: "You're responsible for the activity under your account and for keeping your credentials safe. Invite teammates and contractors as your team grows, and remove access when it's no longer needed.",
        },
        {
          heading: "Your content",
          body: "Files, comments, and decisions you add to a product stay yours. You grant Midpack the limited rights needed to store, version, and display that content back to the people you share it with.",
        },
        {
          heading: "Acceptable use",
          body: "Use Midpack to move real work forward. Don't upload unlawful material, attempt to disrupt the service, or access workspaces you haven't been invited to.",
        },
        {
          heading: "Export and portability",
          body: "Your product history belongs to you. You can export your files and records at any time, so there's no lock-in if you decide to move elsewhere.",
        },
        {
          heading: "Changes to these terms",
          body: "As the product evolves, these terms may change. We'll surface meaningful updates in-app before they take effect so nothing shifts silently underneath you.",
        },
      ]}
    />
  );
}
