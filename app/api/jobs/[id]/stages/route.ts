import { NextRequest, NextResponse } from "next/server";
import { updateStage } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (!body?.name) {
    return NextResponse.json({ error: "stage name is required" }, { status: 400 });
  }
  const job = await updateStage(id, { name: body.name, status: body.status, date: body.date });
  if (!job) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(job);
}
