"use client";

import * as React from "react";
import { Button } from "./button";

export type VerifyEmailStatus = "pending" | "success" | "error";

export interface VerifyEmailViewProps {
  status: VerifyEmailStatus;
  message?: string | null;
  continueHref?: string;
  onResend?: () => void | Promise<void>;
  resending?: boolean;
}

const COPY: Record<VerifyEmailStatus, { title: string; body: string }> = {
  pending: { title: "Verifying your email…", body: "Hang tight while we confirm your address." },
  success: { title: "Email verified", body: "Your email has been confirmed." },
  error: { title: "Verification failed", body: "This link is invalid or has expired." },
};

export function VerifyEmailView({
  status,
  message,
  continueHref = "/login",
  onResend,
  resending = false,
}: VerifyEmailViewProps) {
  const copy = COPY[status];

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{copy.title}</h1>
        <p className="text-sm text-muted-foreground">{message ?? copy.body}</p>
      </div>

      {status === "success" ? (
        <a href={continueHref}>
          <Button className="w-full">Continue</Button>
        </a>
      ) : null}

      {status === "error" && onResend ? (
        <Button variant="outline" className="w-full" disabled={resending} onClick={() => void onResend()}>
          {resending ? "Sending…" : "Resend verification email"}
        </Button>
      ) : null}
    </div>
  );
}
