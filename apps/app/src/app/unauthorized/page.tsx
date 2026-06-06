import { NotFoundView } from "@midpack/ui";

export default function UnauthorizedPage() {
  return (
    <NotFoundView
      title="Not authorized"
      description="You don't have access to this page."
      homeHref="/collections"
    />
  );
}
