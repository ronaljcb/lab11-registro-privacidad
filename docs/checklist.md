# Checklist del laboratorio

Matriz propia basada en las diapositivas 20–29 de L11. Evalúa exclusivamente `laboratorio-minimo`. Las restricciones C01–C08 se desarrollan por escrito.

La ficha tiene respuestas en español y conserva las preguntas originales en inglés. El nivel de riesgo se asigna con la matriz de la diapositiva 25: media × alto y alta × medio son altos; baja × alto es medio. El producto numérico se muestra como referencia.

| Elemento del encargo | Evidencia | Resultado |
| --- | --- | --- |
| Backend con base persistente | app.py, Flask y SQLite | Implementado |
| Nombres, apellidos, correo y teléfono | POST /registro; teléfono opcional | Verificado |
| SQL parametrizado | INSERT con cuatro parámetros y prueba de cadena SQL literal | Verificado |
| Tres o cuatro personas inventadas | Cuatro registros iniciales en verificar.py | Verificado |
| Listado completo y observación de brechas | Segundo cliente anónimo obtiene todos los contactos | Verificado |
| Inventario: campo, finalidad, obligatoriedad, base, retención, acceso y necesidad | Introducción y Step 2 del Word | Incluido, con estado actual diferenciado de propuesta |
| Al menos cinco riesgos concretos | R1–R8, Step 5 | Ocho riesgos actuales |
| Restricción por cada riesgo medio o alto | C01–C08, Step 6 | Ocho propuestas sin implementar |
| Capa, prioridad y prueba | Cada restricción identifica capa y criterio; prioridad antes de datos reales | Incluido |
| Revalorar al aplicar restricciones en papel | Step 6 | Residual esperado, no controles existentes |
| Consulta a interesados y revisión prevista | Step 3 | Plan desarrollado con participantes, momento, objetivos y seguimiento |
| Aprobación de las medidas | Step 6 y Step 7 | Sí para C01–C08; aprobación del diseño, con implementación exigida antes del uso real |
| Decisión coherente | Step 7 | Lanzamiento condicionado a implementar y verificar C01–C08 |
| Nombre y fecha en casillas originales | Step 7 | Ronal Condor Blas; viernes 23 de octubre de 2026 |
| Repositorio sin bases ni credenciales | .gitignore y revisión de archivos seguidos | Verificado |
| Revisión de otro grupo | Formulario y casillas originales | |

## Privacidad del backend actual

| Control examinado | Estado observado | Propuesta |
| --- | --- | --- |
| Autenticación y autorización del listado | Ausentes | C01 |
| Cifrado de contactos en SQLite | Ausente | C02 |
| Minimización del teléfono | Opcional, sin necesidad demostrada | C03 |
| Aviso completo y registro de consentimiento | Ausentes en el backend; base prevista en la DPIA | C04 |
| Plazo y eliminación automática | Ausentes | C05 |
| Acceso, corrección, borrado y exportación autenticados | Ausentes | C06 |
| Formato y unicidad del correo | No se validan | C07 |
| Auditoría dedicada y procedimiento de incidentes | Ausentes | C08 |

La evidencia de `laboratorio-minimo/evidencias.json` observa brechas; no certifica las restricciones propuestas. Para reproducirla, ejecutar verificar.py según el README de esa carpeta. Se usa una base temporal y datos inventados.

El riesgo inicial es alto en R1, R2, R4, R5 y R6, y medio en R3, R7 y R8. Tras aplicar las restricciones en papel, R1 y R2 quedan en medio y los demás en bajo. Las ocho medidas están aprobadas para el diseño; su implementación y comprobación son condiciones para admitir datos reales.

El checklist organiza la evidencia de la entrega. El contenido del checklist oficial enlazado en la diapositiva 20 no pudo consultarse. Los comentarios externos recibidos se registran en el formulario de revisión cruzada; este documento no acredita una revisión externa realizada.
