import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import RichText from "@/components/RichText";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { getProjects, getSettings, safeUrl, skillsList } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);

  const featured = projects.filter((p) => p.featured);
  const shown = (featured.length > 0 ? featured : projects).slice(0, 3);
  const techCount = new Set(projects.flatMap((p) => p.tech)).size;

  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Technologies", value: techCount },
    { label: "In progress", value: projects.filter((p) => p.status === "in-progress").length }
  ].filter((s) => s.value > 0);

  const skills = skillsList(settings);
  const avatar = safeUrl(settings.avatar_url);
  const resume = safeUrl(settings.resume_url);

  return (
    <main>
      <Hero settings={settings} stats={stats} />

      {/* ---------- Featured projects ---------- */}
      <section className="mx-auto max-w-content px-6 py-20">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-light">
                {featured.length > 0 ? "Featured work" : "Latest work"}
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Selected projects</h2>
            </div>
            <Link href="/projects" className="hidden text-sm text-paper/60 hover:text-accent-light sm:block">
              View all →
            </Link>
          </div>
        </Reveal>

        {shown.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center text-paper/50">
            No projects published yet. Add the first one from the admin panel.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <Reveal key={p.id} delay={i * 90} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/projects" className="btn btn-ghost">View all projects →</Link>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section id="about" className="scroll-mt-20 border-t border-line bg-panel/50">
        <div className="mx-auto grid max-w-content gap-12 px-6 py-20 md:grid-cols-[18rem_1fr]">
          <Reveal>
            <div className="relative mx-auto aspect-square w-56 overflow-hidden rounded-3xl border border-line bg-raised md:w-full">
              {avatar ? (
                <Image src={avatar} alt="Fuad" fill sizes="288px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/30 to-aqua/20 font-display text-7xl text-paper/80">
                  F
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-3xl sm:text-4xl">{settings.about_title || "About me"}</h2>
            <RichText text={settings.about_text} className="mt-6 text-[1.02rem]" />

            {skills.length > 0 && (
              <div className="mt-8">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-paper/45">
                  Tools &amp; skills
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <li
                      key={s}
                      className="rounded-lg border border-line bg-ink px-3 py-1 font-mono text-xs text-paper/75"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {resume && (
              <a href={resume} target="_blank" rel="noopener noreferrer" className="btn mt-8">
                Download résumé ↓
              </a>
            )}
          </Reveal>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto grid max-w-content gap-12 px-6 py-20 md:grid-cols-2">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-light">Say hello</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Let&apos;s build something</h2>
            <p className="mt-4 max-w-md text-paper/65">
              Questions about a project, want to collaborate, or just have feedback? Send me a
              message and I&apos;ll get back to you.
            </p>
            <div className="mt-6">
              <SocialLinks settings={settings} />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
