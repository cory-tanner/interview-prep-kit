"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { StageEditor } from "./stage-editor";
import { currentStageName, formatDate, ledStyle, statusLabel } from "./stage-pipeline";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { useJobActions } from "./use-job-actions";
import { useSetBreadcrumb } from "@/components/layout/breadcrumb-context";
import type { Job, Stage } from "@/lib/jobs";

interface JobDetailViewProps {
  job: Job;
  stageNames: string[];
  hasStudyGuide: boolean;
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function JobDetailView({ job, stageNames, hasStudyGuide }: JobDetailViewProps) {
  const router = useRouter();
  const [editingStage, setEditingStage] = useState<Stage | "new" | null>(null);
  const {
    deleting,
    openingGuide,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    requestDelete,
    confirmDelete,
    handleStudyGuide,
  } = useJobActions(job, () => router.refresh());

  useSetBreadcrumb(job.company);

  async function handleConfirmDelete() {
    const removed = await confirmDelete();
    if (removed) router.push("/jobs");
  }

  function handleSaved() {
    setEditingStage(null);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 flex flex-col gap-6 animate-[rise-in_0.3s_ease-out]">
      <Link
        href="/jobs"
        className="flex items-center gap-1.5 self-start font-mono text-[0.7rem] uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All applications
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap pb-6 border-b border-border">
        <div className="min-w-0">
          <h1 className="font-(family-name:--font-display) text-3xl font-extrabold text-foreground">{job.company}</h1>
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground mt-1.5">
            {job.role}
          </p>
          <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground mt-2">
            Added {formatFullDate(job.createdAt)} · Updated {formatFullDate(job.updatedAt)}
          </p>
        </div>
        <Pill tone="brand-outline">{currentStageName(job.stages)}</Pill>
      </div>

      <div>
        <p className="field-label mb-2">Stages</p>
        <div className="flex flex-col gap-1">
          {job.stages.map((stage) =>
            editingStage !== "new" && editingStage?.name === stage.name ? (
              <StageEditor
                key={stage.name}
                jobId={job.id}
                initial={stage}
                stageNames={stageNames}
                onSaved={handleSaved}
                onCancel={() => setEditingStage(null)}
              />
            ) : (
              <button
                key={stage.name}
                type="button"
                onClick={() => setEditingStage(stage)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-left cursor-pointer hover:bg-card transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={ledStyle(stage.status)} />
                <span className="flex-1 text-sm font-medium text-foreground">{stage.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {statusLabel(stage.status)}
                </span>
                <span className="font-mono text-xs text-muted-foreground w-14 text-right">
                  {formatDate(stage.date) ?? "—"}
                </span>
              </button>
            ),
          )}
          {editingStage === "new" && (
            <StageEditor
              jobId={job.id}
              stageNames={stageNames}
              onSaved={handleSaved}
              onCancel={() => setEditingStage(null)}
            />
          )}
        </div>
        {editingStage !== "new" && (
          <button
            type="button"
            onClick={() => setEditingStage("new")}
            className="mt-2 text-xs font-medium text-primary hover:underline cursor-pointer"
          >
            + Add stage
          </button>
        )}
      </div>

      {job.notes && (
        <div>
          <p className="field-label mb-2">Notes</p>
          <p className="text-sm leading-relaxed text-foreground">{job.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap pt-6 border-t border-border">
        <Button variant="primary" onClick={handleStudyGuide} disabled={openingGuide}>
          {openingGuide ? "Opening…" : hasStudyGuide ? "Study Guide" : "Create Guide"}
        </Button>
        <Button variant="ghost" onClick={requestDelete} disabled={deleting}>
          {deleting ? "Removing…" : "Remove"}
        </Button>
      </div>

      <DeleteConfirmDialog
        job={job}
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={handleConfirmDelete}
        pending={deleting}
      />
    </div>
  );
}
