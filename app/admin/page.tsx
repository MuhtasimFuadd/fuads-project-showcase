import { requireAdminPage, isSupabaseConfigured } from "@/lib/require-admin-page";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import AdminShell, { SetupNotice } from "@/components/admin/AdminShell";
import AdminCardLink from "@/components/admin/AdminCardLink";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminPage();

  if (!isSupabaseConfigured()) {
    return (
      <AdminShell title="Admin">
        <SetupNotice />
      </AdminShell>
    );
  }

  const supabase = getSupabaseAdmin();
  const [{ count: total }, { count: drafts }, { count: unread }] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false)
  ]);

  return (
    <AdminShell title="Admin" description="Choose what you'd like to do. Everything you save here updates the live site immediately.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminCardLink
          href="/admin/projects/new"
          title="Add a new project"
          description="Create a project page with a cover, text, images, videos, embeds and code."
        />
        <AdminCardLink
          href="/admin/projects"
          title="Manage projects"
          description={`${total ?? 0} project${total === 1 ? "" : "s"}${drafts ? ` (${drafts} draft${drafts === 1 ? "" : "s"})` : ""} — edit, reorder, feature, hide or delete.`}
        />
        <AdminCardLink
          href="/admin/site"
          title="Site content"
          description="Edit the home page hero, About text, profile photo, skills, résumé and social links."
        />
        <AdminCardLink
          href="/admin/messages"
          title="Messages"
          description="Read what visitors sent through the contact form."
          badge={unread ? `${unread} new` : undefined}
        />
      </div>
    </AdminShell>
  );
}
