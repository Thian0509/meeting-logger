import { NextRequest, NextResponse } from "next/server";
import { Meeting } from "@/lib/models";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const m = await Meeting.create({
    orgId: body.orgId || null,
    title: body.title,
    startTime: new Date(body.startTime || Date.now()),
    hostId: body.hostId || null,
    location: body.location || null,
    tags: body.tags || []
  });
  return NextResponse.json({ ok: true, meetingId: m._id });
}
