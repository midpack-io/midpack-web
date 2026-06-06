import { NotFoundView } from "@midpack/ui";

export default function UnauthorizedPage() {
  return (
    <NotFoundView
      title="Not authorized"
      description="Your account doesn't have admin access."
      homeHref="/login"
    />
  );
}
