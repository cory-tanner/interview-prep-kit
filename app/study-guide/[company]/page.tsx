import { notFound, redirect } from "next/navigation";
import { getCompanyGroups } from "@/lib/content";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ company: string }>;
}

export default async function CompanyStudyGuidePage({ params }: PageProps) {
  const { company } = await params;
  const groups = await getCompanyGroups();
  const group = groups.find((g) => g.companySlug === company);
  const firstLesson = group?.sections[0]?.lessons[0];

  if (!firstLesson) notFound();

  redirect(`/study-guide/${company}/${firstLesson.slug}`);
}
