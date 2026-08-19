import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Heading({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-(family-name:--font-display) text-2xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}
