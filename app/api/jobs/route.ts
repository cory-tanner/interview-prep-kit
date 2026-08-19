import { NextRequest, NextResponse } from "next/server";
import { readJobs, createJob } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await readJobs();
  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body?.company || !body?.role) {
    return NextResponse.json({ error: "company and role are required" }, { status: 400 });
  }
  const job = await createJob({
    company: body.company,
    role: body.role,
    stages: body.stages,
    notes: body.notes,
  });
  return NextResponse.json(job, { status: 201 });
}
