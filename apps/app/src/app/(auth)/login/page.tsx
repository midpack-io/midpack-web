"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@midpack/auth";
import { LoginView } from "@midpack/ui";
import { GoogleSignIn } from "@/components/auth/google-sign-in";

const HAS_GOOGLE = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <LoginView
      loading={loading}
      error={error}
      googleSlot={HAS_GOOGLE ? <GoogleSignIn onDone={() => router.replace("/collections")} /> : undefined}
      onSubmit={async ({ email, password }) => {
        setError(null);
        setLoading(true);
        const ok = await login(email, password);
        setLoading(false);
        if (ok) {
          const returnUrl = new URLSearchParams(window.location.search).get("returnUrl");
          router.replace(returnUrl || "/collections");
        } else {
          setError("Invalid email or password.");
        }
      }}
    />
  );
}
