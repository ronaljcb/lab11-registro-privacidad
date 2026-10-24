# Backend evaluado en la DPIA

Versión mínima de las diapositivas 20 y 21 de L11. Implementa Flask y SQLite con SQL parametrizado. Sus brechas de privacidad se conservan como objeto del ejercicio; las restricciones C01–C08 del Word son propuestas escritas y no están implementadas aquí.

## Ejecución

Desde esta carpeta, con Python 3.12 o compatible:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

Escucha en `http://127.0.0.1:5111`. Usar exclusivamente personas inventadas. El archivo `lab.db` se crea localmente y se excluye de Git.

```powershell
$persona = @{nombres='Ana'; apellidos='Ejemplo'; correo='ana@example.com'; telefono='000000001'} | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:5111/registro -Method Post -ContentType 'application/json' -Body $persona
Invoke-RestMethod -Uri http://127.0.0.1:5111/registros
```

POST `/registro` solicita nombres, apellidos y correo; teléfono es opcional. GET `/registros` devuelve todos los registros sin autenticar ni ocultar contactos. No hay edición, eliminación, exportación, plazo de conservación, registro de consentimiento ni auditoría dedicada de accesos. SQLite conserva los contactos en texto legible. SQL utiliza parámetros: la inyección SQL no se presenta como una brecha del sistema.

## Evidencia reproducible

```powershell
.\.venv\Scripts\python.exe verificar.py
```

La verificación crea cuatro personas ficticias en una base temporal y comprueba las brechas observadas, incluyendo lectura por un segundo cliente anónimo, duplicados y ausencia de edición y borrado. Después añade tres entradas para probar duplicado, formato e inserción parametrizada. La base temporal se elimina al terminar. Véase [evidencias.json](evidencias.json).

El frontend Next.js publicado en Vercel es una demostración complementaria con controles distintos. No representa el backend evaluado en esta DPIA.
