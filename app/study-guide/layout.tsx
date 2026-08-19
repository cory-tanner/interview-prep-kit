import type { ReactNode } from "react";
import { getCompanyGroups } from "@/lib/content";
import { Sidebar } from "@/components/study-guide/sidebar";

export const dynamic = "force-dynamic";

export default async function StudyGuideLayout({ children }: { children: ReactNode }) {
  const groups = await getCompanyGroups();
  return (
    <div className="flex flex-1">
      <Sidebar groups={groups} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
