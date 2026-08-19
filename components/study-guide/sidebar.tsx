"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { COMPLETED_CHANGED_EVENT, lessonKey, readCompletedMap, setLessonCompleted } from "@/lib/progress";
import type { CompanyGroup } from "@/lib/content";

const COLLAPSED_STORAGE_KEY = "interview-prep-kit-collapsed";
const HOW_TO_HREF = "/study-guide/how-to";

function readCollapsedMap(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COLLAPSED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

interface SidebarProps {
  groups: CompanyGroup[];
}

export function Sidebar({ groups }: SidebarProps) {
  const pathname = usePathname();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so this state is hydrated post-mount.
    /* eslint-disable react-hooks/set-state-in-effect */
    setCompleted(readCompletedMap());
    setCollapsed(readCollapsedMap());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleChange = () => setCompleted(readCompletedMap());
    window.addEventListener(COMPLETED_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(COMPLETED_CHANGED_EVENT, handleChange);
  }, []);

  function toggleCollapsed(companySlug: string) {
    setCollapsed((prev) => {
      const next = { ...prev, [companySlug]: !prev[companySlug] };
      window.localStorage.setItem(COLLAPSED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const totalLessons = groups.reduce(
    (sum, group) => sum + group.sections.reduce((s, section) => s + section.lessons.length, 0),
    0,
  );
  const completedCount = hydrated
    ? groups.reduce(
        (sum, group) =>
          sum +
          group.sections.reduce(
            (s, section) =>
              s +
              section.lessons.filter((lesson) => completed[lessonKey(group.companySlug, lesson.slug)]).length,
            0,
          ),
        0,
      )
    : 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <nav className="app-shell no-print w-72 shrink-0 border-r border-border bg-card flex flex-col sticky top-0 max-h-[calc(100vh-3.75rem)] overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
            Progress
          </span>
          <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
            {completedCount}/{totalLessons}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="border-b border-border p-2">
        <Link
          href={HOW_TO_HREF}
          className={cn(
            "flex items-center gap-2 rounded-sm px-2.5 py-2 text-sm font-medium border transition-colors",
            pathname === HOW_TO_HREF
              ? "bg-accent text-primary border-primary"
              : "text-muted-foreground border-dashed border-border hover:text-foreground hover:border-primary",
          )}
        >
          <span aria-hidden>💡</span>
          How to add content
        </Link>
      </div>

      {groups.length === 0 && (
        <p className="p-4 text-sm text-muted-foreground">
          No study guides yet. Ask Claude Code to run the build-study-guide skill.
        </p>
      )}

      <div className="flex-1 py-2">
        {groups.map((group) => {
          const isCollapsed = collapsed[group.companySlug] ?? false;
          return (
            <div key={group.companySlug} className="mb-1">
              <button
                type="button"
                onClick={() => toggleCollapsed(group.companySlug)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-accent cursor-pointer group"
              >
                <span className="font-(family-name:--font-display) text-[0.95rem] font-extrabold text-foreground">
                  {group.company}
                </span>
                <span
                  className={cn(
                    "text-muted-foreground transition-transform text-xs group-hover:text-primary",
                    isCollapsed && "-rotate-90",
                  )}
                >
                  ▾
                </span>
              </button>
              {!isCollapsed &&
                group.sections.map((section) => (
                  <div key={section.section || "_"} className="mb-1">
                    {section.section && (
                      <div className="px-4 pt-1.5 pb-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                        {section.section}
                      </div>
                    )}
                    {section.lessons.map((lesson) => {
                      const href = `/study-guide/${group.companySlug}/${lesson.slug}`;
                      const isActive = pathname === href;
                      const key = lessonKey(group.companySlug, lesson.slug);
                      const isDone = !!completed[key];
                      return (
                        <div
                          key={lesson.slug}
                          className={cn(
                            "flex items-center gap-2 px-4 py-1.5 text-sm border-l-2 transition-colors",
                            isActive
                              ? "bg-accent text-primary font-medium border-primary"
                              : "text-muted-foreground border-transparent hover:bg-accent hover:text-foreground",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={(event) => setLessonCompleted(key, event.target.checked)}
                            className="accent-primary cursor-pointer shrink-0"
                          />
                          <Link
                            href={href}
                            className={cn(
                              "flex-1 truncate flex items-baseline gap-1.5",
                              isDone && !isActive && "line-through decoration-1 opacity-70",
                            )}
                          >
                            <span className="font-mono text-[0.7rem] text-muted-foreground shrink-0">
                              {lesson.number}
                            </span>
                            {lesson.title}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
