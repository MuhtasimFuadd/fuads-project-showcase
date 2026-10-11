import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

// Tiny per-instance rate limit (3 messages / 10 min per IP). It's best-effort
// on serverless hosts, but together with the honeypot it stops casual spam.
const hits = new Map<string, number[]>();

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot filled in => a bot. Pretend it worked.
  if (String(body.company ?? "").trim()) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 3) {
    return NextResponse.json(
      { error: "You've sent a few messages already — please try again later." },
      { status: 429 }
    );
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 4000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please fill in all fields with a valid email." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "The contact form isn't connected yet (database not configured)." },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("messages").insert({ name, email, message });
  if (error) return NextResponse.json({ error: "Could not save your message." }, { status: 500 });

  hits.set(ip, [...recent, now]);
  return NextResponse.json({ ok: true });
}
