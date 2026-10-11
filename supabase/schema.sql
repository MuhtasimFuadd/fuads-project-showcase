-- Fuad's Project Showcase — run this ONCE in Supabase: SQL Editor -> New query -> Run.
-- Safe to re-run: everything is "if not exists" / "or replace".

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                    -- used in the URL: /projects/<slug>
  title text not null,
  tagline text not null default '',             -- one-line summary shown on cards
  description text not null default '',         -- the intro text on the project page
  category text not null default '',            -- e.g. "Web app", "Game", "Hardware"
  tech text[] not null default '{}',            -- e.g. {React,Supabase,Tailwind}
  status text not null default 'completed',     -- 'completed' | 'in-progress' | 'concept'
  cover_image_url text not null default '',
  cover_video_url text not null default '',     -- optional: plays on hover on the card
  live_url text not null default '',
  repo_url text not null default '',
  project_date text not null default '',        -- free text, e.g. "Mar 2025"
  accent text,                                  -- placeholder colour until a cover is set
  featured boolean not null default false,      -- shown on the home page
  published boolean not null default true,      -- false = draft, hidden from visitors
  sort_order integer not null default 0,        -- lower comes first
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- PROJECT BLOCKS — the flexible content of each project page:
-- text, headings, images, videos, embeds, code, quotes, links.
-- ============================================================
create table if not exists project_blocks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  kind text not null,                           -- heading|text|image|video|embed|code|quote|link
  content text not null default '',             -- text / heading / code / quote / link label
  url text not null default '',                 -- image / video / embed / link url
  caption text not null default '',
  sort_order integer not null default 0
);
create index if not exists project_blocks_project_idx on project_blocks(project_id, sort_order);

-- ============================================================
-- SITE SETTINGS — hero text, about text, contact + social links...
-- One row per setting (key/value) so new settings never need a migration.
-- ============================================================
create table if not exists site_settings (
  key text primary key,
  value text not null default ''
);

-- ============================================================
-- MESSAGES — sent through the contact form. Private: admin only.
-- ============================================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- SECURITY (Row Level Security)
-- Visitors (the "anon" key) can only READ published projects, their blocks
-- and the site settings. All writes go through the admin panel's server-side
-- service-role key, which bypasses RLS. Messages have NO public policy.
-- ============================================================
alter table projects enable row level security;
alter table project_blocks enable row level security;
alter table site_settings enable row level security;
alter table messages enable row level security;

drop policy if exists "Published projects are public" on projects;
create policy "Published projects are public"
  on projects for select using (published = true);

drop policy if exists "Blocks of published projects are public" on project_blocks;
create policy "Blocks of published projects are public"
  on project_blocks for select
  using (exists (select 1 from projects p where p.id = project_id and p.published = true));

drop policy if exists "Settings are public" on site_settings;
create policy "Settings are public"
  on site_settings for select using (true);

grant usage on schema public to anon, authenticated, service_role;
grant select on projects, project_blocks, site_settings to anon, authenticated;
grant select, insert, update, delete on projects, project_blocks, site_settings, messages to service_role;

-- ============================================================
-- STORAGE — one public bucket for every image / video / PDF you upload.
-- 50 MB is the cap on Supabase's free plan; raise it if you upgrade.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media', 'portfolio-media', true, 52428800,
  array['image/jpeg','image/png','image/webp','image/gif','image/avif','image/svg+xml',
        'video/mp4','video/webm','video/quicktime','application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read access to portfolio media" on storage.objects;
create policy "Public read access to portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');
-- Uploads happen through short-lived signed URLs created by the admin API
-- (service role), so no public insert policy is needed — or wanted.

-- ============================================================
-- STARTER TEXT (only inserted if missing; edit it later in /admin/site)
-- ============================================================
insert into site_settings (key, value) values
  ('hero_eyebrow', 'Personal projects · built for curiosity'),
  ('hero_title', 'Fuad''s Project Showcase'),
  ('hero_subtitle', 'A living collection of the apps, experiments and ideas I''ve built on my own time — with the stories behind them.')
on conflict (key) do nothing;
