"use client";

import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export interface LoginViewProps {
  onSubmit: (values: { email: string; password: string }) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  signUpHref?: string;
  forgotPasswordHref?: string;
  googleSlot?: React.ReactNode;
}

export function LoginView({
  onSubmit,
  loading = false,
  error,
  signUpHref = "/signup",
  forgotPasswordHref = "/forgot-password",
  googleSlot,
}: LoginViewProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
        <p className="text-sm text-muted-foreground">Welcome back to Midpack.</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit({ email, password });
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a
              href={forgotPasswordHref}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {googleSlot ? (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          {googleSlot}
        </div>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account?{" "}
        <a href={signUpHref} className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
