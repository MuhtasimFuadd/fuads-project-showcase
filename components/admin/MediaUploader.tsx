"use client";

import { useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { isVideoFile } from "@/lib/content";

export type MediaKind = "image" | "video" | "pdf";

const ACCEPT: Record<MediaKind, string> = {
  image: "image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml",
  video: "video/mp4,video/webm,video/quicktime",
  pdf: "application/pdf"
};
const MAX_BYTES = 50 * 1024 * 1024;

// Upload a file straight to Supabase Storage (via a signed URL from our API)
// OR paste a link. Calls onChange with the final public URL.
export default function MediaUploader({
  label,
  hint,
  kind,
  value,
  onChange
}: {
  label: string;
  hint?: string;
  kind: MediaKind;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    if (!ACCEPT[kind].split(",").includes(file.type)) {
      setError(`That file type isn't allowed here (${file.type || "unknown"}).`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is larger than 50 MB.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size })
      });
      const sign = await res.json();
      if (!res.ok) throw new Error(sign.error || "Could not start upload.");

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false } }
      );
      const { error: upErr } = await supabase.storage
        .from(sign.bucket)
        .uploadToSignedUrl(sign.path, sign.token, file, { contentType: file.type });
      if (upErr) throw new Error(upErr.message);

      onChange(sign.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="text-sm text-paper/70">
      <span className="block">{label}</span>
      {hint && <span className="block text-xs text-paper/40">{hint}</span>}

      {value && (
        <div className="mt-2 overflow-hidden rounded-lg border border-line bg-ink">
          {kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-44 w-full object-contain" />
          )}
          {kind === "video" && isVideoFile(value) && (
            <video src={value} controls preload="metadata" className="max-h-44 w-full" />
          )}
          {(kind === "pdf" || (kind === "video" && !isVideoFile(value))) && (
            <p className="truncate px-3 py-2 font-mono text-xs text-paper/60">{value}</p>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT[kind]}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="btn btn-ghost !px-3 !py-1.5 !text-xs"
        >
          {busy ? "Uploading…" : value ? "Replace file" : "Upload file"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-paper/45 hover:text-red-400"
          >
            Remove
          </button>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={kind === "video" ? "…or paste a video / YouTube link" : "…or paste a link"}
          className="field min-w-[12rem] flex-1 !py-1.5 !text-xs"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
