import AudioRecorder from "@/components/recorder/AudioRecorder";

export default async function MeetingDetail({ params }: { params: { id: string }}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Meeting {params.id}</h1>
      <AudioRecorder meetingId={params.id} />
      <section className="rounded-2xl border p-4">
        <h2 className="font-medium mb-2">Summary</h2>
        <p>After transcription completes, generate a summary via the API.</p>
      </section>
    </div>
  );
}
