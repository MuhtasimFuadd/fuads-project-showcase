import { requireAdminPage, isSupabaseConfigured } from "@/lib/require-admin-page";
import AdminShell, { SetupNotice } from "@/components/admin/AdminShell";
import ProjectEditor from "@/components/admin/ProjectEditor";

export default async function NewProjectPage() {
  await requireAdminPage();
  return (
    <AdminShell title="New project" description="Fill in what you have — you can come back and edit anything later.">
      {isSupabaseConfigured() ? <ProjectEditor /> : <SetupNotice />}
    </AdminShell>
  );
}
