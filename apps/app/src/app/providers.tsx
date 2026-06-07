"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GoogleOAuthProvider, useAuth, startSilentRefresh, stopSilentRefresh } from "@midpack/auth";
import { PeopleProvider, ProductNavProvider } from "@midpack/product-ui";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePeople, indexPeople } from "@/hooks/usePeople";
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

// Feeds the shared product components their data dependencies without coupling
// them to react-query / the router. People come from the `/people` query; row
// navigation maps to the Next router. Both are consumed by @midpack/product-ui
// via context (see PeopleProvider / ProductNavProvider).
function ProductUiBridge({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data } = usePeople();
  const peopleMap = useMemo(() => indexPeople(data), [data]);

  return (
    <PeopleProvider value={peopleMap}>
      <ProductNavProvider onOpenProduct={(href) => router.push(href)}>
        {children}
      </ProductNavProvider>
    </PeopleProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={client}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <TooltipProvider delayDuration={200}>
          <MswInit>
            <AuthBootstrap>
              <ProductUiBridge>{children}</ProductUiBridge>
            </AuthBootstrap>
          </MswInit>
        </TooltipProvider>
      </GoogleOAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
