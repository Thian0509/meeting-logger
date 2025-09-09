"use client";
import React, { useRef, useState } from "react";
import Button from "../ui/Button";

export default function AudioRecorder({ meetingId }: { meetingId: string }) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [consent, setConsent] = useState(false);

  async function start() {
    if (!consent) { alert("Confirm verbal consent & purpose before recording."); return; }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }});
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
    mr.start(1000);
    setRecording(true);
  }

  async function stop() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    mr.stop();
    mr.stream.getTracks().forEach(t => t.stop());
    setRecording(false);

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const bytes = blob.size;
    const init = await fetch("/api/upload/init", { method: "POST", body: JSON.stringify({ meetingId, mimeType: "audio/webm", bytes })}).then(r=>r.json());
    const key = init.key;
    await fetch("/api/upload/chunk", { method: "POST", headers: { "x-upload-key": key, "content-type": "audio/webm" }, body: blob });
    await fetch("/api/upload/complete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ meetingId, key, bytes, mimeType: "audio/webm" })});
    alert("Uploaded. Transcription job can now be started on the server.");
  }

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
        <span>I confirm verbal consent was captured and purpose stated.</span>
      </label>
      <div className="flex gap-2">
        {!recording ? <Button onClick={start}>Start recording</Button>
                    : <Button variant="outline" onClick={stop}>Stop & Upload</Button>}
      </div>
    </div>
  );
}
