import Link from "next/link";
import { cn } from "../../lib/utils";

export type Breadcrumb = { label: string; href?: string };

type BreadcrumbsProps = {
  items: Breadcrumb[];
  className?: string;
};

// `root / crumb / crumb` trail. Crumbs with an `href` are links; the last crumb
// reads as the current page. The caller owns the items array (e.g. the app
// prepends a workspace-root crumb).
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center font-mono text-sm text-zinc-500", className)}>
      {items.map((crumb, i) => {
        const isLast = i === items.length - 1;
        const crumbClass = cn(
          "rounded-md px-[7px] py-[3px] transition-colors",
          isLast && "text-foreground",
          crumb.href && "cursor-pointer hover:bg-accent hover:text-foreground",
        );
        return (
          <span key={i} className="flex items-center">
            {crumb.href ? (
              <Link href={crumb.href} className={crumbClass}>
                {crumb.label}
              </Link>
            ) : (
              <span className={crumbClass}>{crumb.label}</span>
            )}
            {!isLast && <span className="mx-[2px] text-zinc-300">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
