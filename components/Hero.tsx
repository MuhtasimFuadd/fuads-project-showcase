import Link from "next/link";
import { safeUrl, type Settings } from "@/lib/content";

export default function Hero({
  settings,
  stats
}: {
  settings: Settings;
  stats: { label: string; value: number }[];
}) {
  const bgImage = safeUrl(settings.hero_image_url);
  const bgVideo = safeUrl(settings.hero_video_url);

  return (
    <section className="relative flex min-h-[88vh] w-full items-center justify-center overflow-hidden">
      {/* Background: optional uploaded video / image, otherwise animated glow + grid */}
      {bgVideo ? (
        <video
          src={bgVideo}
          poster={bgImage || undefined}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : bgImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <div className="absolute -left-24 top-10 h-96 w-96 animate-drift rounded-full bg-accent/25 blur-[110px]" />
          <div
            className="absolute -right-24 bottom-0 h-[26rem] w-[26rem] animate-drift rounded-full bg-aqua/20 blur-[120px]"
            style={{ animationDelay: "-6s" }}
          />
          <div className="bg-grid absolute inset-0" />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/20 to-ink" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
        {settings.hero_eyebrow && (
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.3em] text-accent-light">
            {settings.hero_eyebrow}
          </p>
        )}
        <h1
          className="text-gradient mt-5 animate-rise font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
          style={{ animationDelay: "0.1s" }}
        >
          {settings.hero_title}
        </h1>
        {settings.hero_subtitle && (
          <p
            className="mx-auto mt-7 max-w-xl animate-rise text-lg text-paper/70"
            style={{ animationDelay: "0.2s" }}
          >
            {settings.hero_subtitle}
          </p>
        )}
        <div
          className="mt-9 flex animate-rise flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.3s" }}
        >
          <Link href="/projects" className="btn btn-solid">
            Explore projects →
          </Link>
          <Link href="/#contact" className="btn btn-ghost">
            Get in touch
          </Link>
        </div>

        {stats.length > 0 && (
          <dl
            className="mx-auto mt-14 flex max-w-md animate-rise justify-center divide-x divide-line"
            style={{ animationDelay: "0.4s" }}
          >
            {stats.map((s) => (
              <div key={s.label} className="px-6 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl text-paper">{s.value}</dd>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-paper/45">
                  {s.label}
                </p>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
