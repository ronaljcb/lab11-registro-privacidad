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

