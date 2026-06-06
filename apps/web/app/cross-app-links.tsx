"use client";

import * as React from "react";
import { Button, getAppUrls, type AppId } from "@midpack/ui";

// Computes sibling-app URLs after mount (getAppUrls reads window) to avoid a
// hydration mismatch with the server-rendered ("") value.
export function CrossAppLinks() {
  const [urls, setUrls] = React.useState<Record<AppId, string> | null>(null);

  React.useEffect(() => {
    setUrls(getAppUrls());
  }, []);

  return (
    <div className="flex flex-wrap gap-3">
      <a href={urls?.app ?? "#"}>
        <Button size="lg">Open the app</Button>
      </a>
      <a href={urls?.admin ?? "#"}>
        <Button size="lg" variant="outline">
          Admin
        </Button>
      </a>
    </div>
  );
}
