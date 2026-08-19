"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { Stage, StageStatus } from "@/lib/jobs";

const LED_BACKGROUND: Record<StageStatus, string> = {
  complete: "var(--text)",
  active: "var(--brand)",
  pending: "transparent",
};

/**
 * Inline style for an LED status indicator (the pipeline squares and the detail
 * page's status dots share this exact treatment — only their size/shape classes
 * differ). Keep any new status indicator on this helper so the three states stay
 * visually identical everywhere, the same way `statusLabel` keeps the wording in sync.
 */
export function ledStyle(status: StageStatus): CSSProperties {
  return {
    background: LED_BACKGROUND[status],
    border: status === "pending" ? "1.5px solid var(--border)" : "none",
    animation: status === "active" ? "led-pulse 1.6s ease-in-out infinite" : undefined,
  };
}

export function currentStageName(stages: Stage[]): string {
  const active = stages.find((s) => s.status === "active");
  if (active) return active.name;
  if (stages.length > 0 && stages.every((s) => s.status === "complete")) {
    return stages[stages.length - 1].name;
  }
  const firstPending = stages.find((s) => s.status === "pending");
  return firstPending?.name ?? "—";
}

export function formatDate(date: string | null): string | null {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function statusLabel(status: StageStatus): string {
  if (status === "complete") return "Complete";
  if (status === "active") return "In Progress";
  return "Not Started";
}

function accessibleLabel(stage: Stage): string {
  const dateLabel = formatDate(stage.date);
  return `${stage.name}: ${statusLabel(stage.status)}${dateLabel ? `, ${dateLabel}` : ""}`;
}

interface StagePipelineProps {
  stages: Stage[];
  onStageClick?: (stage: Stage) => void;
}

export function StagePipeline({ stages, onStageClick }: StagePipelineProps) {
  return (
    <div className="flex items-center gap-1.5">
      {stages.map((stage) => (
        <button
          key={stage.name}
          type="button"
          onClick={() => onStageClick?.(stage)}
          disabled={!onStageClick}
          title={stage.name}
          aria-label={accessibleLabel(stage)}
          className={cn(
            "w-4 h-4 shrink-0 transition-transform",
            onStageClick && "cursor-pointer hover:scale-110",
          )}
          style={ledStyle(stage.status)}
        />
      ))}
    </div>
  );
}
