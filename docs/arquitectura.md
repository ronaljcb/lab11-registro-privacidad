# Arquitectura y decisiones

La aplicación implementa un directorio académico de personas ficticias. El frontend se sirve desde Vercel. Los Route Handlers de Next.js validan las solicitudes y consultan PostgreSQL en Neon mediante una credencial exclusiva del servidor.

## Modelo de acceso

`GET /api/personas` genera una cookie aleatoria de 32 bytes cuando no existe una sesión vigente. La base conserva su huella SHA-256. Las altas, lecturas y eliminaciones se filtran por la huella y el vencimiento; la API nunca devuelve dicha huella. El token es una credencial portadora: no acredita identidad y no protege frente a otra persona que use el mismo navegador o copie la cookie.

Las respuestas de la API llevan `Cache-Control: private, no-store`. Las mutaciones requieren origen idéntico. POST exige JSON y un cuerpo de hasta 2 KB. La validación Zod se ejecuta tanto en UI como en servidor. Se limita a 20 mutaciones por minuto y 50 registros por sesión, usando PostgreSQL para conservar el límite entre instancias de Vercel.

## Persistencia

- `lab11_sessions`: huella de sesión, creación, vencimiento y contador de solicitudes.
- `lab11_personas`: UUID, relación con sesión, nombres, apellidos, correo, teléfono opcional y fechas.
- Restricción única `(owner_hash, email)`; no hay unicidad global que revele si otro visitante utiliza un correo.
- Las altas usan una transacción con bloqueo por sesión para aplicar la cuota.
- `database/001_initial.sql` define la migración versionada; no se ejecuta DDL al atender solicitudes.

## Retención

La vigencia es de 24 horas y las consultas excluyen datos vencidos. El borrado físico de sesiones vencidas se realiza con `npm run db:cleanup`; la relación elimina sus registros en cascada. No hay un cron configurado. Las copias de respaldo no se borran mediante ese comando. Esta diferencia se explica en el aviso y en la DPIA.

## Límites deliberados

No se incorporan autenticación de personas, envío de mensajes, exportaciones públicas, analítica ni tratamiento de información real. Solo se aceptan correos `@example.com` y teléfonos opcionales de nueve dígitos que empiecen con `000`. El servidor no puede verificar que un nombre sea inventado. Se debe mantener la advertencia de datos ficticios.

Los riesgos de abuso mediante muchas sesiones, navegador compartido, limpieza programada, respaldos y transferencias internacionales se mantienen explícitos en el informe. No se declara cumplimiento legal ni aptitud para producción con datos reales.
