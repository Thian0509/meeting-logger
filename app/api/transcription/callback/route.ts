import { NextRequest, NextResponse } from "next/server";
import { handleAssemblyCallback } from "@/lib/providers/transcription";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const result = await handleAssemblyCallback(payload);
  return NextResponse.json({ ok: true, result });
}
