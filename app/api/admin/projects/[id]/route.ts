import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";
import { parseBlocks, parseProjectInput } from "@/lib/project-input";

// Full save from the editor: project fields + the complete list of blocks.
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const parsed = parseProjectInput(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("projects")
    .update({ ...parsed.fields, updated_at: new Date().toISOString() })
    .eq("id", params.id);

  if (error) {
    const msg =
      error.code === "23505"
        ? "That URL slug is already used by another project. Pick a different one."
        : error.message;
    return NextResponse.json({ error: msg }, { status: error.code === "23505" ? 409 : 500 });
  }

  // Swap blocks safely: insert the new set first, only then remove the old
  // one, so a failed insert can never leave the project with no content.
  if (Array.isArray(body.blocks)) {
    const { data: old } = await supabase
      .from("project_blocks")
      .select("id")
      .eq("project_id", params.id);

    const fresh = parseBlocks(body.blocks).map((b) => ({ ...b, project_id: params.id }));
    if (fresh.length > 0) {
      const { error: insErr } = await supabase.from("project_blocks").insert(fresh);
      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
    }
    const oldIds = (old ?? []).map((r) => r.id as string);
    if (oldIds.length > 0) {
      await supabase.from("project_blocks").delete().in("id", oldIds);
    }
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, slug: parsed.fields.slug });
}

// Quick toggles from the project list (published / featured).
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  const updates: Record<string, boolean> = {};
  if (typeof body.published === "boolean") updates.published = body.published;
  if (typeof body.featured === "boolean") updates.featured = body.featured;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from("projects").update(updates).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { error } = await getSupabaseAdmin().from("projects").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
