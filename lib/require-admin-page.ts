import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";

// Call at the top of any admin PAGE (API routes use lib/require-admin.ts).
// Middleware already blocks signed-out visitors; this is a second check.
export async function requireAdminPage(): Promise<void> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    redirect("/admin/login");
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
