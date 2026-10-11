import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import BlockRenderer from "@/components/BlockRenderer";
import ProjectCard from "@/components/ProjectCard";
import ProjectPlaceholder from "@/components/ProjectPlaceholder";
import RichText from "@/components/RichText";
import StatusBadge from "@/components/StatusBadge";
import { getProjectBySlug, getProjects, safeUrl } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const found = await getProjectBySlug(params.slug);
  if (!found) return { title: "Project not found" };
  const { project } = found;
  return {
    title: project.title,
    description: project.tagline || undefined,
    openGraph: project.cover_image_url ? { images: [project.cover_image_url] } : undefined
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const found = await getProjectBySlug(params.slug);
  if (!found) notFound();
  const { project, blocks } = found;

  const all = await getProjects();
  const others = all.filter((p) => p.id !== project.id).slice(0, 3);
  const live = safeUrl(project.live_url);
  const repo = safeUrl(project.repo_url);
  const coverVideo = safeUrl(project.cover_video_url);

  return (
    <main className="mx-auto max-w-content px-6 py-12">
      <Link href="/projects" className="text-sm text-paper/50 hover:text-paper">
        ← All projects
      </Link>

      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          {project.category && (
            <span className="font-mono text-xs uppercase tracking-wider text-paper/45">
              {project.category}
            </span>
          )}
          {project.project_date && (
            <span className="font-mono text-xs uppercase tracking-wider text-paper/45">
              · {project.project_date}
            </span>
          )}
        </div>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">{project.title}</h1>
        {project.tagline && <p className="mt-4 text-xl text-paper/65">{project.tagline}</p>}
        {(live || repo) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                Live demo ↗
              </a>
            )}
            {repo && (
              <a href={repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Source code ↗
              </a>
            )}
          </div>
        )}
      </header>

      {/* Cover: video if there is one, otherwise the image / placeholder */}
      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-panel">
        {coverVideo ? (
          <video
            src={coverVideo}
            poster={project.cover_image_url || undefined}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full bg-black object-contain"
          />
        ) : project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            priority
            sizes="(min-width: 1152px) 1100px, 100vw"
            className="object-cover"
          />
        ) : (
          <ProjectPlaceholder color={project.accent} label={project.title} />
        )}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_17rem]">
        <article className="min-w-0 space-y-8">
          {project.description && <RichText text={project.description} className="text-lg" />}
          <BlockRenderer blocks={blocks} />
        </article>

        <aside className="h-fit space-y-6 rounded-2xl border border-line bg-panel p-6 lg:sticky lg:top-24">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-paper/45">Status</p>
            <div className="mt-2">
              <StatusBadge status={project.status} />
            </div>
          </div>
          {project.tech.length > 0 && (
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-paper/45">Built with</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li key={t} className="rounded-md border border-line bg-ink px-2 py-0.5 font-mono text-xs text-paper/75">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(live || repo) && (
            <div className="flex flex-col gap-2 text-sm">
              {live && (
                <a href={live} target="_blank" rel="noopener noreferrer" className="text-accent-light hover:underline">
                  Live demo ↗
                </a>
              )}
              {repo && (
                <a href={repo} target="_blank" rel="noopener noreferrer" className="text-accent-light hover:underline">
                  Source code ↗
                </a>
              )}
            </div>
          )}
        </aside>
      </div>

      {others.length > 0 && (
        <section className="mt-24 border-t border-line pt-12">
          <h2 className="font-display text-2xl">More projects</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
