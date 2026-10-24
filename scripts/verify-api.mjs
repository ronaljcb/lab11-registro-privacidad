import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:3111";
const origin = new URL(base).origin;
const checks = [];
async function start() {
  const response = await fetch(`${base}/api/personas`);
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  assert.ok(cookie);
  assert.match(response.headers.get("cache-control"), /no-store/);
  return cookie;
}
async function request(cookie, method, path, value, customOrigin = origin) {
  return fetch(`${base}${path}`, { method, headers: { Cookie: cookie, Origin: customOrigin, "Content-Type": "application/json" }, ...(value === undefined ? {} : { body: typeof value === "string" ? value : JSON.stringify(value) }) });
}
function passed(name) { checks.push(name); console.log(`PASS ${name}`); }
const a = await start(); const b = await start();
passed("Cookie de sesión y respuestas sin caché");
const person = { firstName: "Persona", lastName: "Prueba", email: `qa.${Date.now()}@example.com`, phone: "000000900", demoAcknowledged: true };
const created = await request(a, "POST", "/api/personas", person);
assert.equal(created.status, 201, await created.clone().text());
const id = (await created.json()).data.id;
passed("Registro persistente en PostgreSQL");
const list = await request(a, "GET", "/api/personas");
assert.ok((await list.json()).data.some((row) => row.id === id));
passed("Lectura posterior recupera el registro");
const other = await request(b, "GET", "/api/personas");
assert.ok(!(await other.json()).data.some((row) => row.id === id));
assert.equal((await request(b, "DELETE", `/api/personas/${id}`)).status, 404);
passed("Aislamiento: otra sesión no lista ni elimina el registro");
assert.equal((await request(a, "POST", "/api/personas", person)).status, 409);
passed("Duplicados rechazados por sesión");
assert.equal((await request(a, "POST", "/api/personas", { ...person, email: "correo@gmail.com" })).status, 400);
assert.equal((await request(a, "POST", "/api/personas", { ...person, phone: "999999999" })).status, 400);
assert.equal((await request(a, "POST", "/api/personas", { ...person, demoAcknowledged: false })).status, 400);
passed("Rechazo de correo real, teléfono real y confirmación ausente");
assert.equal((await request(a, "POST", "/api/personas", person, "https://otro-sitio.example")).status, 403);
assert.equal((await request("", "POST", "/api/personas", person)).status, 401);
passed("Mutaciones exigen origen correcto y sesión");
assert.equal((await request(a, "POST", "/api/personas", "{")).status, 400);
assert.equal((await request(a, "POST", "/api/personas", "x".repeat(2100))).status, 413);
passed("JSON malformado y solicitudes excesivas rechazados");
const optional = await request(a, "POST", "/api/personas", { ...person, email: `sin.telefono.${Date.now()}@example.com`, phone: "" });
assert.equal(optional.status, 201);
const optionalData = (await optional.json()).data;
assert.equal(optionalData.phone, null);
passed("Registro sin teléfono admite valor nulo");
assert.equal((await request(a, "DELETE", `/api/personas/${id}`)).status, 200);
assert.equal((await request(a, "DELETE", `/api/personas/${optionalData.id}`)).status, 200);
assert.ok(!(await (await request(a, "GET", "/api/personas")).json()).data.some((row) => row.id === id));
passed("Eliminación propia comprobada por lectura posterior");
const c = await start();
for (let index = 0; index < 20; index++) assert.equal((await request(c, "DELETE", "/api/personas/00000000-0000-0000-0000-000000000000")).status, 404);
const limited = await request(c, "DELETE", "/api/personas/00000000-0000-0000-0000-000000000000");
assert.equal(limited.status, 429); assert.equal(limited.headers.get("retry-after"), "60");
passed("Límite persistente de 20 mutaciones por minuto");
assert.equal((await fetch(`${base}/api/health`)).status, 200);
passed("Salud del servicio comprueba conexión de base de datos");
console.log(JSON.stringify({ base, passed: checks.length, checks }, null, 2));
