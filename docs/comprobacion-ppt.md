# Cotejo con la presentación del laboratorio

Se contrastó la ficha en español con L11 Fundamentos de privacidad de datos DS3031, diapositivas 20–29, y con el código de `laboratorio-minimo`.

| Diapositiva | Exigencia | Evidencia en la entrega |
| --- | --- | --- |
| 20–21 | BD y backend mínimo; registro y listado; SQL parametrizado | Flask/SQLite, POST /registro y GET /registros; inserción con parámetros |
| 21 | Registrar tres o cuatro personas inventadas y observar el listado | Cuatro registros iniciales y lectura desde otro cliente en verificar.py |
| 23–24 | Describir datos, finalidad, flujo, acceso y almacenamiento; justificar necesidad | Introducción y pasos 1, 2 y 4 del Word |
| 24 | Inventario por campo con siete atributos | Tabla con nombres, apellidos, correo, teléfono, id y fecha de creación, sin agrupar campos |
| 25 | Al menos cinco riesgos; probabilidad, impacto y categorías LINDDUN | Ocho riesgos de divulgación, vinculación, falta de conocimiento e incumplimiento |
| 25 | Clasificar con la matriz presentada | Se corrigió la escala: media × alto y alta × medio son altos; baja × alto es medio. El producto se muestra solo como referencia numérica |
| 26 | Restricción verificable para cada riesgo alto o medio, con capa y prioridad | C01–C08, con criterio de prueba y prioridad antes del primer dato real |
| 20 y 27 | Aplicar restricciones en papel y recalcular el residual | Propuestas sin implementar; R1 y R2 quedan en medio, los demás en bajo |
| 27 | Decisión coherente con condiciones y nombre/fecha | C01–C08 antes de datos reales; aceptación condicionada de los residuales medios; casillas originales con nombre y fecha solicitada |
| 28 | Comentarios del otro grupo | |
| 29 | Repositorio sin lab.db ni credenciales; DPIA y revisión recibida | Código y Word publicados; campos de revisión externa en blanco |

## Revisión de redacción y coherencia

Las respuestas están en español; las preguntas, instrucciones, títulos y diseño de la plantilla original siguen en inglés. El nombre del controller identifica al autor dentro del ejercicio individual, sin atribuirle un cargo de DPO. No se inventan consultas, opiniones ni firmas de terceros.

El texto separa observaciones del backend actual, restricciones propuestas y riesgos residuales estimados. No atribuye controles de la demostración Next.js al backend Flask. Tampoco presenta SQL parametrizado como ausente, teléfono como obligatorio, el plazo propuesto como una obligación legal ni la ficha como certificación de cumplimiento.

La revisión externa no está acreditada. El checklist propio organiza la evidencia disponible; no sustituye al checklist oficial enlazado en la diapositiva 20, cuyo contenido no pudo consultarse. Por ello, este cotejo confirma la parte técnica y documental observable, sin declarar completados esos dos elementos externos.

## Adaptación del documento de referencia

Se tomó `DPIA_Grupo.docx` como guía de organización y detalle: proyecto y tratamiento, recolección, almacenamiento, uso, eliminación, destinatarios, flujo, expectativas y proporcionalidad. La plantilla original sigue siendo la autoridad de diseño.

Las respuestas describen exclusivamente nuestro backend: no tiene cuentas ni formulario web, escucha en loopback y devuelve 400 cuando falta una clave obligatoria. No se copian observaciones, revisión externa, integrantes, plazos legales o bases contractuales del otro grupo. El plazo propuesto de 30 días se justifica por evaluación y correcciones del ejercicio.

Se conservan ocho riesgos propios. R3 diferencia la recopilación innecesaria del teléfono de la divulgación masiva ya valorada en R1: probabilidad alta e impacto bajo, nivel medio según la matriz del curso. Tras eliminar el campo se estima bajo. Los riesgos altos actuales son R1, R2, R4, R5 y R6. La propuesta C02 concreta AES-GCM y una prueba de rechazo de datos cifrados alterados; no está implementada.

## Consulta y aprobación de diseño

El paso 3 está completo: explica la consulta a titulares, la revisión prevista con otro grupo, la revisión técnica individual, la participación docente y las condiciones para consultar a proveedores. El plan no se presenta como una revisión externa ya realizada. Los campos originales para registrar comentarios recibidos siguen sin atribuir observaciones a terceros.

La columna Measure approved contiene Sí en las ocho medidas. Indica aprobación como restricciones del proyecto; no equivale a implementación. El paso 7 explicita esa distinción y mantiene el lanzamiento condicionado a pruebas satisfactorias. Las respuestas usan subtítulos en negrita, y los identificadores y pruebas se distinguen dentro de las matrices.

La base prevista para un eventual registro voluntario se concreta como consentimiento previo e informado, con retiro disponible. El backend actual todavía no registra ese consentimiento. La ficha enlaza la Ley 29733 como fuente de los artículos 13.5, 13.7 y 18. No se trasladan al ejercicio supuestas excepciones contractuales ni reglas de designación de DPO del documento de otro grupo.
