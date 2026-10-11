# Fuad's Project Showcase

A dark, modern portfolio site for personal projects, with an **online admin panel** so you can add and edit everything from your browser — no code changes needed.

- **Stack:** Next.js 14 (App Router, TypeScript) · Tailwind CSS · Supabase (database + file storage) · Vercel
- **Runs immediately:** until Supabase is connected, the site shows built-in sample projects so you can see the design.

## What visitors see

| Page | What's on it |
|---|---|
| `/` | Animated hero, featured projects, About me (photo, text, skills, résumé), contact form + social links |
| `/projects` | All projects with category filters and live search |
| `/projects/<slug>` | Cover image/video, intro, then your content blocks (text, headings, images, videos, YouTube/Vimeo embeds, code, quotes, buttons), tech list, demo/source links, "more projects" |

## What you can edit online (`/admin`)

- **Projects** – title, summary, category, date, status (completed / in progress / concept), technologies, live + source links, cover image, cover video (plays on hover), accent colour, featured, draft/published, order.
- **Page content blocks** – build each project page from reorderable blocks: Text, Heading, Image, Video (upload **or** paste a link), Embed (YouTube, Vimeo, Loom, CodePen, CodeSandbox, Figma), Code, Quote, Button link.
- **Site content** – hero title/subtitle/background image or video, About text, profile photo, skills, résumé PDF, email and social links, footer note.
- **Messages** – everything sent through the contact form (mark read, reply, delete).

Text boxes support: blank line = new paragraph, `- item` bullets, `**bold**`, `*italic*`, `` `code` ``, `[label](https://link)`.

## Setup

### 1. Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000 — the sample projects show right away.

### 2. Connect Supabase (needed for the admin panel)
1. Create a free project at https://supabase.com.
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**. (Creates the tables, security rules and the `portfolio-media` storage bucket.)
3. **Project Settings → API** → copy the Project URL, the anon/publishable key and the service_role/secret key.
4. `cp .env.local.example .env.local` and fill in the four values (the Project URL is just `https://xxxx.supabase.co`, with no `/rest/v1/`).
5. Restart `npm run dev`, go to `/admin`, log in with your `ADMIN_PASSWORD`.

> If the database is connected but you have no projects yet, the site shows an empty state (not the samples). Add your first project from **Admin → Add a new project**.

### 3. Deploy to Vercel
Push to GitHub, import the repo in Vercel, and add the same four environment variables (**Settings → Environment Variables**). `NEXT_PUBLIC_…` ones must be type *Config/Plain*, not *Secret*. Keep `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` server-side only.

## Good to know

- **Uploads go straight from the browser to Supabase Storage** using short-lived signed URLs, so large videos work on Vercel (a normal upload route is capped around 4.5 MB there). Limit is **50 MB per file** (Supabase's free-plan cap). For long videos, upload to YouTube/Vimeo and paste the link instead.
- **Security:** one shared admin password (like the original shop). The session cookie is HttpOnly and expires after 8 hours; every admin API route re-checks it. Visitors can only *read* published projects; all writes use the server-side service-role key. Use a long password.
- **Contact form** saves messages to the admin inbox. It does **not** email you — check **Admin → Messages**. (Resend, used in the old shop for order emails, could be added if you want email notifications.)
- Embeds are limited to a safe allow-list of hosts (YouTube, Vimeo, Loom, CodePen, CodeSandbox, Figma).

## Project structure
```
app/(site)/            public pages: home, /projects, /projects/[slug]
app/admin/             admin pages (login, projects, site content, messages)
app/api/admin/         protected write APIs (projects, settings, messages, upload-signing)
app/api/contact/       public contact-form endpoint
components/            site UI;  components/admin/ = admin UI (editor, block editor, uploader)
lib/content.ts         data reads, types, sample data, URL/embed helpers
lib/admin-auth.ts      password + signed session cookie
supabase/schema.sql    run once in Supabase
```

## Reused from the original shop
Next.js/Tailwind/Supabase setup, cookie-based admin login + middleware, `requireAdmin` guards, service-role client, "works on sample data first" fallback, and the admin card layout. The shop-specific parts (basket, checkout, orders, order emails, Google sign-in) were removed.
