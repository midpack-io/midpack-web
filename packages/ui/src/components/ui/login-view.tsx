"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Separator } from "./separator";
import { GoogleIcon } from "../icons/oauth-icons";

export interface LoginViewProps {
  onSubmit: (values: { email: string; password: string }) => void | Promise<void>;
  // Provided by the page (wires @midpack/auth's useGoogleSignIn). When omitted,
  // the Google button + separator are not rendered.
  onGoogleSignIn?: () => void;
  isLoading?: boolean;
  isGoogleLoading?: boolean;
  error?: string | null;
  signUpHref?: string;
  forgotPasswordHref?: string;
}

export function LoginView({
  onSubmit,
  onGoogleSignIn,
  isLoading = false,
  isGoogleLoading = false,
  error,
  signUpHref = "/signup",
  forgotPasswordHref = "/forgot-password",
}: LoginViewProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const isBusy = isLoading || isGoogleLoading;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
        <p className="text-sm text-muted-foreground">Welcome back to Midpack.</p>
      </div>

      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

      {onGoogleSignIn ? (
        <>
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

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs uppercase text-muted-foreground">
              or
            </span>
          </div>
        </>
      ) : null}

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
            disabled={isBusy}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isBusy}
              className="pr-10"
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
          <div className="flex justify-end">
            <Link
              href={forgotPasswordHref}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isBusy}>
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href={signUpHref} className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
