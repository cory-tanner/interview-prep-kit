"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { StagePipeline, currentStageName } from "./stage-pipeline";
import { StageEditor } from "./stage-editor";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { useJobActions } from "./use-job-actions";
import { cn } from "@/lib/cn";
import type { Job, Stage } from "@/lib/jobs";
import type { JobsViewMode } from "./view-toggle";

interface JobCardProps {
  job: Job;
  layout: JobsViewMode;
  hasStudyGuide: boolean;
  stageNames: string[];
  onChange: () => void;
}

export function JobCard({ job, layout, hasStudyGuide, stageNames, onChange }: JobCardProps) {
  const [editingStage, setEditingStage] = useState<Stage | "new" | null>(null);
  const {
    deleting,
    openingGuide,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    requestDelete,
    confirmDelete,
    handleStudyGuide,
  } = useJobActions(job, onChange);

  const isRow = layout === "row";

  function handleSaved() {
    setEditingStage(null);
    onChange();
  }

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-3.5 transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:shadow-(--shadow-lg) hover:border-foreground",
        isRow ? "p-4" : "p-5",
      )}
    >
      <Link
        href={`/jobs/${job.id}`}
        aria-label={`View ${job.company} details`}
        className="absolute inset-0 z-0 rounded-[inherit]"
      />

      <div className={cn("flex gap-3", isRow ? "flex-col lg:flex-row lg:items-center" : "flex-col")}>
        <div className={cn("flex items-start justify-between gap-2", isRow && "lg:w-60 lg:shrink-0")}>
          <div className="min-w-0">
            <h3 className="font-(family-name:--font-display) text-lg font-extrabold text-foreground truncate leading-tight">
              {job.company}
            </h3>
            <p className="font-mono text-[0.7rem] uppercase tracking-wide text-muted-foreground truncate mt-0.5">
              {job.role}
            </p>
          </div>
          {!isRow && <Pill tone="brand-outline">{currentStageName(job.stages)}</Pill>}
        </div>

        <div className={cn("relative z-10", isRow && "flex-1 lg:min-w-0")}>
          <StagePipeline stages={job.stages} onStageClick={setEditingStage} />
        </div>

        {isRow && (
          <div className="lg:shrink-0">
            <Pill tone="brand-outline">{currentStageName(job.stages)}</Pill>
          </div>
        )}
      </div>

      {editingStage && (
        <StageEditor
          jobId={job.id}
          initial={editingStage === "new" ? undefined : editingStage}
          stageNames={stageNames}
          onSaved={handleSaved}
          onCancel={() => setEditingStage(null)}
        />
      )}

      {job.notes && (
        <div>
          <p className="field-label mb-1">Notes</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{job.notes}</p>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleStudyGuide} disabled={openingGuide}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
            </svg>
            {openingGuide ? "Opening…" : hasStudyGuide ? "Study Guide" : "Create Guide"}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setEditingStage("new")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add Stage
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={requestDelete}
          disabled={deleting}
          aria-label={`Remove ${job.company}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>

      <DeleteConfirmDialog
        job={job}
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        pending={deleting}
      />
    </Card>
  );
}
