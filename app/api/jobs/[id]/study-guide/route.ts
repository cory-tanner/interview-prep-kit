import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";
import { ensureOverviewLesson } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return NextResponse.json({ error: "not found" }, { status: 404 });

  const { slug } = await ensureOverviewLesson({ companySlug: job.id, company: job.company, role: job.role });
  return NextResponse.json({ slug });
}
