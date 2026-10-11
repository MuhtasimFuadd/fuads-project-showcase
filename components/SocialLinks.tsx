import { safeUrl, type Settings } from "@/lib/content";

export function socialItems(s: Settings) {
  const items: { label: string; href: string }[] = [];
  const add = (label: string, raw: string, prefix = "") => {
    const v = raw.trim();
    if (!v) return;
    const href = safeUrl(prefix + v);
    if (href) items.push({ label, href });
  };
  add("GitHub", s.github);
  add("LinkedIn", s.linkedin);
  add("X / Twitter", s.twitter);
  add("YouTube", s.youtube);
  add("Website", s.website);
  add("Email", s.email, "mailto:");
  return items;
}

export default function SocialLinks({ settings }: { settings: Settings }) {
  const items = socialItems(settings);
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((i) => (
        <li key={i.label}>
          <a
            href={i.href}
            target={i.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-line px-4 py-1.5 text-sm text-paper/75 transition-colors hover:border-accent/60 hover:text-accent-light"
          >
            {i.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
