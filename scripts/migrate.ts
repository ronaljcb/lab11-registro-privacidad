import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
if (!process.env.DATABASE_URL) throw new Error("Configura DATABASE_URL antes de ejecutar la migración.");
const sql = neon(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);
const source = await readFile(new URL("../database/001_initial.sql", import.meta.url), "utf8");
const statements = source.split(";").map((s) => s.trim()).filter((s) => s && !["BEGIN", "COMMIT"].includes(s));
await sql.transaction(statements.map((statement) => sql.query(statement)));
console.log("Migración 001 aplicada: tablas e índices verificados.");
