import { NextRequest, NextResponse } from "next/server";
import { removeStageName } from "@/lib/stages";

export const dynamic = "force-dynamic";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const { removed, names } = await removeStageName(name);
  if (!removed) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(names);
}
