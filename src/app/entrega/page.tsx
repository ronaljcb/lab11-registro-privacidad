import type { Metadata } from "next";
import { ArrowDownToLine, ArrowUpRight, FileText, FolderGit2, ListChecks } from "lucide-react";

export const metadata: Metadata = { title: "Documentación" };

const documents = [
  { href: "/documentos/dpia-laboratorio-11.docx", label: "EVALUACIÓN · WORD", title: "Ficha DPIA del laboratorio", description: "Plantilla original, inventario, ocho riesgos y restricciones propuestas.", icon: FileText, download: true },
  { href: "https://github.com/ronaljcb/lab11-registro-privacidad/tree/main/laboratorio-minimo", label: "BACKEND EVALUADO · GITHUB", title: "Registro mínimo en Flask y SQLite", description: "Código local y observaciones reproducibles de sus brechas de privacidad.", icon: FolderGit2, download: false },
  { href: "https://github.com/ronaljcb/lab11-registro-privacidad/blob/main/docs/checklist.md", label: "VERIFICACIÓN · DOCUMENTO", title: "Checklist del trabajo", description: "Estado actual, restricciones por escrito y criterios de comprobación.", icon: ListChecks, download: false },
];

export default function DeliveryPage() {
  return <>
    <div className="page-heading"><div><p className="eyebrow">03 <span /> EL TRABAJO DOCUMENTADO</p><h1>Del registro<br />a la evaluación<span>.</span></h1><p className="page-description">El backend del ejercicio, sus riesgos y la ficha de evaluación.</p></div></div>
    <div className="document-list">{documents.map(({ href, label, title, description, icon: Icon, download }) =>
      <a key={href} href={href} target="_blank" rel="noreferrer" className="document-row">
        <span className="document-icon"><Icon size={24} strokeWidth={1.4} /></span>
        <div><span className="small-label">{label}</span><h2>{title}</h2><p>{description}</p></div>
        {download ? <ArrowDownToLine size={21} /> : <ArrowUpRight size={21} />}
      </a>
    )}</div>
    <div className="delivery-note"><p className="small-label">ALCANCE DE LA EVALUACIÓN</p><h2>Las brechas son el punto de partida.</h2><p>La DPIA evalúa el backend local de Flask y SQLite, siguiendo las diapositivas del laboratorio. Sus restricciones se proponen por escrito. Esta aplicación publicada es una demostración complementaria con controles adicionales; esos controles no se atribuyen al backend evaluado.</p></div>
    <div className="delivery-meta"><span>Autor<br /><strong>Ronal Condor Blas</strong></span><span>Curso<br /><strong>DS3031</strong></span><span>Evaluación<br /><strong>Backend mínimo local</strong></span></div>
  </>;
}
