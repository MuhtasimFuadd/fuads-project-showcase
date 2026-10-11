import Link from "next/link";

export default function AdminCardLink({
  href,
  title,
  description,
  badge
}: {
  href: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-accent/60 hover:bg-accent/5"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-xl text-paper group-hover:text-accent-light">{title}</h2>
        {badge && (
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-xs text-ink">{badge}</span>
        )}
      </div>
      <p className="mt-2 text-sm text-paper/60">{description}</p>
      <span className="mt-4 inline-block text-xs uppercase tracking-wide text-accent-light">Open →</span>
    </Link>
  );
}
