"use client";

export { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { useAuth } from "./use-auth";

interface UseGoogleSignInOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onCancel?: () => void;
}

export function useGoogleSignIn({ onSuccess, onError, onCancel }: UseGoogleSignInOptions = {}) {
  const { oauthLogin } = useAuth();

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (response: Omit<TokenResponse, "error" | "error_description" | "error_uri">) => {
      try {
        await oauthLogin("google", { access_token: response.access_token });
        onSuccess?.();
      } catch (error) {
        onError?.(error);
      }
    },
    onError: () => {
      onError?.(new Error("Google sign-in was cancelled or failed."));
    },
    onNonOAuthError: () => {
      onCancel?.();
    },
  });

  return googleLogin;
}
