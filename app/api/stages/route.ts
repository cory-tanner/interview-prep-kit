import { NextRequest, NextResponse } from "next/server";
import { readStageNames, addStageName } from "@/lib/stages";

export const dynamic = "force-dynamic";

export async function GET() {
  const names = await readStageNames();
  return NextResponse.json(names);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (typeof body?.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const names = await addStageName(body.name);
  return NextResponse.json(names);
}
