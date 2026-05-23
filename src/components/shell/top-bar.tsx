import { Search, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type TopBarProps = {
  breadcrumbs?: string[];
  className?: string;
};

export function TopBar({ breadcrumbs = ["Робочий простір"], className }: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[60px] items-center gap-[14px] border-b border-border bg-surface px-[24px]",
        className,
      )}
    >
      {/* Brand wordmark */}
      <a
        href="/"
        className="relative inline-flex items-baseline text-lg tracking-tight cursor-pointer rounded-[4px] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ring"
      >
        <span className="font-semibold text-foreground">Mid</span>
        <span className="font-normal text-zinc-500">pack</span>
      </a>

      {/* Divider */}
      <span className="h-[20px] w-px bg-border" aria-hidden />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-[6px] font-mono text-sm text-zinc-500">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-[6px]">
            <span className={i === breadcrumbs.length - 1 ? "text-foreground" : ""}>{crumb}</span>
            {i < breadcrumbs.length - 1 && <span className="text-zinc-300">/</span>}
          </span>
        ))}
      </nav>

      {/* Search */}
      <label className="ml-[18px] flex h-[34px] w-[360px] items-center gap-[8px] rounded-md border border-transparent bg-surface-2 px-[12px] transition-colors [&:hover:not(:focus-within)]:border-border focus-within:border-accent-ring focus-within:bg-surface">
        <Search className="size-[16px] shrink-0 text-zinc-400" strokeWidth={1.75} />
        <input
          type="search"
          placeholder="Пошук колекцій, продуктів, файлів…"
          className="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-base leading-none text-foreground placeholder:text-zinc-400 outline-none"
        />
      </label>

      <div className="flex-1" />

      {/* Actions */}
      <Button variant="ghost" size="icon" aria-label="Сповіщення" className="size-[32px]">
        <Bell className="size-[18px] text-zinc-700" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Довідка" className="size-[32px]">
        <HelpCircle className="size-[18px] text-zinc-700" strokeWidth={1.75} />
      </Button>

      <Avatar className="ml-[4px] size-[28px]">
        <AvatarFallback className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-xs font-semibold text-white">
          AK
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
