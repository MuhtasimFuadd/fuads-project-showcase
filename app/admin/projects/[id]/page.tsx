import { notFound } from "next/navigation";
import { requireAdminPage, isSupabaseConfigured } from "@/lib/require-admin-page";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import AdminShell, { SetupNotice } from "@/components/admin/AdminShell";
import ProjectEditor from "@/components/admin/ProjectEditor";
import type { Block, Project } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { created?: string };
}) {
  await requireAdminPage();
  if (!isSupabaseConfigured()) {
    return <AdminShell title="Edit project"><SetupNotice /></AdminShell>;
  }

  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("projects").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();

  const { data: blocks } = await supabase
    .from("project_blocks")
    .select("id, kind, content, url, caption, sort_order")
    .eq("project_id", params.id)
    .order("sort_order", { ascending: true });

  const project = { ...(data as Project), tech: (data as Project).tech ?? [] };

  return (
    <AdminShell
      title={project.title}
      description={searchParams.created ? "Project created ✓ — keep adding content below." : "Edit this project."}
    >
      <ProjectEditor key={project.id} project={project} blocks={(blocks ?? []) as Block[]} />
    </AdminShell>
  );
}
