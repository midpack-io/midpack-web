"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Separator } from "./separator";
import { GoogleIcon } from "../icons/oauth-icons";

export interface SignUpViewProps {
  onSubmit: (values: { name: string; email: string; password: string }) => void | Promise<void>;
  // Provided by the page (wires @midpack/auth's useGoogleSignIn). When omitted,
  // the Google button + separator are not rendered.
  onGoogleSignIn?: () => void;
  isLoading?: boolean;
  isGoogleLoading?: boolean;
  error?: string | null;
  loginHref?: string;
}

export function SignUpView({
  onSubmit,
  onGoogleSignIn,
  isLoading = false,
  isGoogleLoading = false,
  error,
  loginHref = "/login",
}: SignUpViewProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const isBusy = isLoading || isGoogleLoading;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start using Midpack in minutes.</p>
      </div>

      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

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
            disabled={isBusy}
            className="h-11"
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
            disabled={isBusy}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isBusy}
              className="h-11 pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">At least 8 characters, with a letter and a number.</p>
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isBusy}>
          {isLoading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      {onGoogleSignIn ? (
        <>
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs uppercase text-muted-foreground">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-3 text-sm font-medium"
            disabled={isBusy}
            onClick={onGoogleSignIn}
          >
            {isGoogleLoading ? (
              <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </Button>
        </>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={loginHref} className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
