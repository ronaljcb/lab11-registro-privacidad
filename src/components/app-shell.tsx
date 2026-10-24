"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, FileText, Fingerprint, UsersRound } from "lucide-react";

const navigation = [
  { href: "/", label: "Registro", icon: UsersRound, number: "01" },
  { href: "/privacidad", label: "Privacidad", icon: Fingerprint, number: "02" },
  { href: "/entrega", label: "Documentación", icon: FileText, number: "03" },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="app-frame">
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="Registro, inicio"><span className="brand-mark">r<span>.</span></span><span>registro<span className="brand-caption">PRIVACIDAD DESDE EL DISEÑO</span></span></Link>
      <div className="sidebar-course"><BookOpen size={15} /><span>Ética y Seguridad de los Datos<small>DS3031 · Laboratorio 11</small></span></div>
      <nav aria-label="Navegación principal" className="navigation">{navigation.map(({ href, label, icon: Icon, number }) => <Link key={href} href={href} className={`nav-link ${pathname === href ? "active" : ""}`} aria-current={pathname === href ? "page" : undefined}><Icon size={18} /><span>{label}</span><small>{number}</small></Link>)}</nav>
      <div className="sidebar-note"><span className="small-label">UNA PRÁCTICA CON PROPÓSITO</span><p>Guardar lo necesario.<br />Entender lo que implica.</p><span className="note-rule" /><small>Ronal Condor Blas<br />2026</small></div>
      <a className="source-link" href="https://github.com/ronaljcb/lab11-registro-privacidad" target="_blank" rel="noreferrer">Ver repositorio <ArrowUpRight size={15} /></a>
    </aside>
    <div className="workspace"><header className="topbar"><span>Laboratorio 11 <span className="breadcrumb-slash">/</span> {navigation.find((n) => n.href === pathname)?.label ?? "Registro"}</span><span className="environment"><i />Demostración complementaria</span></header><main id="contenido" className="main-content">{children}</main><footer className="app-footer"><span>DS3031 · Ética y Seguridad de los Datos</span><span>Datos ficticios. Decisiones conscientes.</span></footer></div>
  </div>;
}
