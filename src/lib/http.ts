import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { database } from "./db";
export const COOKIE_NAME = "registro_session";
export const privateHeaders = { "Cache-Control": "private, no-store, max-age=0", "Vary": "Cookie" };
export const fingerprint = (value: string) => createHash("sha256").update(value).digest("hex");
export function sessionHash(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? fingerprint(token) : null;
}
export function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: privateHeaders }); }
export function errorResponse(error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error ? error.code : "unknown";
  console.error("registry_request_failed", { code: typeof code === "string" ? code : "unknown" });
  return json({ error: "No pudimos completar la solicitud. Inténtalo nuevamente." }, 503);
}
export function mutationGuard(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return json({ error: "Origen de solicitud no permitido." }, 403);
  if (!sessionHash(request)) return json({ error: "Abre el registro para iniciar tu sesión." }, 401);
  return null;
}
export async function getSession(request: NextRequest) {
  const sql = database();
  const hash = sessionHash(request);
  if (hash) {
    const existing = await sql`SELECT owner_hash, expires_at FROM lab11_sessions WHERE owner_hash = ${hash} AND expires_at > now()`;
    if (existing[0]) return { hash, expiresAt: existing[0].expires_at as string, token: null };
  }
  const token = randomBytes(32).toString("base64url");
  const nextHash = fingerprint(token);
  const rows = await sql`INSERT INTO lab11_sessions (owner_hash) VALUES (${nextHash}) RETURNING expires_at`;
  return { hash: nextHash, expiresAt: rows[0].expires_at as string, token };
}
export async function mutationSession(request: NextRequest) {
  const sql = database();
  const hash = sessionHash(request)!;
  const rows = await sql`UPDATE lab11_sessions SET
      request_count = CASE WHEN window_started < now() - interval '1 minute' THEN 1 ELSE request_count + 1 END,
      window_started = CASE WHEN window_started < now() - interval '1 minute' THEN now() ELSE window_started END
    WHERE owner_hash = ${hash} AND expires_at > now()
      AND (window_started < now() - interval '1 minute' OR request_count < 20)
    RETURNING owner_hash`;
  if (rows.length) return { hash, response: null };
  const live = await sql`SELECT 1 FROM lab11_sessions WHERE owner_hash = ${hash} AND expires_at > now()`;
  const response = live.length ? json({ error: "Has realizado varias solicitudes. Espera un minuto." }, 429)
    : json({ error: "Tu sesión venció. Recarga la página para continuar." }, 401);
  if (live.length) response.headers.set("Retry-After", "60");
  return { hash, response };
}
