# Verificación de la entrega

DS3031 · Laboratorio 11 · Ronal Condor Blas · 24 de octubre de 2026.

Esta es una verificación propia basada en las diapositivas 20–29 del laboratorio. No reemplaza el checklist oficial del curso, que no fue adjuntado.

| Requisito | Evidencia | Estado |
| --- | --- | --- |
| Base de datos y backend mínimo | `database/001_initial.sql`, `src/app/api/personas` | Implementado |
| Alta y listado de nombres, apellidos, correo y teléfono | API y formulario; teléfono opcional | Verificado |
| Frontend opcional | Next.js, shadcn/ui; vistas de registro, privacidad y documentación | Implementado |
| Inventario y necesidad | Informe, secciones 1 y 2 | Incluido |
| Al menos cinco riesgos concretos | Diez riesgos en la sección 3 | Incluido |
| Restricción verificable por riesgo alto o medio | C1–C10, sección 4 | Incluido |
| Riesgo residual y decisión con responsable | Sección 5 | Incluido |
| Repositorio sin base de datos ni credenciales | `.gitignore` y revisión de archivos seguidos | Verificado |
| Persistencia e independencia entre sesiones | `scripts/verify-api.mjs` | 12 comprobaciones de API satisfactorias |
| Compilación, TypeScript y ESLint | `npm run build`, `npm run typecheck`, `npm run lint` | Satisfactorios |
| Revisión recibida de otro grupo | `docs/revision-cruzada.md` | Pendiente |
| Checklist oficial y plantilla original | No adjuntos en los materiales recibidos | Pendiente de cotejo |
| Autorización de trabajo individual | A cargo del docente | No acreditada |

## Pruebas reproducibles

1. Cookie de sesión y respuestas sin caché compartida.
2. Alta persistente en PostgreSQL.
3. Lectura posterior del registro.
4. Otra sesión no lista ni elimina registros ajenos.
5. Correo duplicado rechazado en la misma sesión.
6. Correo ajeno a `example.com`, teléfono no ficticio y confirmación ausente rechazados.
7. Origen externo y ausencia de sesión rechazados.
8. JSON malformado y cuerpo mayor de 2 KB rechazados.
9. Teléfono vacío guardado como `NULL`.
10. Eliminación propia y lectura posterior.
11. Solicitud 21 de mutación dentro del minuto rechazada con 429.
12. Endpoint de salud con consulta real a la base de datos.

La comprobación visual cubre carga de ejemplos, formulario sin teléfono, búsqueda, confirmación de eliminación y navegación. El script elimina los registros ficticios que crea; deja únicamente las sesiones técnicas, que pueden limpiarse después de vencer.
