import { Button } from "@midpack/ui";

// Login + Register live in apps/app (/login, /signup) — a different subdomain,
// so these are genuine cross-app links (<a>, not next/link, which can't soft-
// navigate across two separate apps). `appUrl` is resolved on the server from
// the request host (see page.tsx) and passed in, so each href is correct on the
// first render: no "#" placeholder that swaps in after mount, and no jump-to-top
// if a visitor clicks before hydration.
export function AuthLinks({ appUrl }: { appUrl: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a href={`${appUrl}/login`}>
        <Button size="lg" className="h-12 px-8 text-base">
          Login
        </Button>
      </a>
      <a href={`${appUrl}/signup`}>
        <Button size="lg" variant="outline" className="h-12 px-8 text-base">
          Register
        </Button>
      </a>
    </div>
  );
}
