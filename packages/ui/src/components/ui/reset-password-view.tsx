"use client";

import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export interface ResetPasswordViewProps {
  onSubmit: (values: { password: string }) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  // When true, show the success confirmation instead of the form.
  done?: boolean;
  loginHref?: string;
}

export function ResetPasswordView({
  onSubmit,
  loading = false,
  error,
  done = false,
  loginHref = "/login",
}: ResetPasswordViewProps) {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  const mismatch = confirm.length > 0 && password !== confirm;

  if (done) {
    return (
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Password updated</h1>
        <p className="text-sm text-muted-foreground">You can now sign in with your new password.</p>
        <a href={loginHref} className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Choose a new password</h1>
        <p className="text-sm text-muted-foreground">At least 8 characters, with a letter and a number.</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (mismatch) return;
          void onSubmit({ password });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {mismatch ? <p className="text-sm text-destructive">Passwords don&apos;t match.</p> : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading || mismatch}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
