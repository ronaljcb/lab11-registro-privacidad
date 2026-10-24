import { NextRequest } from "next/server";
import { database } from "@/lib/db";
import { errorResponse, json, mutationGuard, mutationSession } from "@/lib/http";
export const runtime = "nodejs";
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const guard = mutationGuard(request);
  if (guard) return guard;
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Registro no encontrado." }, 404);
  try {
    const { hash, response } = await mutationSession(request);
    if (response) return response;
    const rows = await database()`DELETE FROM lab11_personas WHERE id = ${id} AND owner_hash = ${hash} AND expires_at > now() RETURNING id`;
    return rows.length ? json({ deleted: true }) : json({ error: "Registro no encontrado." }, 404);
  } catch (error) { return errorResponse(error); }
}
