"use client";

import * as React from "react";
import { authApi, isApiError } from "@midpack/api-client";
import { ResetPasswordView } from "@midpack/ui";

export default function ResetPasswordPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-12">
      <ResetPasswordView
        loading={loading}
        error={error}
        done={done}
        onSubmit={async ({ password }) => {
          const token = new URLSearchParams(window.location.search).get("token");
          if (!token) {
            setError("Missing or invalid reset token.");
            return;
          }
          setError(null);
          setLoading(true);
          try {
            await authApi.resetPassword({ token, new_password: password });
            setDone(true);
          } catch (e) {
            setError(isApiError(e) ? e.message : "Could not reset password.");
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
