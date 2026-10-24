# Registro de personas · Laboratorio 11

Aplicación académica para registrar personas ficticias y evaluar los riesgos de privacidad del sistema. Trabajo de DS3031, Ética y Seguridad de los Datos.

**Responsable:** Ronal Condor Blas.

- Aplicación: https://lab11-registro-privacidad.vercel.app
- Informe PDF: [Informe y DPIA](public/documentos/informe-laboratorio-11.pdf)
- Fuente LaTeX: [main.tex](docs/informe-latex/main.tex)
- [Arquitectura](docs/arquitectura.md) · [Checklist propio](docs/checklist.md) · [Revisión cruzada pendiente](docs/revision-cruzada.md)

## Qué incluye

Registro, listado, búsqueda y eliminación de personas. Interfaz adaptable con componentes shadcn/ui, aviso de privacidad y documentación. La API guarda los datos en PostgreSQL de Neon, con acceso delimitado por sesión del navegador.

El correo debe terminar en `@example.com`. El teléfono es opcional y solo admite nueve dígitos que empiecen con `000`. Usa nombres inventados. La aplicación no envía correos ni mensajes.

## Ejecutar localmente

Requisitos: Node.js 22 o superior, npm y una base PostgreSQL en Neon.

```sh
npm ci
```

Copia `.env.example` a `.env.local` y configura las conexiones de tu base de datos. La credencial pertenece exclusivamente al servidor; no uses un prefijo `NEXT_PUBLIC_`.

```sh
npm run db:migrate
npm run dev
```

Abre http://localhost:3000. Para probar la compilación de producción:

```sh
npm run build
npm start
```

## API

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/api/personas` | Inicia o recupera una sesión y lista sus registros vigentes. |
| POST | `/api/personas` | Registra una persona ficticia en la sesión actual. |
| DELETE | `/api/personas/:id` | Elimina un registro perteneciente a la sesión. |
| GET | `/api/health` | Comprueba la conexión con PostgreSQL. |

Ejemplo de cuerpo POST:

```json
{
  "firstName": "Lucía",
  "lastName": "Torres",
  "email": "lucia.torres@example.com",
  "phone": "000000101",
  "demoAcknowledged": true
}
```

Para clientes de API, primero realiza GET y conserva la cookie. Las mutaciones requieren la cabecera `Origin` con el origen exacto del servicio. El listado no utiliza caché compartida.

## Verificación

```sh
npm run typecheck
npm run lint
npm run build
```

Con el servidor iniciado, ejecuta las doce comprobaciones de API. `BASE_URL` permite seleccionar el servidor, sin modificar el script. Por defecto utiliza http://localhost:3111.

```powershell
$env:BASE_URL = 'http://localhost:3000'
npm run test:api
```

El script comprueba persistencia, aislamiento entre sesiones, validación, duplicados, origen, límite de solicitudes y eliminación. Crea exclusivamente registros ficticios y elimina los registros que crea.

## Conservación y limpieza

Las sesiones vencen a las 24 horas; los datos vencidos dejan de estar disponibles por la API. La limpieza física no está programada automáticamente:

```sh
npm run db:cleanup
```

El comando elimina sesiones vencidas y sus registros por cascada. No elimina copias de respaldo del proveedor. Perder la cookie impide volver a acceder a esa sesión; el sistema no incluye recuperación de identidad.

## Despliegue

El proyecto está preparado para Vercel con la integración Neon del plan gratuito. Configura `DATABASE_URL` en el servidor, aplica la migración y despliega con el directorio raíz de este repositorio. No subas `.env.local`, `.vercel`, archivos `.db`, `.sqlite` ni volcados de la base.

## Compilar el informe

El informe utiliza XeLaTeX y Times New Roman. La fuente está en `docs/informe-latex`; la imagen de evidencia se conserva en su subdirectorio `images`.

```sh
cd docs/informe-latex
xelatex -interaction=nonstopmode -halt-on-error main.tex
xelatex -interaction=nonstopmode -halt-on-error main.tex
```

## Estado académico

La DPIA incluye inventario, necesidad, diez riesgos, restricciones verificables, valoración residual y decisión. La publicación se limita a una demostración con datos ficticios. La revisión de otro grupo sigue pendiente. El checklist incluido es una verificación propia; debe cotejarse con el checklist oficial del curso y con su plantilla original, que no se adjuntaron. La modalidad individual requiere la aceptación del docente.
