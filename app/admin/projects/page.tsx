import Link from "next/link";
import { requireAdminPage, isSupabaseConfigured } from "@/lib/require-admin-page";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import AdminShell, { SetupNotice } from "@/components/admin/AdminShell";
import ProjectsList from "@/components/admin/ProjectsList";
import type { Project } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requireAdminPage();
  if (!isSupabaseConfigured()) {
    return <AdminShell title="Projects"><SetupNotice /></AdminShell>;
  }

  const { data } = await getSupabaseAdmin()
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const projects = ((data ?? []) as Project[]).map((p) => ({ ...p, tech: p.tech ?? [] }));

  return (
    <AdminShell title="Projects" description="Drafts are hidden from visitors until you publish them.">
      <div className="mb-6">
        <Link href="/admin/projects/new" className="btn btn-solid">+ New project</Link>
      </div>
      <ProjectsList projects={projects} />
    </AdminShell>
  );
}
