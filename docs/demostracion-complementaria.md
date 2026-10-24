# Demostración complementaria en Next.js

Esta aplicación no es el backend evaluado en la DPIA. La evaluación corresponde a laboratorio-minimo. Las instrucciones siguientes describen exclusivamente la demostración mejorada.

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

## Arquitectura de la demostración

El frontend se sirve desde Vercel. Los Route Handlers de Next.js validan las solicitudes y consultan PostgreSQL en Neon mediante una credencial exclusiva del servidor. Este flujo corresponde a la demostración; la DPIA del Word evalúa el backend Flask local.

### Acceso y validación

GET `/api/personas` genera una cookie aleatoria de 32 bytes cuando no existe una sesión vigente. La base conserva su huella SHA-256. Altas, lecturas y eliminaciones se filtran por huella y vencimiento; la API no devuelve la huella. El token no acredita identidad ni impide el acceso a quien use el mismo navegador o copie la cookie.

Las respuestas llevan `Cache-Control: private, no-store`. Las mutaciones requieren el mismo origen. POST exige JSON y un cuerpo de hasta 2 KB. Zod valida en interfaz y servidor. PostgreSQL conserva los límites de 20 mutaciones por minuto y 50 registros por sesión entre instancias de Vercel.

### Modelo de datos

- `lab11_sessions`: huella de sesión, creación, vencimiento y contador de solicitudes.
- `lab11_personas`: UUID, relación con sesión, nombres, apellidos, correo, teléfono opcional y fechas.
- Unicidad por `(owner_hash, email)`, sin comprobación global que revele correos de otras sesiones.
- Transacción y bloqueo por sesión para aplicar la cuota de altas.
- Migración versionada en `database/001_initial.sql`; no se ejecuta DDL al atender solicitudes.

### Límites de uso

La limpieza manual elimina físicamente sesiones vencidas y sus registros por cascada. No elimina copias del proveedor. La caducidad del acceso y el borrado físico son operaciones distintas.

No hay autenticación de personas, envío de mensajes, exportación pública ni analítica. El servidor limita el formato de contactos de prueba, pero no puede verificar que los nombres sean inventados. La demostración utiliza exclusivamente datos ficticios.

