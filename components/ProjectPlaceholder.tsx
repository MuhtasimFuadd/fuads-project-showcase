// Shown wherever a project has no cover image yet — a generated tile tinted
// with the project's accent colour, so an empty card still looks intentional.
export default function ProjectPlaceholder({
  color,
  label
}: {
  color?: string | null;
  label?: string;
}) {
  const c = color || "#FF8A4C";
  const initials = (label ?? "")
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w))
    .slice(0, 2)
    .map((w) => (w.match(/[\p{L}\p{N}]/u)?.[0] ?? "").toUpperCase())
    .join("");

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 20% 10%, ${c}55 0%, transparent 60%), radial-gradient(90% 80% at 90% 100%, ${c}33 0%, transparent 60%), #10131A`
      }}
      aria-hidden="true"
    >
      <div className="bg-grid absolute inset-0 opacity-70" />
      <span
        className="relative font-display text-6xl font-semibold tracking-tight"
        style={{ color: c, opacity: 0.85 }}
      >
        {initials || "{ }"}
      </span>
    </div>
  );
}
