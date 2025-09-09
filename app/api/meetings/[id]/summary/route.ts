import { NextRequest, NextResponse } from "next/server";
import { Meeting, Transcript, Summary } from "@/lib/models";
import { summarizeTranscript } from "@/lib/providers/summary";

export async function POST(_req: NextRequest, { params }: { params: { id: string }}) {
  const m = await Meeting.findById(params.id).lean();
  if (!m?.transcriptId) return NextResponse.json({ error: "No transcript" }, { status: 404 });
  const tr = await Transcript.findById(m.transcriptId).lean();
  if (!tr?.text) return NextResponse.json({ error: "Transcript empty" }, { status: 404 });
  const s = await summarizeTranscript(tr.text);
  const summary = await Summary.create({
    meetingId: m._id, model: s.model, promptHash: s.promptHash,
    bullets: s.bullets, risks: s.risks, decisions: s.decisions, tasksExtracted: s.tasks
  });
  await Meeting.updateOne({ _id: m._id }, { $set: { summaryId: summary._id }});
  return NextResponse.json({ ok: true, summaryId: summary._id });
}
