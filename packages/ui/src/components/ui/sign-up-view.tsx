"use client";

import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export interface SignUpViewProps {
  onSubmit: (values: { name: string; email: string; password: string }) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  loginHref?: string;
  googleSlot?: React.ReactNode;
}

export function SignUpView({
  onSubmit,
  loading = false,
  error,
  loginHref = "/login",
  googleSlot,
}: SignUpViewProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start using Midpack in minutes.</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit({ name, email, password });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">At least 8 characters, with a letter and a number.</p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
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
        Already have an account?{" "}
        <a href={loginHref} className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
