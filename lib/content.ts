import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type ProjectStatus = "completed" | "in-progress" | "concept";

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  concept: "Concept"
};

export type BlockKind =
  | "heading"
  | "text"
  | "image"
  | "video"
  | "embed"
  | "code"
  | "quote"
  | "link";

export const BLOCK_KINDS: { kind: BlockKind; label: string }[] = [
  { kind: "text", label: "Text" },
  { kind: "heading", label: "Heading" },
  { kind: "image", label: "Image" },
  { kind: "video", label: "Video" },
  { kind: "embed", label: "Embed (YouTube…)" },
  { kind: "code", label: "Code" },
  { kind: "quote", label: "Quote" },
  { kind: "link", label: "Button link" }
];

export type Block = {
  id: string;
  kind: BlockKind;
  content: string;
  url: string;
  caption: string;
  sort_order: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  tech: string[];
  status: ProjectStatus;
  cover_image_url: string;
  cover_video_url: string;
  live_url: string;
  repo_url: string;
  project_date: string;
  accent: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
};

/* ------------------------------------------------------------------ *
 * Site settings (every editable piece of site text lives here)
 * ------------------------------------------------------------------ */

export const SETTING_KEYS = [
  "hero_eyebrow",
  "hero_title",
  "hero_subtitle",
  "hero_image_url",
  "hero_video_url",
  "about_title",
  "about_text",
  "avatar_url",
  "skills",
  "email",
  "github",
  "linkedin",
  "twitter",
  "youtube",
  "website",
  "resume_url",
  "footer_note"
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];
export type Settings = Record<SettingKey, string>;

export const DEFAULT_SETTINGS: Settings = {
  hero_eyebrow: "Personal projects · built for curiosity",
  hero_title: "Fuad's Project Showcase",
  hero_subtitle:
    "A living collection of the apps, experiments and ideas I've built on my own time — with the stories behind them.",
  hero_image_url: "",
  hero_video_url: "",
  about_title: "About me",
  about_text:
    "Hi, I'm Fuad. I like turning half-formed ideas into things that actually run.\n\nThis site is where my personal projects live — what I built, why I built it, what broke along the way, and what I learned. Everything here is made outside of work, for the fun of it.\n\n(You can change this text anytime from the admin panel → Site content.)",
  avatar_url: "",
  skills: "TypeScript\nReact\nNext.js\nPython\nSupabase\nTailwind CSS\nGit\nUI design",
  email: "",
  github: "",
  linkedin: "",
  twitter: "",
  youtube: "",
  website: "",
  resume_url: "",
  footer_note: "Built with Next.js & Supabase."
};

/* ------------------------------------------------------------------ *
 * Sample data — shown ONLY while Supabase isn't connected yet, so the
 * site always runs. Once it's connected, only your real data shows.
 * ------------------------------------------------------------------ */

const SAMPLE_PROJECTS: Project[] = [
  {
    id: "sample-1",
    slug: "pulse-habit-tracker",
    title: "Pulse — Habit Tracker",
    tagline: "A tiny habit tracker with streaks, heat-maps and zero guilt trips.",
    description:
      "Pulse started as a weekend itch: every habit app I tried was either too noisy or too empty. This one keeps a clean daily grid, celebrates streaks quietly, and works offline.",
    category: "Web app",
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    status: "completed",
    cover_image_url: "",
    cover_video_url: "",
    live_url: "",
    repo_url: "",
    project_date: "2025",
    accent: "#FF8A4C",
    featured: true,
    published: true,
    sort_order: 1,
    created_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "sample-2",
    slug: "orbit-weather",
    title: "Orbit — Weather Dashboard",
    tagline: "Forecasts as a calm, glanceable dashboard with live radar.",
    description:
      "Orbit pulls forecast data from a public API and turns it into one glanceable screen: now, next six hours, and the week ahead.",
    category: "Web app",
    tech: ["React", "D3", "REST APIs"],
    status: "completed",
    cover_image_url: "",
    cover_video_url: "",
    live_url: "",
    repo_url: "",
    project_date: "2024",
    accent: "#4FD1C5",
    featured: true,
    published: true,
    sort_order: 2,
    created_at: "2024-09-01T00:00:00Z"
  },
  {
    id: "sample-3",
    slug: "neon-runner",
    title: "Neon Runner",
    tagline: "A one-button endless runner built for the browser in a week.",
    description:
      "A tiny arcade game: one button, increasing speed, procedurally generated obstacles and a global high-score table.",
    category: "Game",
    tech: ["JavaScript", "Canvas", "Web Audio"],
    status: "completed",
    cover_image_url: "",
    cover_video_url: "",
    live_url: "",
    repo_url: "",
    project_date: "2024",
    accent: "#B07CFF",
    featured: true,
    published: true,
    sort_order: 3,
    created_at: "2024-06-01T00:00:00Z"
  },
  {
    id: "sample-4",
    slug: "chatterbox-notes",
    title: "Chatterbox — AI Notes",
    tagline: "Talk to your notes: search, summarise and connect ideas.",
    description:
      "An experiment in making a personal notebook you can have a conversation with. Currently in progress.",
    category: "AI",
    tech: ["Python", "LLM APIs", "Vector search"],
    status: "in-progress",
    cover_image_url: "",
    cover_video_url: "",
    live_url: "",
    repo_url: "",
    project_date: "2025",
    accent: "#5B8CFF",
    featured: false,
    published: true,
    sort_order: 4,
    created_at: "2025-03-01T00:00:00Z"
  },
  {
    id: "sample-5",
    slug: "greenhouse-monitor",
    title: "Greenhouse Monitor",
    tagline: "A microcontroller + sensors keeping plants alive from my phone.",
    description:
      "Soil moisture, temperature and light sensors feed a little dashboard and send alerts when the plants get thirsty.",
    category: "Hardware",
    tech: ["ESP32", "C++", "MQTT"],
    status: "concept",
    cover_image_url: "",
    cover_video_url: "",
    live_url: "",
    repo_url: "",
    project_date: "Planned",
    accent: "#6FCF6B",
    featured: false,
    published: true,
    sort_order: 5,
    created_at: "2025-05-01T00:00:00Z"
  }
];

