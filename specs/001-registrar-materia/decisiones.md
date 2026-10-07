# Decisiones – HU-001 Registrar una materia

## 1. Rango y formato de la nota

**Pregunta:** ¿Cuál es exactamente el rango y formato que quieres para la nota del primer bimestre (por ejemplo, rango mínimo/máximo, si admite decimales y qué separador decimal)?

**Respuesta:** La nota debe estar entre `0.00` y `20.00`.

**Motivo:** La historia exige rechazar notas fuera del rango permitido, por lo que este rango define qué valores puede registrar el estudiante.

## 2. Validación y comparación básica del nombre

**Pregunta:** ¿Debemos aceptar cualquier nombre no vacío y considerar repetida una materia cuando coincide ignorando mayúsculas/minúsculas y espacios al inicio o al final?

**Respuesta:** Sí. El nombre no puede estar vacío; los duplicados se comparan sin distinguir mayúsculas/minúsculas ni espacios externos.

**Motivo:** Evita registros incompletos y duplicados accidentales causados únicamente por diferencias de escritura superficial.

## 3. Presentación de errores de validación

**Pregunta:** Si el nombre y la nota están vacíos o ambos son inválidos al mismo tiempo, ¿la aplicación debe mostrar todos los errores detectados en una sola respuesta y no guardar nada?

**Respuesta:** Sí. Debe mostrar todos los errores aplicables a la vez y no guardar la materia.

**Motivo:** Permite corregir el formulario completo en una sola interacción y evita guardados parciales o ambiguos.

## 4. Datos que se guardan

**Pregunta:** ¿Debemos guardar y mostrar el nombre recortado de espacios externos, conservar la nota como número (incluidos sus decimales), y dejar preparado el registro con el segundo bimestre vacío?

**Respuesta:** Sí. Se guarda el nombre recortado, la nota numérica y el segundo bimestre vacío.

**Motivo:** Define una representación consistente para mostrar y comparar los registros, y deja la materia lista para completarse posteriormente.

## 5. Equivalencia de tildes en nombres

**Pregunta:** ¿“Matemáticas” y “matematicas” deben considerarse la misma materia al comparar duplicados, ignorando también tildes?

**Respuesta:** Sí. La comparación de duplicados también ignora las tildes.

**Motivo:** Evita duplicados cuando el mismo nombre se escribe con o sin acentos.

## 6. Error al guardar

**Pregunta:** Si el almacenamiento local falla al intentar guardar una materia, ¿debemos avisar que no se pudo guardar y mantener al usuario en el formulario, sin mostrar la materia como registrada?

**Respuesta:** Sí. Se debe avisar del fallo, mantener el formulario y no mostrar la materia como guardada.

**Motivo:** Impide presentar como persistente un dato que no se pudo conservar y permite al estudiante reintentar sin perder lo escrito.

## 7. Error al cargar

**Pregunta:** Si al abrir la aplicación no se pueden leer las materias guardadas, ¿debemos mostrar un aviso de que no se pudieron cargar y presentar la lista como vacía, sin sobrescribir ni borrar los datos existentes?

**Respuesta:** Sí. Se debe avisar del fallo, mostrar temporalmente la lista vacía y no sobrescribir ni borrar los datos existentes.

**Motivo:** Informa al estudiante del problema sin convertir un fallo de lectura en pérdida de datos.

## 8. Estado del formulario después de guardar

**Pregunta:** Al registrar correctamente una materia, ¿debemos volver a dejar vacío el formulario y mostrar la materia en la lista, conservando la nota ingresada?

**Respuesta:** Sí. Se limpia el formulario y se actualiza la lista con la materia registrada.

**Motivo:** Confirma visualmente el registro exitoso y deja el formulario listo para ingresar otra materia.

## 9. Separador decimal y precisión de la nota

**Pregunta:** ¿Qué separador decimal debe aceptar la entrada de la nota y cuántas cifras decimales como máximo se permiten?

**Respuesta:** Se acepta el punto (`.`) como separador decimal y hasta dos cifras decimales.

**Motivo:** Define un formato de entrada preciso y consistente para las notas dentro del rango acordado.
