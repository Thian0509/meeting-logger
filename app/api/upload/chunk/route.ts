import { NextRequest, NextResponse } from "next/server";
import { putObject } from "@/lib/s3";

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-upload-key");
  const contentType = req.headers.get("content-type") || "application/octet-stream";
  if (!key) return NextResponse.json({ error: "x-upload-key missing" }, { status: 400 });
  const buf = Buffer.from(await req.arrayBuffer());
  await putObject({ Key: key, Body: buf, ContentType: contentType });
  return NextResponse.json({ ok: true });
}
