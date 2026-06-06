import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Midpack — workflow for bundled-file approvals",
  description: "Move every product bundle through approver-gated stages, together.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
