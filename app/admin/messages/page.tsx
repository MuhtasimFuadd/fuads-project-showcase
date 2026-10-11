import { requireAdminPage, isSupabaseConfigured } from "@/lib/require-admin-page";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import AdminShell, { SetupNotice } from "@/components/admin/AdminShell";
import MessagesList, { type MessageRow } from "@/components/admin/MessagesList";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await requireAdminPage();
  if (!isSupabaseConfigured()) {
    return <AdminShell title="Messages"><SetupNotice /></AdminShell>;
  }
  const { data } = await getSupabaseAdmin()
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <AdminShell title="Messages" description="Sent through the contact form on your home page.">
      <MessagesList messages={(data ?? []) as MessageRow[]} />
    </AdminShell>
  );
}
