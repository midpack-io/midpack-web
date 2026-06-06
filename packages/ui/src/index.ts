export { cn } from "./lib/utils";
export { getAppUrls, getCurrentApp, type AppId } from "./lib/app-urls";

// Primitives
export { Button, buttonVariants, type ButtonProps } from "./components/ui/button";
export { Input } from "./components/ui/input";
export { Label } from "./components/ui/label";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
export { Separator } from "./components/ui/separator";

// Auth views (presentational — wire to @midpack/auth in the app pages)
export { LoginView, type LoginViewProps } from "./components/ui/login-view";
export { SignUpView, type SignUpViewProps } from "./components/ui/sign-up-view";
export {
  ForgotPasswordView,
  type ForgotPasswordViewProps,
} from "./components/ui/forgot-password-view";
export {
  ResetPasswordView,
  type ResetPasswordViewProps,
} from "./components/ui/reset-password-view";
export {
  VerifyEmailView,
  type VerifyEmailViewProps,
  type VerifyEmailStatus,
} from "./components/ui/verify-email-view";
export { NotFoundView, type NotFoundViewProps } from "./components/ui/not-found-view";
export { HeroPanel, type HeroPanelProps } from "./components/ui/hero-panel";
