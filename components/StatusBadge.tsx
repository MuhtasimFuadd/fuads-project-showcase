import { STATUS_LABELS, type ProjectStatus } from "@/lib/content";

const STYLES: Record<ProjectStatus, string> = {
  completed: "border-aqua/40 text-aqua",
  "in-progress": "border-accent/50 text-accent-light",
  concept: "border-paper/25 text-paper/60"
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const s = (status in STATUS_LABELS ? status : "completed") as ProjectStatus;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border bg-ink/70 px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider backdrop-blur ${STYLES[s]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[s]}
    </span>
  );
}
