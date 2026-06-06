import { Button } from "./button";

export interface NotFoundViewProps {
  homeHref?: string;
  title?: string;
  description?: string;
}

export function NotFoundView({
  homeHref = "/",
  title = "Page not found",
  description = "The page you're looking for doesn't exist or has moved.",
}: NotFoundViewProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <a href={homeHref}>
        <Button>Back home</Button>
      </a>
    </div>
  );
}
