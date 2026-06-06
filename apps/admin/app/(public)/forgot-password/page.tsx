"use client";

import * as React from "react";
import { authApi, isApiError } from "@midpack/api-client";
import { ForgotPasswordView } from "@midpack/ui";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  return (
    <ForgotPasswordView
      loading={loading}
      error={error}
      sent={sent}
      onSubmit={async ({ email }) => {
        setError(null);
        setLoading(true);
        try {
          await authApi.forgotPassword({ email });
          setSent(true);
        } catch (e) {
          setError(isApiError(e) ? e.message : "Something went wrong.");
        } finally {
          setLoading(false);
        }
      }}
    />
  );
}
