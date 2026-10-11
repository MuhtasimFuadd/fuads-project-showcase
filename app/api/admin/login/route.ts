import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  SESSION_SECONDS,
  createAdminSessionToken,
  isCorrectPassword
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  let password: string;
  try {
    const body = await request.json();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let ok = false;
  try {
    ok = Boolean(password) && isCorrectPassword(password);
  } catch {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on the server." },
      { status: 500 }
    );
  }

  if (!ok) {
    // A small delay makes password-guessing scripts much slower.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  cookies().set(ADMIN_COOKIE_NAME, await createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS
  });
  return NextResponse.json({ ok: true });
}
