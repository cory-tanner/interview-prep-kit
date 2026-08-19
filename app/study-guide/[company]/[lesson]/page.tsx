import { notFound } from "next/navigation";
import { getLesson } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { LessonContent } from "@/components/study-guide/lesson-content";
import { lessonKey } from "@/lib/progress";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ company: string; lesson: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { company, lesson } = await params;
  const data = await getLesson(company, lesson);
  if (!data) notFound();

  const html = renderMarkdown(data.content);

  return <LessonContent html={html} lessonKey={lessonKey(company, lesson)} />;
}
