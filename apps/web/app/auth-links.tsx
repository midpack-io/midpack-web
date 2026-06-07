"use client";

import * as React from "react";
import { Button, getAppUrls } from "@midpack/ui";

// Login + Register both live in apps/app (/login, /signup). The app's base URL
// is computed after mount (getAppUrls reads window) so the server-rendered
// fallback ("#") stays stable and there's no hydration mismatch.
export function AuthLinks() {
  const [appUrl, setAppUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    setAppUrl(getAppUrls().app);
  }, []);

  return (
    <div className="flex flex-wrap gap-3">
      <a href={appUrl ? `${appUrl}/login` : "#"}>
        <Button size="lg">Login</Button>
      </a>
      <a href={appUrl ? `${appUrl}/signup` : "#"}>
        <Button size="lg" variant="outline">
          Register
        </Button>
      </a>
    </div>
  );
}
