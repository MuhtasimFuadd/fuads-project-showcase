"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Block, Project, ProjectStatus } from "@/lib/content";
import BlockEditor, { newKey, type EditorBlock } from "./BlockEditor";
import MediaUploader from "./MediaUploader";

type Form = {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  tech: string;
  status: ProjectStatus;
  cover_image_url: string;
  cover_video_url: string;
  live_url: string;
  repo_url: string;
  project_date: string;
  accent: string;
  featured: boolean;
  published: boolean;
  sort_order: string;
};

const EMPTY: Form = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  category: "",
  tech: "",
  status: "completed",
  cover_image_url: "",
  cover_video_url: "",
  live_url: "",
  repo_url: "",
  project_date: "",
  accent: "#FF8A4C",
  featured: false,
  published: true,
  sort_order: "0"
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-panel p-6">
      <h2 className="font-display text-lg text-paper">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function ProjectEditor({
  project,
  blocks
}: {
  project?: Project;
  blocks?: Block[];
}) {
  const router = useRouter();
  const isNew = !project;

  const [f, setF] = useState<Form>(
    project
      ? {
          title: project.title,
          slug: project.slug,
          tagline: project.tagline,
          description: project.description,
          category: project.category,
          tech: project.tech.join(", "),
          status: project.status,
          cover_image_url: project.cover_image_url,
          cover_video_url: project.cover_video_url,
          live_url: project.live_url,
          repo_url: project.repo_url,
          project_date: project.project_date,
          accent: project.accent || "#FF8A4C",
          featured: project.featured,
          published: project.published,
          sort_order: String(project.sort_order)
        }
      : EMPTY
  );
  const [list, setList] = useState<EditorBlock[]>(
    (blocks ?? []).map((b) => ({
      key: newKey(),
      kind: b.kind,
      content: b.content,
      url: b.url,
      caption: b.caption
    }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        ...f,
        sort_order: Number(f.sort_order) || 0,
        blocks: list.map(({ kind, content, url, caption }) => ({ kind, content, url, caption }))
      };
      const res = await fetch(isNew ? "/api/admin/projects" : `/api/admin/projects/${project!.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");

      if (isNew) {
        router.replace(`/admin/projects/${data.id}?created=1`);
        router.refresh();
        return;
      }
      if (data.slug) set("slug", data.slug);
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
      <Section title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-paper/70 md:col-span-2">
            Title *
            <input required value={f.title} onChange={(e) => set("title", e.target.value)} className="field mt-1" />
          </label>
          <label className="block text-sm text-paper/70 md:col-span-2">
            One-line summary
            <span className="block text-xs text-paper/40">Shown on the project card.</span>
            <input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} className="field mt-1" />
          </label>
          <label className="block text-sm text-paper/70">
            Category
            <input value={f.category} onChange={(e) => set("category", e.target.value)}
              placeholder="Web app, Game, AI, Hardware…" className="field mt-1" />
          </label>
          <label className="block text-sm text-paper/70">
            Date
            <input value={f.project_date} onChange={(e) => set("project_date", e.target.value)}
              placeholder="e.g. Mar 2025" className="field mt-1" />
          </label>
          <label className="block text-sm text-paper/70">
            Status
            <select value={f.status} onChange={(e) => set("status", e.target.value as ProjectStatus)} className="field mt-1">
              <option value="completed">Completed</option>
              <option value="in-progress">In progress</option>
              <option value="concept">Concept</option>
            </select>
          </label>
          <label className="block text-sm text-paper/70">
            Technologies
            <span className="block text-xs text-paper/40">Comma-separated.</span>
            <input value={f.tech} onChange={(e) => set("tech", e.target.value)}
              placeholder="React, Supabase, Tailwind" className="field mt-1" />
          </label>
          <label className="block text-sm text-paper/70">
            Live demo link
            <input value={f.live_url} onChange={(e) => set("live_url", e.target.value)} placeholder="https://…" className="field mt-1" />
          </label>
          <label className="block text-sm text-paper/70">
            Source code link
            <input value={f.repo_url} onChange={(e) => set("repo_url", e.target.value)} placeholder="https://github.com/…" className="field mt-1" />
          </label>
        </div>
      </Section>

      <Section title="Cover media">
        <div className="grid gap-6 md:grid-cols-2">
          <MediaUploader label="Cover image" hint="Shown on cards and at the top of the project page (16:10 works best)."
            kind="image" value={f.cover_image_url} onChange={(v) => set("cover_image_url", v)} />
          <MediaUploader label="Cover video (optional)" hint="Plays on hover on the card, and replaces the image on the project page."
            kind="video" value={f.cover_video_url} onChange={(v) => set("cover_video_url", v)} />
        </div>
        <label className="block text-sm text-paper/70">
          Placeholder colour
          <span className="block text-xs text-paper/40">Used for the generated tile when there is no cover image.</span>
          <input type="color" value={f.accent} onChange={(e) => set("accent", e.target.value)}
            className="mt-1 h-10 w-24 rounded border border-line bg-ink" />
        </label>
      </Section>

      <Section title="Introduction text">
        <textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={5}
          placeholder="What is this project and why did you build it?" className="field" />
        <p className="text-xs text-paper/35">
          Blank line = new paragraph · <code>- item</code> = bullet · <code>**bold**</code> · <code>[label](https://link)</code>
        </p>
      </Section>

      <Section title="Page content">
        <p className="text-sm text-paper/55">
          Build the project page from blocks: text, headings, images, videos, embeds, code and more.
        </p>
        <BlockEditor blocks={list} onChange={setList} />
      </Section>

      <Section title="Visibility">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex items-center gap-2 text-sm text-paper/75">
            <input type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4" />
            Published (uncheck to keep as a hidden draft)
          </label>
          <label className="flex items-center gap-2 text-sm text-paper/75">
            <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4" />
            Featured on the home page
          </label>
          <label className="block text-sm text-paper/70">
            Order (lower = first)
            <input type="number" value={f.sort_order} onChange={(e) => set("sort_order", e.target.value)} className="field mt-1" />
          </label>
        </div>
        <label className="block text-sm text-paper/70">
          Page URL slug
          <span className="block text-xs text-paper/40">
            /projects/{f.slug || "your-title"} — leave blank to generate from the title.
          </span>
          <input value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto" className="field mt-1 max-w-md" />
        </label>
      </Section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-ink/90 p-4 backdrop-blur">
        <button type="submit" disabled={saving} className="btn btn-solid">
          {saving ? "Saving…" : isNew ? "Create project" : "Save changes"}
        </button>
        <Link href="/admin/projects" className="btn btn-ghost">Back to list</Link>
        {!isNew && f.published && (
          <Link href={`/projects/${f.slug}`} target="_blank" className="text-sm text-accent-light hover:underline">
            View on site ↗
          </Link>
        )}
        {notice && <span className="text-sm text-aqua">{notice}</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </form>
  );
}
