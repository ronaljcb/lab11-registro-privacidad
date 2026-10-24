import { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { database } from "@/lib/db";
import { personSchema } from "@/lib/validation";
import { COOKIE_NAME, errorResponse, getSession, json, mutationGuard, mutationSession } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const sql = database();
    const session = await getSession(request);
    const rows = await sql`SELECT id, first_name AS "firstName", last_name AS "lastName", email, phone, created_at AS "createdAt"
      FROM lab11_personas WHERE owner_hash = ${session.hash} AND expires_at > now() ORDER BY created_at DESC, id LIMIT 50`;
    const response = json({ data: rows, expiresAt: session.expiresAt });
    if (session.token) response.cookies.set(COOKIE_NAME, session.token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 86400,
    });
    return response;
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: NextRequest) {
  const guard = mutationGuard(request);
  if (guard) return guard;
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Se requiere contenido JSON." }, 415);
  const body = await request.text();
  if (new TextEncoder().encode(body).length > 2048) return json({ error: "El registro supera el tamaño permitido." }, 413);
  let payload: unknown;
  try { payload = JSON.parse(body); } catch { return json({ error: "El contenido JSON no es válido." }, 400); }
  const parsed = personSchema.safeParse(payload);
  if (!parsed.success) return json({ error: "Revisa los campos del formulario.", fields: parsed.error.flatten().fieldErrors }, 400);
  try {
    const { hash, response } = await mutationSession(request);
    if (response) return response;
    const sql = database();
    const value = parsed.data;
    const results = await sql.transaction([
      sql`SELECT pg_advisory_xact_lock(hashtextextended(${hash}, 0))`,
      sql`INSERT INTO lab11_personas (id, owner_hash, first_name, last_name, email, phone, expires_at)
        SELECT ${randomUUID()}, s.owner_hash, ${value.firstName}, ${value.lastName}, ${value.email}, ${value.phone || null}, s.expires_at
        FROM lab11_sessions s WHERE s.owner_hash = ${hash} AND s.expires_at > now()
          AND (SELECT count(*) FROM lab11_personas WHERE owner_hash = ${hash} AND expires_at > now()) < 50
        RETURNING id, first_name AS "firstName", last_name AS "lastName", email, phone, created_at AS "createdAt"`,
    ]);
    if (!results[1].length) return json({ error: "Llegaste al límite de 50 registros por sesión." }, 409);
    return json({ data: results[1][0] }, 201);
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "23505") return json({ error: "Ese correo ya está registrado en tu sesión." }, 409);
    return errorResponse(error);
  }
}
