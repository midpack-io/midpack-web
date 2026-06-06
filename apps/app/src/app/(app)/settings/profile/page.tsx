import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { PlaceholderCard } from "@/components/settings/placeholder-card";

export default function SettingsProfilePage() {
  return (
    <>
      <SettingsPageHeader
        eyebrow="Settings · account"
        title="Profile"
        sub="Page out of scope for this handoff."
      />
      <PlaceholderCard />
    </>
  );
}
