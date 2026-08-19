import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type Tone = "brand" | "brand-outline" | "amber" | "muted";

const TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-accent text-primary rounded-full",
  "brand-outline": "bg-transparent text-primary border border-primary rounded-sm",
  amber: "bg-(--amber-soft) text-(--amber) rounded-full",
  muted: "bg-border text-muted-foreground rounded-full",
};

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Pill({ tone = "muted", className, ...props }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 font-mono text-[0.7rem] font-medium uppercase tracking-wide",
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    />
  );
}
