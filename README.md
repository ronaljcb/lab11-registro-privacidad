# Laboratorio 11 Evaluación de impacto en privacidad

Ronal Condor Blas · DS3031 Ética y Seguridad de los Datos

La DPIA evalúa el **backend mínimo local de Flask y SQLite** de [laboratorio-minimo](laboratorio-minimo), siguiendo las diapositivas 20–29 de L11. Ese backend conserva las brechas de privacidad que se deben identificar. Las ocho restricciones C01–C08 se proponen por escrito y no están implementadas en él.

## Entrega

- [Ficha DPIA en Word con el diseño original](docs/DPIA_Laboratorio_11.docx)
- [Backend evaluado e instrucciones](laboratorio-minimo/README.md)
- [Evidencia reproducible](laboratorio-minimo/evidencias.json)
- [Checklist propio basado en la presentación](docs/checklist.md)
- [Formulario de revisión cruzada](docs/revision-cruzada.md)

La ficha contiene inventario, necesidad y proporcionalidad, ocho riesgos actuales, restricciones verificables, riesgo residual esperado y decisión condicionada. Los apartados de consulta externa se conservan en blanco.

## Cómo observar el sistema

```powershell
cd laboratorio-minimo
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe verificar.py
.\.venv\Scripts\python.exe app.py
```

POST `/registro` almacena nombres, apellidos, correo y teléfono opcional. GET `/registros` entrega todos los registros sin autenticar. La inserción usa parámetros SQL. Se emplean exclusivamente valores inventados y el servidor escucha en `127.0.0.1:5111`.

`verificar.py` crea cuatro personas ficticias en una base temporal y observa acceso desde otro cliente, exposición de contactos, duplicados, correo inválido, almacenamiento legible y ausencia de edición y borrado. Añade tres entradas de prueba específicas y elimina la base al terminar. No se incluyen bases de datos ni credenciales en Git.

## Decisión de la DPIA

El backend actual es un ejercicio local con datos inventados. Un lanzamiento con datos reales requiere implementar y verificar C01–C08. La valoración residual del Word es una estimación posterior a esas propuestas; las puntuaciones actuales siguen siendo las de Step 5. El riesgo de copia y compromiso del equipo o sus claves requiere una nueva revisión antes de operar.

## Demostración complementaria

La [aplicación publicada](https://lab11-registro-privacidad.vercel.app) utiliza Next.js, shadcn/ui, Vercel y Neon. Tiene controles adicionales y se mantiene como demostración opcional. Sus controles no se usan para valorar el backend mínimo. [Instrucciones de esta versión](docs/demostracion-complementaria.md).

El PDF y la fuente LaTeX de la primera versión documentan esa demostración. Se conservan como material anterior; la entrega vigente es el Word enlazado arriba.
