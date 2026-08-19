"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { JobCard } from "./job-card";
import { JobFormDialog } from "./job-form-dialog";
import { ViewToggle, type JobsViewMode } from "./view-toggle";
import type { Job } from "@/lib/jobs";

const VIEW_STORAGE_KEY = "interview-prep-kit-jobs-view";

interface JobBoardProps {
  jobs: Job[];
  studyGuideCompanySlugs: string[];
  stageNames: string[];
}

export function JobBoard({ jobs, studyGuideCompanySlugs, stageNames }: JobBoardProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<JobsViewMode>("row");

  useEffect(() => {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY) as JobsViewMode | null;
    // localStorage only exists client-side, so this state is hydrated post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "row" || stored === "grid") setView(stored);
  }, []);

  function handleViewChange(mode: JobsViewMode) {
    setView(mode);
    window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
  }

  function refresh() {
    router.refresh();
  }

  const activeCount = jobs.filter((job) => !job.stages.every((stage) => stage.status === "complete")).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 flex flex-col gap-6 animate-[rise-in_0.4s_ease-out]">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div className="flex items-end gap-5">
          <div className="flex flex-col items-center leading-none shrink-0 border border-border rounded-md px-4 py-2.5">
            <span className="font-mono text-5xl font-extrabold text-primary tabular-nums">
              {activeCount}
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-wide text-muted-foreground mt-0.5">
              active
            </span>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-0.5">
              Job search
            </p>
            <h1 className="font-(family-name:--font-display) text-2xl font-extrabold tracking-tight text-foreground">
              Applications
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {jobs.length} application{jobs.length === 1 ? "" : "s"} tracked overall
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle value={view} onChange={handleViewChange} />
          <Button variant="primary" onClick={() => setShowForm(true)}>
            + Add application
          </Button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-14 text-center flex flex-col items-center gap-2">
          <span className="text-3xl" aria-hidden>
            🗂️
          </span>
          <p className="text-foreground font-medium">No applications yet</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Add one above, or ask Claude Code to run the <code className="inline-code">add-application</code>{" "}
            skill.
          </p>
        </div>
      ) : (
        <div
          className={cn(
            view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-3",
          )}
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              layout={view}
              hasStudyGuide={studyGuideCompanySlugs.includes(job.id)}
              stageNames={stageNames}
              onChange={refresh}
            />
          ))}
        </div>
      )}

      {showForm && (
        <JobFormDialog
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
