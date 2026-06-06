"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@midpack/auth";
import { SignUpView } from "@midpack/ui";
import { isApiError } from "@midpack/api-client";

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <SignUpView
      loading={loading}
      error={error}
      onSubmit={async ({ name, email, password }) => {
        setError(null);
        setLoading(true);
        try {
          const ok = await register(email, password, name || undefined);
          if (ok) router.replace("/");
        } catch (e) {
          setError(isApiError(e) ? e.message : "Could not create account.");
        } finally {
          setLoading(false);
        }
      }}
    />
  );
}