const SAMPLE_BLOCKS: Record<string, Block[]> = {
  "sample-1": [
    { id: "b1", kind: "heading", content: "Why I built it", url: "", caption: "", sort_order: 1 },
    {
      id: "b2",
      kind: "text",
      content:
        "Most habit trackers punish you for missing a day. Pulse does the opposite — it shows **consistency over time** instead of a fragile streak.\n\n- Daily grid with one-tap check-ins\n- Weekly and monthly heat-maps\n- Works offline and syncs later",
      url: "",
      caption: "",
      sort_order: 2
    },
    {
      id: "b3",
      kind: "quote",
      content: "The best tracker is the one you still open in week six.",
      url: "",
      caption: "Design note",
      sort_order: 3
    },
    {
      id: "b4",
      kind: "code",
      content: "const streak = days.reduce((n, d) => (d.done ? n + 1 : 0), 0);",
      url: "",
      caption: "The (very forgiving) streak logic",
      sort_order: 4
    }
  ]
};

/* ------------------------------------------------------------------ *
 * Supabase read client (public anon key, never cached)
 * ------------------------------------------------------------------ */

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  // Next.js caches every fetch() by default — even ones inside supabase-js —
  // which would keep serving stale projects after you edit them in the admin.
  return createClient(url, key, {
    auth: { persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) }
  });
}

function normalizeProject(row: Record<string, unknown>): Project {
  return {
    ...(row as unknown as Project),
    tech: Array.isArray(row.tech) ? (row.tech as string[]) : []
  };
}

/* ------------------------------------------------------------------ *
 * Public reads
 * ------------------------------------------------------------------ */

export const getSettings = cache(async (): Promise<Settings> => {
  const supabase = getSupabase();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error || !data) return DEFAULT_SETTINGS;

  const merged: Settings = { ...DEFAULT_SETTINGS };
  for (const row of data as { key: string; value: string }[]) {
    if ((SETTING_KEYS as readonly string[]).includes(row.key)) {
      // An empty saved value means "I cleared this", except for text the
      // site can't look right without.
      merged[row.key as SettingKey] = row.value;
    }
  }
  if (!merged.hero_title.trim()) merged.hero_title = DEFAULT_SETTINGS.hero_title;
  return merged;
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const supabase = getSupabase();
  if (!supabase) return SAMPLE_PROJECTS;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(normalizeProject);
});

export async function getProjectBySlug(
  slug: string
): Promise<{ project: Project; blocks: Block[] } | null> {
  const supabase = getSupabase();
  if (!supabase) {
    const project = SAMPLE_PROJECTS.find((p) => p.slug === slug);
    return project ? { project, blocks: SAMPLE_BLOCKS[project.id] ?? [] } : null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;

  const project = normalizeProject(data as Record<string, unknown>);
  const { data: blocks } = await supabase
    .from("project_blocks")
    .select("id, kind, content, url, caption, sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });

  return { project, blocks: (blocks ?? []) as Block[] };
}

/* ------------------------------------------------------------------ *
 * Small helpers shared by pages and the admin
 * ------------------------------------------------------------------ */

export function skillsList(settings: Settings): string[] {
  return settings.skills
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Only ever let http(s)/mailto/relative URLs reach an href or src.
export function safeUrl(raw: string): string {
  const url = (raw ?? "").trim();
  if (!url) return "";
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (/^(https?:\/\/|mailto:)/i.test(url)) return url;
  return "";
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project"
  );
}

// Turns a normal YouTube / Vimeo / Loom / CodePen / CodeSandbox / Figma link
// into the URL an <iframe> needs. Anything else is rejected, so an admin typo
// (or a hostile paste) can never embed an arbitrary site.
export function toEmbedUrl(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }
    const m = u.pathname.match(/^\/(embed|shorts|live)\/([\w-]+)/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[2]}` : null;
  }
  if (host === "vimeo.com") {
    const m = u.pathname.match(/^\/(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}` : null;
  }
  if (host === "player.vimeo.com") return u.toString();
  if (host === "loom.com") {
    const m = u.pathname.match(/^\/(share|embed)\/([\w]+)/);
    return m ? `https://www.loom.com/embed/${m[2]}` : null;
  }
  if (host === "codepen.io") return u.toString().replace("/pen/", "/embed/");
  if (host === "codesandbox.io") return u.toString().replace("/s/", "/embed/");
  if (host === "figma.com") {
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(u.toString())}`;
  }
  return null;
}

export function isVideoFile(url: string): boolean {
  return /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(url);
}
