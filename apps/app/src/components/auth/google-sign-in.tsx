"use client";

import * as React from "react";
import { Button } from "@midpack/ui";
import { useGoogleSignIn } from "@midpack/auth";

// Only render this when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set — the underlying
// hook needs a configured GoogleOAuthProvider.
export function GoogleSignIn({ onDone }: { onDone?: () => void }) {
  const [error, setError] = React.useState<string | null>(null);
  const signIn = useGoogleSignIn({
    onSuccess: onDone,
    onError: () => setError("Google sign-in failed."),
  });

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" className="w-full" onClick={() => signIn()}>
        Continue with Google
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
