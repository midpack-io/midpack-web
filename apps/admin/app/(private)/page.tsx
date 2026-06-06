import { Card, CardDescription, CardHeader, CardTitle } from "@midpack/ui";

const STATS = [
  { label: "Users", hint: "Accounts on the platform" },
  { label: "Workspaces", hint: "Active customer workspaces" },
  { label: "Subscriptions", hint: "Billing & plans" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Internal SaaS management for Midpack.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle>{s.label}</CardTitle>
              <CardDescription>{s.hint}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
