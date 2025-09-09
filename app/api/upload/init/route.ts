import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  const { meetingId, mimeType, bytes } = await req.json();
  const key = `org/default/meetings/${meetingId}/raw/${crypto.randomUUID()}.webm`;
  return NextResponse.json({ key });
}
