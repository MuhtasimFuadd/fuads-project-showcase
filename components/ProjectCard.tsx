import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/content";
import ProjectPlaceholder from "./ProjectPlaceholder";
import HoverVideo from "./HoverVideo";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ project }: { project: Project }) {
  const cover = project.cover_image_url ? (
    <Image
      src={project.cover_image_url}
      alt=""
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
    />
  ) : (
    <ProjectPlaceholder color={project.accent} label={project.title} />
  );

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_50px_-20px_rgba(255,138,76,0.35)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-raised">
        {project.cover_video_url ? (
          <HoverVideo src={project.cover_video_url}>{cover}</HoverVideo>
        ) : (
          cover
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={project.status} />
        </div>
        {project.cover_video_url && (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-paper/70 backdrop-blur">
            ▶ hover to preview
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3 font-mono text-[0.7rem] uppercase tracking-wider text-paper/45">
          <span>{project.category || "Project"}</span>
          {project.project_date && <span>{project.project_date}</span>}
        </div>
        <h3 className="mt-2 font-display text-xl leading-snug text-paper group-hover:text-accent-light">
          {project.title}
        </h3>
        {project.tagline && (
          <p className="mt-2 line-clamp-2 text-sm text-paper/60">{project.tagline}</p>
        )}
        {project.tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((t) => (
              <li
                key={t}
                className="rounded-md border border-line bg-ink px-2 py-0.5 font-mono text-[0.7rem] text-paper/65"
              >
                {t}
              </li>
            ))}
            {project.tech.length > 4 && (
              <li className="px-1 py-0.5 font-mono text-[0.7rem] text-paper/40">
                +{project.tech.length - 4}
              </li>
            )}
          </ul>
        )}
      </div>
    </Link>
  );
}
