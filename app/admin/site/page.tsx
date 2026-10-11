import { requireAdminPage, isSupabaseConfigured } from "@/lib/require-admin-page";
import { getSettings } from "@/lib/content";
import AdminShell, { SetupNotice } from "@/components/admin/AdminShell";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  await requireAdminPage();
  if (!isSupabaseConfigured()) {
    return <AdminShell title="Site content"><SetupNotice /></AdminShell>;
  }
  const settings = await getSettings();
  return (
    <AdminShell title="Site content" description="The text, photos and links that appear around your projects.">
      <SiteSettingsForm initial={settings} />
    </AdminShell>
  );
}
