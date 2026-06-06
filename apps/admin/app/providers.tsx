"use client";

import * as React from "react";
import { GoogleOAuthProvider, useAuth, startSilentRefresh, stopSilentRefresh } from "@midpack/auth";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  // Mount useAuth once at the root so session restore + cross-tab sync run
  // app-wide, and keep the access token fresh in the background.
  useAuth();

  React.useEffect(() => {
    startSilentRefresh();
    return () => stopSilentRefresh();
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </GoogleOAuthProvider>
  );
}
