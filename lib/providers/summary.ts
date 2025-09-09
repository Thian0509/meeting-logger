import OpenAI from "openai";
import crypto from "node:crypto";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const PROMPT = `You are a strict meeting summarizer for a financial services firm in South Africa.
Return JSON with keys: bullets[], decisions[], risks[], tasks[].
Be concise, factual, and compliance-aware.`;

export async function summarizeTranscript(text: string) {
  const input = `${PROMPT}\n\nMEETING TRANSCRIPT:\n${text}`;
  const promptHash = crypto.createHash("sha256").update(PROMPT).digest("hex");

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: input }],
    response_format: { type: "json_object" },
    temperature: 0.2
  });

  const json = JSON.parse(resp.choices[0].message.content || "{}");
  return {
    model: "gpt-4o-mini",
    promptHash,
    bullets: json.bullets || [],
    risks: json.risks || [],
    decisions: json.decisions || [],
    tasks: json.tasks || []
  };
}
