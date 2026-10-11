import { isVideoFile, safeUrl, toEmbedUrl, type Block } from "@/lib/content";
import RichText from "./RichText";

function Caption({ text }: { text: string }) {
  if (!text) return null;
  return <figcaption className="mt-2 text-center text-sm text-paper/45">{text}</figcaption>;
}

function VideoOrEmbed({ block }: { block: Block }) {
  const url = block.url.trim();
  if (isVideoFile(url) && safeUrl(url)) {
    return (
      <figure>
        <video
          src={safeUrl(url)}
          controls
          playsInline
          preload="metadata"
          className="w-full rounded-2xl border border-line bg-black"
        />
        <Caption text={block.caption} />
      </figure>
    );
  }
  const embed = toEmbedUrl(url);
  if (embed) {
    return (
      <figure>
        <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-black">
          <iframe
            src={embed}
            title={block.caption || "Embedded media"}
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture; fullscreen; clipboard-write"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            className="h-full w-full"
          />
        </div>
        <Caption text={block.caption} />
      </figure>
    );
  }
  const href = safeUrl(url);
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
      Watch video ↗
    </a>
  ) : null;
}

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((b) => {
        switch (b.kind) {
          case "heading":
            return (
              <h2 key={b.id} className="pt-4 font-display text-2xl text-paper sm:text-3xl">
                {b.content}
              </h2>
            );
          case "text":
            return <RichText key={b.id} text={b.content} className="text-[1.02rem]" />;
          case "image": {
            const src = safeUrl(b.url);
            if (!src) return null;
            return (
              <figure key={b.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={b.caption || ""}
                  loading="lazy"
                  className="w-full rounded-2xl border border-line"
                />
                <Caption text={b.caption} />
              </figure>
            );
          }
          case "video":
          case "embed":
            return <VideoOrEmbed key={b.id} block={b} />;
          case "code":
            return (
              <figure key={b.id}>
                <pre className="overflow-x-auto rounded-2xl border border-line bg-panel p-5 font-mono text-sm leading-relaxed text-accent-light">
                  <code>{b.content}</code>
                </pre>
                <Caption text={b.caption} />
              </figure>
            );
          case "quote":
            return (
              <blockquote
                key={b.id}
                className="border-l-2 border-accent pl-5 font-display text-xl leading-snug text-paper/90"
              >
                {b.content}
                {b.caption && (
                  <footer className="mt-2 font-body text-sm text-paper/45">— {b.caption}</footer>
                )}
              </blockquote>
            );
          case "link": {
            const href = safeUrl(b.url);
            if (!href) return null;
            return (
              <div key={b.id}>
                <a
                  href={href}
                  target={href.startsWith("/") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="btn"
                >
                  {b.content || "Open link"} ↗
                </a>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
