"use client";

import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export interface ForgotPasswordViewProps {
  onSubmit: (values: { email: string }) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  // When true, show the "check your inbox" confirmation instead of the form.
  sent?: boolean;
  loginHref?: string;
}

export function ForgotPasswordView({
  onSubmit,
  loading = false,
  error,
  sent = false,
  loginHref = "/login",
}: ForgotPasswordViewProps) {
  const [email, setEmail] = React.useState("");

  if (sent) {
    return (
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Check your inbox</h1>
        <p className="text-sm text-muted-foreground">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
        <a href={loginHref} className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit({ email });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <a href={loginHref} className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </a>
      </p>
    </div>
  );
}
