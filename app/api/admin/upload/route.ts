import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

const BUCKET = "portfolio-media";
const MAX_BYTES = 50 * 1024 * 1024; // matches Supabase's free-plan cap

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "application/pdf": "pdf"
};

// Step 1 of an upload: the browser asks for a short-lived signed upload URL,
// then sends the file STRAIGHT to Supabase Storage. (Sending big videos
// through this server would hit Vercel's ~4.5 MB request limit.)
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { contentType?: string; size?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const contentType = String(body.contentType ?? "");
  const ext = ALLOWED[contentType];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported file type. Use an image, MP4/WebM/MOV video, or PDF." },
      { status: 400 }
    );
  }
  if (Number(body.size) > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 50 MB." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const month = new Date().toISOString().slice(0, 7);
  const path = `${month}/${randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Could not create upload URL. Did you run schema.sql?" },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ path, token: data.token, publicUrl: pub.publicUrl, bucket: BUCKET });
}
