import { BLOCK_KINDS, slugify, type BlockKind, type ProjectStatus } from "@/lib/content";

const STATUSES: ProjectStatus[] = ["completed", "in-progress", "concept"];
const KINDS = BLOCK_KINDS.map((b) => b.kind);

const str = (v: unknown, max = 5000) => String(v ?? "").trim().slice(0, max);

// Validates + cleans the project fields coming from the admin editor.
export function parseProjectInput(body: Record<string, unknown>) {
  const title = str(body.title, 160);
  if (!title) return { error: "A title is required." as const };

  const techRaw = Array.isArray(body.tech)
    ? (body.tech as unknown[]).map((t) => str(t, 40))
    : str(body.tech, 600).split(",");
  const tech = techRaw.map((t) => t.trim()).filter(Boolean).slice(0, 30);

  const status = STATUSES.includes(body.status as ProjectStatus)
    ? (body.status as ProjectStatus)
    : "completed";

  const sort = Number(body.sort_order);

  return {
    fields: {
      title,
      slug: slugify(str(body.slug, 80) || title),
      tagline: str(body.tagline, 240),
      description: str(body.description, 8000),
      category: str(body.category, 60),
      tech,
      status,
      cover_image_url: str(body.cover_image_url, 1000),
      cover_video_url: str(body.cover_video_url, 1000),
      live_url: str(body.live_url, 1000),
      repo_url: str(body.repo_url, 1000),
      project_date: str(body.project_date, 40),
      accent: /^#[0-9a-fA-F]{6}$/.test(str(body.accent, 7)) ? str(body.accent, 7) : null,
      featured: Boolean(body.featured),
      published: body.published === undefined ? true : Boolean(body.published),
      sort_order: Number.isFinite(sort) ? Math.trunc(sort) : 0
    }
  };
}

export function parseBlocks(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 200)
    .map((b, i) => {
      const o = (b ?? {}) as Record<string, unknown>;
      const kind = KINDS.includes(o.kind as BlockKind) ? (o.kind as BlockKind) : null;
      if (!kind) return null;
      return {
        kind,
        content: str(o.content, 20000),
        url: str(o.url, 1000),
        caption: str(o.caption, 400),
        sort_order: i
      };
    })
    .filter((b): b is NonNullable<typeof b> => b !== null);
}
