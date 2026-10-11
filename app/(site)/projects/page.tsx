import type { Metadata } from "next";
import ProjectsBrowser from "@/components/ProjectsBrowser";
import { getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-light">Portfolio</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">All projects</h1>
      <p className="mt-4 max-w-xl text-paper/60">
        Everything I&apos;ve built on my own time. Click a project for the full story, screenshots
        and demos.
      </p>
      <div className="mt-10">
        <ProjectsBrowser projects={projects} />
      </div>
    </main>
  );
}
