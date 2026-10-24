import { neon } from "@neondatabase/serverless";
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL requerida.");
const rows = await neon(process.env.DATABASE_URL)`DELETE FROM lab11_sessions WHERE expires_at <= now() RETURNING owner_hash`;
console.log(`Sesiones vencidas eliminadas: ${rows.length}. Sus registros se eliminan en cascada.`);
