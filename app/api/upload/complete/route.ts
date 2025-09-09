import { NextRequest, NextResponse } from "next/server";
import { Recording, Meeting } from "@/lib/models";

export async function POST(req: NextRequest) {
  const { meetingId, key, bytes, mimeType } = await req.json();
  const rec = await Recording.create({ meetingId, storageKey: key, url: "", mimeType, bytes });
  await Meeting.updateOne({ _id: meetingId }, { $set: { recordingId: rec._id, status: "recording" } });
  return NextResponse.json({ ok: true, recordingId: rec._id });
}
