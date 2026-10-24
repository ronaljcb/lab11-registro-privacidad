import { database } from "@/lib/db";
import { json } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET() {
  try { await database()`SELECT 1 FROM lab11_sessions LIMIT 1`; return json({ status: "ok", storage: "PostgreSQL", mode: "academic-demo" }); }
  catch { return json({ status: "unavailable" }, 503); }
}
