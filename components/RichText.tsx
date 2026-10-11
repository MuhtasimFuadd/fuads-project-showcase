import { safeUrl } from "@/lib/content";

// A deliberately tiny, safe text formatter for admin-written text boxes.
// Supports: blank line = new paragraph, "- item" lists, **bold**, *italic*,
// `code` and [label](https://link). It never uses dangerouslySetInnerHTML,
// so pasted text can't inject HTML or scripts.

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-paper">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={key}
          className="rounded bg-raised px-1.5 py-0.5 font-mono text-[0.85em] text-accent-light"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeUrl(link[2]);
      if (!href) return link[1];
      return (
        <a
          key={key}
          href={href}
          target={href.startsWith("/") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="text-accent-light underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

export default function RichText({
  text,
  className = ""
}: {
  text: string;
  className?: string;
}) {
  const chunks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-4 leading-relaxed text-paper/75 ${className}`}>
      {chunks.map((chunk, i) => {
        const lines = chunk.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-accent">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\s*[-*]\s+/, ""), `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {renderInline(l, `${i}-${j}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
