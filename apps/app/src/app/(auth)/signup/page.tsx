"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, useGoogleSignIn } from "@midpack/auth";
import { isApiError } from "@midpack/api-client";
import { SignUpView } from "@midpack/ui";

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const googleSignIn = useGoogleSignIn({
    onSuccess: () => router.replace("/collections"),
    onError: (err) => {
      setError(
        isApiError(err) && err.status === 409
          ? "That email is already registered with a different sign-in method."
          : "Google sign-up failed. Please try again."
      );
      setIsGoogleLoading(false);
    },
    onCancel: () => setIsGoogleLoading(false),
  });

  return (
    <SignUpView
      isLoading={isLoading}
      isGoogleLoading={isGoogleLoading}
      error={error}
      onGoogleSignIn={() => {
        setError(null);
        setIsGoogleLoading(true);
        googleSignIn();
      }}
      onSubmit={async ({ name, email, password }) => {
        setError(null);
        setIsLoading(true);
        try {
          const ok = await register(email, password, name || undefined);
          if (ok) router.replace("/collections");
        } catch (e) {
          setError(isApiError(e) ? e.message : "Could not create account.");
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
