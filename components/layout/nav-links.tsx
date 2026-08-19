"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useBreadcrumbLabel } from "@/components/layout/breadcrumb-context";

const NAV_ITEMS = [
  { href: "/jobs", label: "Jobs" },
  { href: "/study-guide", label: "Study Guide" },
];

export function NavLinks() {
  const pathname = usePathname();
  const breadcrumbLabel = useBreadcrumbLabel();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const showBreadcrumb = item.href === "/jobs" && pathname.startsWith("/jobs/") && Boolean(breadcrumbLabel);
        return (
          <span key={item.href} className={cn("flex items-center gap-1.5 min-w-0", showBreadcrumb && "flex-1")}>
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 shrink-0 font-mono text-[0.7rem] uppercase tracking-wide transition-colors",
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                aria-hidden
                className="w-1.5 h-1.5 shrink-0"
                style={{
                  background: isActive ? "var(--brand)" : "transparent",
                  border: isActive ? "none" : "1.5px solid var(--border)",
                }}
              />
              {item.label}
            </Link>
            {showBreadcrumb && (
              <span className="flex items-center gap-1.5 min-w-0 text-muted-foreground">
                <span aria-hidden className="font-mono text-[0.7rem]">
                  /
                </span>
                <span className="font-mono text-[0.7rem] normal-case tracking-normal truncate">
                  {breadcrumbLabel}
                </span>
              </span>
            )}
          </span>
        );
      })}
    </>
  );
}
