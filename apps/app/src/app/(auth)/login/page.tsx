"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, useGoogleSignIn } from "@midpack/auth";
import { isApiError } from "@midpack/api-client";
import { LoginView } from "@midpack/ui";

function returnUrl(): string {
  if (typeof window === "undefined") return "/collections";
  return new URLSearchParams(window.location.search).get("returnUrl") || "/collections";
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const googleSignIn = useGoogleSignIn({
    onSuccess: () => router.replace(returnUrl()),
    onError: (err) => {
      setError(
        isApiError(err) && err.status === 409
          ? "That email is already registered with a different sign-in method."
          : "Google sign-in failed. Please try again."
      );
      setIsGoogleLoading(false);
    },
    onCancel: () => setIsGoogleLoading(false),
  });

  return (
    <LoginView
      isLoading={isLoading}
      isGoogleLoading={isGoogleLoading}
      error={error}
      onGoogleSignIn={() => {
        setError(null);
        setIsGoogleLoading(true);
        googleSignIn();
      }}
      onSubmit={async ({ email, password }) => {
        setError(null);
        setIsLoading(true);
        const ok = await login(email, password);
        setIsLoading(false);
        if (ok) router.replace(returnUrl());
        else setError("Invalid email or password.");
      }}
    />
  );
}
