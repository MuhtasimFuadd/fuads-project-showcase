import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";
import { SETTING_KEYS } from "@/lib/content";

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Only known keys are ever written.
  const rows = SETTING_KEYS.filter((k) => k in body).map((k) => ({
    key: k,
    value: String((body as Record<string, unknown>)[k] ?? "").slice(0, 10000)
  }));

  const { error } = await getSupabaseAdmin()
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
