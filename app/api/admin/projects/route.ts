import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";
import { parseBlocks, parseProjectInput } from "@/lib/project-input";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const parsed = parseProjectInput(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const fields = { ...parsed.fields };

  // The slug is the project's URL. If it's taken, add a short suffix.
  let project: { id: string; slug: string } | null = null;
  let lastError = "";
  for (let attempt = 0; attempt < 4 && !project; attempt++) {
    const slug = attempt === 0 ? fields.slug : `${fields.slug}-${randomUUID().slice(0, 4)}`;
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...fields, slug })
      .select("id, slug")
      .single();
    if (data) project = data;
    else if (error?.code !== "23505") {
      lastError = error?.message ?? "Could not create project.";
      break;
    }
  }
  if (!project) {
    return NextResponse.json({ error: lastError || "Could not create project." }, { status: 500 });
  }

  const blocks = parseBlocks(body.blocks).map((b) => ({ ...b, project_id: project!.id }));
  if (blocks.length > 0) {
    const { error } = await supabase.from("project_blocks").insert(blocks);
    if (error) return NextResponse.json({ error: error.message, id: project.id }, { status: 500 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ id: project.id, slug: project.slug }, { status: 201 });
}
