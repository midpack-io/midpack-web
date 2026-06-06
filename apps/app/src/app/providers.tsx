"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider, useAuth, startSilentRefresh, stopSilentRefresh } from "@midpack/auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { makeQueryClient } from "@/lib/query-client";
import { MswInit } from "./msw-init";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

// Runs session restore + cross-tab sync + silent refresh once, app-wide. Sits
// inside MswInit so (in mock mode) the worker is ready before auth requests fire.
function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useAuth();

  useEffect(() => {
    startSilentRefresh();
    return () => stopSilentRefresh();
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={client}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <TooltipProvider delayDuration={200}>
          <MswInit>
            <AuthBootstrap>{children}</AuthBootstrap>
          </MswInit>
        </TooltipProvider>
      </GoogleOAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
