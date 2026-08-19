import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { readJobs } from "./jobs";

const CONTENT_DIR = path.join(process.cwd(), "content");
const LESSON_SLUG_RE = /^(\d{2})-(.+)$/;

export interface LessonMeta {
  slug: string;
  number: string;
  title: string;
  section: string;
  company: string;
  companySlug: string;
}

export interface Lesson extends LessonMeta {
  content: string;
}

export interface SectionGroup {
  section: string;
  lessons: LessonMeta[];
}

export interface CompanyGroup {
  companySlug: string;
  company: string;
  sections: SectionGroup[];
}

function parseLessonSlug(slug: string): { number: string; topic: string } | null {
  const match = slug.match(LESSON_SLUG_RE);
  if (!match) return null;
  return { number: match[1], topic: match[2] };
}

async function listCompanyFolders(): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function listLessonFiles(companySlug: string): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, companySlug);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  return entries.filter((file) => LESSON_SLUG_RE.test(file.replace(/\.md$/, ""))).sort();
}

export async function hasLessons(companySlug: string): Promise<boolean> {
  const files = await listLessonFiles(companySlug);
  return files.length > 0;
}

interface EnsureOverviewLessonInput {
  companySlug: string;
  company: string;
  role: string;
}

export async function ensureOverviewLesson({
  companySlug,
  company,
  role,
}: EnsureOverviewLessonInput): Promise<{ slug: string }> {
  const existing = await listLessonFiles(companySlug);
  if (existing.length > 0) {
    return { slug: existing[0].replace(/\.md$/, "") };
  }

  const dir = path.join(CONTENT_DIR, companySlug);
  await fs.mkdir(dir, { recursive: true });

  const body = `---
title: "Overview & Learning Path"
section: "Crash Course"
company: "${company}"
---

# ${company} — ${role}

_Study guide content coming soon. Run the build-study-guide skill to generate lessons._
`;

  await fs.writeFile(path.join(dir, "00-overview.md"), body, "utf-8");
  return { slug: "00-overview" };
}

export async function getLesson(companySlug: string, lessonSlug: string): Promise<Lesson | undefined> {
  const parsed = parseLessonSlug(lessonSlug);
  if (!parsed) return undefined;

  const filePath = path.join(CONTENT_DIR, companySlug, `${lessonSlug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch {
    return undefined;
  }

  const { data, content } = matter(raw);
  return {
    slug: lessonSlug,
    number: parsed.number,
    title: (data.title as string) ?? parsed.topic,
    section: (data.section as string) ?? "",
    company: (data.company as string) ?? companySlug,
    companySlug,
    content,
  };
}

export async function getCompanyGroups(): Promise<CompanyGroup[]> {
  const companySlugs = await listCompanyFolders();
  const jobs = await readJobs().catch(() => []);
  const knownCompanyNames = new Set(jobs.map((job) => job.company));

  const groups: CompanyGroup[] = [];

  for (const companySlug of companySlugs) {
    const files = await listLessonFiles(companySlug);
    if (files.length === 0) continue;

    const lessons: LessonMeta[] = [];
    let companyDisplayName = companySlug;

    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      const parsed = parseLessonSlug(slug);
      if (!parsed) continue;

      const raw = await fs.readFile(path.join(CONTENT_DIR, companySlug, file), "utf-8");
      const { data } = matter(raw);
      const company = (data.company as string) ?? companySlug;
      companyDisplayName = company;

      lessons.push({
        slug,
        number: parsed.number,
        title: (data.title as string) ?? parsed.topic,
        section: (data.section as string) ?? "",
        company,
        companySlug,
      });
    }

    if (knownCompanyNames.size > 0 && !knownCompanyNames.has(companyDisplayName)) {
      console.warn(
        `[content] content/${companySlug} lessons use company "${companyDisplayName}", which doesn't match any entry in data/jobs.json. Sidebar grouping may be inconsistent.`,
      );
    }

    const sectionOrder: string[] = [];
    const sectionMap = new Map<string, LessonMeta[]>();
    for (const lesson of lessons) {
      if (!sectionMap.has(lesson.section)) {
        sectionMap.set(lesson.section, []);
        sectionOrder.push(lesson.section);
      }
      sectionMap.get(lesson.section)!.push(lesson);
    }

    groups.push({
      companySlug,
      company: companyDisplayName,
      sections: sectionOrder.map((section) => ({ section, lessons: sectionMap.get(section)! })),
    });
  }

  return groups;
}
