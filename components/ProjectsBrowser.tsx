"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/content";
import ProjectCard from "./ProjectCard";

// Category chips + live search over title / tagline / technologies.
export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return [p.title, p.tagline, p.category, ...p.tech]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [projects, category, query]);

  if (projects.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line p-10 text-center text-paper/50">
        No projects published yet — check back soon.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {categories.length > 2 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  category === c
                    ? "border-accent bg-accent/15 text-accent-light"
                    : "border-line text-paper/65 hover:border-paper/30 hover:text-paper"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects or tech…"
          aria-label="Search projects"
          className="field sm:max-w-xs"
        />
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-paper/50">Nothing matches that search.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
