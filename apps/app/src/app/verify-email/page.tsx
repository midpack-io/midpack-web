"use client";

import * as React from "react";
import { authApi, isApiError } from "@midpack/api-client";
import { VerifyEmailView, type VerifyEmailStatus } from "@midpack/ui";

export default function VerifyEmailPage() {
  const [status, setStatus] = React.useState<VerifyEmailStatus>("pending");
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }
    authApi
      .verifyEmail({ token })
      .then(() => setStatus("success"))
      .catch((e) => {
        setStatus("error");
        setMessage(isApiError(e) ? e.message : null);
      });
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-12">
      <VerifyEmailView status={status} message={message} continueHref="/login" />
    </div>
  );
}
