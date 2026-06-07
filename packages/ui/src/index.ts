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
export { GoogleIcon, AppleIcon } from "./components/icons/oauth-icons";

// shadcn / Radix primitives (the shared base — also re-exported by @midpack/product-ui)
export * from "./components/ui/badge";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/popover";
export * from "./components/ui/tooltip";
export * from "./components/ui/avatar";
export * from "./components/ui/calendar";
export * from "./components/ui/scroll-area";
export * from "./components/ui/skeleton";

// Generic chrome (domain-agnostic shell components — shared by app, admin, web)
export * from "./components/chrome/logo";
export * from "./components/chrome/brand-link";
export * from "./components/chrome/breadcrumbs";
export * from "./components/chrome/user-menu";
export * from "./components/chrome/language-switcher";

// Generic design-system pieces (status chip + filter controls)
export * from "./components/ds/status-chip";
export * from "./components/ds/filter-dropdown";
export * from "./components/ds/filter-multiselect";
export * from "./components/ds/active-filter-chip";
export * from "./components/ds/filter-bar";

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
