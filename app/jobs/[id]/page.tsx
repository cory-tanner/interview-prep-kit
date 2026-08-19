import { notFound } from "next/navigation";
import { getJob } from "@/lib/jobs";
import { hasLessons } from "@/lib/content";
import { readStageNames } from "@/lib/stages";
import { JobDetailView } from "@/components/jobs/job-detail-view";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const [hasStudyGuide, stageNames] = await Promise.all([hasLessons(job.id), readStageNames()]);

  return <JobDetailView job={job} stageNames={stageNames} hasStudyGuide={hasStudyGuide} />;
}
