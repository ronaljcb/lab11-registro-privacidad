"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, Database, LoaderCircle, LockKeyhole, Plus, RotateCw, Search, ShieldCheck, Sparkles, Trash2, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { examplePeople, personSchema, type Person, type PersonInput } from "@/lib/validation";

type Errors = Record<string, string[] | undefined>;
const emptyForm = { firstName: "", lastName: "", email: "", phone: "", demoAcknowledged: false };
function phoneLabel(value: string | null) { return value ? value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : "No registrado"; }
function Field({ name, label, hint, error, ...props }: React.ComponentProps<typeof Input> & { name: string; label: string; hint?: string; error?: string[] }) {
  return <div className="form-field"><Label htmlFor={name}>{label}</Label><Input {...props} id={name} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined} />{error ? <p id={`${name}-error`} className="field-error">{error[0]}</p> : hint ? <p id={`${name}-hint`} className="field-hint">{hint}</p> : null}</div>;
}
export function Registry() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [deleting, setDeleting] = useState<Person | null>(null);
  async function refresh() {
    setLoading(true); setProblem("");
    try {
      const response = await fetch("/api/personas", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setPeople(payload.data);
    } catch (error) { setProblem(error instanceof Error ? error.message : "No pudimos cargar el registro."); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/personas", { cache: "no-store", signal: controller.signal }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setPeople(payload.data); setLoading(false);
    }).catch((error) => { if (error.name !== "AbortError") { setProblem(error.message || "No pudimos cargar el registro."); setLoading(false); } });
    return () => controller.abort();
  }, []);
  async function createPerson(value: PersonInput) {
    const response = await fetch("/api/personas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
    const payload = await response.json();
    if (!response.ok) { if (payload.fields) setErrors(payload.fields); throw new Error(payload.error); }
    return payload.data as Person;
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setErrors({});
    const parsed = personSchema.safeParse(form);
    if (!parsed.success) { setErrors(parsed.error.flatten().fieldErrors); return; }
    setBusy(true);
    try { const person = await createPerson(parsed.data); setPeople((current) => [person, ...current]); setOpen(false); setForm(emptyForm); toast.success("Registro guardado"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "No pudimos guardar el registro."); }
    finally { setBusy(false); }
  }
  async function loadExamples() {
    setBusy(true); let created = 0;
    try {
      for (const value of examplePeople) {
        if (people.some((person) => person.email === value.email)) continue;
        const person = await createPerson(value); setPeople((current) => [person, ...current]); created++;
      }
      toast.success(created ? `${created} ejemplos guardados` : "Los ejemplos ya están en tu registro");
    } catch (error) { toast.error(error instanceof Error ? error.message : "No pudimos cargar los ejemplos."); }
    finally { setBusy(false); }
  }
  async function removePerson() {
    if (!deleting) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/personas/${deleting.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setPeople((current) => current.filter((person) => person.id !== deleting.id)); setDeleting(null); toast.success("Registro eliminado");
    } catch (error) { toast.error(error instanceof Error ? error.message : "No pudimos eliminar el registro."); }
    finally { setBusy(false); }
  }
  const filtered = people.filter((person) => `${person.firstName} ${person.lastName} ${person.email} ${person.phone ?? ""}`.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")));
  const ready = !loading && !problem;
  return <>
    <div className="page-heading"><div><p className="eyebrow">01 <span /> EL PUNTO DE PARTIDA</p><h1>Registro de personas<span>.</span></h1><p className="page-description">Un registro sencillo. Solo los datos que hacen falta.</p></div><Button className="primary-button" onClick={() => { setErrors({}); setOpen(true); }} disabled={!ready || busy}><Plus size={17} />Nuevo registro</Button></div>
    <div className="overview"><div className="overview-count"><span className="big-number">{loading ? "—" : String(people.length).padStart(2, "0")}</span><div><strong>Personas registradas</strong><span>En tu sesión de demostración</span></div></div><div className="overview-detail"><span className="tiny-icon"><Database size={18} /></span><div><strong>4 campos, una finalidad</strong><span>Probar el registro y analizar su privacidad.</span></div></div></div>
    <section className="register-section" aria-labelledby="list-title"><div className="section-toolbar"><h2 id="list-title">Tu registro <span>{people.length}</span></h2><div className="toolbar-actions"><div className="search-field"><Search size={16} /><Input aria-label="Buscar en el registro" placeholder="Buscar una persona…" value={search} onChange={(e) => setSearch(e.target.value)} /></div><Button variant="outline" size="icon" aria-label="Actualizar registro" onClick={refresh} disabled={loading || busy}><RotateCw size={15} className={loading ? "animate-spin" : ""} /></Button></div></div>
      <div className="register-table"><Table><TableHeader><TableRow><TableHead>PERSONA</TableHead><TableHead>CORREO ELECTRÓNICO</TableHead><TableHead>TELÉFONO</TableHead><TableHead className="text-right"><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader><TableBody>
        {ready && filtered.map((person, index) => <TableRow key={person.id}><TableCell><div className="person-cell"><span className={`person-avatar avatar-${index % 4}`} aria-hidden="true">{person.firstName[0]}{person.lastName[0]}</span><div><strong>{person.firstName} {person.lastName}</strong><span>Registro de prueba</span></div></div></TableCell><TableCell className="email-cell">{person.email}</TableCell><TableCell className={`phone-cell ${!person.phone ? "missing" : ""}`}>{phoneLabel(person.phone)}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" aria-label={`Eliminar a ${person.firstName} ${person.lastName}`} onClick={() => setDeleting(person)} disabled={busy}><Trash2 size={16} /></Button></TableCell></TableRow>)}
      </TableBody></Table>
      {loading ? <div className="empty-state" role="status"><LoaderCircle className="animate-spin" size={25} /><h3>Conectando con tu registro</h3><p>Estamos recuperando los datos de tu sesión.</p></div> : problem ? <div className="empty-state" role="alert"><Database size={25} /><h3>No pudimos conectar</h3><p>{problem}</p><Button variant="outline" onClick={refresh}>Volver a intentar</Button></div> : people.length === 0 ? <div className="empty-state"><span className="empty-icon"><UsersRound size={27} strokeWidth={1.3} /></span><h3>Tu registro empieza aquí</h3><p>Agrega una persona ficticia o carga los ejemplos<br className="desktop-break" /> para explorar cómo funciona.</p><Button variant="outline" onClick={loadExamples} disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <Sparkles size={15} />}Cargar ejemplos</Button></div> : filtered.length === 0 ? <div className="empty-state"><Search size={24} /><h3>No hay coincidencias</h3><p>Prueba con otro nombre o correo.</p><Button variant="outline" onClick={() => setSearch("")}>Limpiar búsqueda</Button></div> : null}</div>
      <div className="table-footer"><span>{ready ? `${filtered.length} de ${people.length} registros` : "Conexión con la base de datos"}</span><span><LockKeyhole size={12} />Visibles solo en esta sesión</span></div>
    </section>
    <section className="privacy-note"><div className="privacy-note-icon"><ShieldCheck size={22} strokeWidth={1.5} /></div><div><h2>La privacidad empieza antes de guardar.</h2><p>Usa nombres inventados, correos @example.com y teléfonos que empiecen con 000.<br className="desktop-break" />Tu sesión vence en 24 horas. Puedes eliminar tus registros en cualquier momento.</p></div><Link href="/privacidad">Cómo cuidamos los datos <ArrowRight size={16} /></Link></section>
    <div className="bottom-caption"><Check size={13} /><span>El teléfono es opcional. Si no hace falta, no lo recolectamos.</span></div>
    <Dialog open={open} onOpenChange={(value) => { if (!busy) setOpen(value); }}><DialogContent className="registry-dialog sm:max-w-[510px]" showCloseButton={!busy}><DialogHeader><p className="eyebrow">UN REGISTRO, CUATRO CAMPOS</p><DialogTitle className="text-2xl">Nueva persona</DialogTitle><DialogDescription>Registra una persona ficticia en tu sesión de prueba.</DialogDescription></DialogHeader><form onSubmit={submit} noValidate><div className="form-grid"><Field name="firstName" label="Nombres" placeholder="Lucía" autoComplete="off" maxLength={60} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} error={errors.firstName} /><Field name="lastName" label="Apellidos" placeholder="Torres" autoComplete="off" maxLength={60} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} error={errors.lastName} /></div><Field name="email" label="Correo electrónico" type="email" placeholder="lucia.torres@example.com" autoComplete="off" maxLength={120} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} hint="Solo correos ficticios terminados en @example.com." /><Field name="phone" label="Teléfono (opcional)" type="tel" placeholder="000 000 101" autoComplete="off" maxLength={15} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} hint="9 dígitos que empiecen con 000. Puedes dejarlo vacío." /><label className="demo-checkbox"><input type="checkbox" checked={form.demoAcknowledged} onChange={(e) => setForm({ ...form, demoAcknowledged: e.target.checked })} aria-describedby={errors.demoAcknowledged ? "ack-error" : undefined} /><span>Confirmo que estos datos son ficticios y se usarán únicamente para esta demostración.</span></label>{errors.demoAcknowledged ? <p id="ack-error" className="field-error">{errors.demoAcknowledged[0]}</p> : null}<div className="form-actions"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancelar</Button><Button type="submit" disabled={busy}>{busy ? <LoaderCircle className="animate-spin" size={15} /> : <Plus size={15} />}Guardar registro</Button></div></form></DialogContent></Dialog>
    <AlertDialog open={Boolean(deleting)} onOpenChange={(value) => { if (!value && !busy) setDeleting(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar este registro?</AlertDialogTitle><AlertDialogDescription>Se eliminará a {deleting?.firstName} {deleting?.lastName} del registro activo. Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><Button variant="outline" onClick={() => setDeleting(null)} disabled={busy}>Conservar</Button><Button variant="destructive" onClick={removePerson} disabled={busy}>{busy ? "Eliminando…" : "Eliminar registro"}</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </>;
}
