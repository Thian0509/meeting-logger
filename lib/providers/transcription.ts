import { Transcript, Meeting } from "../models";

const AAI = process.env.ASSEMBLYAI_API_KEY!;

/** Start a transcription job with AssemblyAI (you must give it a public audio URL). */
export async function enqueueTranscription({ meetingId, audioUrl }: { meetingId: string; audioUrl: string }) {
  const res = await fetch("https://api.assemblyai.com/v2/transcripts", {
    method: "POST",
    headers: { "authorization": AAI, "content-type": "application/json" },
    body: JSON.stringify({ audio_url: audioUrl, speaker_labels: true, metadata: { meetingId } })
  });
  if (!res.ok) throw new Error("Failed to enqueue transcription");
  return res.json();
}

/** Handle AssemblyAI webhook POST. */
export async function handleAssemblyCallback(payload: any) {
  if (payload.status !== "completed") return { ok: true };
  const t = await Transcript.create({
    meetingId: payload.metadata?.meetingId || undefined,
    provider: "assemblyai",
    language: payload.language_code,
    text: payload.text,
    segments: payload.utterances || payload.words || [],
    confidence: payload.confidence
  });
  if (payload.metadata?.meetingId) {
    await Meeting.updateOne({ _id: payload.metadata.meetingId }, { $set: { transcriptId: t._id, status: "complete" } });
  }
  return { ok: true, meetingId: payload.metadata?.meetingId, transcriptId: t._id };
}
