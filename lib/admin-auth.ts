// Uses the Web Crypto API (works in both the Edge middleware runtime and
// Node route handlers) instead of Node's "crypto" module, which doesn't run
// inside Next.js middleware.

export const ADMIN_COOKIE_NAME = "fuad_admin";
export const SESSION_SECONDS = 60 * 60 * 8; // 8 hours

function getPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD environment variable is not set.");
  }
  return password;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// The cookie holds "<expiry>.<signature>". The password itself is never
// stored, and a stolen cookie stops working after it expires (the original
// version's token never expired server-side).
export async function createAdminSessionToken(): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const sig = await hmacSha256Hex(getPassword(), `fuad-admin-session:${expires}`);
  return `${expires}.${sig}`;
}

export function isCorrectPassword(candidate: string): boolean {
  return constantTimeEqual(candidate, getPassword());
}

export async function isValidSessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  try {
    const [expiresRaw, sig] = token.split(".");
    const expires = Number(expiresRaw);
    if (!sig || !Number.isFinite(expires)) return false;
    if (expires < Math.floor(Date.now() / 1000)) return false;
    const expected = await hmacSha256Hex(
      getPassword(),
      `fuad-admin-session:${expires}`
    );
    return constantTimeEqual(sig, expected);
  } catch {
    return false;
  }
}
