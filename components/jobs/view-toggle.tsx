"use client";

import { cn } from "@/lib/cn";

export type JobsViewMode = "row" | "grid";

interface ViewToggleProps {
  value: JobsViewMode;
  onChange: (mode: JobsViewMode) => void;
}

function optionClasses(active: boolean) {
  return cn(
    "inline-flex items-center justify-center w-8 h-8 rounded-[calc(var(--radius-sm)-2px)] transition-colors cursor-pointer",
    active
      ? "bg-card text-primary shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-sm border border-border bg-background p-0.5">
      <button
        type="button"
        onClick={() => onChange("row")}
        className={optionClasses(value === "row")}
        aria-label="Row view"
        aria-pressed={value === "row"}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="4" rx="1" />
          <rect x="3" y="11" width="18" height="4" rx="1" />
          <rect x="3" y="17" width="18" height="4" rx="1" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={optionClasses(value === "grid")}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
      </button>
    </div>
  );
}
