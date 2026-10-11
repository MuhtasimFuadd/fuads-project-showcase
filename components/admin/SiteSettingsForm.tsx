"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Settings } from "@/lib/content";
import MediaUploader from "./MediaUploader";

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-panel p-6">
      <h2 className="font-display text-lg text-paper">{title}</h2>
      {hint && <p className="mt-1 text-sm text-paper/45">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function SiteSettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [s, setS] = useState<Settings>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const set = (k: keyof Settings, v: string) => setS((p) => ({ ...p, [k]: v }));

  function text(k: keyof Settings, label: string, placeholder = "") {
    return (
      <label className="block text-sm text-paper/70">
        {label}
        <input value={s[k]} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} className="field mt-1" />
      </label>
    );
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setNotice("Saved ✓ — the live site is updated.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <Section title="Home page hero" hint="The big banner at the top of the home page.">
        {text("hero_eyebrow", "Small line above the title")}
        {text("hero_title", "Main title")}
        <label className="block text-sm text-paper/70">
          Subtitle
          <textarea value={s.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} rows={3} className="field mt-1" />
        </label>
        <div className="grid gap-6 md:grid-cols-2">
          <MediaUploader label="Background image (optional)" hint="Leave empty for the animated glow background."
            kind="image" value={s.hero_image_url} onChange={(v) => set("hero_image_url", v)} />
          <MediaUploader label="Background video (optional)" hint="Loops silently behind the title. Keep it short and small."
            kind="video" value={s.hero_video_url} onChange={(v) => set("hero_video_url", v)} />
        </div>
      </Section>

      <Section title="About me">
        {text("about_title", "Section title")}
        <label className="block text-sm text-paper/70">
          About text
          <textarea value={s.about_text} onChange={(e) => set("about_text", e.target.value)} rows={8} className="field mt-1" />
          <span className="mt-1 block text-xs text-paper/35">
            Blank line = new paragraph · <code>- item</code> = bullet · <code>**bold**</code> · <code>[label](https://link)</code>
          </span>
        </label>
        <MediaUploader label="Profile photo" kind="image" value={s.avatar_url} onChange={(v) => set("avatar_url", v)} />
        <label className="block text-sm text-paper/70">
          Tools &amp; skills
          <span className="block text-xs text-paper/40">One per line (or comma-separated).</span>
          <textarea value={s.skills} onChange={(e) => set("skills", e.target.value)} rows={5} className="field mt-1 font-mono !text-xs" />
        </label>
        <MediaUploader label="Résumé (PDF)" hint="Adds a “Download résumé” button to the About section."
          kind="pdf" value={s.resume_url} onChange={(v) => set("resume_url", v)} />
      </Section>

      <Section title="Contact & social links" hint="Empty fields are simply not shown.">
        <div className="grid gap-4 md:grid-cols-2">
          {text("email", "Public email", "you@example.com")}
          {text("github", "GitHub URL", "https://github.com/…")}
          {text("linkedin", "LinkedIn URL", "https://linkedin.com/in/…")}
          {text("twitter", "X / Twitter URL", "https://x.com/…")}
          {text("youtube", "YouTube URL", "https://youtube.com/@…")}
          {text("website", "Other website", "https://…")}
        </div>
        {text("footer_note", "Footer note")}
      </Section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-ink/90 p-4 backdrop-blur">
        <button type="submit" disabled={saving} className="btn btn-solid">
          {saving ? "Saving…" : "Save changes"}
        </button>
        {notice && <span className="text-sm text-aqua">{notice}</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </form>
  );
}
