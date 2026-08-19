export const COMPLETED_STORAGE_KEY = "interview-prep-kit-completed";
export const COMPLETED_CHANGED_EVENT = "interview-prep-kit-completed-changed";

export function lessonKey(companySlug: string, slug: string): string {
  return `${companySlug}/${slug}`;
}

export function readCompletedMap(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COMPLETED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function setLessonCompleted(key: string, value: boolean): void {
  const map = readCompletedMap();
  map[key] = value;
  window.localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(COMPLETED_CHANGED_EVENT));
}
