import { readJobs } from "@/lib/jobs";
import { hasLessons } from "@/lib/content";
import { readStageNames } from "@/lib/stages";
import { JobBoard } from "@/components/jobs/job-board";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await readJobs();
  const lessonChecks = await Promise.all(jobs.map((job) => hasLessons(job.id)));
  const studyGuideCompanySlugs = jobs.filter((_, index) => lessonChecks[index]).map((job) => job.id);
  const stageNames = await readStageNames();

  return <JobBoard jobs={jobs} studyGuideCompanySlugs={studyGuideCompanySlugs} stageNames={stageNames} />;
}
