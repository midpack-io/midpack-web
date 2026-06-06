"use client";

import { useEffect, useState } from "react";

const ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

export function MswInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!ENABLED);

  useEffect(() => {
    if (!ENABLED) return;
    let cancelled = false;

    (async () => {
      const { worker } = await import("@/mocks/browser");
      const { seed } = await import("@/mocks/seed");
      seed();
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: { url: "/mockServiceWorker.js" },
      });
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
