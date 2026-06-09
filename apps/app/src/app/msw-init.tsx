"use client";

import { useEffect, useState } from "react";

const ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

export function MswInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!ENABLED);

  useEffect(() => {
    if (!ENABLED) return;
    let cancelled = false;

    (async () => {
      try {
        const { worker } = await import("@/mocks/browser");
        const { seed } = await import("@/mocks/seed");
        seed();
        // Race the worker start against a timeout. On a back/forward reload the
        // service-worker registration can hang or reject (SW re-registration
        // race); without this the promise never settles, `ready` stays false,
        // and `return null` below blanks the ENTIRE app. We'd rather render and
        // let the worker catch up than gate forever.
        await Promise.race([
          worker.start({
            onUnhandledRequest: "bypass",
            serviceWorker: { url: "/mockServiceWorker.js" },
          }),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);
      } catch (err) {
        console.error("[MswInit] worker.start() failed; rendering anyway", err);
      } finally {
        // Always un-gate — never leave the app blank waiting on a mock worker.
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
