"use client";

import { useEffect, useState } from "react";
import { COMPLETED_CHANGED_EVENT, readCompletedMap, setLessonCompleted } from "@/lib/progress";

interface LessonContentProps {
  html: string;
  lessonKey: string;
}

export function LessonContent({ html, lessonKey }: LessonContentProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so this state is hydrated post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompleted(!!readCompletedMap()[lessonKey]);

    const handleChange = () => setCompleted(!!readCompletedMap()[lessonKey]);
    window.addEventListener(COMPLETED_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(COMPLETED_CHANGED_EVENT, handleChange);
  }, [lessonKey]);

  return (
    <div className="mx-auto w-full max-w-3xl px-8 py-8 animate-[rise-in_0.35s_ease-out]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border no-print">
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={completed}
            onChange={(event) => setLessonCompleted(lessonKey, event.target.checked)}
            className="accent-primary w-4 h-4"
          />
          {completed ? "Completed" : "Mark complete"}
        </label>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M6 14h12v8H6z" />
          </svg>
          Print
        </button>
      </div>
      {/* Content is authored locally by the user or a Claude Code skill, never third-party input — see lib/markdown.ts */}
      <article className="content-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
