"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/content";

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function patch(id: string, body: Record<string, boolean>) {
    setBusy(id);
    setError("");
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setBusy(null);
    if (!res.ok) setError((await res.json().catch(() => ({}))).error || "Update failed.");
    router.refresh();
  }

  async function remove(p: Project) {
    if (!confirm(`Delete “${p.title}” and all of its content? This can't be undone.`)) return;
    setBusy(p.id);
    setError("");
    const res = await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) setError((await res.json().catch(() => ({}))).error || "Delete failed.");
    router.refresh();
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-10 text-center text-paper/55">
        <p>No projects yet.</p>
        <Link href="/admin/projects/new" className="btn btn-solid mt-5">Add your first project</Link>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
        {projects.map((p) => (
          <li key={p.id} className={`flex flex-wrap items-center gap-4 p-4 ${busy === p.id ? "opacity-50" : ""}`}>
            <div className="h-14 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-line bg-raised">
              {p.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover_image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${p.accent || "#FF8A4C"}66, #10131A)` }} />
              )}
            </div>
            <div className="min-w-[10rem] flex-1">
              <Link href={`/admin/projects/${p.id}`} className="font-display text-base text-paper hover:text-accent-light">
                {p.title}
              </Link>
              <p className="mt-0.5 font-mono text-xs text-paper/40">
                /{p.slug} · {p.status} · order {p.sort_order}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button onClick={() => patch(p.id, { published: !p.published })}
                className={`rounded-full border px-3 py-1 ${p.published ? "border-aqua/50 text-aqua" : "border-line text-paper/50"}`}>
                {p.published ? "Published" : "Draft"}
              </button>
              <button onClick={() => patch(p.id, { featured: !p.featured })}
                className={`rounded-full border px-3 py-1 ${p.featured ? "border-accent/60 text-accent-light" : "border-line text-paper/50"}`}>
                {p.featured ? "★ Featured" : "☆ Feature"}
              </button>
              <Link href={`/admin/projects/${p.id}`} className="rounded-full border border-line px-3 py-1 text-paper/75 hover:text-paper">
                Edit
              </Link>
              <button onClick={() => remove(p)} className="rounded-full border border-line px-3 py-1 text-paper/50 hover:border-red-500/60 hover:text-red-400">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
